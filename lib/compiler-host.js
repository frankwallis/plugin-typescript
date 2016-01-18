System.register(['typescript', './logger', './utils'], function(exports_1) {
    var ts, logger_1, utils_1;
    var logger, __HTML_MODULE__, CompilerHost;
    return {
        setters:[
            function (ts_1) {
                ts = ts_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            logger = new logger_1.default({ debug: false });
            exports_1("__HTML_MODULE__", __HTML_MODULE__ = "__html_module__");
            ;
            CompilerHost = (function () {
                function CompilerHost(options) {
                    this._options = options || {};
                    this._options.module = this.getEnum(this._options.module, ts.ModuleKind, 4);
                    this._options.target = this.getEnum(this._options.target, ts.ScriptTarget, 1);
                    this._options.jsx = this.getEnum(this._options.jsx, ts.JsxEmit, 0);
                    this._options.allowNonTsExtensions = (this._options.allowNonTsExtensions !== false);
                    this._options.skipDefaultLibCheck = (this._options.skipDefaultLibCheck !== false);
                    this._options.noResolve = true;
                    this._options.moduleResolution = 1;
                    this._files = {};
                    var file = this.addFile(__HTML_MODULE__, "var __html__: string = ''; export default __html__;");
                    file.dependencies = { list: [], mappings: {} };
                    file.checked = true;
                    file.errors = [];
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
                CompilerHost.prototype.getDefaultLibFileName = function () {
                    return "typescript/lib/lib.es6.d.ts";
                };
                CompilerHost.prototype.useCaseSensitiveFileNames = function () {
                    return false;
                };
                CompilerHost.prototype.getCanonicalFileName = function (fileName) {
                    return ts.normalizePath(fileName);
                };
                CompilerHost.prototype.getCurrentDirectory = function () {
                    return "";
                };
                CompilerHost.prototype.getNewLine = function () {
                    return "\n";
                };
                CompilerHost.prototype.readFile = function (fileName) {
                    throw new Error("Not implemented");
                };
                CompilerHost.prototype.writeFile = function (name, text, writeByteOrderMark) {
                    throw new Error("Not implemented");
                };
                CompilerHost.prototype.getSourceFile = function (fileName) {
                    fileName = this.getCanonicalFileName(fileName);
                    return this._files[fileName];
                };
                CompilerHost.prototype.getAllFiles = function () {
                    var _this = this;
                    return Object.keys(this._files).map(function (key) { return _this._files[key]; });
                };
                CompilerHost.prototype.fileExists = function (fileName) {
                    return !!this.getSourceFile(fileName);
                };
                CompilerHost.prototype.addFile = function (fileName, text) {
                    fileName = this.getCanonicalFileName(fileName);
                    var file = this._files[fileName];
                    if (!file) {
                        this._files[fileName] = ts.createSourceFile(fileName, text, this._options.target);
                        logger.debug("added " + fileName);
                    }
                    else if (file.text != text) {
                        this._files[fileName] = ts.createSourceFile(fileName, text, this._options.target);
                        logger.debug("updated " + fileName);
                    }
                    return this._files[fileName];
                };
                CompilerHost.prototype.resolveModuleNames = function (moduleNames, containingFile) {
                    var _this = this;
                    return moduleNames.map(function (modName) {
                        var dependencies = _this._files[containingFile].dependencies;
                        if (utils_1.isHtml(modName)) {
                            return { resolvedFileName: __HTML_MODULE__ };
                        }
                        else if (dependencies) {
                            var resolvedFileName = dependencies.mappings[modName];
                            var isExternalLibraryImport = utils_1.isTypescriptDeclaration(resolvedFileName);
                            return { resolvedFileName: resolvedFileName, isExternalLibraryImport: isExternalLibraryImport };
                        }
                        else {
                            return ts.resolveModuleName(modName, containingFile, _this._options, _this).resolvedModule;
                        }
                    });
                };
                return CompilerHost;
            })();
            exports_1("CompilerHost", CompilerHost);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXItaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21waWxlci1ob3N0LnRzIl0sIm5hbWVzIjpbIkNvbXBpbGVySG9zdCIsIkNvbXBpbGVySG9zdC5jb25zdHJ1Y3RvciIsIkNvbXBpbGVySG9zdC5nZXRFbnVtIiwiQ29tcGlsZXJIb3N0Lm9wdGlvbnMiLCJDb21waWxlckhvc3QuZ2V0RGVmYXVsdExpYkZpbGVOYW1lIiwiQ29tcGlsZXJIb3N0LnVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXMiLCJDb21waWxlckhvc3QuZ2V0Q2Fub25pY2FsRmlsZU5hbWUiLCJDb21waWxlckhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSIsIkNvbXBpbGVySG9zdC5nZXROZXdMaW5lIiwiQ29tcGlsZXJIb3N0LnJlYWRGaWxlIiwiQ29tcGlsZXJIb3N0LndyaXRlRmlsZSIsIkNvbXBpbGVySG9zdC5nZXRTb3VyY2VGaWxlIiwiQ29tcGlsZXJIb3N0LmdldEFsbEZpbGVzIiwiQ29tcGlsZXJIb3N0LmZpbGVFeGlzdHMiLCJDb21waWxlckhvc3QuYWRkRmlsZSIsIkNvbXBpbGVySG9zdC5yZXNvbHZlTW9kdWxlTmFtZXMiXSwibWFwcGluZ3MiOiI7O1FBS00sTUFBTSxFQUNDLGVBQWU7Ozs7Ozs7Ozs7Ozs7WUFEdEIsTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLDZCQUFBLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQSxDQUFDO1lBRTZCLENBQUM7WUFrQi9FO2dCQUlDQSxzQkFBWUEsT0FBWUE7b0JBQ3ZCQyxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxJQUFJQSxFQUFFQSxDQUFDQTtvQkFDOUJBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVBQVFBLEVBQUdBLENBQUNBLFVBQVVBLEVBQUVBLENBQW9CQSxDQUFDQSxDQUFDQTtvQkFDdEdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVBQVFBLEVBQUdBLENBQUNBLFlBQVlBLEVBQUVBLENBQW1CQSxDQUFDQSxDQUFDQTtvQkFDdkdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEVBQVFBLEVBQUdBLENBQUNBLE9BQU9BLEVBQUVBLENBQWVBLENBQUNBLENBQUNBO29CQUN4RkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxvQkFBb0JBLEtBQUtBLEtBQUtBLENBQUNBLENBQUNBO29CQUNwRkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsbUJBQW1CQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxtQkFBbUJBLEtBQUtBLEtBQUtBLENBQUNBLENBQUNBO29CQUNsRkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBRy9CQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLENBQStCQSxDQUFDQTtvQkFFakVBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBO29CQUtqQkEsSUFBTUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZUFBZUEsRUFBRUEscURBQXFEQSxDQUFDQSxDQUFDQTtvQkFDOUZBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLEVBQUVBLElBQUlBLEVBQUVBLEVBQUVBLEVBQUVBLFFBQVFBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBO29CQUMvQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ3BCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDdEJBLENBQUNBO2dCQUVPRCw4QkFBT0EsR0FBZkEsVUFBbUJBLFNBQWNBLEVBQUVBLFFBQWFBLEVBQUVBLFlBQWVBO29CQUNoRUUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsSUFBSUEsU0FBU0EsQ0FBQ0E7d0JBQUNBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBO29CQUVoREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQy9CQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxFQUFFQSxLQUFLQSxTQUFTQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDbkVBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLFFBQVFBLENBQUNBO2dDQUMxQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3JDQSxJQUFJQTtnQ0FDSEEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7d0JBQzVCQSxDQUFDQTtvQkFDRkEsQ0FBQ0E7b0JBRURBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLHlCQUF1QkEsU0FBU0EsTUFBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3REQSxDQUFDQTtnQkFFREYsc0JBQVdBLGlDQUFPQTt5QkFBbEJBO3dCQUNDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtvQkFDdEJBLENBQUNBOzs7bUJBQUFIO2dCQUNNQSw0Q0FBcUJBLEdBQTVCQTtvQkFDQ0ksTUFBTUEsQ0FBQ0EsNkJBQTZCQSxDQUFDQTtnQkFDdENBLENBQUNBO2dCQUVNSixnREFBeUJBLEdBQWhDQTtvQkFDQ0ssTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ2RBLENBQUNBO2dCQUVNTCwyQ0FBb0JBLEdBQTNCQSxVQUE0QkEsUUFBZ0JBO29CQUMzQ00sTUFBTUEsQ0FBRUEsRUFBVUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzVDQSxDQUFDQTtnQkFFTU4sMENBQW1CQSxHQUExQkE7b0JBQ0NPLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO2dCQUNYQSxDQUFDQTtnQkFFTVAsaUNBQVVBLEdBQWpCQTtvQkFDQ1EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0JBQ2JBLENBQUNBO2dCQUVNUiwrQkFBUUEsR0FBZkEsVUFBZ0JBLFFBQWdCQTtvQkFDL0JTLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BDQSxDQUFDQTtnQkFFTVQsZ0NBQVNBLEdBQWhCQSxVQUFpQkEsSUFBWUEsRUFBRUEsSUFBWUEsRUFBRUEsa0JBQTJCQTtvQkFDdkVVLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BDQSxDQUFDQTtnQkFFTVYsb0NBQWFBLEdBQXBCQSxVQUFxQkEsUUFBZ0JBO29CQUNwQ1csUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDL0NBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUM5QkEsQ0FBQ0E7Z0JBRU1YLGtDQUFXQSxHQUFsQkE7b0JBQUFZLGlCQUVDQTtvQkFESUEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQUEsR0FBR0EsSUFBSUEsT0FBQUEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBaEJBLENBQWdCQSxDQUFDQSxDQUFDQTtnQkFDbEVBLENBQUNBO2dCQUVNWixpQ0FBVUEsR0FBakJBLFVBQWtCQSxRQUFnQkE7b0JBQ2pDYSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDdkNBLENBQUNBO2dCQUVNYiw4QkFBT0EsR0FBZEEsVUFBZUEsUUFBZ0JBLEVBQUVBLElBQVlBO29CQUM1Q2MsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDM0NBLElBQU1BLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO29CQUVuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2JBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7d0JBQzlFQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFTQSxRQUFVQSxDQUFDQSxDQUFDQTtvQkFDckNBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFFMUJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7d0JBQ2xGQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxhQUFXQSxRQUFVQSxDQUFDQSxDQUFDQTtvQkFDdkNBLENBQUNBO29CQUVMQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDOUJBLENBQUNBO2dCQU9NZCx5Q0FBa0JBLEdBQXpCQSxVQUEwQkEsV0FBcUJBLEVBQUVBLGNBQXNCQTtvQkFBdkVlLGlCQWtCQ0E7b0JBakJBQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFDQSxPQUFPQTt3QkFDOUJBLElBQU1BLFlBQVlBLEdBQUdBLEtBQUlBLENBQUNBLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBO3dCQUU5REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsY0FBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3JCQSxNQUFNQSxDQUFDQSxFQUFFQSxnQkFBZ0JBLEVBQUVBLGVBQWVBLEVBQUVBLENBQUNBO3dCQUM5Q0EsQ0FBQ0E7d0JBQ0RBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBOzRCQUN2QkEsSUFBTUEsZ0JBQWdCQSxHQUFHQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTs0QkFDeERBLElBQU1BLHVCQUF1QkEsR0FBR0EsK0JBQXVCQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBOzRCQUUxRUEsTUFBTUEsQ0FBQ0EsRUFBRUEsa0JBQUFBLGdCQUFnQkEsRUFBRUEseUJBQUFBLHVCQUF1QkEsRUFBRUEsQ0FBQ0E7d0JBQ3REQSxDQUFDQTt3QkFDREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ0xBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsT0FBT0EsRUFBRUEsY0FBY0EsRUFBRUEsS0FBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsS0FBSUEsQ0FBQ0EsQ0FBQ0EsY0FBY0EsQ0FBQ0E7d0JBRTFGQSxDQUFDQTtvQkFDRkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ0pBLENBQUNBO2dCQUNGZixtQkFBQ0E7WUFBREEsQ0FBQ0EsQUEvSEQsSUErSEM7WUEvSEQsdUNBK0hDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7aXNIdG1sLCBpc1R5cGVzY3JpcHREZWNsYXJhdGlvbiwgaXNKYXZhU2NyaXB0fSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7IGRlYnVnOiBmYWxzZSB9KTtcbmV4cG9ydCBjb25zdCBfX0hUTUxfTU9EVUxFX18gPSBcIl9faHRtbF9tb2R1bGVfX1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbWJpbmVkT3B0aW9ucyBleHRlbmRzIFBsdWdpbk9wdGlvbnMsIHRzLkNvbXBpbGVyT3B0aW9ucyB7IH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNwaWxlUmVzdWx0IHtcblx0ZmFpbHVyZTogYm9vbGVhbjtcblx0ZXJyb3JzOiBBcnJheTx0cy5EaWFnbm9zdGljPjtcblx0anM6IHN0cmluZztcblx0c291cmNlTWFwOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlRmlsZSBleHRlbmRzIHRzLlNvdXJjZUZpbGUge1xuICAgb3V0cHV0PzogVHJhbnNwaWxlUmVzdWx0O1xuICAgcGVuZGluZ0RlcGVuZGVuY2llcz86IFByb21pc2U8RGVwZW5kZW5jeUluZm8+O1xuICAgZGVwZW5kZW5jaWVzPzogRGVwZW5kZW5jeUluZm87XG4gICBlcnJvcnM/OiB0cy5EaWFnbm9zdGljW107XG4gICBjaGVja2VkPzogYm9vbGVhbjtcbiAgIGlzTGliRmlsZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBDb21waWxlckhvc3QgaW1wbGVtZW50cyB0cy5Db21waWxlckhvc3Qge1xuXHRwcml2YXRlIF9vcHRpb25zOiBhbnk7XG5cdHByaXZhdGUgX2ZpbGVzOiB7IFtzOiBzdHJpbmddOiBTb3VyY2VGaWxlOyB9OyAvL01hcDxzdHJpbmcsIHRzLlNvdXJjZUZpbGU+O1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IGFueSkge1xuXHRcdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdHRoaXMuX29wdGlvbnMubW9kdWxlID0gdGhpcy5nZXRFbnVtKHRoaXMuX29wdGlvbnMubW9kdWxlLCAoPGFueT50cykuTW9kdWxlS2luZCwgdHMuTW9kdWxlS2luZC5TeXN0ZW0pO1xuXHRcdHRoaXMuX29wdGlvbnMudGFyZ2V0ID0gdGhpcy5nZXRFbnVtKHRoaXMuX29wdGlvbnMudGFyZ2V0LCAoPGFueT50cykuU2NyaXB0VGFyZ2V0LCB0cy5TY3JpcHRUYXJnZXQuRVM1KTtcblx0XHR0aGlzLl9vcHRpb25zLmpzeCA9IHRoaXMuZ2V0RW51bSh0aGlzLl9vcHRpb25zLmpzeCwgKDxhbnk+dHMpLkpzeEVtaXQsIHRzLkpzeEVtaXQuTm9uZSk7XG5cdFx0dGhpcy5fb3B0aW9ucy5hbGxvd05vblRzRXh0ZW5zaW9ucyA9ICh0aGlzLl9vcHRpb25zLmFsbG93Tm9uVHNFeHRlbnNpb25zICE9PSBmYWxzZSk7XG5cdFx0dGhpcy5fb3B0aW9ucy5za2lwRGVmYXVsdExpYkNoZWNrID0gKHRoaXMuX29wdGlvbnMuc2tpcERlZmF1bHRMaWJDaGVjayAhPT0gZmFsc2UpO1xuXHRcdHRoaXMuX29wdGlvbnMubm9SZXNvbHZlID0gdHJ1ZTtcblxuXHRcdC8vIEZvcmNlIG1vZHVsZSByZXNvbHV0aW9uIGludG8gJ2NsYXNzaWMnIG1vZGUsIHRvIHByZXZlbnQgbm9kZSBtb2R1bGUgcmVzb2x1dGlvbiBmcm9tIGtpY2tpbmcgaW5cblx0XHR0aGlzLl9vcHRpb25zLm1vZHVsZVJlc29sdXRpb24gPSB0cy5Nb2R1bGVSZXNvbHV0aW9uS2luZC5DbGFzc2ljO1xuXG5cdFx0dGhpcy5fZmlsZXMgPSB7fTsgLy9uZXcgTWFwPHN0cmluZywgdHMuU291cmNlRmlsZT4oKTtcblxuXHRcdC8vIHN1cHBvcnQgZm9yIGltcG9ydGluZyBodG1sIHRlbXBsYXRlcyB1bnRpbFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjcwOSNpc3N1ZWNvbW1lbnQtOTE5Njg5NTAgZ2V0cyBpbXBsZW1lbnRlZFxuXHRcdC8vIG5vdGUgLSB0aGlzIG9ubHkgYWZmZWN0cyB0eXBlLWNoZWNraW5nLCBub3QgcnVudGltZSFcblx0XHRjb25zdCBmaWxlID0gdGhpcy5hZGRGaWxlKF9fSFRNTF9NT0RVTEVfXywgXCJ2YXIgX19odG1sX186IHN0cmluZyA9ICcnOyBleHBvcnQgZGVmYXVsdCBfX2h0bWxfXztcIik7XG4gICAgICBmaWxlLmRlcGVuZGVuY2llcyA9IHsgbGlzdDogW10sIG1hcHBpbmdzOiB7fSB9O1xuICAgICAgZmlsZS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIGZpbGUuZXJyb3JzID0gW107XG5cdH1cblxuXHRwcml2YXRlIGdldEVudW08VD4oZW51bVZhbHVlOiBhbnksIGVudW1UeXBlOiBhbnksIGRlZmF1bHRWYWx1ZTogVCk6IFQge1xuXHRcdGlmIChlbnVtVmFsdWUgPT0gdW5kZWZpbmVkKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG5cdFx0Zm9yICh2YXIgZW51bVByb3AgaW4gZW51bVR5cGUpIHtcblx0XHRcdGlmIChlbnVtUHJvcC50b0xvd2VyQ2FzZSgpID09PSBlbnVtVmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgZW51bVR5cGVbZW51bVByb3BdID09PSBcInN0cmluZ1wiKVxuXHRcdFx0XHRcdHJldHVybiBlbnVtVHlwZVtlbnVtVHlwZVtlbnVtUHJvcF1dO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIGVudW1UeXBlW2VudW1Qcm9wXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXNlZCB2YWx1ZSBbJHtlbnVtVmFsdWV9XWApO1xuXHR9XG5cblx0cHVibGljIGdldCBvcHRpb25zKCk6IENvbWJpbmVkT3B0aW9ucyB7XG5cdFx0cmV0dXJuIHRoaXMuX29wdGlvbnM7XG5cdH1cblx0cHVibGljIGdldERlZmF1bHRMaWJGaWxlTmFtZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcInR5cGVzY3JpcHQvbGliL2xpYi5lczYuZC50c1wiO1xuXHR9XG5cblx0cHVibGljIHVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHVibGljIGdldENhbm9uaWNhbEZpbGVOYW1lKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdHJldHVybiAodHMgYXMgYW55KS5ub3JtYWxpemVQYXRoKGZpbGVOYW1lKTtcblx0fVxuXG5cdHB1YmxpYyBnZXRDdXJyZW50RGlyZWN0b3J5KCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TmV3TGluZSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiBcIlxcblwiO1xuXHR9XG5cblx0cHVibGljIHJlYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTtcblx0fVxuXG5cdHB1YmxpYyB3cml0ZUZpbGUobmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIHdyaXRlQnl0ZU9yZGVyTWFyazogYm9vbGVhbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTtcblx0fVxuXG5cdHB1YmxpYyBnZXRTb3VyY2VGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBTb3VyY2VGaWxlIHtcblx0XHRmaWxlTmFtZSA9IHRoaXMuZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWUpO1xuXHRcdHJldHVybiB0aGlzLl9maWxlc1tmaWxlTmFtZV07XG5cdH1cblxuXHRwdWJsaWMgZ2V0QWxsRmlsZXMoKTogU291cmNlRmlsZVtdIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9maWxlcykubWFwKGtleSA9PiB0aGlzLl9maWxlc1trZXldKTtcblx0fVxuXG5cdHB1YmxpYyBmaWxlRXhpc3RzKGZpbGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gISF0aGlzLmdldFNvdXJjZUZpbGUoZmlsZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGFkZEZpbGUoZmlsZU5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogU291cmNlRmlsZSB7XG5cdFx0ZmlsZU5hbWUgPSB0aGlzLmdldENhbm9uaWNhbEZpbGVOYW1lKGZpbGVOYW1lKTsgICAgICBcbiAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLl9maWxlc1tmaWxlTmFtZV07XG4gICAgICBcbiAgICAgIGlmICghZmlsZSkge1xuXHRcdCAgIHRoaXMuX2ZpbGVzW2ZpbGVOYW1lXSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoZmlsZU5hbWUsIHRleHQsIHRoaXMuX29wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgYWRkZWQgJHtmaWxlTmFtZX1gKTsgICAgICAgICBcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGZpbGUudGV4dCAhPSB0ZXh0KSB7XG4gICAgICAgICAvLyBjcmVhdGUgYSBuZXcgb25lXG4gICAgICAgICB0aGlzLl9maWxlc1tmaWxlTmFtZV0gPSB0cy5jcmVhdGVTb3VyY2VGaWxlKGZpbGVOYW1lLCB0ZXh0LCB0aGlzLl9vcHRpb25zLnRhcmdldCk7XG4gICAgICAgICBsb2dnZXIuZGVidWcoYHVwZGF0ZWQgJHtmaWxlTmFtZX1gKTsgICAgICAgICBcbiAgICAgIH1cblx0XHRcblx0XHRyZXR1cm4gdGhpcy5fZmlsZXNbZmlsZU5hbWVdO1xuXHR9XG5cblx0Lypcblx0XHRPdmVycmlkZXMgdGhlIHN0YW5kYXJkIHJlc29sdXRpb24gYWxnb3JpdGhtIHVzZWQgYnkgdGhlIGNvbXBpbGVyIHNvIHRoYXQgd2UgY2FuIHVzZSBzeXN0ZW1qc1xuXHRcdHJlc29sdXRpb24uIEJlY2F1c2UgVHlwZVNjcmlwdCByZXF1aXJlcyBzeW5jaHJvbm91cyByZXNvbHV0aW9uLCBldmVyeXRoaW5nIGlzIHByZS1yZXNvbHZlZFxuXHRcdGJ5IHRoZSB0eXBlLWNoZWNrZXIgYW5kIHJlZ2lzdGVyZWQgd2l0aCB0aGUgaG9zdCBiZWZvcmUgdHlwZS1jaGVja2luZy5cblx0Ki9cblx0cHVibGljIHJlc29sdmVNb2R1bGVOYW1lcyhtb2R1bGVOYW1lczogc3RyaW5nW10sIGNvbnRhaW5pbmdGaWxlOiBzdHJpbmcpOiB0cy5SZXNvbHZlZE1vZHVsZVtdIHtcblx0XHRyZXR1cm4gbW9kdWxlTmFtZXMubWFwKChtb2ROYW1lKSA9PiB7XG5cdFx0XHRjb25zdCBkZXBlbmRlbmNpZXMgPSB0aGlzLl9maWxlc1tjb250YWluaW5nRmlsZV0uZGVwZW5kZW5jaWVzO1xuXG5cdFx0XHRpZiAoaXNIdG1sKG1vZE5hbWUpKSB7XG5cdFx0XHRcdHJldHVybiB7IHJlc29sdmVkRmlsZU5hbWU6IF9fSFRNTF9NT0RVTEVfXyB9O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoZGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdGNvbnN0IHJlc29sdmVkRmlsZU5hbWUgPSBkZXBlbmRlbmNpZXMubWFwcGluZ3NbbW9kTmFtZV07XG5cdFx0XHRcdGNvbnN0IGlzRXh0ZXJuYWxMaWJyYXJ5SW1wb3J0ID0gaXNUeXBlc2NyaXB0RGVjbGFyYXRpb24ocmVzb2x2ZWRGaWxlTmFtZSk7XG5cblx0XHRcdFx0cmV0dXJuIHsgcmVzb2x2ZWRGaWxlTmFtZSwgaXNFeHRlcm5hbExpYnJhcnlJbXBvcnQgfTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdHMucmVzb2x2ZU1vZHVsZU5hbWUobW9kTmFtZSwgY29udGFpbmluZ0ZpbGUsIHRoaXMuX29wdGlvbnMsIHRoaXMpLnJlc29sdmVkTW9kdWxlO1xuXHRcdFx0XHQvLyBcdHRocm93IG5ldyBFcnJvcihgY29udGFpbmluZyBmaWxlICR7Y29udGFpbmluZ0ZpbGV9IGhhcyBub3QgYmVlbiBsb2FkZWRgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuIl19