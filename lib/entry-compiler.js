var fs = require('fs');
var path = require('path');

var ts = require('typescript');
var convert = require('convert-source-map');

var Compiler = require('./compiler');

function EntryCompiler(logger, compiler, opts) {
	opts = opts || {};

	this.opts = {
		sourceMap: opts.sourceMap || false
	};

	this.logger = logger;
	this.compiler = compiler;
	this.cachedResults = {};
}

/**
 * Compiles the source for this entry file
 * TypeScript will do the require resolution, so this compiles the entire component
 *
 * @param {string} the entry file
 * @return {boolean} success
 * @api public
 */
EntryCompiler.prototype.compile = function (entry) {
	var results = this.compiler.compile([entry.path]);
		
	if (results) {
		this.outputDiagnostics(entry, results.errors);
		this.cachedResults[entry.path] = results;
		return !results.failure;
	}
	else {
		return true; // use the already cached output
	}
}

/**
 * Updates the file contents with the compiled output. 
 * Also sorts out the source maps
 *
 * @param {object} the file
 * @param {string} the entry file
 * @return {boolean} success
 * @api public
 */
EntryCompiler.prototype.update = function (file, entry) {
	this.logger.debug('updating %s', file.path);

	var inputPath = ts.normalizePath(file.path);
	outputPath = Compiler.tsToJs(inputPath);

	var results = this.cachedResults[entry.path];

	if (!results)
		throw new Error("Unexpected file: " + inputPath);

	if (results.failure)
		return false;

	if (!results.output[outputPath]) {
		this.logger.error('typescript', file.path + ' was not compiled');
		return false;
	}

	file.src = this.getSource(results, outputPath);
	file.type = 'js';
	file.mtime = new Date();
	
	if (this.opts.sourceMap) {
		file.sourceMap = this.getSourceMap(results, file.path, outputPath);
	}

	return true;
}


/**
 * Write the compiler errors to console
 *
 * @param {string} the entry file
 * @param {array} the TypeScript compiler errors
 * @return {boolean} success
 * @api private
 */
EntryCompiler.prototype.outputDiagnostics = function (entry, diags) {
	var self = this;

	diags.slice(0, 10)
		.forEach(function(diag) {
			// feature: print the compiler output over 2 lines! file then message
			if (diag.file) {
			  var loc = diag.file.getLineAndCharacterFromPosition(diag.start);
			  var filename = Compiler.normalizePath(path.relative(entry.root, diag.file.filename));
			  var output = filename + "(" + loc.line + "," + loc.character + "): ";

			  if (diag.category === ts.DiagnosticCategory.Error)
			    self.logger.error('typescript', output)
			  else
			    self.logger.warn('typescript', output)
			}

			if (diag.category === 1)
				self.logger.error('typescript', diag.messageText + " (TS" + diag.code + ")");
			else
			  	self.logger.warn('typescript', diag.messageText + " (TS" + diag.code + ")");
		});
}

/**
 * Retrieves the compiled output as a string
 *
 * @param {results} the compilation results
 * @param {string} the output file
 * @return {string} compiled output
 * @api private
 */
EntryCompiler.prototype.getSource = function (results, outputPath) {
	var output = results.output[outputPath];

	// strip out source urls
	if (output)
	 	output = output.replace(convert.mapFileCommentRegex, '');

	return output;
};

/**
 * Retrieves the source map as a string
 *
 * @param {results} the compilation results
 * @param {string} the input file
 * @param {string} the output file
 * @return {string} source map json
 * @api private
 */
EntryCompiler.prototype.getSourceMap = function (results, inputPath, outputPath) {
	var sourcemap = convert.fromJSON(results.output[outputPath + '.map']);
	sourcemap.setProperty('sources', [inputPath]);
	return sourcemap.toJSON();
};

module.exports = EntryCompiler;
