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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXItaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21waWxlci1ob3N0LnRzIl0sIm5hbWVzIjpbIkNvbXBpbGVySG9zdCIsIkNvbXBpbGVySG9zdC5jb25zdHJ1Y3RvciIsIkNvbXBpbGVySG9zdC5nZXRFbnVtIiwiQ29tcGlsZXJIb3N0Lm9wdGlvbnMiLCJDb21waWxlckhvc3QuZ2V0RGVmYXVsdExpYkZpbGVOYW1lIiwiQ29tcGlsZXJIb3N0LnVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXMiLCJDb21waWxlckhvc3QuZ2V0Q2Fub25pY2FsRmlsZU5hbWUiLCJDb21waWxlckhvc3QuZ2V0Q3VycmVudERpcmVjdG9yeSIsIkNvbXBpbGVySG9zdC5nZXROZXdMaW5lIiwiQ29tcGlsZXJIb3N0LnJlYWRGaWxlIiwiQ29tcGlsZXJIb3N0LndyaXRlRmlsZSIsIkNvbXBpbGVySG9zdC5nZXRTb3VyY2VGaWxlIiwiQ29tcGlsZXJIb3N0LmdldEFsbEZpbGVzIiwiQ29tcGlsZXJIb3N0LmZpbGVFeGlzdHMiLCJDb21waWxlckhvc3QuYWRkRmlsZSIsIkNvbXBpbGVySG9zdC5yZXNvbHZlTW9kdWxlTmFtZXMiXSwibWFwcGluZ3MiOiI7O1FBS00sTUFBTSxFQUNDLGVBQWU7Ozs7Ozs7Ozs7Ozs7WUFEdEIsTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLDZCQUFBLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQSxDQUFDO1lBRTZCLENBQUM7WUFrQi9FO2dCQUlDQSxzQkFBWUEsT0FBWUE7b0JBQ3ZCQyxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxJQUFJQSxFQUFFQSxDQUFDQTtvQkFDOUJBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVB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REEsQ0FBQ0EsQUFoSUQsSUFnSUM7WUFoSUQsdUNBZ0lDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7aXNIdG1sLCBpc1R5cGVzY3JpcHREZWNsYXJhdGlvbiwgaXNKYXZhU2NyaXB0fSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7IGRlYnVnOiBmYWxzZSB9KTtcbmV4cG9ydCBjb25zdCBfX0hUTUxfTU9EVUxFX18gPSBcIl9faHRtbF9tb2R1bGVfX1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbWJpbmVkT3B0aW9ucyBleHRlbmRzIFBsdWdpbk9wdGlvbnMsIHRzLkNvbXBpbGVyT3B0aW9ucyB7IH07XG5cbmV4cG9ydCB0eXBlIFRyYW5zcGlsZVJlc3VsdCA9IHtcblx0ZmFpbHVyZTogYm9vbGVhbjtcblx0ZXJyb3JzOiBBcnJheTx0cy5EaWFnbm9zdGljPjtcblx0anM6IHN0cmluZztcblx0c291cmNlTWFwOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlRmlsZSBleHRlbmRzIHRzLlNvdXJjZUZpbGUge1xuICAgb3V0cHV0PzogVHJhbnNwaWxlUmVzdWx0O1xuICAgcGVuZGluZ0RlcGVuZGVuY2llcz86IFByb21pc2U8RGVwZW5kZW5jeUluZm8+O1xuICAgZGVwZW5kZW5jaWVzPzogRGVwZW5kZW5jeUluZm87XG4gICBlcnJvcnM/OiB0cy5EaWFnbm9zdGljW107XG4gICBjaGVja2VkPzogYm9vbGVhbjtcbiAgIGlzTGliRmlsZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBDb21waWxlckhvc3QgaW1wbGVtZW50cyB0cy5Db21waWxlckhvc3Qge1xuXHRwcml2YXRlIF9vcHRpb25zOiBhbnk7XG5cdHByaXZhdGUgX2ZpbGVzOiB7IFtzOiBzdHJpbmddOiBTb3VyY2VGaWxlOyB9O1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IGFueSkge1xuXHRcdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdHRoaXMuX29wdGlvbnMubW9kdWxlID0gdGhpcy5nZXRFbnVtKHRoaXMuX29wdGlvbnMubW9kdWxlLCAoPGFueT50cykuTW9kdWxlS2luZCwgdHMuTW9kdWxlS2luZC5TeXN0ZW0pO1xuXHRcdHRoaXMuX29wdGlvbnMudGFyZ2V0ID0gdGhpcy5nZXRFbnVtKHRoaXMuX29wdGlvbnMudGFyZ2V0LCAoPGFueT50cykuU2NyaXB0VGFyZ2V0LCB0cy5TY3JpcHRUYXJnZXQuRVM1KTtcblx0XHR0aGlzLl9vcHRpb25zLmpzeCA9IHRoaXMuZ2V0RW51bSh0aGlzLl9vcHRpb25zLmpzeCwgKDxhbnk+dHMpLkpzeEVtaXQsIHRzLkpzeEVtaXQuTm9uZSk7XG5cdFx0dGhpcy5fb3B0aW9ucy5hbGxvd05vblRzRXh0ZW5zaW9ucyA9ICh0aGlzLl9vcHRpb25zLmFsbG93Tm9uVHNFeHRlbnNpb25zICE9PSBmYWxzZSk7XG5cdFx0dGhpcy5fb3B0aW9ucy5za2lwRGVmYXVsdExpYkNoZWNrID0gKHRoaXMuX29wdGlvbnMuc2tpcERlZmF1bHRMaWJDaGVjayAhPT0gZmFsc2UpO1xuXHRcdHRoaXMuX29wdGlvbnMubm9SZXNvbHZlID0gdHJ1ZTtcblxuXHRcdC8vIEZvcmNlIG1vZHVsZSByZXNvbHV0aW9uIGludG8gJ2NsYXNzaWMnIG1vZGUsIHRvIHByZXZlbnQgbm9kZSBtb2R1bGUgcmVzb2x1dGlvbiBmcm9tIGtpY2tpbmcgaW5cblx0XHR0aGlzLl9vcHRpb25zLm1vZHVsZVJlc29sdXRpb24gPSB0cy5Nb2R1bGVSZXNvbHV0aW9uS2luZC5DbGFzc2ljO1xuXG5cdFx0dGhpcy5fZmlsZXMgPSB7fTtcblxuXHRcdC8vIHN1cHBvcnQgZm9yIGltcG9ydGluZyBodG1sIHRlbXBsYXRlcyB1bnRpbFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjcwOSNpc3N1ZWNvbW1lbnQtOTE5Njg5NTAgZ2V0cyBpbXBsZW1lbnRlZFxuXHRcdC8vIG5vdGUgLSB0aGlzIG9ubHkgYWZmZWN0cyB0eXBlLWNoZWNraW5nLCBub3QgcnVudGltZSFcblx0XHRjb25zdCBmaWxlID0gdGhpcy5hZGRGaWxlKF9fSFRNTF9NT0RVTEVfXywgXCJ2YXIgX19odG1sX186IHN0cmluZyA9ICcnOyBleHBvcnQgZGVmYXVsdCBfX2h0bWxfXztcIik7XG4gICAgICBmaWxlLmRlcGVuZGVuY2llcyA9IHsgbGlzdDogW10sIG1hcHBpbmdzOiB7fSB9O1xuICAgICAgZmlsZS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIGZpbGUuZXJyb3JzID0gW107XG5cdH1cblxuXHRwcml2YXRlIGdldEVudW08VD4oZW51bVZhbHVlOiBhbnksIGVudW1UeXBlOiBhbnksIGRlZmF1bHRWYWx1ZTogVCk6IFQge1xuXHRcdGlmIChlbnVtVmFsdWUgPT0gdW5kZWZpbmVkKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG5cdFx0Zm9yICh2YXIgZW51bVByb3AgaW4gZW51bVR5cGUpIHtcblx0XHRcdGlmIChlbnVtUHJvcC50b0xvd2VyQ2FzZSgpID09PSBlbnVtVmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgZW51bVR5cGVbZW51bVByb3BdID09PSBcInN0cmluZ1wiKVxuXHRcdFx0XHRcdHJldHVybiBlbnVtVHlwZVtlbnVtVHlwZVtlbnVtUHJvcF1dO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIGVudW1UeXBlW2VudW1Qcm9wXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXNlZCB2YWx1ZSBbJHtlbnVtVmFsdWV9XWApO1xuXHR9XG5cblx0cHVibGljIGdldCBvcHRpb25zKCk6IENvbWJpbmVkT3B0aW9ucyB7XG5cdFx0cmV0dXJuIHRoaXMuX29wdGlvbnM7XG5cdH1cbiAgIFxuXHRwdWJsaWMgZ2V0RGVmYXVsdExpYkZpbGVOYW1lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwidHlwZXNjcmlwdC9saWIvbGliLmVzNi5kLnRzXCI7XG5cdH1cblxuXHRwdWJsaWMgdXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwdWJsaWMgZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0cmV0dXJuICh0cyBhcyBhbnkpLm5vcm1hbGl6ZVBhdGgoZmlsZU5hbWUpO1xuXHR9XG5cblx0cHVibGljIGdldEN1cnJlbnREaXJlY3RvcnkoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHB1YmxpYyBnZXROZXdMaW5lKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIFwiXFxuXCI7XG5cdH1cblxuXHRwdWJsaWMgcmVhZEZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xuXHR9XG5cblx0cHVibGljIHdyaXRlRmlsZShuYW1lOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgd3JpdGVCeXRlT3JkZXJNYXJrOiBib29sZWFuKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTm90IGltcGxlbWVudGVkXCIpO1xuXHR9XG5cblx0cHVibGljIGdldFNvdXJjZUZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IFNvdXJjZUZpbGUge1xuXHRcdGZpbGVOYW1lID0gdGhpcy5nZXRDYW5vbmljYWxGaWxlTmFtZShmaWxlTmFtZSk7XG5cdFx0cmV0dXJuIHRoaXMuX2ZpbGVzW2ZpbGVOYW1lXTtcblx0fVxuXG5cdHB1YmxpYyBnZXRBbGxGaWxlcygpOiBTb3VyY2VGaWxlW10ge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2ZpbGVzKS5tYXAoa2V5ID0+IHRoaXMuX2ZpbGVzW2tleV0pO1xuXHR9XG5cblx0cHVibGljIGZpbGVFeGlzdHMoZmlsZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAhIXRoaXMuZ2V0U291cmNlRmlsZShmaWxlTmFtZSk7XG5cdH1cblxuXHRwdWJsaWMgYWRkRmlsZShmaWxlTmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpOiBTb3VyY2VGaWxlIHtcblx0XHRmaWxlTmFtZSA9IHRoaXMuZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWUpOyAgICAgIFxuICAgICAgY29uc3QgZmlsZSA9IHRoaXMuX2ZpbGVzW2ZpbGVOYW1lXTtcbiAgICAgIFxuICAgICAgaWYgKCFmaWxlKSB7XG5cdFx0ICAgdGhpcy5fZmlsZXNbZmlsZU5hbWVdID0gdHMuY3JlYXRlU291cmNlRmlsZShmaWxlTmFtZSwgdGV4dCwgdGhpcy5fb3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgbG9nZ2VyLmRlYnVnKGBhZGRlZCAke2ZpbGVOYW1lfWApOyAgICAgICAgIFxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZmlsZS50ZXh0ICE9IHRleHQpIHtcbiAgICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgICAgIHRoaXMuX2ZpbGVzW2ZpbGVOYW1lXSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoZmlsZU5hbWUsIHRleHQsIHRoaXMuX29wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgdXBkYXRlZCAke2ZpbGVOYW1lfWApOyAgICAgICAgIFxuICAgICAgfVxuXHRcdFxuXHRcdHJldHVybiB0aGlzLl9maWxlc1tmaWxlTmFtZV07XG5cdH1cblxuXHQvKlxuXHRcdE92ZXJyaWRlcyB0aGUgc3RhbmRhcmQgcmVzb2x1dGlvbiBhbGdvcml0aG0gdXNlZCBieSB0aGUgY29tcGlsZXIgc28gdGhhdCB3ZSBjYW4gdXNlIHN5c3RlbWpzXG5cdFx0cmVzb2x1dGlvbi4gQmVjYXVzZSBUeXBlU2NyaXB0IHJlcXVpcmVzIHN5bmNocm9ub3VzIHJlc29sdXRpb24sIGV2ZXJ5dGhpbmcgaXMgcHJlLXJlc29sdmVkXG5cdFx0YnkgdGhlIHR5cGUtY2hlY2tlciBhbmQgcmVnaXN0ZXJlZCB3aXRoIHRoZSBob3N0IGJlZm9yZSB0eXBlLWNoZWNraW5nLlxuXHQqL1xuXHRwdWJsaWMgcmVzb2x2ZU1vZHVsZU5hbWVzKG1vZHVsZU5hbWVzOiBzdHJpbmdbXSwgY29udGFpbmluZ0ZpbGU6IHN0cmluZyk6IHRzLlJlc29sdmVkTW9kdWxlW10ge1xuXHRcdHJldHVybiBtb2R1bGVOYW1lcy5tYXAoKG1vZE5hbWUpID0+IHtcblx0XHRcdGNvbnN0IGRlcGVuZGVuY2llcyA9IHRoaXMuX2ZpbGVzW2NvbnRhaW5pbmdGaWxlXS5kZXBlbmRlbmNpZXM7XG5cblx0XHRcdGlmIChpc0h0bWwobW9kTmFtZSkpIHtcblx0XHRcdFx0cmV0dXJuIHsgcmVzb2x2ZWRGaWxlTmFtZTogX19IVE1MX01PRFVMRV9fIH07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChkZXBlbmRlbmNpZXMpIHtcblx0XHRcdFx0Y29uc3QgcmVzb2x2ZWRGaWxlTmFtZSA9IGRlcGVuZGVuY2llcy5tYXBwaW5nc1ttb2ROYW1lXTtcblx0XHRcdFx0Y29uc3QgaXNFeHRlcm5hbExpYnJhcnlJbXBvcnQgPSBpc1R5cGVzY3JpcHREZWNsYXJhdGlvbihyZXNvbHZlZEZpbGVOYW1lKTtcblxuXHRcdFx0XHRyZXR1cm4geyByZXNvbHZlZEZpbGVOYW1lLCBpc0V4dGVybmFsTGlicmFyeUltcG9ydCB9O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0cy5yZXNvbHZlTW9kdWxlTmFtZShtb2ROYW1lLCBjb250YWluaW5nRmlsZSwgdGhpcy5fb3B0aW9ucywgdGhpcykucmVzb2x2ZWRNb2R1bGU7XG5cdFx0XHRcdC8vIFx0dGhyb3cgbmV3IEVycm9yKGBjb250YWluaW5nIGZpbGUgJHtjb250YWluaW5nRmlsZX0gaGFzIG5vdCBiZWVuIGxvYWRlZGApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG4iXX0=