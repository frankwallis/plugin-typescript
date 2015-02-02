var path = require('path');
var ts = require('typescript');
var LanguageServicesHost = require("./services-host");
var Promise = require('bluebird');
var convert = require('convert-source-map');

var Logger = require("./logger");
var logger = new Logger({debug: false});

class IncrementalCompiler {
	constructor(fetch, resolve) {
		this._servicesHost = new LanguageServicesHost();
		this._pendingFiles = {};
		this._pendingDependencies = {};

		this._services = ts.createLanguageService(this._servicesHost, ts.createDocumentRegistry());
		this._runtimeRead = null;

		this.fetch = fetch;
		this.resolve = resolve;
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

			this.outputDiagnostics(diagnostics);

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

	/**
	 * Write the compiler errors to console
	 *
	 * @param {string} the entry file
	 * @param {array} the TypeScript compiler errors
	 * @return {boolean} success
	 * @api private
	 */
	outputDiagnostics(diags) {
		// feature: don't spam the console, only display the first 10 errors
		diags.slice(0, 10)
			.forEach(function(diag) {
				if (diag.file) {
					// feature: print the compiler output over 2 lines! file then message if (diag.file) {
					var loc = diag.file.getLineAndCharacterFromPosition(diag.start);
					var filename = diag.file.filename; //Compiler.normalizePath(path.relative(entry.root, diag.file.filename));
					var output = filename + "(" + loc.line + "," + loc.character + "): ";

					// TODO - get these to work as source hyperlinks in chrome?
					if (diag.category === ts.DiagnosticCategory.Error)
						logger.error(output)
					else
						logger.warn(output)
				}
				
				if (diag.category === ts.DiagnosticCategory.Error)
					logger.error(diag.messageText + " (TS" + diag.code + ")");
				else
					logger.warn(diag.messageText + " (TS" + diag.code + ")");
			});
	}
}

function isTypescript(file) {
	return (/\.ts$/i).test(file);
}

function isTypescriptDeclaration(file) {
	return (/\.d\.ts$/i).test(file);
}

function tsToJs(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js');
}

function tsToJsMap(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js.map');
}

module.exports = IncrementalCompiler;
module.exports.isTypescript = isTypescript;
module.exports.isTypescriptDeclaration = isTypescriptDeclaration;
module.exports.normalizePath = ts.normalizePath;