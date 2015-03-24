import ts from 'typescript';
import convert from 'convert-source-map';

import {LanguageServicesHost} from './services-host';
import {isAmbient, isAmbientImport, isTypescriptDeclaration} from './utils';
import Logger from './logger';

var logger = new Logger({debug: false});

export class IncrementalCompiler {
	constructor(fetch, resolve) {
		this.fetch = fetch;
		this.resolve = resolve;

		this._files = {};

		this._servicesHost = new LanguageServicesHost();
		this._services = ts.createLanguageService(this._servicesHost, ts.createDocumentRegistry());
		this.resolvedDefaultLib = this.resolve(this._servicesHost.getDefaultLibFilename());
	}

	/**
	 * Load the file and trigger loading it's dependencies
	 * called with a resolved filename
	 * returns a promise to the file when it has been loaded
	 */
	load(filename) {
		// only load each file once, and cache the promises
		if (!this._files[filename]) {
			logger.debug("loading " + filename);
			this._files[filename] = {};

			/* file.loaded is a promise which returns the file
				when deps and text are populated and the file
				has been added to the host with any required overrides */
			this._files[filename].loaded = this.fetch(filename)
				.then((text) => {
					this._files[filename].text = text;
					this._files[filename].info = ts.preProcessFile(text, true);
					return this.getDependencies(filename, this._files[filename].info);
				})
				.then((depsMap) => {
					this._files[filename].depsMap = depsMap;
					this._files[filename].deps = Object.keys(depsMap).map((key) => depsMap[key]);
					this._files[filename].deps.forEach((res) => this.load(res));
					this._servicesHost.addFile(filename, this._files[filename].text);
					return this.getOverrides(filename, this._files[filename].info)
				})
				.then((overrides) => {
					this._servicesHost.addOverrides(overrides);
					return this._files[filename];
				});
		}

		return this._files[filename].loaded;
	}

	/*
	 * Pre-process the file to get all its dependencies and resolve them
	 * returns a promise to an array of the resolved names
	 */
	getDependencies(filename, info) {
		/* build the list of files we need to resolve */
		var deps = [];
		deps = deps.concat(info.referencedFiles.map((ref) => ref.filename));
		deps = deps.concat(info.importedFiles.map((imp) => imp.filename));

		/* ignore ambient imports for now */
		deps = deps.filter((dep) => !isAmbientImport(dep));

		/* map to a promise -> array of resolved names */
		logger.debug(filename + ' deps: ' + JSON.stringify(deps));
		var resolved = deps.map((dep) => this.resolve(dep, filename));

		/* default lib is always a dependency */
		resolved.push(this.resolvedDefaultLib);

		return Promise.all(resolved).then((filelist) => {
			var depsMap = {};
			deps.forEach((dep, idx) => {
				depsMap[dep] = filelist[idx];
			});
			depsMap[this._servicesHost.getDefaultLibFilename()] = filelist[filelist.length -1];
			return depsMap;
		});
	}

	/*
	 * Find all the ambient references and resolve them as if they were relative
	 * Return promise to a map of relative resolved name -> ambient resolved name
	 */
	getOverrides(filename, info) {
		var ambientRefs = info.referencedFiles
			.filter((ref) => isAmbient(ref.filename));

		var resolved = ambientRefs.map((ref) => {
			return this.resolve("./" + ref.filename, filename);
		});

		return Promise.all(resolved).then((filelist) => {
			var overrides = {};
			filelist.forEach((file, idx) => {
				overrides[file] = this._files[filename].depsMap[ambientRefs[idx].filename];
			});
			return overrides;
		});
	}

	/**
	 * Once the dependencies are loaded, compile the file
	 * return a promise to the compilation results
	 */
	compile(filename) {
		logger.log("compiling " + filename);

		return this.canEmit(filename)
			.then(() => this.getCompilationResults(filename));
	}

	/**
	 * Wait until all the dependencies have been loaded
	 * returns a promise resolved when the dependency tree
	 * has been loaded
	 */
	canEmit(filename, seen) {
		/* avoid circular references which will cause a deadlock */
		seen = seen || [];
		seen.push(filename);

		return this._files[filename].loaded
			.then(() => {
				var deps = this._files[filename].deps.filter((dep) => {
					return (seen.indexOf(dep) < 0);
				});

				return Promise.all(deps.map((dep) => this.canEmit(dep, seen)));
			});
	}

	/**
	 * Get the compilation result for a specified filename.
	 */
	getCompilationResults(filename) {
		var diagnostics = this.getAllDiagnostics(filename)
			.concat(this._services.getCompilerOptionsDiagnostics());

		if (diagnostics.length == 0) {
			var output = this._services.getEmitOutput(filename);
			if (output.emitOutputStatus != ts.EmitReturnStatus.Succeeded)
				throw new Error("Typescript emit error [" + output.emitOutputStatus + "]");

			var jsname = tsToJs(filename);
			var jstext = output.outputFiles
				.filter((file) => (file.name == jsname))[0].text;

			var mapname = tsToJsMap(filename);
			var maptext = output.outputFiles
				.filter((file) => (file.name == mapname))[0].text;

			// replace the source map url with the actual source map
			var sourcemap = convert.fromJSON(maptext);
			jstext = jstext.replace(convert.mapFileCommentRegex, sourcemap.toComment());

			return {
				failure: false,
				errors: [],
				js: jstext,
				map: maptext
			}
		} else {
			return {
				failure: true,
				errors: diagnostics,
				js: undefined,
				map: undefined
			}
		}
	}

	/**
	 * accumulates the diagnostics for the file and any reference files it uses
	 */
	getAllDiagnostics(filename, seen) {
		/* ignore circular references */
		seen = seen || [];

		if (seen.indexOf(filename) >= 0)
			return [];
		else
			seen.push(filename);

		var depDiagnostics = this._files[filename].deps
			.filter((dep) => isTypescriptDeclaration(dep))
			.reduce((result, dep) => {
				return result.concat(this.getAllDiagnostics(dep, seen));
			}, []);

		return this.getFileDiagnostics(filename).concat(depDiagnostics);
	}

	/**
	 * gets the diagnostics for the file
	 * caches results
	 */
	getFileDiagnostics(filename) {
		if (!this._files[filename].diagnostics) {
			this._files[filename].diagnostics = this._services.getSemanticDiagnostics(filename)
				.concat(this._services.getSyntacticDiagnostics(filename));
		}
		return this._files[filename].diagnostics;
	}
}

export function tsToJs(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js');
}

export function tsToJsMap(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js.map');
}
