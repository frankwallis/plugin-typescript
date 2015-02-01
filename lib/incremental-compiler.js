var path = require('path');
var ts = require('typescript');
var TypeScriptSystemJsHost = require("./services-host");
var Logger = require("./logger");
var logger = new Logger({ debug: false });

function Compiler(opts) {
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

	this.servicesHost = new TypeScriptSystemJsHost(this.opts, this.resolve, this.fetch);
}

Compiler.prototype.load = function (name) {
	name = name.split('!')[0];
	return this.servicesHost.load(name, true);
}

Compiler.prototype.compile = function (name) {
	name = name.split('!')[0];
	return this.servicesHost.compile(name, this.resolve, this.fetch);
}

Compiler.prototype.resolve = function (parent, dep) {
    logger.debug("resolving " + parent + " -> " + dep);
    var result = "";

    if (dep[0] == '/')
        result = dep;
    else if (dep[0] == '.')
        result = path.join(path.dirname(parent), dep);
    else
    	result = dep;

    if (path.extname(result) != '.ts')
        result = result + ".ts";

    logger.debug('resolved ' + result)
    return result;
}

Compiler.prototype.fetch = function (name) {
	var load = {
		name: name,
		metadata: {}
	}
	return System.locate(load).then(function(address) {
		logger.debug("located " + address);
		load.address = address;
		return System.fetch(load).then(function(res) {
			logger.debug("loaded " + name);
			return res;
		}.bind(this));
	}.bind(this));
}

module.exports = Compiler;
module.exports.isTypescript = TypeScriptSystemJsHost.isTypescript;
module.exports.isTypescriptDeclaration = TypeScriptSystemJsHost.isTypescriptDeclaration;
module.exports.normalizePath = ts.normalizePath;