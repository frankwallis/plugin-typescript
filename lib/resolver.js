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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVzb2x2ZXIudHMiXSwibmFtZXMiOlsiUmVzb2x2ZXIiLCJSZXNvbHZlci5jb25zdHJ1Y3RvciIsIlJlc29sdmVyLnJlc29sdmUiLCJSZXNvbHZlci5yZWdpc3RlckRlY2xhcmF0aW9uRmlsZSIsIlJlc29sdmVyLnJlc29sdmVEZXBlbmRlbmNpZXMiLCJSZXNvbHZlci5yZXNvbHZlUmVmZXJlbmNlIiwiUmVzb2x2ZXIucmVzb2x2ZUltcG9ydCIsIlJlc29sdmVyLnJlc29sdmVUeXBpbmciXSwibWFwcGluZ3MiOiI7O1FBVU0sTUFBTTs7Ozs7Ozs7Ozs7OztZQUFOLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUU1QztnQkFPQ0Esa0JBQVlBLElBQWtCQSxFQUFFQSxPQUF3QkEsRUFBRUEsS0FBb0JBO29CQUM3RUMsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ2xCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtvQkFDeEJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO29CQUdwQkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFHNUJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNwQkEsQ0FBQ0E7Z0JBS01ELDBCQUFPQSxHQUFkQSxVQUFlQSxVQUFrQkE7b0JBQWpDRSxpQkEyQkNBO29CQTFCQUEsSUFBTUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQzlDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQTt3QkFBQ0EsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsV0FBU0EsVUFBVUEseUJB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QUNBLENBQUNBO29CQUNMQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQ0ZQLGVBQUNBO1lBQURBLENBQUNBLEFBcklELElBcUlDO1lBcklELCtCQXFJQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyogKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQge0NvbXBpbGVySG9zdH0gZnJvbSAnLi9jb21waWxlci1ob3N0JztcbmltcG9ydCB7XG5cdGlzVHlwZXNjcmlwdCwgaXNUeXBlc2NyaXB0RGVjbGFyYXRpb24sXG5cdGlzSmF2YVNjcmlwdCwgaXNSZWxhdGl2ZSxcblx0aXNBbWJpZW50LCBpc0FtYmllbnRJbXBvcnRcbn0gZnJvbSBcIi4vdXRpbHNcIjtcblxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7IGRlYnVnOiBmYWxzZSB9KTtcblxuZXhwb3J0IGNsYXNzIFJlc29sdmVyIHtcblx0cHJpdmF0ZSBfaG9zdDogQ29tcGlsZXJIb3N0O1xuXHRwcml2YXRlIF9yZXNvbHZlOiBSZXNvbHZlRnVuY3Rpb247XG5cdHByaXZhdGUgX2ZldGNoOiBGZXRjaEZ1bmN0aW9uO1xuXHRwcml2YXRlIF9kZWNsYXJhdGlvbkZpbGVzOiBzdHJpbmdbXTtcblx0cHJpdmF0ZSBfdHlwaW5nczogeyBbczogc3RyaW5nXTogUHJvbWlzZTxzdHJpbmc+OyB9OyAvL01hcDxzdHJpbmcsIHN0cmluZz47XG5cblx0Y29uc3RydWN0b3IoaG9zdDogQ29tcGlsZXJIb3N0LCByZXNvbHZlOiBSZXNvbHZlRnVuY3Rpb24sIGZldGNoOiBGZXRjaEZ1bmN0aW9uKSB7XG5cdFx0dGhpcy5faG9zdCA9IGhvc3Q7XG5cdFx0dGhpcy5fcmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0dGhpcy5fZmV0Y2ggPSBmZXRjaDtcblxuXHRcdC8vIGxpc3Qgb2YgYWxsIHJlZ2lzdGVyZWQgZGVjbGFyYXRpb24gZmlsZXNcblx0XHR0aGlzLl9kZWNsYXJhdGlvbkZpbGVzID0gW107XG5cblx0XHQvLyBtYXAgb2YgZXh0ZXJuYWwgbW9kdWxlcyB0byB0aGVpciB0eXBpbmdzXG5cdFx0dGhpcy5fdHlwaW5ncyA9IHt9OyAvL25ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cdH1cblxuXHQvKlxuXHRcdHJldHVybnMgYSBwcm9taXNlIHRvIGFuIGFycmF5IG9mIHR5cGVzY3JpcHQgZXJyb3JzIGZvciB0aGlzIGZpbGVcblx0Ki9cblx0cHVibGljIHJlc29sdmUoc291cmNlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxEZXBlbmRlbmN5SW5mbz4ge1xuXHRcdGNvbnN0IGZpbGUgPSB0aGlzLl9ob3N0LmdldFNvdXJjZUZpbGUoc291cmNlTmFtZSk7XG4gICAgICBpZiAoIWZpbGUpIHRocm93IG5ldyBFcnJvcihgZmlsZSBbJHtzb3VyY2VOYW1lfV0gaGFzIG5vdCBiZWVuIGFkZGVkYCk7XG4gICAgICBcbiAgICAgIGlmICghZmlsZS5wZW5kaW5nRGVwZW5kZW5jaWVzKSB7ICAgXG4gICAgICAgICBjb25zdCBpbmZvID0gdHMucHJlUHJvY2Vzc0ZpbGUoZmlsZS50ZXh0LCB0cnVlKTtcbiAgICAgICAgIGZpbGUuaXNMaWJGaWxlID0gaW5mby5pc0xpYkZpbGU7XG4gICAgICAgICBcbiAgICAgICAgIGZpbGUucGVuZGluZ0RlcGVuZGVuY2llcyA9IHRoaXMucmVzb2x2ZURlcGVuZGVuY2llcyhzb3VyY2VOYW1lLCBpbmZvKVxuICAgICAgICAgICAgLnRoZW4obWFwcGluZ3MgPT4ge1xuICAgICAgICAgICAgICAgY29uc3QgZGVwcyA9IE9iamVjdC5rZXlzKG1hcHBpbmdzKVxuXHRcdFx0XHRcdCAgIC5tYXAoKGtleSkgPT4gbWFwcGluZ3Nba2V5XSlcblx0XHRcdFx0XHQgXHQuZmlsdGVyKChyZXMpID0+IGlzVHlwZXNjcmlwdChyZXMpKSAvLyBpZ25vcmUgZS5nLiBqcywgY3NzIGZpbGVzXG5cdFx0XHRcdFx0XG4gICAgICAgICAgICAgICAvKiBhZGQgdGhlIGZpeGVkIGRlY2xhcmF0aW9uIGZpbGVzICovXG4gICAgICAgICAgICAgICBjb25zdCByZWZzID0gdGhpcy5fZGVjbGFyYXRpb25GaWxlcy5maWx0ZXIoZGVjbCA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKGRlY2wgIT0gc291cmNlTmFtZSkgJiYgKGRlcHMuaW5kZXhPZihkZWNsKSA8IDApO1xuICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBkZXBzLmNvbmNhdChyZWZzKTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgZmlsZS5kZXBlbmRlbmNpZXMgPSB7IG1hcHBpbmdzLCBsaXN0IH07ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgcmV0dXJuIGZpbGUuZGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAgICBcbiAgICAgIHJldHVybiBmaWxlLnBlbmRpbmdEZXBlbmRlbmNpZXM7IFxuXHR9XG5cblx0Lypcblx0XHRyZWdpc3RlciBkZWNsYXJhdGlvbiBmaWxlcyBmcm9tIGNvbmZpZ1xuXHQqL1xuXHRwdWJsaWMgcmVnaXN0ZXJEZWNsYXJhdGlvbkZpbGUoc291cmNlTmFtZTogc3RyaW5nLCBpc0RlZmF1bHRMaWI6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9kZWNsYXJhdGlvbkZpbGVzLnB1c2goc291cmNlTmFtZSk7XG5cdH1cblx0XG5cdC8qXG5cdFx0cHJvY2VzcyB0aGUgc291cmNlIHRvIGdldCBpdHMgZGVwZW5kZW5jaWVzIGFuZCByZXNvbHZlIGFuZCByZWdpc3RlciB0aGVtXG5cdFx0cmV0dXJucyBhIHByb21pc2UgdG8gdGhlIGxpc3Qgb2YgcmVnaXN0ZXJlZCBkZXBlbmRlbmN5IGZpbGVzXG5cdCovXG5cdHByaXZhdGUgcmVzb2x2ZURlcGVuZGVuY2llcyhzb3VyY2VOYW1lOiBzdHJpbmcsIGluZm86IHRzLlByZVByb2Nlc3NlZEZpbGVJbmZvKTogUHJvbWlzZTx7IFtzOiBzdHJpbmddOiBzdHJpbmc7IH0+IHtcblx0XHQvKiBidWlsZCB0aGUgbGlzdCBvZiBmaWxlIHJlc29sdXRpb25zICovXG5cdFx0LyogcmVmZXJlbmNlcyBmaXJzdCAqL1xuXHRcdGNvbnN0IHJlc29sdmVkUmVmZXJlbmNlcyA9IGluZm8ucmVmZXJlbmNlZEZpbGVzXG5cdFx0XHQubWFwKChyZWYpID0+IHRoaXMucmVzb2x2ZVJlZmVyZW5jZShyZWYuZmlsZU5hbWUsIHNvdXJjZU5hbWUpKTtcblxuXHRcdGNvbnN0IHJlc29sdmVkSW1wb3J0cyA9IGluZm8uaW1wb3J0ZWRGaWxlc1xuXHRcdFx0Lm1hcCgoaW1wKSA9PiB0aGlzLnJlc29sdmVJbXBvcnQoaW1wLmZpbGVOYW1lLCBzb3VyY2VOYW1lKSk7XG5cblx0XHRjb25zdCByZWZzID0gW10uY29uY2F0KGluZm8ucmVmZXJlbmNlZEZpbGVzKS5jb25jYXQoaW5mby5pbXBvcnRlZEZpbGVzKS5tYXAocHJlID0+IHByZS5maWxlTmFtZSk7XG5cdFx0Y29uc3QgZGVwcyA9IHJlc29sdmVkUmVmZXJlbmNlcy5jb25jYXQocmVzb2x2ZWRJbXBvcnRzKTtcblxuXHRcdC8qIGFuZCBjb252ZXJ0IHRvIHByb21pc2UgdG8gYSBtYXAgb2YgbG9jYWwgcmVmZXJlbmNlIHRvIHJlc29sdmVkIGRlcGVuZGVuY3kgKi9cblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoZGVwcylcblx0XHRcdC50aGVuKChyZXNvbHZlZCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gcmVmcy5yZWR1Y2UoKHJlc3VsdCwgcmVmLCBpZHgpID0+IHtcblx0XHRcdFx0XHRyZXN1bHRbcmVmXSA9IHJlc29sdmVkW2lkeF07XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fSwge30pO1xuXHRcdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIHJlc29sdmVSZWZlcmVuY2UocmVmZXJlbmNlTmFtZTogc3RyaW5nLCBzb3VyY2VOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdGlmICgoaXNBbWJpZW50KHJlZmVyZW5jZU5hbWUpICYmICF0aGlzLl9ob3N0Lm9wdGlvbnMucmVzb2x2ZUFtYmllbnRSZWZzKSB8fCAocmVmZXJlbmNlTmFtZS5pbmRleE9mKFwiL1wiKSA9PT0gLTEpKVxuXHRcdFx0cmVmZXJlbmNlTmFtZSA9IFwiLi9cIiArIHJlZmVyZW5jZU5hbWU7XG5cblx0XHRyZXR1cm4gdGhpcy5fcmVzb2x2ZShyZWZlcmVuY2VOYW1lLCBzb3VyY2VOYW1lKTtcblx0fVxuXG5cdHByaXZhdGUgcmVzb2x2ZUltcG9ydChpbXBvcnROYW1lOiBzdHJpbmcsIHNvdXJjZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0aWYgKGlzUmVsYXRpdmUoaW1wb3J0TmFtZSkgJiYgaXNUeXBlc2NyaXB0RGVjbGFyYXRpb24oc291cmNlTmFtZSkgJiYgIWlzVHlwZXNjcmlwdERlY2xhcmF0aW9uKGltcG9ydE5hbWUpKVxuXHRcdFx0aW1wb3J0TmFtZSA9IGltcG9ydE5hbWUgKyBcIi5kLnRzXCI7XG5cblx0XHRyZXR1cm4gdGhpcy5fcmVzb2x2ZShpbXBvcnROYW1lLCBzb3VyY2VOYW1lKVxuXHRcdFx0LnRoZW4ocmVzb2x2ZWRJbXBvcnQgPT4ge1xuXHRcdFx0ICBcdGlmICh0aGlzLl9ob3N0Lm9wdGlvbnMucmVzb2x2ZVR5cGluZ3MgJiYgaXNBbWJpZW50SW1wb3J0KGltcG9ydE5hbWUpICYmIGlzSmF2YVNjcmlwdChyZXNvbHZlZEltcG9ydCkgJiYgIWlzVHlwZXNjcmlwdERlY2xhcmF0aW9uKHNvdXJjZU5hbWUpKSB7XG5cdFx0XHQgIFx0XHRpZiAoIXRoaXMuX3R5cGluZ3NbcmVzb2x2ZWRJbXBvcnRdKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90eXBpbmdzW3Jlc29sdmVkSW1wb3J0XSA9IHRoaXMucmVzb2x2ZVR5cGluZyhpbXBvcnROYW1lLCBzb3VyY2VOYW1lKVxuXHRcdFx0XHRcdFx0XHQudGhlbihyZXNvbHZlZFR5cGluZyA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc29sdmVkVHlwaW5nID8gcmVzb2x2ZWRUeXBpbmcgOiByZXNvbHZlZEltcG9ydDtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX3R5cGluZ3NbcmVzb2x2ZWRJbXBvcnRdO1xuXHRcdFx0ICBcdH1cblx0XHRcdCAgXHRlbHNlIHtcblx0XHRcdCAgXHRcdHJldHVybiByZXNvbHZlZEltcG9ydDtcblx0XHRcdCAgXHR9XG4gIFx0XHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSByZXNvbHZlVHlwaW5nKGltcG9ydE5hbWU6IHN0cmluZywgc291cmNlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcblx0XHQvLyB3ZSBjYW4gb25seSBzdXBwb3J0IHBhY2thZ2VzIHJlZ2lzdGVyZWQgd2l0aG91dCBhIHNsYXNoIGluIHRoZW1cblx0XHRjb25zdCBwYWNrYWdlTmFtZSA9IGltcG9ydE5hbWUuc3BsaXQoL1xcLy8pWzBdO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3Jlc29sdmUocGFja2FnZU5hbWUsIHNvdXJjZU5hbWUpXG5cdFx0XHQudGhlbihleHBvcnRlZCA9PiB7XG5cdFx0XHRcdHJldHVybiBleHBvcnRlZC5zbGljZSgwLCAtMykgKyBcIi9wYWNrYWdlLmpzb25cIjtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihhZGRyZXNzID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2ZldGNoKGFkZHJlc3MpXG5cdFx0XHRcdFx0LnRoZW4ocGFja2FnZVRleHQgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdHlwaW5ncyA9IEpTT04ucGFyc2UocGFja2FnZVRleHQpLnR5cGluZ3M7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHlwaW5ncyA/IHRoaXMuX3Jlc29sdmUoXCIuL1wiICsgdHlwaW5ncywgYWRkcmVzcykgOiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0XHRcdGxvZ2dlci53YXJuKGB1bmFibGUgdG8gcmVzb2x2ZSB0eXBpbmdzIGZvciAke2ltcG9ydE5hbWV9LCAke2FkZHJlc3N9IGNvdWxkIG5vdCBiZSBmb3VuZGApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9XG59Il19