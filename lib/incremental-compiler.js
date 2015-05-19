/* */
import ts from 'typescript';
import convert from 'convert-source-map';

import {LanguageServicesHost} from './services-host';
import {
	tsToJs, tsToJsMap,
	isTypescript, isTypescriptDeclaration,
	isAmbientImport, isAmbientReference
} from './utils';

import Logger from './logger';
let logger = new Logger({debug: false});

export class IncrementalCompiler {
	constructor(fetch, resolve, options) {
		this.fetch = fetch;
		this.resolve = resolve;

		this._files = {};

		this._servicesHost = new LanguageServicesHost(options);
		this._services = ts.createLanguageService(this._servicesHost, ts.createDocumentRegistry());

		this.loadedDefaultLib = this.resolve('typescript/bin/lib.es6.d.ts')
			.then((res) => {
				this._servicesHost.setDefaultLibFileName("/" + res);
				return this.load(res);
			});
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
			this._files[filename].tsname = ts.normalizePath("/" + filename);

			/* file.loaded is a promise which returns the file
				when deps and text are populated and the file
				has been added to the host with any reference overrides applied */
			this._files[filename].loaded = this.fetch(filename)
				.then((text) => {
					this._files[filename].text = text;
					this._files[filename].info = ts.preProcessFile(text, true);
					return this.getDependencies(filename, this._files[filename].info);
				})
				.then((depsMap) => {
					this._files[filename].deps = Object.keys(depsMap).map((key) => depsMap[key]);
					this._files[filename].deps.forEach((res) => this.load(res));

					let text = this.replaceAmbientRefs(this._files[filename].text, depsMap);
					this._servicesHost.addFile(this._files[filename].tsname, text);

					return this._files[filename];
				});
		}

		return this._files[filename].loaded;
	}

	replaceAmbientRefs(text, depsMap) {
		let replaceMap = undefined;

		Object.keys(depsMap).forEach((key) => {
			if (isAmbientReference(key)) {
				replaceMap = replaceMap || {};
				replaceMap[key] = this._files[depsMap[key]].tsname;
			}
		});

		if (replaceMap)
			return this.mapReplace(text, replaceMap);
		else
			return text;
	}

	mapReplace(str, mapObj) {
		function escapeRegExp(string) {
    		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}

		let rx = new RegExp(Object.keys(mapObj).map(escapeRegExp).join("|"), "gi");
		return str.replace(rx, function(matched) {
			return mapObj[matched.toLowerCase()];
		})
	}
	/*
	 * Pre-process the file to get all its dependencies and resolve them
	 * returns a promise to an array of the resolved names
	 */
	getDependencies(filename, info) {
		/* build the list of files we need to resolve */
		let deps = [];
		deps = deps.concat(info.referencedFiles.map((ref) => ref.fileName));
		deps = deps.concat(info.importedFiles.map((imp) => imp.fileName));

		/* ignore ambient imports for now */
		deps = deps.filter((dep) => !isAmbientImport(dep));

		/* get a promise to an array of the resolved names */
		logger.debug(filename + ' deps: ' + JSON.stringify(deps));
		let resolved = deps.map((dep) => this.resolve(dep, filename));

		return Promise.all(resolved).then((filelist) => {
			let depsMap = {};
			deps.forEach((dep, idx) => {
				if (isTypescript(filelist[idx]))
					depsMap[dep] = filelist[idx];
			});
			return depsMap;
		});
	}

	/**
	 * Once the dependencies are loaded, compile the file
	 * return a promise to the compilation results
	 */
	compile(filename) {
		logger.log("compiling " + filename);

		return this.loadedDefaultLib
			.then(() => this.canEmit(filename))
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
				let deps = this._files[filename].deps
					.filter((dep) => (seen.indexOf(dep) < 0));

				return Promise.all(deps.map((dep) => this.canEmit(dep, seen)));
			});
	}

	/**
	 * Get the compilation result for a specified filename.
	 */
	getCompilationResults(filename) {
		let diagnostics = this.getAllDiagnostics(filename)
			.concat(this._services.getCompilerOptionsDiagnostics());

		if (diagnostics.length == 0) {
			let output = this._services.getEmitOutput(this._files[filename].tsname);
			if (output.emitSkipped)
				throw new Error("Typescript emit error");

			let jsname = tsToJs(this._files[filename].tsname);
			let jstext = output.outputFiles
				.filter((file) => (file.name == jsname))[0].text;

			let mapname = tsToJsMap(this._files[filename].tsname);
			let mapfile = output.outputFiles
				.filter((file) => (file.name == mapname))[0]

			if (mapfile) {
				// replace the source map url with the actual source map
				let sourcemap = convert.fromJSON(mapfile.text);
				jstext = jstext.replace(convert.mapFileCommentRegex, sourcemap.toComment());
			}

			return {
				failure: false,
				errors: [],
				js: jstext
			}
		} else {
			return {
				failure: true,
				errors: diagnostics,
				js: undefined
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

		let depDiagnostics = this._files[filename].deps
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
			this._files[filename].diagnostics = this._services.getSemanticDiagnostics(this._files[filename].tsname)
				.concat(this._services.getSyntacticDiagnostics(this._files[filename].tsname));
		}
		return this._files[filename].diagnostics;
	}
}
