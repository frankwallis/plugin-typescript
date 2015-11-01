var ts = require('typescript');
var logger_1 = require('./logger');
var factory_1 = require('./factory');
var format_errors_1 = require('./format-errors');
var utils_1 = require('./utils');
var logger = new logger_1.default({ debug: false });
var factory = factory_1.createFactory(System.typescriptOptions, _resolve, _fetch);
function translate(load) {
    logger.debug("systemjs translating " + load.address);
    return factory.then(function (_a) {
        var transpiler = _a.transpiler, typeChecker = _a.typeChecker, host = _a.host;
        var result = transpiler.transpile(load.address, load.source);
        format_errors_1.formatErrors(result.errors, logger);
        if (result.failure)
            throw new Error("TypeScript transpilation failed");
        if (host.options.typeCheck && utils_1.isTypescript(load.address)) {
            typeChecker.check(load.address, load.source)
                .catch(function (err) { return logger.error(err.message); })
                .then(function (diags) {
                format_errors_1.formatErrors(diags, logger);
                if (host.options.typeCheck === "strict") {
                    if (diags.some(function (diag) { return diag.category === ts.DiagnosticCategory.Error; }))
                        new Error("TypeScript found type errors");
                }
            });
        }
        load.source = wrapSource(result.js, load);
        load.metadata.sourceMap = result.sourceMap;
        load.metadata.format = 'register';
        return load;
    });
}
exports.translate = translate;
function wrapSource(source, load) {
    return '(function(__moduleName){' + source + '\n})("' + load.name + '");\n//# sourceURL=' + load.address + '!transpiled';
}
function _resolve(dep, parent) {
    if (!parent)
        parent = __filename;
    return System.normalize(dep, parent)
        .then(function (normalized) {
        if (normalized.slice(-6) == '.ts.js')
            normalized = normalized.slice(0, -3);
        else if (normalized.slice(-8) == '.json.js')
            normalized = normalized.slice(0, -3);
        logger.debug("resolved " + normalized + " (" + parent + " -> " + dep + ")");
        return normalized;
    });
}
function _fetch(address) {
    return System.fetch({ address: address, name: address, metadata: {} })
        .then(function (text) {
        logger.debug("fetched " + address);
        return text;
    });
}
