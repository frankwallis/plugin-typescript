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
	}

	/**
	 * Load the file and trigger loading it's dependencies
	 * return a promise to the file contents when it has been loaded
	 */
	load(filename) {
		logger.debug("loading " + filename);

		// only load each file once, and cache the promises
		if (!this._files[filename]) {
			this._files[filename] = {
				name: filename
			};

			this._files[filename].loaded = this.fetch(filename)
				.then((text) => {
					this._files[filename].text = text;
					return this.getDependencies(filename, text);
				})
				.then((deps) => {
					this._files[filename].deps = deps;
					deps.forEach((res) => this.load(res));
					this._servicesHost.addFile(filename, this._files[filename].text);
					return this._files[filename];
				});
		}

		return this._files[filename].loaded;
	}

	/*
	 * Pre-process the file to get all its dependencies and recursively process them
	 * resolved when all the dependencies have been loaded
	 */
	getDependencies(filename, text) {
		/* scan the file to get it's imports and references */
		var info = ts.preProcessFile(text, true);

		/* build the list of files we need to resolve */
		var deps = [];
		deps = deps.concat(info.referencedFiles.map((ref) => ref.filename));
		deps = deps.concat(info.importedFiles.map((imp) => imp.filename));
		deps = deps.filter((dep) => !isAmbientImport(dep));
		logger.debug(filename + ' deps: ' + JSON.stringify(deps));

		/* map to a promise to resolved names array */
		deps = deps.map((dep) => this.resolve(dep, filename));
		deps.push(this.resolve(this._servicesHost.getDefaultLibFilename()));

		return Promise.all(deps);
	}

	// function mapReplace(str, mapObj){
	// 	var rx = new RegExp(Object.keys(mapObj).join("|"),"gi");
	//
	// 	return str.replace(rx, function(matched) {
	// 		return mapObj[matched.toLowerCase()];
	// 	});
	// }

	/**
	 * Once the dependencies are loaded, compile the file
	 * return a promise to the compilation results
	 */
	compile(filename) {
		logger.log("compiling " + filename);

		/* wait until all the dependencies are loaded */
		return this.canEmit(filename, [])
			.then(() => this.getCompilationResults(filename));
	}

	canEmit(filename, previous) {
		return this._files[filename].loaded
			.then(() => {
				/* avoid circular dependencies */
				previous.push(filename);
				var deps = this._files[filename].deps.filter((dep) => {
					return (previous.indexOf(dep) < 0);
				});

				return Promise.all(deps.map((dep) => this.canEmit(dep, previous)));
			});
	}

	/**
	 * Get the compilation result for a specified filename.
	 */
	getCompilationResults(filename) {
		var output = this._services.getEmitOutput(filename);

		if (output.emitOutputStatus === ts.EmitReturnStatus.Succeeded) {
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
			var diagnostics = this._services.getCompilerOptionsDiagnostics()
				.concat(this._services.getSyntacticDiagnostics(filename))
				.concat(this._services.getSemanticDiagnostics(filename));

			return {
				failure: true,
				errors: diagnostics,
				js: undefined,
				map: undefined
			}
		}
	}
}

export function tsToJs(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js');
}

export function tsToJsMap(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js.map');
}
