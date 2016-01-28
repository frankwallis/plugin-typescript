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
                        this.invalidate(fileName);
                        logger.debug("updated " + fileName);
                    }
                    return this._files[fileName];
                };
                CompilerHost.prototype.invalidate = function (fileName, seen) {
                    var _this = this;
                    seen = seen || [];
                    if (seen.indexOf(fileName) < 0) {
                        seen.push(fileName);
                        var file = this._files[fileName];
                        if (file) {
                            file.checked = false;
                            file.errors = [];
                        }
                        Object.keys(this._files)
                            .map(function (key) { return _this._files[key]; })
                            .forEach(function (file) {
                            if (file.dependencies && file.dependencies.list.indexOf(fileName) >= 0) {
                                _this.invalidate(file.fileName, seen);
                            }
                        });
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXItaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21waWxlci1ob3N0LnRzIl0sIm5hbWVzIjpbIkNvbXBpbGVySG9zdCIsIkNvbXBpbGVySG9zdC5jb25zdHJ1Y3RvciIsIkNvbXBpbGVySG9zdC5nZXRFbnVtIiwiQ29tcGlsZXJIb3N0Lm9wdGlvbnMiLCJDb21waWxlckhvc3QuZ2V0RGVmYXVsdExpYkZpbGVOYW1lIiwiQ29tcGlsZXJIb3N0LnVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXMiLCJDb21waWxlckhvc3QuZ2V0Q2Fub25pY2FsRmlsZU5hbWUiLCJDb21waWxlckhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSIsIkNvbXBpbGVySG9zdC5nZXROZXdMaW5lIiwiQ29tcGlsZXJIb3N0LnJlYWRGaWxlIiwiQ29tcGlsZXJIb3N0LndyaXRlRmlsZSIsIkNvbXBpbGVySG9zdC5nZXRTb3VyY2VGaWxlIiwiQ29tcGlsZXJIb3N0LmdldEFsbEZpbGVzIiwiQ29tcGlsZXJIb3N0LmZpbGVFeGlzdHMiLCJDb21waWxlckhvc3QuYWRkRmlsZSIsIkNvbXBpbGVySG9zdC5pbnZhbGlkYXRlIiwiQ29tcGlsZXJIb3N0LnJlc29sdmVNb2R1bGVOYW1lcyJdLCJtYXBwaW5ncyI6Ijs7UUFLTSxNQUFNLEVBQ0MsZUFBZTs7Ozs7Ozs7Ozs7OztZQUR0QixNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDL0IsNkJBQUEsZUFBZSxHQUFHLGlCQUFpQixDQUFBLENBQUM7WUFFNkIsQ0FBQztZQWtCL0U7Z0JBSUNBLHNCQUFZQSxPQUFZQTtvQkFDdkJDLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE9BQU9BLElBQUlBLEVBQUVBLENBQUNBO29CQUM5QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEs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QUFRQSxFQUFFQSxLQUFJQSxDQUFDQSxDQUFDQSxjQUFjQSxDQUFDQTt3QkFFMUZBLENBQUNBO29CQUNGQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDSkEsQ0FBQ0E7Z0JBQ0ZoQixtQkFBQ0E7WUFBREEsQ0FBQ0EsQUF4SkQsSUF3SkM7WUF4SkQsdUNBd0pDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqL1xyXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcclxuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XHJcbmltcG9ydCB7aXNIdG1sLCBpc1R5cGVzY3JpcHREZWNsYXJhdGlvbiwgaXNKYXZhU2NyaXB0fSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoeyBkZWJ1ZzogZmFsc2UgfSk7XHJcbmV4cG9ydCBjb25zdCBfX0hUTUxfTU9EVUxFX18gPSBcIl9faHRtbF9tb2R1bGVfX1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb21iaW5lZE9wdGlvbnMgZXh0ZW5kcyBQbHVnaW5PcHRpb25zLCB0cy5Db21waWxlck9wdGlvbnMgeyB9O1xyXG5cclxuZXhwb3J0IHR5cGUgVHJhbnNwaWxlUmVzdWx0ID0ge1xyXG5cdGZhaWx1cmU6IGJvb2xlYW47XHJcblx0ZXJyb3JzOiBBcnJheTx0cy5EaWFnbm9zdGljPjtcclxuXHRqczogc3RyaW5nO1xyXG5cdHNvdXJjZU1hcDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZUZpbGUgZXh0ZW5kcyB0cy5Tb3VyY2VGaWxlIHtcclxuICAgb3V0cHV0PzogVHJhbnNwaWxlUmVzdWx0O1xyXG4gICBwZW5kaW5nRGVwZW5kZW5jaWVzPzogUHJvbWlzZTxEZXBlbmRlbmN5SW5mbz47XHJcbiAgIGRlcGVuZGVuY2llcz86IERlcGVuZGVuY3lJbmZvO1xyXG4gICBlcnJvcnM/OiB0cy5EaWFnbm9zdGljW107XHJcbiAgIGNoZWNrZWQ/OiBib29sZWFuO1xyXG4gICBpc0xpYkZpbGU/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcGlsZXJIb3N0IGltcGxlbWVudHMgdHMuQ29tcGlsZXJIb3N0IHtcclxuXHRwcml2YXRlIF9vcHRpb25zOiBhbnk7XHJcblx0cHJpdmF0ZSBfZmlsZXM6IHsgW3M6IHN0cmluZ106IFNvdXJjZUZpbGU7IH07XHJcblxyXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IGFueSkge1xyXG5cdFx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0XHR0aGlzLl9vcHRpb25zLm1vZHVsZSA9IHRoaXMuZ2V0RW51bSh0aGlzLl9vcHRpb25zLm1vZHVsZSwgKDxhbnk+dHMpLk1vZHVsZUtpbmQsIHRzLk1vZHVsZUtpbmQuU3lzdGVtKTtcclxuXHRcdHRoaXMuX29wdGlvbnMudGFyZ2V0ID0gdGhpcy5nZXRFbnVtKHRoaXMuX29wdGlvbnMudGFyZ2V0LCAoPGFueT50cykuU2NyaXB0VGFyZ2V0LCB0cy5TY3JpcHRUYXJnZXQuRVM1KTtcclxuXHRcdHRoaXMuX29wdGlvbnMuanN4ID0gdGhpcy5nZXRFbnVtKHRoaXMuX29wdGlvbnMuanN4LCAoPGFueT50cykuSnN4RW1pdCwgdHMuSnN4RW1pdC5Ob25lKTtcclxuXHRcdHRoaXMuX29wdGlvbnMuYWxsb3dOb25Uc0V4dGVuc2lvbnMgPSAodGhpcy5fb3B0aW9ucy5hbGxvd05vblRzRXh0ZW5zaW9ucyAhPT0gZmFsc2UpO1xyXG5cdFx0dGhpcy5fb3B0aW9ucy5za2lwRGVmYXVsdExpYkNoZWNrID0gKHRoaXMuX29wdGlvbnMuc2tpcERlZmF1bHRMaWJDaGVjayAhPT0gZmFsc2UpO1xyXG5cdFx0dGhpcy5fb3B0aW9ucy5ub1Jlc29sdmUgPSB0cnVlO1xyXG5cclxuXHRcdC8vIEZvcmNlIG1vZHVsZSByZXNvbHV0aW9uIGludG8gJ2NsYXNzaWMnIG1vZGUsIHRvIHByZXZlbnQgbm9kZSBtb2R1bGUgcmVzb2x1dGlvbiBmcm9tIGtpY2tpbmcgaW5cclxuXHRcdHRoaXMuX29wdGlvbnMubW9kdWxlUmVzb2x1dGlvbiA9IHRzLk1vZHVsZVJlc29sdXRpb25LaW5kLkNsYXNzaWM7XHJcblxyXG5cdFx0dGhpcy5fZmlsZXMgPSB7fTtcclxuXHJcblx0XHQvLyBzdXBwb3J0IGZvciBpbXBvcnRpbmcgaHRtbCB0ZW1wbGF0ZXMgdW50aWxcclxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjcwOSNpc3N1ZWNvbW1lbnQtOTE5Njg5NTAgZ2V0cyBpbXBsZW1lbnRlZFxyXG5cdFx0Ly8gbm90ZSAtIHRoaXMgb25seSBhZmZlY3RzIHR5cGUtY2hlY2tpbmcsIG5vdCBydW50aW1lIVxyXG5cdFx0Y29uc3QgZmlsZSA9IHRoaXMuYWRkRmlsZShfX0hUTUxfTU9EVUxFX18sIFwidmFyIF9faHRtbF9fOiBzdHJpbmcgPSAnJzsgZXhwb3J0IGRlZmF1bHQgX19odG1sX187XCIpO1xyXG4gICAgICBmaWxlLmRlcGVuZGVuY2llcyA9IHsgbGlzdDogW10sIG1hcHBpbmdzOiB7fSB9O1xyXG4gICAgICBmaWxlLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICBmaWxlLmVycm9ycyA9IFtdO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRFbnVtPFQ+KGVudW1WYWx1ZTogYW55LCBlbnVtVHlwZTogYW55LCBkZWZhdWx0VmFsdWU6IFQpOiBUIHtcclxuXHRcdGlmIChlbnVtVmFsdWUgPT0gdW5kZWZpbmVkKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xyXG5cclxuXHRcdGZvciAodmFyIGVudW1Qcm9wIGluIGVudW1UeXBlKSB7XHJcblx0XHRcdGlmIChlbnVtUHJvcC50b0xvd2VyQ2FzZSgpID09PSBlbnVtVmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBlbnVtVHlwZVtlbnVtUHJvcF0gPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdFx0XHRyZXR1cm4gZW51bVR5cGVbZW51bVR5cGVbZW51bVByb3BdXTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gZW51bVR5cGVbZW51bVByb3BdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbmlzZWQgdmFsdWUgWyR7ZW51bVZhbHVlfV1gKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgb3B0aW9ucygpOiBDb21iaW5lZE9wdGlvbnMge1xyXG5cdFx0cmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcblx0fVxyXG4gICBcclxuXHRwdWJsaWMgZ2V0RGVmYXVsdExpYkZpbGVOYW1lKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gXCJ0eXBlc2NyaXB0L2xpYi9saWIuZXM2LmQudHNcIjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldENhbm9uaWNhbEZpbGVOYW1lKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuICh0cyBhcyBhbnkpLm5vcm1hbGl6ZVBhdGgoZmlsZU5hbWUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEN1cnJlbnREaXJlY3RvcnkoKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBcIlwiO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldE5ld0xpbmUoKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBcIlxcblwiO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHdyaXRlRmlsZShuYW1lOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgd3JpdGVCeXRlT3JkZXJNYXJrOiBib29sZWFuKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0U291cmNlRmlsZShmaWxlTmFtZTogc3RyaW5nKTogU291cmNlRmlsZSB7XHJcblx0XHRmaWxlTmFtZSA9IHRoaXMuZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWUpO1xyXG5cdFx0cmV0dXJuIHRoaXMuX2ZpbGVzW2ZpbGVOYW1lXTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRBbGxGaWxlcygpOiBTb3VyY2VGaWxlW10ge1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fZmlsZXMpLm1hcChrZXkgPT4gdGhpcy5fZmlsZXNba2V5XSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZmlsZUV4aXN0cyhmaWxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gISF0aGlzLmdldFNvdXJjZUZpbGUoZmlsZU5hbWUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZEZpbGUoZmlsZU5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogU291cmNlRmlsZSB7XHJcblx0XHRmaWxlTmFtZSA9IHRoaXMuZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWUpOyAgICAgIFxyXG4gICAgICBjb25zdCBmaWxlID0gdGhpcy5fZmlsZXNbZmlsZU5hbWVdO1xyXG4gICAgICBcclxuICAgICAgaWYgKCFmaWxlKSB7XHJcblx0XHQgICB0aGlzLl9maWxlc1tmaWxlTmFtZV0gPSB0cy5jcmVhdGVTb3VyY2VGaWxlKGZpbGVOYW1lLCB0ZXh0LCB0aGlzLl9vcHRpb25zLnRhcmdldCk7XHJcbiAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgYWRkZWQgJHtmaWxlTmFtZX1gKTsgICAgICAgICBcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChmaWxlLnRleHQgIT0gdGV4dCkge1xyXG4gICAgICAgICAvLyBjcmVhdGUgYSBuZXcgb25lXHJcbiAgICAgICAgIHRoaXMuX2ZpbGVzW2ZpbGVOYW1lXSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoZmlsZU5hbWUsIHRleHQsIHRoaXMuX29wdGlvbnMudGFyZ2V0KTtcclxuICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKGZpbGVOYW1lKTtcclxuICAgICAgICAgbG9nZ2VyLmRlYnVnKGB1cGRhdGVkICR7ZmlsZU5hbWV9YCk7ICAgICAgICAgXHJcbiAgICAgIH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXMuX2ZpbGVzW2ZpbGVOYW1lXTtcclxuXHR9XHJcblxyXG4gICBwcml2YXRlIGludmFsaWRhdGUoZmlsZU5hbWU6IHN0cmluZywgc2Vlbj86IHN0cmluZ1tdKSB7XHJcbiAgICAgIHNlZW4gPSBzZWVuIHx8IFtdO1xyXG4gICAgICBcclxuICAgICAgaWYgKHNlZW4uaW5kZXhPZihmaWxlTmFtZSkgPCAwKSB7XHJcbiAgICAgICAgIHNlZW4ucHVzaChmaWxlTmFtZSk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5fZmlsZXNbZmlsZU5hbWVdO1xyXG4gICAgICAgICBcclxuICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgZmlsZS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZpbGUuZXJyb3JzID0gW107XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2ZpbGVzKVxyXG4gICAgICAgICAgICAubWFwKGtleSA9PiB0aGlzLl9maWxlc1trZXldKVxyXG4gICAgICAgICAgICAuZm9yRWFjaChmaWxlID0+IHtcclxuICAgICAgICAgICAgICAgaWYgKGZpbGUuZGVwZW5kZW5jaWVzICYmIGZpbGUuZGVwZW5kZW5jaWVzLmxpc3QuaW5kZXhPZihmaWxlTmFtZSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoZmlsZS5maWxlTmFtZSwgc2Vlbik7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgfVxyXG4gICBcclxuXHQvKlxyXG5cdFx0T3ZlcnJpZGVzIHRoZSBzdGFuZGFyZCByZXNvbHV0aW9uIGFsZ29yaXRobSB1c2VkIGJ5IHRoZSBjb21waWxlciBzbyB0aGF0IHdlIGNhbiB1c2Ugc3lzdGVtanNcclxuXHRcdHJlc29sdXRpb24uIEJlY2F1c2UgVHlwZVNjcmlwdCByZXF1aXJlcyBzeW5jaHJvbm91cyByZXNvbHV0aW9uLCBldmVyeXRoaW5nIGlzIHByZS1yZXNvbHZlZFxyXG5cdFx0YnkgdGhlIHR5cGUtY2hlY2tlciBhbmQgcmVnaXN0ZXJlZCB3aXRoIHRoZSBob3N0IGJlZm9yZSB0eXBlLWNoZWNraW5nLlxyXG5cdCovXHJcblx0cHVibGljIHJlc29sdmVNb2R1bGVOYW1lcyhtb2R1bGVOYW1lczogc3RyaW5nW10sIGNvbnRhaW5pbmdGaWxlOiBzdHJpbmcpOiB0cy5SZXNvbHZlZE1vZHVsZVtdIHtcclxuXHRcdHJldHVybiBtb2R1bGVOYW1lcy5tYXAoKG1vZE5hbWUpID0+IHtcclxuXHRcdFx0Y29uc3QgZGVwZW5kZW5jaWVzID0gdGhpcy5fZmlsZXNbY29udGFpbmluZ0ZpbGVdLmRlcGVuZGVuY2llcztcclxuXHJcblx0XHRcdGlmIChpc0h0bWwobW9kTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4geyByZXNvbHZlZEZpbGVOYW1lOiBfX0hUTUxfTU9EVUxFX18gfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChkZXBlbmRlbmNpZXMpIHtcclxuXHRcdFx0XHRjb25zdCByZXNvbHZlZEZpbGVOYW1lID0gZGVwZW5kZW5jaWVzLm1hcHBpbmdzW21vZE5hbWVdO1xyXG5cdFx0XHRcdGNvbnN0IGlzRXh0ZXJuYWxMaWJyYXJ5SW1wb3J0ID0gaXNUeXBlc2NyaXB0RGVjbGFyYXRpb24ocmVzb2x2ZWRGaWxlTmFtZSk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB7IHJlc29sdmVkRmlsZU5hbWUsIGlzRXh0ZXJuYWxMaWJyYXJ5SW1wb3J0IH07XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHRzLnJlc29sdmVNb2R1bGVOYW1lKG1vZE5hbWUsIGNvbnRhaW5pbmdGaWxlLCB0aGlzLl9vcHRpb25zLCB0aGlzKS5yZXNvbHZlZE1vZHVsZTtcclxuXHRcdFx0XHQvLyBcdHRocm93IG5ldyBFcnJvcihgY29udGFpbmluZyBmaWxlICR7Y29udGFpbmluZ0ZpbGV9IGhhcyBub3QgYmVlbiBsb2FkZWRgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbiJdfQ==