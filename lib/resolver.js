System.register(['typescript', 'path', './logger', './utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ts, path, logger_1, utils_1;
    var logger, Resolver;
    return {
        setters:[
            function (ts_1) {
                ts = ts_1;
            },
            function (path_1) {
                path = path_1;
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
                Resolver.prototype.registerDeclarationFile = function (sourceName) {
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
                        if (utils_1.isAmbientImport(importName) && utils_1.isJavaScript(resolvedImport)) {
                            if (_this._host.options.typingsMap) {
                                var mappedTyping = _this.resolveMappedTyping(importName, resolvedImport);
                                if (mappedTyping)
                                    return mappedTyping;
                            }
                            if (_this._host.options.resolveTypings) {
                                if (!_this._typings[resolvedImport]) {
                                    _this._typings[resolvedImport] = _this.resolveTyping(importName, sourceName)
                                        .then(function (resolvedTyping) {
                                        return resolvedTyping ? resolvedTyping : resolvedImport;
                                    });
                                }
                                return _this._typings[resolvedImport];
                            }
                        }
                        return resolvedImport;
                    });
                };
                Resolver.prototype.resolveMappedTyping = function (importName, resolvedImportName) {
                    var _this = this;
                    return Object.keys(this._host.options.typingsMap).reduce(function (result, key) {
                        if (_this._host.options.typingsMap[key] === true) {
                            if (importName.indexOf(key) === 0) {
                                return utils_1.jsToDts(resolvedImportName);
                            }
                        }
                        else if (key === importName) {
                            return path.join(path.dirname(resolvedImportName), importName, _this._host.options.typingsMap[key]);
                        }
                        return result;
                    }, undefined);
                };
                Resolver.prototype.resolveTyping = function (importName, sourceName) {
                    var _this = this;
                    var packageName = importName.split(/\//)[0];
                    return this._resolve(packageName, sourceName)
                        .then(function (exported) {
                        return path.join(exported.slice(0, -3), "package.json");
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
            }());
            exports_1("Resolver", Resolver);
        }
    }
});
