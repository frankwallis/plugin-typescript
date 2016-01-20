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
                    this._fileResMaps = {};
                    this.addFile(__HTML_MODULE__, "var __html__: string = ''; export default __html__;");
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
                    fileName = this.getCanonicalFileName(fileName);
                    return this._files[fileName];
                };
                CompilerHost.prototype.fileExists = function (fileName) {
                    return !!this.getSourceFile(fileName);
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
                    return ts.normalizePath(fileName);
                };
                CompilerHost.prototype.getCurrentDirectory = function () {
                    return "";
                };
                CompilerHost.prototype.getNewLine = function () {
                    return "\n";
                };
                CompilerHost.prototype.addFile = function (fileName, text, isDefaultLib) {
                    if (isDefaultLib === void 0) { isDefaultLib = false; }
                    fileName = this.getCanonicalFileName(fileName);
                    this._files[fileName] = ts.createSourceFile(fileName, text, this._options.target);
                    this._files[fileName].isDefaultLib = isDefaultLib;
                    logger.debug("added " + fileName);
                    return this._files[fileName];
                };
                CompilerHost.prototype.addResolutionMap = function (fileName, map) {
                    fileName = this.getCanonicalFileName(fileName);
                    this._fileResMaps[fileName] = map;
                };
                CompilerHost.prototype.resolveModuleNames = function (moduleNames, containingFile) {
                    var _this = this;
                    return moduleNames.map(function (modName) {
                        var mappings = _this._fileResMaps[containingFile];
                        if (utils_1.isHtml(modName)) {
                            return { resolvedFileName: __HTML_MODULE__ };
                        }
                        else if (mappings) {
                            var resolvedFileName = mappings[modName];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXItaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21waWxlci1ob3N0LnRzIl0sIm5hbWVzIjpbIkNvbXBpbGVySG9zdCIsIkNvbXBpbGVySG9zdC5jb25zdHJ1Y3RvciIsIkNvbXBpbGVySG9zdC5nZXRFbnVtIiwiQ29tcGlsZXJIb3N0Lm9wdGlvbnMiLCJDb21waWxlckhvc3QuZ2V0U291cmNlRmlsZSIsIkNvbXBpbGVySG9zdC5maWxlRXhpc3RzIiwiQ29tcGlsZXJIb3N0LnJlYWRGaWxlIiwiQ29tcGlsZXJIb3N0LndyaXRlRmlsZSIsIkNvbXBpbGVySG9zdC5nZXREZWZhdWx0TGliRmlsZU5hbWUiLCJDb21waWxlckhvc3QudXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lcyIsIkNvbXBpbGVySG9zdC5nZXRDYW5vbmljYWxGaWxlTmFtZSIsIkNvbXBpbGVySG9zdC5nZXRDdXJyZW50RGlyZWN0b3J5IiwiQ29tcGlsZXJIb3N0LmdldE5ld0xpbmUiLCJDb21waWxlckhvc3QuYWRkRmlsZSIsIkNvbXBpbGVySG9zdC5hZGRSZXNvbHV0aW9uTWFwIiwiQ29tcGlsZXJIb3N0LnJlc29sdmVNb2R1bGVOYW1lcyJdLCJtYXBwaW5ncyI6Ijs7UUFLSSxNQUFNLEVBQ0MsZUFBZTs7Ozs7Ozs7Ozs7OztZQUR0QixNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDL0IsNkJBQUEsZUFBZSxHQUFHLGlCQUFpQixDQUFBLENBQUM7WUFFK0IsQ0FBQztZQUUvRTtnQkFLQ0Esc0JBQVlBLE9BQVlBO29CQUN2QkMsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsT0FBT0EsSUFBSUEsRUFBRUEsQ0FBQ0E7b0JBQzlCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFRQSxFQUFHQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFvQkEsQ0FBQ0EsQ0FBQ0E7b0JBQ3RHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFRQSxFQUFHQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFtQkEsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxFQUFRQSxFQUFHQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFlQSxDQUFDQSxDQUFDQTtvQkFDeEZBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLG9CQUFvQkEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0Esb0JBQW9CQSxLQUFLQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDcEZBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLG1CQUFtQkEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsbUJBQW1CQSxLQUFLQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDbEZBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO29CQUcvQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxDQUErQkEsQ0FBQ0E7b0JBRWpFQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDakJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLEVBQUVBLENBQUNBO29CQUt2QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZUFBZUEsRUFBRUEscURBQXFEQSxDQUFDQSxDQUFDQTtnQkFDdEZBLENBQUNBO2dCQUVPRCw4QkFBT0EsR0FBZkEsVUFBbUJBLFNBQWNBLEVBQUVBLFFBQWFBLEVBQUVBLFlBQWVBO29CQUNoRUUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsSUFBSUEsU0FBU0EsQ0FBQ0E7d0JBQUNBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBO29CQUVoREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQy9CQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxFQUFFQSxLQUFLQSxTQUFTQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDbkVBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLFFBQVFBLENBQUNBO2dDQUMxQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3JDQSxJQUFJQTtnQ0FDSEEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7d0JBQzVCQSxDQUFDQTtvQkFDRkEsQ0FBQ0E7b0JBRURBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLHlCQUF1QkEsU0FBU0EsTUFBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3REQSxDQUFDQTtnQkFFREYsc0JBQVdBLGlDQUFPQTt5QkFBbEJBO3dCQUNDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtvQkFDdEJBLENBQUNBOzs7bUJBQUFIO2dCQUVNQSxvQ0FBYUEsR0FBcEJBLFVBQXFCQSxRQUFnQkE7b0JBQ3BDSSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO29CQUMvQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzlCQSxDQUFDQTtnQkFFTUosaUNBQVVBLEdBQWpCQSxVQUFrQkEsUUFBZ0JBO29CQUNqQ0ssTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZDQSxDQUFDQTtnQkFFTUwsK0JBQVFBLEdBQWZBLFVBQWdCQSxRQUFnQkE7b0JBQy9CTSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBO2dCQUNwQ0EsQ0FBQ0E7Z0JBRU1OLGdDQUFTQSxHQUFoQkEsVUFBaUJBLElBQVlBLEVBQUVBLElBQVlBLEVBQUVBLGtCQUEyQkE7b0JBQ3ZFTyxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBO2dCQUNwQ0EsQ0FBQ0E7Z0JBRU1QLDRDQUFxQkEsR0FBNUJBO29CQUNDUSxNQUFNQSxDQUFDQSw2QkFBNkJBLENBQUNBO2dCQUN0Q0EsQ0FBQ0E7Z0JBRU1SLGdEQUF5QkEsR0FBaENBO29CQUNDUyxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtnQkFDZEEsQ0FBQ0E7Z0JBRU1ULDJDQUFvQkEsR0FBM0JBLFVBQTRCQSxRQUFnQkE7b0JBQzNDVSxNQUFNQSxDQUFFQSxFQUFVQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDNUNBLENBQUNBO2dCQUVNViwwQ0FBbUJBLEdBQTFCQTtvQkFDQ1csTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQ1hBLENBQUNBO2dCQUVNWCxpQ0FBVUEsR0FBakJBO29CQUNDWSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFDYkEsQ0FBQ0E7Z0JBRU1aLDhCQUFPQSxHQUFkQSxVQUFlQSxRQUFnQkEsRUFBRUEsSUFBWUEsRUFBRUEsWUFBNkJBO29CQUE3QmEsNEJBQTZCQSxHQUE3QkEsb0JBQTZCQTtvQkFDM0VBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQy9DQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUNsRkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsR0FBR0EsWUFBWUEsQ0FBQ0E7b0JBRWxEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFTQSxRQUFVQSxDQUFDQSxDQUFDQTtvQkFDbENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUM5QkEsQ0FBQ0E7Z0JBUU1iLHVDQUFnQkEsR0FBdkJBLFVBQXdCQSxRQUFnQkEsRUFBRUEsR0FBd0JBO29CQUNqRWMsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDL0NBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNuQ0EsQ0FBQ0E7Z0JBT01kLHlDQUFrQkEsR0FBekJBLFVBQTBCQSxXQUFxQkEsRUFBRUEsY0FBc0JBO29CQUF2RWUsaUJBa0JDQTtvQkFqQkFBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLFVBQUNBLE9BQU9BO3dCQUM5QkEsSUFBSUEsUUFBUUEsR0FBR0EsS0FBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7d0JBRWpEQSxFQUFFQSxDQUFDQSxDQUFDQSxjQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDckJBLE1BQU1BLENBQUNBLEVBQUVBLGdCQUFnQkEsRUFBRUEsZUFBZUEsRUFBRUEsQ0FBQ0E7d0JBQzlDQSxDQUFDQTt3QkFDREEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ25CQSxJQUFJQSxnQkFBZ0JBLEdBQUdBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBOzRCQUN6Q0EsSUFBSUEsdUJBQXVCQSxHQUFHQSwrQkFBdUJBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0E7NEJBRXhFQSxNQUFNQSxDQUFDQSxFQUFFQSxrQkFBQUEsZ0JBQWdCQSxFQUFFQSx5QkFBQUEsdUJBQXVCQSxFQUFFQSxDQUFDQTt3QkFDdERBLENBQUNBO3dCQUNEQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDTEEsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxPQUFPQSxFQUFFQSxjQUFjQSxFQUFFQSxLQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxLQUFJQSxDQUFDQSxDQUFDQSxjQUFjQSxDQUFDQTt3QkFFMUZBLENBQUNBO29CQUNGQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDSkEsQ0FBQ0E7Z0JBQ0ZmLG1CQUFDQTtZQUFEQSxDQUFDQSxBQTlIRCxJQThIQztZQTlIRCx1Q0E4SEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHtpc0h0bWwsIGlzVHlwZXNjcmlwdERlY2xhcmF0aW9uLCBpc0phdmFTY3JpcHR9IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgbG9nZ2VyID0gbmV3IExvZ2dlcih7IGRlYnVnOiBmYWxzZSB9KTtcbmV4cG9ydCBsZXQgX19IVE1MX01PRFVMRV9fID0gXCJfX2h0bWxfbW9kdWxlX19cIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb21iaW5lZE9wdGlvbnMgZXh0ZW5kcyBQbHVnaW5PcHRpb25zLCB0cy5Db21waWxlck9wdGlvbnMgeyB9O1xuXG5leHBvcnQgY2xhc3MgQ29tcGlsZXJIb3N0IGltcGxlbWVudHMgdHMuQ29tcGlsZXJIb3N0IHtcblx0cHJpdmF0ZSBfb3B0aW9uczogYW55O1xuXHRwcml2YXRlIF9maWxlczogeyBbczogc3RyaW5nXTogYW55OyB9OyAvL01hcDxzdHJpbmcsIHRzLlNvdXJjZUZpbGU+O1xuXHRwcml2YXRlIF9maWxlUmVzTWFwczogeyBbczogc3RyaW5nXTogYW55OyB9OyAvL01hcDxzdHJpbmcsIGFueT47XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogYW55KSB7XG5cdFx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFx0dGhpcy5fb3B0aW9ucy5tb2R1bGUgPSB0aGlzLmdldEVudW0odGhpcy5fb3B0aW9ucy5tb2R1bGUsICg8YW55PnRzKS5Nb2R1bGVLaW5kLCB0cy5Nb2R1bGVLaW5kLlN5c3RlbSk7XG5cdFx0dGhpcy5fb3B0aW9ucy50YXJnZXQgPSB0aGlzLmdldEVudW0odGhpcy5fb3B0aW9ucy50YXJnZXQsICg8YW55PnRzKS5TY3JpcHRUYXJnZXQsIHRzLlNjcmlwdFRhcmdldC5FUzUpO1xuXHRcdHRoaXMuX29wdGlvbnMuanN4ID0gdGhpcy5nZXRFbnVtKHRoaXMuX29wdGlvbnMuanN4LCAoPGFueT50cykuSnN4RW1pdCwgdHMuSnN4RW1pdC5Ob25lKTtcblx0XHR0aGlzLl9vcHRpb25zLmFsbG93Tm9uVHNFeHRlbnNpb25zID0gKHRoaXMuX29wdGlvbnMuYWxsb3dOb25Uc0V4dGVuc2lvbnMgIT09IGZhbHNlKTtcblx0XHR0aGlzLl9vcHRpb25zLnNraXBEZWZhdWx0TGliQ2hlY2sgPSAodGhpcy5fb3B0aW9ucy5za2lwRGVmYXVsdExpYkNoZWNrICE9PSBmYWxzZSk7XG5cdFx0dGhpcy5fb3B0aW9ucy5ub1Jlc29sdmUgPSB0cnVlO1xuXG5cdFx0Ly8gRm9yY2UgbW9kdWxlIHJlc29sdXRpb24gaW50byAnY2xhc3NpYycgbW9kZSwgdG8gcHJldmVudCBub2RlIG1vZHVsZSByZXNvbHV0aW9uIGZyb20ga2lja2luZyBpblxuXHRcdHRoaXMuX29wdGlvbnMubW9kdWxlUmVzb2x1dGlvbiA9IHRzLk1vZHVsZVJlc29sdXRpb25LaW5kLkNsYXNzaWM7XG5cblx0XHR0aGlzLl9maWxlcyA9IHt9OyAvL25ldyBNYXA8c3RyaW5nLCB0cy5Tb3VyY2VGaWxlPigpO1xuXHRcdHRoaXMuX2ZpbGVSZXNNYXBzID0ge307IC8vbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcblxuXHRcdC8vIHN1cHBvcnQgZm9yIGltcG9ydGluZyBodG1sIHRlbXBsYXRlcyB1bnRpbFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjcwOSNpc3N1ZWNvbW1lbnQtOTE5Njg5NTAgZ2V0cyBpbXBsZW1lbnRlZFxuXHRcdC8vIG5vdGUgLSB0aGlzIG9ubHkgYWZmZWN0cyB0eXBlLWNoZWNraW5nLCBub3QgcnVudGltZSFcblx0XHR0aGlzLmFkZEZpbGUoX19IVE1MX01PRFVMRV9fLCBcInZhciBfX2h0bWxfXzogc3RyaW5nID0gJyc7IGV4cG9ydCBkZWZhdWx0IF9faHRtbF9fO1wiKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RW51bTxUPihlbnVtVmFsdWU6IGFueSwgZW51bVR5cGU6IGFueSwgZGVmYXVsdFZhbHVlOiBUKTogVCB7XG5cdFx0aWYgKGVudW1WYWx1ZSA9PSB1bmRlZmluZWQpIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cblx0XHRmb3IgKHZhciBlbnVtUHJvcCBpbiBlbnVtVHlwZSkge1xuXHRcdFx0aWYgKGVudW1Qcm9wLnRvTG93ZXJDYXNlKCkgPT09IGVudW1WYWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBlbnVtVHlwZVtlbnVtUHJvcF0gPT09IFwic3RyaW5nXCIpXG5cdFx0XHRcdFx0cmV0dXJuIGVudW1UeXBlW2VudW1UeXBlW2VudW1Qcm9wXV07XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gZW51bVR5cGVbZW51bVByb3BdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pc2VkIHZhbHVlIFske2VudW1WYWx1ZX1dYCk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IG9wdGlvbnMoKTogQ29tYmluZWRPcHRpb25zIHtcblx0XHRyZXR1cm4gdGhpcy5fb3B0aW9ucztcblx0fVxuXG5cdHB1YmxpYyBnZXRTb3VyY2VGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiB0cy5Tb3VyY2VGaWxlIHtcblx0XHRmaWxlTmFtZSA9IHRoaXMuZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWUpO1xuXHRcdHJldHVybiB0aGlzLl9maWxlc1tmaWxlTmFtZV07XG5cdH1cblxuXHRwdWJsaWMgZmlsZUV4aXN0cyhmaWxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuICEhdGhpcy5nZXRTb3VyY2VGaWxlKGZpbGVOYW1lKTtcblx0fVxuXG5cdHB1YmxpYyByZWFkRmlsZShmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7XG5cdH1cblxuXHRwdWJsaWMgd3JpdGVGaWxlKG5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nLCB3cml0ZUJ5dGVPcmRlck1hcms6IGJvb2xlYW4pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7XG5cdH1cblxuXHRwdWJsaWMgZ2V0RGVmYXVsdExpYkZpbGVOYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwidHlwZXNjcmlwdC9saWIvbGliLmVzNi5kLnRzXCI7XG5cdH1cblxuXHRwdWJsaWMgdXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwdWJsaWMgZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0cmV0dXJuICh0cyBhcyBhbnkpLm5vcm1hbGl6ZVBhdGgoZmlsZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGdldEN1cnJlbnREaXJlY3RvcnkoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBnZXROZXdMaW5lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiXFxuXCI7XG5cdH1cblxuXHRwdWJsaWMgYWRkRmlsZShmaWxlTmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIGlzRGVmYXVsdExpYjogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdFx0ZmlsZU5hbWUgPSB0aGlzLmdldENhbm9uaWNhbEZpbGVOYW1lKGZpbGVOYW1lKTtcblx0XHR0aGlzLl9maWxlc1tmaWxlTmFtZV0gPSB0cy5jcmVhdGVTb3VyY2VGaWxlKGZpbGVOYW1lLCB0ZXh0LCB0aGlzLl9vcHRpb25zLnRhcmdldCk7XG5cdFx0dGhpcy5fZmlsZXNbZmlsZU5hbWVdLmlzRGVmYXVsdExpYiA9IGlzRGVmYXVsdExpYjtcblxuXHRcdGxvZ2dlci5kZWJ1ZyhgYWRkZWQgJHtmaWxlTmFtZX1gKTtcblx0XHRyZXR1cm4gdGhpcy5fZmlsZXNbZmlsZU5hbWVdO1xuXHR9XG5cblx0Lypcblx0XHRDYWxsZWQgYnkgdGhlIHR5cGUtY2hlY2tlciwgdGhpcyBtZXRob2QgYWRkcyBhIG1hcCBvZiBpbXBvcnRzL3JlZmVyZW5jZXMgdXNlZFxuXHRcdGJ5IHRoaXMgZmlsZSB0byB0aGVpciByZXNvbHZlZCBsb2NhdGlvbnMuXG5cdFx0VGhlc2Ugd2lsbCBpbmNsdWRlIGFueSByZWRpcmVjdGlvbnMgdG8gYSB0eXBpbmdzIGZpbGUgaWYgb25lIGlzIHByZXNlbnQuXG5cdFx0VGhpcyBtYXAgaXMgdGhlbiB1c2VkIGluIHJlc29sdmVNb2R1bGVOYW1lcyBiZWxvdy5cblx0Ki9cblx0cHVibGljIGFkZFJlc29sdXRpb25NYXAoZmlsZU5hbWU6IHN0cmluZywgbWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+KSB7XG5cdFx0ZmlsZU5hbWUgPSB0aGlzLmdldENhbm9uaWNhbEZpbGVOYW1lKGZpbGVOYW1lKTtcblx0XHR0aGlzLl9maWxlUmVzTWFwc1tmaWxlTmFtZV0gPSBtYXA7XG5cdH1cblxuXHQvKlxuXHRcdE92ZXJyaWRlcyB0aGUgc3RhbmRhcmQgcmVzb2x1dGlvbiBhbGdvcml0aG0gdXNlZCBieSB0aGUgY29tcGlsZXIgc28gdGhhdCB3ZSBjYW4gdXNlIHN5c3RlbWpzXG5cdFx0cmVzb2x1dGlvbi4gQmVjYXVzZSBUeXBlU2NyaXB0IHJlcXVpcmVzIHN5bmNocm9ub3VzIHJlc29sdXRpb24sIGV2ZXJ5dGhpbmcgaXMgcHJlLXJlc29sdmVkXG5cdFx0YnkgdGhlIHR5cGUtY2hlY2tlciBhbmQgcmVnaXN0ZXJlZCB3aXRoIHRoZSBob3N0IGJlZm9yZSB0eXBlLWNoZWNraW5nLlxuXHQqL1xuXHRwdWJsaWMgcmVzb2x2ZU1vZHVsZU5hbWVzKG1vZHVsZU5hbWVzOiBzdHJpbmdbXSwgY29udGFpbmluZ0ZpbGU6IHN0cmluZyk6IHRzLlJlc29sdmVkTW9kdWxlW10ge1xuXHRcdHJldHVybiBtb2R1bGVOYW1lcy5tYXAoKG1vZE5hbWUpID0+IHtcblx0XHRcdGxldCBtYXBwaW5ncyA9IHRoaXMuX2ZpbGVSZXNNYXBzW2NvbnRhaW5pbmdGaWxlXTtcblxuXHRcdFx0aWYgKGlzSHRtbChtb2ROYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4geyByZXNvbHZlZEZpbGVOYW1lOiBfX0hUTUxfTU9EVUxFX18gfTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG1hcHBpbmdzKSB7XG5cdFx0XHRcdGxldCByZXNvbHZlZEZpbGVOYW1lID0gbWFwcGluZ3NbbW9kTmFtZV07XG5cdFx0XHRcdGxldCBpc0V4dGVybmFsTGlicmFyeUltcG9ydCA9IGlzVHlwZXNjcmlwdERlY2xhcmF0aW9uKHJlc29sdmVkRmlsZU5hbWUpO1xuXG5cdFx0XHRcdHJldHVybiB7IHJlc29sdmVkRmlsZU5hbWUsIGlzRXh0ZXJuYWxMaWJyYXJ5SW1wb3J0IH07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRzLnJlc29sdmVNb2R1bGVOYW1lKG1vZE5hbWUsIGNvbnRhaW5pbmdGaWxlLCB0aGlzLl9vcHRpb25zLCB0aGlzKS5yZXNvbHZlZE1vZHVsZTtcblx0XHRcdFx0Ly8gXHR0aHJvdyBuZXcgRXJyb3IoYGNvbnRhaW5pbmcgZmlsZSAke2NvbnRhaW5pbmdGaWxlfSBoYXMgbm90IGJlZW4gbG9hZGVkYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==