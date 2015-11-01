/* */
var ts = require('typescript');
var logger_1 = require('./logger');
var utils_1 = require("./utils");
let logger = new logger_1.default({ debug: false });
class Transpiler {
    constructor(host) {
        this._host = host;
        this._options = Object.assign(this._host.options);
        this._options.inlineSourceMap = false;
        this._options.sourceMap = (this._options.sourceMap !== false);
        this._options.declaration = false;
        this._options.isolatedModules = true;
    }
    transpile(sourceName, source) {
        logger.debug(`transpiling ${sourceName}`);
        let sourceFile = this._host.addFile(sourceName, source);
        let program = ts.createProgram([sourceName], this._options, this._host);
        let jstext = undefined;
        let maptext = undefined;
        // Emit
        let emitResult = program.emit(undefined, (outputName, output) => {
            if (utils_1.isJavaScript(outputName))
                jstext = output.slice(0, output.lastIndexOf("//#")); // remove sourceMappingURL
            else if (utils_1.isSourceMap(outputName))
                maptext = output;
            else
                throw new Error(`unexpected ouput file ${outputName}`);
        });
        let diagnostics = program.getSyntacticDiagnostics().concat(emitResult.diagnostics);
        return {
            failure: this.hasError(diagnostics),
            errors: diagnostics,
            js: jstext,
            sourceMap: maptext
        };
    }
    hasError(diags) {
        return diags.some(diag => (diag.category === ts.DiagnosticCategory.Error));
    }
}
exports.Transpiler = Transpiler;
