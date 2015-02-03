import path from 'path';
import ts from 'typescript';
import convert from 'convert-source-map';

import LanguageServicesHost from './services-host';
import Logger from './logger';

var logger = new Logger({debug: false});

class IncrementalCompiler {
	constructor(fetch, resolve) {
		this.fetch = fetch;
		this.resolve = resolve;

		this._pendingFiles = {};
		this._pendingDependencies = {};

		this._servicesHost = new LanguageServicesHost();
		this._services = ts.createLanguageService(this._servicesHost, ts.createDocumentRegistry());
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

					this._pendingDependencies[filename] =
						this.loadDependencies(filename, text);

					return text;
				});
		}

		return this._pendingFiles[filename];
	}

	/*
	 * Load the dependencies for this file, returns a promise
	 * resolved when all the dependencies have been loaded
	 */
	loadDependencies(filename, text, excludeLib) {

		var info = ts.preProcessFile(text, true);

		/* build the list of files */
		var deps = [];

		if (!excludeLib)
			deps.push(this._servicesHost.getDefaultLibFilename());

		deps = deps.concat(info.referencedFiles.map((ref) => ref.filename));
		deps = deps.concat(info.importedFiles.map((imp) => imp.filename));
		logger.debug(filename + ' deps: ' + JSON.stringify(deps));

		/* and map to promises */
		var result = [];
		deps.forEach((dep) => {
			if (!this.isExternal(dep)) {
				var resolved = this.resolve(filename, dep);

				var loaded = this.load(resolved);

				if (isTypescriptDeclaration(resolved)) {
					loaded = loaded.then((txt) => {
						return this.loadDependencies(resolved, txt, true);
					});
				} 
				result.push(loaded);
			}
		});

		return Promise.all(result);
	}

	/**
	 * Get the compilation result for a specified filename.
	 * return a promise to the compilation results
	 */
	compile(filename) {
		logger.log("compiling " + filename);

		/* wait until all the dependencies are loaded */
		return this._pendingDependencies[filename]
			.then(() => {
				/* return the results */
				return this.getCompilationResults(filename);	
			});
	}

	getCompilationResults(filename) {
		var output = this._services.getEmitOutput(filename);

		if (output.emitOutputStatus === ts.EmitReturnStatus.Succeeded) {

			//console.log(JSON.stringify(output));

			var jsname = tsToJs(filename);
			var jstext = output.outputFiles
				.filter((file) => (file.name == jsname))[0].text;

			// strip out source urls
			if (jstext)
				jstext = jstext.replace(convert.mapFileCommentRegex, '');

			var mapname = tsToJsMap(filename);
			console.log(mapname);
			var maptext = output.outputFiles.filter((file) => (file.name == mapname))[0].text;

			var mapobj = JSON.parse(maptext);
			//mapobj.setProperty('sources', [filename]);
			mapobj['sources'] = [filename];
			//map.setProperty('sourcesContent', [self.host.cachedInput[inputPath].ts.text]);  

			return {
				failure: false,
				errors: [],
				js: jstext,
				map: mapobj
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

	/**
	 * Is this an external dependency?
	 */
	isExternal(dep) {
		return ((dep[0] != '.') && (dep[0] != '/') && !isTypescriptDeclaration(dep))
	}
}

export default IncrementalCompiler;

export function isTypescript(file) {
	return (/\.ts$/i).test(file);
}

export function isTypescriptDeclaration(file) {
	return (/\.d\.ts$/i).test(file);
}

export function tsToJs(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js');
}

export function tsToJsMap(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js.map');
}

//module.exports = IncrementalCompiler;
// module.exports.isTypescript = isTypescript;
// module.exports.isTypescriptDeclaration = isTypescriptDeclaration;
// module.exports.normalizePath = ts.normalizePath;