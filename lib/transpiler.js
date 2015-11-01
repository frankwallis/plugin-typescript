var ts = require('typescript');
var logger_1 = require('./logger');
var utils_1 = require("./utils");
var logger = new logger_1.default({ debug: false });
var Transpiler = (function () {
    function Transpiler(host) {
        this._host = host;
        this._options = Object.assign(this._host.options);
        this._options.inlineSourceMap = false;
        this._options.sourceMap = (this._options.sourceMap !== false);
        this._options.declaration = false;
        this._options.isolatedModules = true;
    }
    Transpiler.prototype.transpile = function (sourceName, source) {
        logger.debug("transpiling " + sourceName);
        var sourceFile = this._host.addFile(sourceName, source);
        var program = ts.createProgram([sourceName], this._options, this._host);
        var jstext = undefined;
        var maptext = undefined;
        var emitResult = program.emit(undefined, function (outputName, output) {
            if (utils_1.isJavaScript(outputName))
                jstext = output.slice(0, output.lastIndexOf("//#"));
            else if (utils_1.isSourceMap(outputName))
                maptext = output;
            else
                throw new Error("unexpected ouput file " + outputName);
        });
        var diagnostics = program.getSyntacticDiagnostics().concat(emitResult.diagnostics);
        return {
            failure: this.hasError(diagnostics),
            errors: diagnostics,
            js: jstext,
            sourceMap: maptext
        };
    };
    Transpiler.prototype.hasError = function (diags) {
        return diags.some(function (diag) { return (diag.category === ts.DiagnosticCategory.Error); });
    };
    return Transpiler;
})();
exports.Transpiler = Transpiler;
