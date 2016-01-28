System.register(['typescript', './logger', "./utils"], function(exports_1) {
    var ts, logger_1, utils_1;
    var logger, Resolver;
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
            Resolver = (function () {
                function Resolver(host, resolve, fetch) {
                    this._host = host;
                    this._resolve = resolve;
                    this._fetch = fetch;
                    this._declarationFiles = [];
                    this._typings = {};
                }
                Resolver.prototype.resolve = function (sourceName) {
                    var _this = this;
                    var file = this._host.getSourceFile(sourceName);
                    if (!file)
                        throw new Error("file [" + sourceName + "] has not been added");
                    if (!file.pendingDependencies) {
                        var info = ts.preProcessFile(file.text, true);
                        file.isLibFile = info.isLibFile;
                        file.pendingDependencies = this.resolveDependencies(sourceName, info)
                            .then(function (mappings) {
                            var deps = Object.keys(mappings)
                                .map(function (key) { return mappings[key]; })
                                .filter(function (res) { return utils_1.isTypescript(res); });
                            var refs = _this._declarationFiles.filter(function (decl) {
                                return (decl != sourceName) && (deps.indexOf(decl) < 0);
                            });
                            var list = deps.concat(refs);
                            file.dependencies = { mappings: mappings, list: list };
                            return file.dependencies;
                        });
                    }
                    return file.pendingDependencies;
                };
                Resolver.prototype.registerDeclarationFile = function (sourceName, isDefaultLib) {
                    this._declarationFiles.push(sourceName);
                };
                Resolver.prototype.resolveDependencies = function (sourceName, info) {
                    var _this = this;
                    var resolvedReferences = info.referencedFiles
                        .map(function (ref) { return _this.resolveReference(ref.fileName, sourceName); });
                    var resolvedImports = info.importedFiles
                        .map(function (imp) { return _this.resolveImport(imp.fileName, sourceName); });
                    var refs = [].concat(info.referencedFiles).concat(info.importedFiles).map(function (pre) { return pre.fileName; });
                    var deps = resolvedReferences.concat(resolvedImports);
                    return Promise.all(deps)
                        .then(function (resolved) {
                        return refs.reduce(function (result, ref, idx) {
                            result[ref] = resolved[idx];
                            return result;
                        }, {});
                    });
                };
                Resolver.prototype.resolveReference = function (referenceName, sourceName) {
                    if ((utils_1.isAmbient(referenceName) && !this._host.options.resolveAmbientRefs) || (referenceName.indexOf("/") === -1))
                        referenceName = "./" + referenceName;
                    return this._resolve(referenceName, sourceName);
                };
                Resolver.prototype.resolveImport = function (importName, sourceName) {
                    var _this = this;
                    if (utils_1.isRelative(importName) && utils_1.isTypescriptDeclaration(sourceName) && !utils_1.isTypescriptDeclaration(importName))
                        importName = importName + ".d.ts";
                    return this._resolve(importName, sourceName)
                        .then(function (resolvedImport) {
                        if (_this._host.options.resolveTypings && utils_1.isAmbientImport(importName) && utils_1.isJavaScript(resolvedImport) && !utils_1.isTypescriptDeclaration(sourceName)) {
                            if (!_this._typings[resolvedImport]) {
                                _this._typings[resolvedImport] = _this.resolveTyping(importName, sourceName)
                                    .then(function (resolvedTyping) {
                                    return resolvedTyping ? resolvedTyping : resolvedImport;
                                });
                            }
                            return _this._typings[resolvedImport];
                        }
                        else {
                            return resolvedImport;
                        }
                    });
                };
                Resolver.prototype.resolveTyping = function (importName, sourceName) {
                    var _this = this;
                    var packageName = importName.split(/\//)[0];
                    return this._resolve(packageName, sourceName)
                        .then(function (exported) {
                        return exported.slice(0, -3) + "/package.json";
                    })
                        .then(function (address) {
                        return _this._fetch(address)
                            .then(function (packageText) {
                            var typings = JSON.parse(packageText).typings;
                            return typings ? _this._resolve("./" + typings, address) : undefined;
                        })
                            .catch(function (err) {
                            logger.warn("unable to resolve typings for " + importName + ", " + address + " could not be found");
                            return undefined;
                        });
                    });
                };
                return Resolver;
            })();
            exports_1("Resolver", Resolver);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVzb2x2ZXIudHMiXSwibmFtZXMiOlsiUmVzb2x2ZXIiLCJSZXNvbHZlci5jb25zdHJ1Y3RvciIsIlJlc29sdmVyLnJlc29sdmUiLCJSZXNvbHZlci5yZWdpc3RlckRlY2xhcmF0aW9uRmlsZSIsIlJlc29sdmVyLnJlc29sdmVEZXBlbmRlbmNpZXMiLCJSZXNvbHZlci5yZXNvbHZlUmVmZXJlbmNlIiwiUmVzb2x2ZXIucmVzb2x2ZUltcG9ydCIsIlJlc29sdmVyLnJlc29sdmVUeXBpbmciXSwibWFwcGluZ3MiOiI7O1FBVU0sTUFBTTs7Ozs7Ozs7Ozs7OztZQUFOLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUU1QztnQkFPQ0Esa0JBQVlBLElBQWtCQSxFQUFFQSxPQUF3QkEsRUFBRUEsS0FBb0JBO29CQUM3RUMsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ2xCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtvQkFDeEJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO29CQUdwQkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFHNUJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNwQkEsQ0FBQ0E7Z0JBS01ELDBCQUFPQSxHQUFkQSxVQUFlQSxVQUFrQkE7b0JBQWpDRSxpQkEyQkNBO29CQTFCQUEsSUFBTUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQzlDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQTt3QkFBQ0EsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsV0FBU0EsVUFBVUEseUJB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QUNBLENBQUNBO29CQUNMQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQ0ZQLGVBQUNBO1lBQURBLENBQUNBLEFBcklELElBcUlDO1lBcklELCtCQXFJQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyogKi9cclxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XHJcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xyXG5pbXBvcnQge0NvbXBpbGVySG9zdH0gZnJvbSAnLi9jb21waWxlci1ob3N0JztcclxuaW1wb3J0IHtcclxuXHRpc1R5cGVzY3JpcHQsIGlzVHlwZXNjcmlwdERlY2xhcmF0aW9uLFxyXG5cdGlzSmF2YVNjcmlwdCwgaXNSZWxhdGl2ZSxcclxuXHRpc0FtYmllbnQsIGlzQW1iaWVudEltcG9ydFxyXG59IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHsgZGVidWc6IGZhbHNlIH0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlc29sdmVyIHtcclxuXHRwcml2YXRlIF9ob3N0OiBDb21waWxlckhvc3Q7XHJcblx0cHJpdmF0ZSBfcmVzb2x2ZTogUmVzb2x2ZUZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX2ZldGNoOiBGZXRjaEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX2RlY2xhcmF0aW9uRmlsZXM6IHN0cmluZ1tdO1xyXG5cdHByaXZhdGUgX3R5cGluZ3M6IHsgW3M6IHN0cmluZ106IFByb21pc2U8c3RyaW5nPjsgfTsgLy9NYXA8c3RyaW5nLCBzdHJpbmc+O1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihob3N0OiBDb21waWxlckhvc3QsIHJlc29sdmU6IFJlc29sdmVGdW5jdGlvbiwgZmV0Y2g6IEZldGNoRnVuY3Rpb24pIHtcclxuXHRcdHRoaXMuX2hvc3QgPSBob3N0O1xyXG5cdFx0dGhpcy5fcmVzb2x2ZSA9IHJlc29sdmU7XHJcblx0XHR0aGlzLl9mZXRjaCA9IGZldGNoO1xyXG5cclxuXHRcdC8vIGxpc3Qgb2YgYWxsIHJlZ2lzdGVyZWQgZGVjbGFyYXRpb24gZmlsZXNcclxuXHRcdHRoaXMuX2RlY2xhcmF0aW9uRmlsZXMgPSBbXTtcclxuXHJcblx0XHQvLyBtYXAgb2YgZXh0ZXJuYWwgbW9kdWxlcyB0byB0aGVpciB0eXBpbmdzXHJcblx0XHR0aGlzLl90eXBpbmdzID0ge307IC8vbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcclxuXHR9XHJcblxyXG5cdC8qXHJcblx0XHRyZXR1cm5zIGEgcHJvbWlzZSB0byBhbiBhcnJheSBvZiB0eXBlc2NyaXB0IGVycm9ycyBmb3IgdGhpcyBmaWxlXHJcblx0Ki9cclxuXHRwdWJsaWMgcmVzb2x2ZShzb3VyY2VOYW1lOiBzdHJpbmcpOiBQcm9taXNlPERlcGVuZGVuY3lJbmZvPiB7XHJcblx0XHRjb25zdCBmaWxlID0gdGhpcy5faG9zdC5nZXRTb3VyY2VGaWxlKHNvdXJjZU5hbWUpO1xyXG4gICAgICBpZiAoIWZpbGUpIHRocm93IG5ldyBFcnJvcihgZmlsZSBbJHtzb3VyY2VOYW1lfV0gaGFzIG5vdCBiZWVuIGFkZGVkYCk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIWZpbGUucGVuZGluZ0RlcGVuZGVuY2llcykgeyAgIFxyXG4gICAgICAgICBjb25zdCBpbmZvID0gdHMucHJlUHJvY2Vzc0ZpbGUoZmlsZS50ZXh0LCB0cnVlKTtcclxuICAgICAgICAgZmlsZS5pc0xpYkZpbGUgPSBpbmZvLmlzTGliRmlsZTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIGZpbGUucGVuZGluZ0RlcGVuZGVuY2llcyA9IHRoaXMucmVzb2x2ZURlcGVuZGVuY2llcyhzb3VyY2VOYW1lLCBpbmZvKVxyXG4gICAgICAgICAgICAudGhlbihtYXBwaW5ncyA9PiB7XHJcbiAgICAgICAgICAgICAgIGNvbnN0IGRlcHMgPSBPYmplY3Qua2V5cyhtYXBwaW5ncylcclxuXHRcdFx0XHRcdCAgIC5tYXAoKGtleSkgPT4gbWFwcGluZ3Nba2V5XSlcclxuXHRcdFx0XHRcdCBcdC5maWx0ZXIoKHJlcykgPT4gaXNUeXBlc2NyaXB0KHJlcykpIC8vIGlnbm9yZSBlLmcuIGpzLCBjc3MgZmlsZXNcclxuXHRcdFx0XHRcdFxyXG4gICAgICAgICAgICAgICAvKiBhZGQgdGhlIGZpeGVkIGRlY2xhcmF0aW9uIGZpbGVzICovXHJcbiAgICAgICAgICAgICAgIGNvbnN0IHJlZnMgPSB0aGlzLl9kZWNsYXJhdGlvbkZpbGVzLmZpbHRlcihkZWNsID0+IHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIChkZWNsICE9IHNvdXJjZU5hbWUpICYmIChkZXBzLmluZGV4T2YoZGVjbCkgPCAwKTtcclxuICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gZGVwcy5jb25jYXQocmVmcyk7XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBmaWxlLmRlcGVuZGVuY2llcyA9IHsgbWFwcGluZ3MsIGxpc3QgfTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIHJldHVybiBmaWxlLmRlcGVuZGVuY2llcztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgIHJldHVybiBmaWxlLnBlbmRpbmdEZXBlbmRlbmNpZXM7IFxyXG5cdH1cclxuXHJcblx0LypcclxuXHRcdHJlZ2lzdGVyIGRlY2xhcmF0aW9uIGZpbGVzIGZyb20gY29uZmlnXHJcblx0Ki9cclxuXHRwdWJsaWMgcmVnaXN0ZXJEZWNsYXJhdGlvbkZpbGUoc291cmNlTmFtZTogc3RyaW5nLCBpc0RlZmF1bHRMaWI6IGJvb2xlYW4pIHtcclxuXHRcdHRoaXMuX2RlY2xhcmF0aW9uRmlsZXMucHVzaChzb3VyY2VOYW1lKTtcclxuXHR9XHJcblx0XHJcblx0LypcclxuXHRcdHByb2Nlc3MgdGhlIHNvdXJjZSB0byBnZXQgaXRzIGRlcGVuZGVuY2llcyBhbmQgcmVzb2x2ZSBhbmQgcmVnaXN0ZXIgdGhlbVxyXG5cdFx0cmV0dXJucyBhIHByb21pc2UgdG8gdGhlIGxpc3Qgb2YgcmVnaXN0ZXJlZCBkZXBlbmRlbmN5IGZpbGVzXHJcblx0Ki9cclxuXHRwcml2YXRlIHJlc29sdmVEZXBlbmRlbmNpZXMoc291cmNlTmFtZTogc3RyaW5nLCBpbmZvOiB0cy5QcmVQcm9jZXNzZWRGaWxlSW5mbyk6IFByb21pc2U8eyBbczogc3RyaW5nXTogc3RyaW5nOyB9PiB7XHJcblx0XHQvKiBidWlsZCB0aGUgbGlzdCBvZiBmaWxlIHJlc29sdXRpb25zICovXHJcblx0XHQvKiByZWZlcmVuY2VzIGZpcnN0ICovXHJcblx0XHRjb25zdCByZXNvbHZlZFJlZmVyZW5jZXMgPSBpbmZvLnJlZmVyZW5jZWRGaWxlc1xyXG5cdFx0XHQubWFwKChyZWYpID0+IHRoaXMucmVzb2x2ZVJlZmVyZW5jZShyZWYuZmlsZU5hbWUsIHNvdXJjZU5hbWUpKTtcclxuXHJcblx0XHRjb25zdCByZXNvbHZlZEltcG9ydHMgPSBpbmZvLmltcG9ydGVkRmlsZXNcclxuXHRcdFx0Lm1hcCgoaW1wKSA9PiB0aGlzLnJlc29sdmVJbXBvcnQoaW1wLmZpbGVOYW1lLCBzb3VyY2VOYW1lKSk7XHJcblxyXG5cdFx0Y29uc3QgcmVmcyA9IFtdLmNvbmNhdChpbmZvLnJlZmVyZW5jZWRGaWxlcykuY29uY2F0KGluZm8uaW1wb3J0ZWRGaWxlcykubWFwKHByZSA9PiBwcmUuZmlsZU5hbWUpO1xyXG5cdFx0Y29uc3QgZGVwcyA9IHJlc29sdmVkUmVmZXJlbmNlcy5jb25jYXQocmVzb2x2ZWRJbXBvcnRzKTtcclxuXHJcblx0XHQvKiBhbmQgY29udmVydCB0byBwcm9taXNlIHRvIGEgbWFwIG9mIGxvY2FsIHJlZmVyZW5jZSB0byByZXNvbHZlZCBkZXBlbmRlbmN5ICovXHJcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoZGVwcylcclxuXHRcdFx0LnRoZW4oKHJlc29sdmVkKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIHJlZnMucmVkdWNlKChyZXN1bHQsIHJlZiwgaWR4KSA9PiB7XHJcblx0XHRcdFx0XHRyZXN1bHRbcmVmXSA9IHJlc29sdmVkW2lkeF07XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHRcdH0sIHt9KTtcclxuXHRcdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHJlc29sdmVSZWZlcmVuY2UocmVmZXJlbmNlTmFtZTogc3RyaW5nLCBzb3VyY2VOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG5cdFx0aWYgKChpc0FtYmllbnQocmVmZXJlbmNlTmFtZSkgJiYgIXRoaXMuX2hvc3Qub3B0aW9ucy5yZXNvbHZlQW1iaWVudFJlZnMpIHx8IChyZWZlcmVuY2VOYW1lLmluZGV4T2YoXCIvXCIpID09PSAtMSkpXHJcblx0XHRcdHJlZmVyZW5jZU5hbWUgPSBcIi4vXCIgKyByZWZlcmVuY2VOYW1lO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9yZXNvbHZlKHJlZmVyZW5jZU5hbWUsIHNvdXJjZU5hbWUpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByZXNvbHZlSW1wb3J0KGltcG9ydE5hbWU6IHN0cmluZywgc291cmNlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdGlmIChpc1JlbGF0aXZlKGltcG9ydE5hbWUpICYmIGlzVHlwZXNjcmlwdERlY2xhcmF0aW9uKHNvdXJjZU5hbWUpICYmICFpc1R5cGVzY3JpcHREZWNsYXJhdGlvbihpbXBvcnROYW1lKSlcclxuXHRcdFx0aW1wb3J0TmFtZSA9IGltcG9ydE5hbWUgKyBcIi5kLnRzXCI7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3Jlc29sdmUoaW1wb3J0TmFtZSwgc291cmNlTmFtZSlcclxuXHRcdFx0LnRoZW4ocmVzb2x2ZWRJbXBvcnQgPT4ge1xyXG5cdFx0XHQgIFx0aWYgKHRoaXMuX2hvc3Qub3B0aW9ucy5yZXNvbHZlVHlwaW5ncyAmJiBpc0FtYmllbnRJbXBvcnQoaW1wb3J0TmFtZSkgJiYgaXNKYXZhU2NyaXB0KHJlc29sdmVkSW1wb3J0KSAmJiAhaXNUeXBlc2NyaXB0RGVjbGFyYXRpb24oc291cmNlTmFtZSkpIHtcclxuXHRcdFx0ICBcdFx0aWYgKCF0aGlzLl90eXBpbmdzW3Jlc29sdmVkSW1wb3J0XSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLl90eXBpbmdzW3Jlc29sdmVkSW1wb3J0XSA9IHRoaXMucmVzb2x2ZVR5cGluZyhpbXBvcnROYW1lLCBzb3VyY2VOYW1lKVxyXG5cdFx0XHRcdFx0XHRcdC50aGVuKHJlc29sdmVkVHlwaW5nID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXNvbHZlZFR5cGluZyA/IHJlc29sdmVkVHlwaW5nIDogcmVzb2x2ZWRJbXBvcnQ7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX3R5cGluZ3NbcmVzb2x2ZWRJbXBvcnRdO1xyXG5cdFx0XHQgIFx0fVxyXG5cdFx0XHQgIFx0ZWxzZSB7XHJcblx0XHRcdCAgXHRcdHJldHVybiByZXNvbHZlZEltcG9ydDtcclxuXHRcdFx0ICBcdH1cclxuICBcdFx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgcmVzb2x2ZVR5cGluZyhpbXBvcnROYW1lOiBzdHJpbmcsIHNvdXJjZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0XHQvLyB3ZSBjYW4gb25seSBzdXBwb3J0IHBhY2thZ2VzIHJlZ2lzdGVyZWQgd2l0aG91dCBhIHNsYXNoIGluIHRoZW1cclxuXHRcdGNvbnN0IHBhY2thZ2VOYW1lID0gaW1wb3J0TmFtZS5zcGxpdCgvXFwvLylbMF07XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3Jlc29sdmUocGFja2FnZU5hbWUsIHNvdXJjZU5hbWUpXHJcblx0XHRcdC50aGVuKGV4cG9ydGVkID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gZXhwb3J0ZWQuc2xpY2UoMCwgLTMpICsgXCIvcGFja2FnZS5qc29uXCI7XHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKGFkZHJlc3MgPT4ge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9mZXRjaChhZGRyZXNzKVxyXG5cdFx0XHRcdFx0LnRoZW4ocGFja2FnZVRleHQgPT4ge1xyXG5cdFx0XHRcdFx0XHRjb25zdCB0eXBpbmdzID0gSlNPTi5wYXJzZShwYWNrYWdlVGV4dCkudHlwaW5ncztcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHR5cGluZ3MgPyB0aGlzLl9yZXNvbHZlKFwiLi9cIiArIHR5cGluZ3MsIGFkZHJlc3MpIDogdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5jYXRjaChlcnIgPT4ge1xyXG5cdFx0XHRcdFx0XHRsb2dnZXIud2FybihgdW5hYmxlIHRvIHJlc29sdmUgdHlwaW5ncyBmb3IgJHtpbXBvcnROYW1lfSwgJHthZGRyZXNzfSBjb3VsZCBub3QgYmUgZm91bmRgKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHR9XHJcbn0iXX0=