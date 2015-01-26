var path = require('path');
var log = console.log;

var Host = require('./caching-host');
var ts   = require('typescript');

function Compiler(opts) {
	this.host = new Host();

/*
	allowNonTsExtensions?: boolean;
    charset?: string;
    codepage?: number;
    declaration?: boolean;
    diagnostics?: boolean;
    emitBOM?: boolean;
    help?: boolean;
    locale?: string;
    mapRoot?: string;
    module?: ModuleKind;
    noEmitOnError?: boolean;
    noErrorTruncation?: boolean;
    noImplicitAny?: boolean;
    noLib?: boolean;
    noLibCheck?: boolean;
    noResolve?: boolean;
    out?: string;
    outDir?: string;
    preserveConstEnums?: boolean;
    removeComments?: boolean;
    sourceMap?: boolean;
    sourceRoot?: string;
    suppressImplicitAnyIndexErrors?: boolean;
    target?: ScriptTarget;
    version?: boolean;
    watch?: boolean;
*/

	this.opts = opts || {};
	this.opts.module = ts.ModuleKind.CommonJS;
	this.opts.target = this.opts.target && (this.opts.target.toLowerCase() == 'es6') ? ts.ScriptTarget.ES6 : ts.ScriptTarget.ES5;
	this.opts.skipWrite = true;
}

Compiler.prototype.compileSource = function (name, source) {
	console.log('compiling ' + name);

	var result = {
		failure: false,
		errors: [],
		output: []
	};

	this.host.reset();
	this.host.addFile(name, source);
	this.opts.noResolve = true;
	this.opts.noLib = true;

	var program = ts.createProgram([name], this.opts, this.host);
	result.errors = this.compileProgram(program);
	
	if (result.errors.length) {
		if (result.errors[0].category == ts.DiagnosticCategory.Error)
			result.failure = true;
	}

//	if (!result.failure) {
		result.output = this.host.getOutput();
		this.host.reset(true);
//	}

	return result;

}
/**
 * Compile the inputs and return the results
 *
 * @param {array} list of input files with absolute paths
 * @return {object} compilation results
 * @api public
 */
Compiler.prototype.compile = function (inputs) {
	log("Inputs: " + JSON.stringify(inputs));

	var result = {
		failure: false,
		errors: [],
		output: []
	};

	this.host.reset();
	var program = ts.createProgram(inputs, this.opts, this.host);

	if (this.host.inputHasChanged()) {
		result.errors = this.compileProgram(program);
		log("Outputs: " + JSON.stringify(Object.keys(this.host.output)));

		if (result.errors.length) {
			if (result.errors[0].category == ts.DiagnosticCategory.Error)
				result.failure = true;
		}
	}
	else {
		log("Files are unchanged");
		return false;
	}

	if (!result.failure) {
		result.output = this.host.getOutput();
		this.host.reset(true);
	}

	return result;
}

/**
 * Compile the inputs and return the results
 *
 * @param {array} list of input files with absolute paths
 * @return {object} compilation results
 * @api public
 */
Compiler.prototype.compileProgram = function (program) {
	var errors = program.getDiagnostics();

	if (!errors.length) {
		var checker = program.getTypeChecker(true);
		var semanticErrors = checker.getDiagnostics();
		var emitErrors = checker.emitFiles().diagnostics;
		errors = semanticErrors.concat(emitErrors);

		if (this.opts.declaration) {
			// patch for https://github.com/Microsoft/TypeScript/issues/465
			errors = errors.filter(function(diag) {
				return diag.code != "4025";
			})
		}
	}

	return errors;
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

module.exports = Compiler;
module.exports.isTypescript = isTypescript;
module.exports.isTypescriptDeclaration = isTypescriptDeclaration;
module.exports.tsToJs = tsToJs;
module.exports.normalizePath = ts.normalizePath;