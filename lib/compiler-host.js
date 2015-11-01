var ts = require('typescript');
var logger_1 = require('./logger');
var utils_1 = require('./utils');
var logger = new logger_1.default({ debug: false });
exports.__HTML_MODULE__ = "__html_module__";
var CompilerHost = (function () {
    function CompilerHost(options) {
        this._options = options || {};
        this._options.module = this.getEnum(this._options.module, ts.ModuleKind, ts.ModuleKind.System);
        this._options.target = this.getEnum(this._options.target, ts.ScriptTarget, ts.ScriptTarget.ES5);
        this._options.jsx = this.getEnum(this._options.jsx, ts.JsxEmit, ts.JsxEmit.None);
        this._options.allowNonTsExtensions = (this._options.allowNonTsExtensions !== false);
        this._options.noResolve = true;
        this._options.noLib = true;
        this._files = new Map();
        this._fileResMaps = new Map();
        this.addFile(exports.__HTML_MODULE__, "var __html__: string = ''; export default __html__;");
    }
    CompilerHost.prototype.getEnum = function (enumValue, enumType, defaultValue) {
        if (enumValue == undefined)
            return defaultValue;
        for (var enumProp in enumType) {
            if (enumProp.toLowerCase() === enumValue.toString().toLowerCase()) {
                if (typeof enumType[enumProp] === "string")
                    return enumType[enumType[enumProp]];
                else
                    return enumType[enumProp];
            }
        }
        throw new Error("Unrecognised value [" + enumValue + "]");
    };
    Object.defineProperty(CompilerHost.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    CompilerHost.prototype.getSourceFile = function (fileName) {
        return this._files[fileName];
    };
    CompilerHost.prototype.fileExists = function (fileName) {
        return !!this._files[fileName];
    };
    CompilerHost.prototype.readFile = function (fileName) {
        throw new Error("Not implemented");
    };
    CompilerHost.prototype.writeFile = function (name, text, writeByteOrderMark) {
        throw new Error("Not implemented");
    };
    CompilerHost.prototype.getDefaultLibFileName = function () {
        return "typescript/lib/lib.es6.d.ts";
    };
    CompilerHost.prototype.useCaseSensitiveFileNames = function () {
        return false;
    };
    CompilerHost.prototype.getCanonicalFileName = function (fileName) {
        return fileName;
    };
    CompilerHost.prototype.getCurrentDirectory = function () {
        return "";
    };
    CompilerHost.prototype.getNewLine = function () {
        return "\n";
    };
    CompilerHost.prototype.addFile = function (filename, text) {
        this._files[filename] = ts.createSourceFile(filename, text, this._options.target);
        logger.debug("added " + filename);
        return this._files[filename];
    };
    CompilerHost.prototype.addResolutionMap = function (filename, map) {
        this._fileResMaps[filename] = map;
    };
    CompilerHost.prototype.resolveModuleNames = function (moduleNames, containingFile) {
        var _this = this;
        return moduleNames.map(function (modName) {
            if (utils_1.isHtml(modName))
                return { resolvedFileName: exports.__HTML_MODULE__ };
            else if (_this._fileResMaps[containingFile])
                return { resolvedFileName: _this._fileResMaps[containingFile][modName] };
            else
                return ts.resolveModuleName(modName, containingFile, _this._options, _this).resolvedModule;
        });
    };
    return CompilerHost;
})();
exports.CompilerHost = CompilerHost;
