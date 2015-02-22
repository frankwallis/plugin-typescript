import ts from 'typescript';
import convert from 'convert-source-map';

import {LanguageServicesHost} from './services-host';
import {isExternal, isTypescriptDeclaration} from './utils';
import Logger from './logger';

var logger = new Logger({debug: false});

export class IncrementalCompiler {
	constructor(fetch, resolve) {
		this.fetch = fetch;
		this.resolve = resolve;

		this._pendingFiles = {};
		this._pendingDependencies = {};

		this._servicesHost = new LanguageServicesHost();
		this._services = ts.createLanguageService(this._servicesHost, ts.createDocumentRegistry());

		this.loadDefaultLib = this.resolve(this._servicesHost.getDefaultLibFilename())
									.then((resolvedname) => this.load(resolvedname));
	}

	/**
	 * Load the file and trigger loading it's dependencies
	 * return a promise to the file contents when it has been loaded
	 */
	load(filename) {
		logger.debug("loading " + filename);

		// only load the file once, and cache the promises
		if (!this._pendingFiles[filename]) {
			this._pendingFiles[filename] = this.fetch(filename)
				.then((text) => {
					this._servicesHost.addFile(filename, text);
					this._pendingDependencies[filename] = this.loadDependencies(filename, text)
						.then(() => this.loadDefaultLib)

					return text;
				});
		}

		return this._pendingFiles[filename];
	}

	/*
	 * Pre-process the file to get all its dependencies and recursively process them
	 * resolved when all the dependencies have been loaded
	 */
	loadDependencies(filename, text) {
		// scan the file to get it's imports and references
		var info = ts.preProcessFile(text, true);

		/* build the list of files */
		var deps = [];
		deps = deps.concat(info.referencedFiles.map((ref) => ref.filename));
		deps = deps.concat(info.importedFiles.map((imp) => imp.filename));
		logger.debug(filename + ' deps: ' + JSON.stringify(deps));

		/* and map to promises */
		var result = [];
		deps.forEach((dep) => {
			if (!isExternal(dep)) {
				var depsloaded = this.resolve(dep, filename)
					.then((resolved) => {
						return this.load(resolved)
							.then(() => this._pendingDependencies[resolved]);
						});

				result.push(depsloaded);
			}
		});

		return Promise.all(result);
	}

	/**
	 * Once the dependencies are loaded, compile the file
	 * return a promise to the compilation results
	 */
	compile(filename) {
		logger.log("compiling " + filename);

		/* wait until all the dependencies are loaded */
		return this._pendingDependencies[filename]
			.then(() => this.getCompilationResults(filename));
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
