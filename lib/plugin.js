System.register(["typescript"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
        return { next: verb(0), "throw": verb(1), "return": verb(2) };
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [0, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    function parseConfig(config) {
        var result = config || {};
        result.module = getEnum(result.module, typescript_1.ModuleKind, typescript_1.ModuleKind.System);
        result.target = getEnum(result.target, typescript_1.ScriptTarget, typescript_1.ScriptTarget.ES5);
        result.jsx = getEnum(result.jsx, typescript_1.JsxEmit, typescript_1.JsxEmit.None);
        result.allowNonTsExtensions = (result.allowNonTsExtensions !== false);
        result.skipDefaultLibCheck = (result.skipDefaultLibCheck !== false);
        result.noResolve = true;
        result.allowSyntheticDefaultImports = (result.allowSyntheticDefaultImports !== false);
        result.moduleResolution = typescript_1.ModuleResolutionKind.Classic;
        result.types = result.types || [];
        result.typings = result.typings || {};
        if (result.supportHtmlImports) {
            logger$2.error("The 'supportHtmlImports' option is no longer supported");
            logger$2.error("Please use TypeScript's new 'wildcard declarations' feature instead");
        }
        if (result.resolveAmbientRefs) {
            logger$2.error("The 'resolveAmbientRefs' option is no longer supported");
            logger$2.error("Please use External Typings support instead");
        }
        if (result.targetLib) {
            logger$2.error("The 'targetLib' option is no longer supported");
            logger$2.error("Please use the 'lib' option instead");
        }
        if (!result.lib) {
            result.lib = ['es6'];
        }
        return result;
    }
    function getEnum(enumValue, enumType, defaultValue) {
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
    }
    function isAbsolute(filename) {
        return (filename[0] === '/');
    }
    function isRelative(filename) {
        return (filename[0] === '.');
    }
    function isAmbient(filename) {
        return (!isRelative(filename) && !isAbsolute(filename));
    }
    function isTypescript(filename) {
        return typescriptRegex.test(filename);
    }
    function isJavaScript(filename) {
        return javascriptRegex.test(filename);
    }
    function isJSX(filename) {
        return jsxRegex.test(filename);
    }
    function isSourceMap(filename) {
        return mapRegex.test(filename);
    }
    function isTypescriptDeclaration(filename) {
        return declarationRegex.test(filename);
    }
    function convertToDts(anyFile) {
        return anyFile.replace(convertRegex, '.d.ts');
    }
    function getExtension(normalized) {
        var baseName = typescript_1.getBaseFileName(normalized);
        var parts = baseName.split('.');
        return parts.length > 1 ? parts.pop() : undefined;
    }
    function stripDoubleExtension(normalized) {
        var parts = normalized.split('.');
        if (parts.length > 1) {
            var extensions = ["js", "jsx", "ts", "tsx", "json"];
            if (extensions.indexOf(parts[parts.length - 2]) >= 0) {
                return parts.slice(0, -1).join('.');
            }
        }
        return normalized;
    }
    function hasError(diags) {
        return diags.some(function (diag) { return (diag.category === typescript_1.DiagnosticCategory.Error); });
    }
    function convertErrors(diags) {
        return diags.reduce(function (result, diag) {
            var locationText = undefined;
            if (diag.file) {
                var position = diag.file.getLineAndCharacterOfPosition(diag.start);
                var filename = diag.file.fileName;
                locationText = filename + ":" + (position.line + 1) + ":" + (position.character + 1);
            }
            var messageText = typescript_1.flattenDiagnosticMessageText(diag.messageText, "\n");
            messageText = messageText + " (TS" + diag.code + ")";
            result.push({
                messageText: messageText,
                locationText: locationText,
                category: diag.category,
                errorCode: diag.code
            });
            return result;
        }, []);
    }
    function outputErrors(errors, logger) {
        errors.slice(0, 10).forEach(function (error) {
            var write = (error.category === typescript_1.DiagnosticCategory.Error) ? logger.error : logger.warn;
            if (error.locationText)
                write(error.locationText);
            write(error.messageText);
        });
    }
    function formatErrors(diags, logger) {
        var errors = convertErrors(diags);
        outputErrors(errors, logger);
    }
    function createFactory(sjsconfig, builder, _resolve, _fetch, _lookup) {
        if (sjsconfig === void 0) {
            sjsconfig = {};
        }
        return __awaiter(this, void 0, void 0, function () {
            var tsconfigFiles, typingsFiles, config, services, resolvedFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tsconfigFiles = [];
                        typingsFiles = [];
                        return [4, loadConfig(sjsconfig, _resolve, _fetch)];
                    case 1:
                        config = _a.sent();
                        return [4, createServices(config, builder, _resolve, _lookup)];
                    case 2:
                        services = _a.sent();
                        if (!services.options.typeCheck)
                            return [3, 4];
                        return [4, resolveDeclarationFiles(services.options, _resolve)];
                    case 3:
                        resolvedFiles = _a.sent();
                        resolvedFiles.forEach(function (resolvedFile) {
                            services.resolver.registerDeclarationFile(resolvedFile);
                        });
                        _a.label = 4;
                    case 4: return [2, services];
                }
            });
        });
    }
    function loadConfig(sjsconfig, _resolve, _fetch) {
        return __awaiter(this, void 0, void 0, function () {
            var tsconfig, tsconfigAddress, tsconfigText, result, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sjsconfig.tsconfig)
                            return [3, 3];
                        tsconfig = (sjsconfig.tsconfig === true) ? "tsconfig.json" : sjsconfig.tsconfig;
                        return [4, _resolve(tsconfig)];
                    case 1:
                        tsconfigAddress = _a.sent();
                        return [4, _fetch(tsconfigAddress)];
                    case 2:
                        tsconfigText = _a.sent();
                        result = typescript_1.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);
                        if (result.error) {
                            formatErrors([result.error], logger$1);
                            throw new Error("failed to load tsconfig from " + tsconfigAddress);
                        }
                        files = result.config.files;
                        return [2, typescript_1.extend(typescript_1.extend({ tsconfigAddress: tsconfigAddress, files: files }, sjsconfig), result.config.compilerOptions)];
                    case 3: return [2, sjsconfig];
                }
            });
        });
    }
    function resolveDeclarationFiles(options, _resolve) {
        var files = options.files || [];
        var declarationFiles = files
            .filter(function (filename) { return isTypescriptDeclaration(filename); })
            .map(function (filename) { return _resolve(filename, options.tsconfigAddress); });
        return Promise.all(declarationFiles);
    }
    function createServices(config, builder, _resolve, _lookup) {
        return __awaiter(this, void 0, void 0, function () {
            var options, host, transpiler, resolver, typeChecker, defaultLibResolutions, defaultLibAddresses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = parseConfig(config);
                        host = new CompilerHost();
                        transpiler = new Transpiler(host);
                        resolver = undefined;
                        typeChecker = undefined;
                        if (!options.typeCheck)
                            return [3, 2];
                        resolver = new Resolver(host, _resolve, _lookup);
                        typeChecker = new TypeChecker(host);
                        if (!!options.noLib)
                            return [3, 2];
                        defaultLibResolutions = host.getDefaultLibFilePaths(options).map(function (libPath) { return _resolve(libPath); });
                        return [4, Promise.all(defaultLibResolutions)];
                    case 1:
                        defaultLibAddresses = _a.sent();
                        defaultLibAddresses.forEach(function (defaultLibAddress) {
                            resolver.registerDeclarationFile(defaultLibAddress);
                        });
                        _a.label = 2;
                    case 2: return [2, { host: host, transpiler: transpiler, resolver: resolver, typeChecker: typeChecker, options: options }];
                }
            });
        });
    }
    function getFactory() {
        var __global = typeof (self) !== 'undefined' ? self : global;
        __global.tsfactory = __global.tsfactory || createFactory(SystemJS.typescriptOptions, false, _resolve, _fetch, _lookup)
            .then(function (output) {
            validateOptions(output.options);
            return output;
        });
        return __global.tsfactory;
    }
    function translate(load) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, _a, transpiler, resolver, typeChecker, host, options, result, deps, diags, failOnError;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loader = this;
                        logger.debug("systemjs translating " + load.address);
                        factory = factory || getFactory();
                        return [4, factory];
                    case 1:
                        _a = _b.sent(), transpiler = _a.transpiler, resolver = _a.resolver, typeChecker = _a.typeChecker, host = _a.host, options = _a.options;
                        host.addFile(load.address, load.source, options.target);
                        if (isTypescriptDeclaration(load.address)) {
                            if (loader.builder && (options.module == typescript_1.ModuleKind.ES2015)) {
                                load.source = null;
                                load.metadata.format = 'esm';
                            }
                            else {
                                load.source = '';
                                load.metadata.format = 'cjs';
                            }
                        }
                        else {
                            result = transpiler.transpile(load.address, options);
                            formatErrors(result.diags, logger);
                            if (result.failure)
                                throw new Error('TypeScript transpilation failed');
                            load.source = result.js;
                            if (result.sourceMap)
                                load.metadata.sourceMap = JSON.parse(result.sourceMap);
                            if (!options.autoDetectModule) {
                                if (options.module === typescript_1.ModuleKind.System)
                                    load.metadata.format = 'register';
                                else if (options.module === typescript_1.ModuleKind.ES2015)
                                    load.metadata.format = 'esm';
                                else if (options.module === typescript_1.ModuleKind.CommonJS)
                                    load.metadata.format = 'cjs';
                            }
                        }
                        if (!(options.typeCheck && isTypescript(load.address)))
                            return [3, 3];
                        return [4, resolver.resolve(load.address, options)];
                    case 2:
                        deps = _b.sent();
                        load.metadata.deps = deps.list
                            .filter(function (d) { return isTypescript(d); })
                            .filter(function (d) { return d !== load.address; })
                            .map(function (d) { return isTypescriptDeclaration(d) ? d + '!' + __moduleName : d; });
                        diags = typeChecker.check(options);
                        formatErrors(diags, logger);
                        failOnError = !loader.builder && (options.typeCheck === "strict");
                        if (failOnError && hasError(diags))
                            throw new Error("Typescript compilation failed");
                        _b.label = 3;
                    case 3: return [2, load.source];
                }
            });
        });
    }
    exports_1("translate", translate);
    function bundle(loads, compileOpts, outputOpts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, typeChecker, host, options, diags;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!factory)
                            return [2, []];
                        return [4, factory];
                    case 1:
                        _a = _b.sent(), typeChecker = _a.typeChecker, host = _a.host, options = _a.options;
                        if (options.typeCheck) {
                            diags = typeChecker.forceCheck(options);
                            formatErrors(diags, logger);
                            loads.forEach(function (load) {
                                var diags = typeChecker.getFileDiagnostics(load.address);
                                var errors = convertErrors(diags);
                                load.metadata.tserrors = errors;
                            });
                            if ((options.typeCheck === "strict") && typeChecker.hasErrors())
                                throw new Error("Typescript compilation failed");
                        }
                        return [2, []];
                }
            });
        });
    }
    exports_1("bundle", bundle);
    function validateOptions(options) {
        if ((options.module != typescript_1.ModuleKind.System) && (options.module != typescript_1.ModuleKind.ES2015)) {
            logger.warn("transpiling to " + typescript_1.ModuleKind[options.module] + ", consider setting module: \"system\" in typescriptOptions to transpile directly to System.register format");
        }
    }
    function _resolve(dep, parent) {
        return __awaiter(this, void 0, void 0, function () {
            var normalized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!parent)
                            parent = __moduleName;
                        return [4, SystemJS.normalize(dep, parent)];
                    case 1:
                        normalized = _a.sent();
                        normalized = normalized.split('!')[0];
                        normalized = stripDoubleExtension(normalized);
                        logger.debug("resolved " + normalized + " (" + parent + " -> " + dep + ")");
                        return [2, typescript_1.normalizePath(normalized)];
                }
            });
        });
    }
    function _fetch(address) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, SystemJS.fetch({ name: address, address: address, metadata: {} })];
                    case 1:
                        text = _a.sent();
                        logger.debug("fetched " + address);
                        return [2, text];
                }
            });
        });
    }
    function _lookup(address) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = {};
                        return [4, SystemJS.locate({ name: address, address: address, metadata: metadata })];
                    case 1:
                        _a.sent();
                        logger.debug("located " + address);
                        return [2, metadata];
                }
            });
        });
    }
    var typescript_1, Logger, logger$2, typescriptRegex, javascriptRegex, jsxRegex, mapRegex, declarationRegex, convertRegex, logger$3, CompilerHost, logger$4, Transpiler, logger$5, Resolver, logger$6, TypeChecker, logger$1, logger, factory;
    return {
        setters: [
            function (typescript_1_1) {
                typescript_1 = typescript_1_1;
            }
        ],
        execute: function () {
            Logger = (function () {
                function Logger(options) {
                    this.options = options;
                    this.options = options || {};
                }
                Logger.prototype.log = function (msg) {
                    console.log("TypeScript", "[Info]", msg);
                };
                Logger.prototype.error = function (msg) {
                    console.error("TypeScript", "[Error]", msg);
                };
                Logger.prototype.warn = function (msg) {
                    console.warn("TypeScript", "[Warning]", msg);
                };
                Logger.prototype.debug = function (msg) {
                    if (this.options.debug) {
                        console.log("TypeScript", msg);
                    }
                };
                return Logger;
            }());
            logger$2 = new Logger({ debug: false });
            typescriptRegex = /\.tsx?$/i;
            javascriptRegex = /\.js$/i;
            jsxRegex = /\.jsx$/i;
            mapRegex = /\.map$/i;
            declarationRegex = /\.d\.tsx?$/i;
            convertRegex = /\.[^\.]+$/;
            logger$3 = new Logger({ debug: false });
            CompilerHost = (function () {
                function CompilerHost() {
                    this._reportedFiles = [];
                    this._files = {};
                }
                CompilerHost.prototype.getDefaultLibFileName = function (options) {
                    return this.getDefaultLibFilePaths(options)[0];
                };
                CompilerHost.prototype.getDefaultLibFilePaths = function (options) {
                    return options.lib.map(function (libName) { return "typescript/lib/lib." + libName + ".d.ts"; });
                };
                CompilerHost.prototype.useCaseSensitiveFileNames = function () {
                    return false;
                };
                CompilerHost.prototype.getCanonicalFileName = function (fileName) {
                    return typescript_1.normalizePath(fileName);
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
                CompilerHost.prototype.getDirectories = function () {
                    throw new Error("Not implemented");
                };
                CompilerHost.prototype.addFile = function (fileName, text, target) {
                    fileName = this.getCanonicalFileName(fileName);
                    var file = this._files[fileName];
                    if (!file) {
                        this._files[fileName] = typescript_1.createSourceFile(fileName, text, target);
                        logger$3.debug("added " + fileName);
                    }
                    else if (file.text != text) {
                        this._files[fileName] = typescript_1.createSourceFile(fileName, text, target);
                        this.invalidate(fileName);
                        logger$3.debug("updated " + fileName);
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
                            file.diags = [];
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
                        if (dependencies) {
                            var resolvedFileName = dependencies.mappings[modName];
                            if (!resolvedFileName) {
                                if (_this._reportedFiles.indexOf(resolvedFileName) < 0) {
                                    logger$3.warn(containingFile + ' -> ' + modName + ' could not be resolved');
                                    _this._reportedFiles.push(resolvedFileName);
                                }
                                return undefined;
                            }
                            else {
                                var isExternalLibraryImport = isTypescriptDeclaration(resolvedFileName);
                                var extension = getExtension(resolvedFileName);
                                return { resolvedFileName: resolvedFileName, isExternalLibraryImport: isExternalLibraryImport, extension: extension };
                            }
                        }
                        else {
                            return undefined;
                        }
                    });
                };
                return CompilerHost;
            }());
            logger$4 = new Logger({ debug: false });
            Transpiler = (function () {
                function Transpiler(_host) {
                    this._host = _host;
                }
                Transpiler.prototype.getTranspileOptions = function (options) {
                    var result = typescript_1.clone(options);
                    result.isolatedModules = true;
                    if (result.sourceMap === undefined)
                        result.sourceMap = result.inlineSourceMap;
                    if (result.sourceMap === undefined)
                        result.sourceMap = true;
                    result.inlineSourceMap = false;
                    result.declaration = false;
                    result.noEmitOnError = false;
                    result.out = undefined;
                    result.outFile = undefined;
                    result.noLib = true;
                    result.lib = undefined;
                    result.types = [];
                    result.suppressOutputPathCheck = true;
                    result.noEmit = false;
                    return result;
                };
                Transpiler.prototype.transpile = function (sourceName, options) {
                    logger$4.debug("transpiling " + sourceName);
                    var file = this._host.getSourceFile(sourceName);
                    if (!file)
                        throw new Error("file [" + sourceName + "] has not been added");
                    if (!file.output) {
                        var transpileOptions = this.getTranspileOptions(options);
                        var program = typescript_1.createProgram([sourceName], transpileOptions, this._host);
                        var jstext_1 = undefined;
                        var maptext_1 = undefined;
                        var emitResult = program.emit(undefined, function (outputName, output) {
                            if (isJavaScript(outputName) || isJSX(outputName))
                                jstext_1 = output.slice(0, output.lastIndexOf("//#"));
                            else if (isSourceMap(outputName))
                                maptext_1 = output;
                            else
                                throw new Error("unexpected ouput file " + outputName);
                        });
                        var diagnostics = emitResult.diagnostics
                            .concat(program.getOptionsDiagnostics())
                            .concat(program.getSyntacticDiagnostics());
                        file.output = {
                            failure: hasError(diagnostics),
                            diags: diagnostics,
                            js: jstext_1,
                            sourceMap: maptext_1
                        };
                    }
                    return file.output;
                };
                return Transpiler;
            }());
            logger$5 = new Logger({ debug: false });
            Resolver = (function () {
                function Resolver(host, resolve, lookup) {
                    this._host = host;
                    this._resolve = resolve;
                    this._lookup = lookup;
                    this._declarationFiles = [];
                }
                Resolver.prototype.resolve = function (sourceName, options) {
                    var _this = this;
                    var file = this._host.getSourceFile(sourceName);
                    if (!file)
                        throw new Error("file [" + sourceName + "] has not been added");
                    if (!file.pendingDependencies) {
                        var info = typescript_1.preProcessFile(file.text, true);
                        file.isLibFile = info.isLibFile;
                        file.pendingDependencies = this.resolveDependencies(sourceName, info, options)
                            .then(function (mappings) {
                            var deps = Object.keys(mappings)
                                .map(function (key) { return mappings[key]; })
                                .filter(function (res) { return isTypescript(res); });
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
                Resolver.prototype.resolveDependencies = function (sourceName, info, options) {
                    var _this = this;
                    var resolvedReferences = info.referencedFiles
                        .map(function (ref) { return _this.resolveReference(ref.fileName, sourceName, options); });
                    var resolvedTypes = info.typeReferenceDirectives
                        .map(function (typ) { return _this.resolveTypeReference(typ.fileName, sourceName, options); });
                    var resolvedImports = info.importedFiles
                        .map(function (imp) { return _this.resolveImport(imp.fileName, sourceName, options); });
                    var resolvedExternals = info.ambientExternalModules && info.ambientExternalModules
                        .map(function (ext) { return _this.resolveImport(ext, sourceName, options); });
                    var refs = []
                        .concat(info.referencedFiles)
                        .concat(info.typeReferenceDirectives)
                        .concat(info.importedFiles)
                        .map(function (pre) { return pre.fileName; })
                        .concat(info.ambientExternalModules);
                    var deps = []
                        .concat(resolvedReferences)
                        .concat(resolvedTypes)
                        .concat(resolvedImports)
                        .concat(resolvedExternals);
                    return Promise.all(deps)
                        .then(function (resolved) {
                        return refs.reduce(function (result, ref, idx) {
                            result[ref] = resolved[idx];
                            return result;
                        }, {});
                    });
                };
                Resolver.prototype.resolveReference = function (referenceName, sourceName, options) {
                    if (isAmbient(referenceName)) {
                        referenceName = "./" + referenceName;
                    }
                    return this._resolve(referenceName, sourceName);
                };
                Resolver.prototype.resolveTypeReference = function (referenceName, sourceName, options) {
                    return this.lookupAtType(referenceName, sourceName, options);
                };
                Resolver.prototype.resolveImport = function (importName, sourceName, options) {
                    return __awaiter(this, void 0, void 0, function () {
                        var address, atTypeAddress, typingAddress;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (isRelative(importName) && isTypescriptDeclaration(sourceName) && !isTypescriptDeclaration(importName))
                                        importName = importName + ".d.ts";
                                    return [4, this._resolve(importName, sourceName)];
                                case 1:
                                    address = _a.sent();
                                    if (!!isTypescript(address))
                                        return [3, 4];
                                    return [4, this.lookupAtType(importName, sourceName, options)];
                                case 2:
                                    atTypeAddress = _a.sent();
                                    if (atTypeAddress)
                                        return [2, atTypeAddress];
                                    return [4, this.lookupTyping(importName, sourceName, address, options)];
                                case 3:
                                    typingAddress = _a.sent();
                                    if (typingAddress)
                                        return [2, typingAddress];
                                    _a.label = 4;
                                case 4: return [2, address];
                            }
                        });
                    });
                };
                Resolver.prototype.lookupTyping = function (importName, sourceName, address, options) {
                    return __awaiter(this, void 0, void 0, function () {
                        var packageName, packageTypings, importTypings, metadata;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    packageName = this.getPackageName(importName);
                                    packageTypings = options.typings[packageName];
                                    importTypings = options.typings[importName];
                                    if (!importTypings)
                                        return [3, 1];
                                    return [2, this.resolveTyping(importTypings, packageName, sourceName, address)];
                                case 1:
                                    if (!packageTypings)
                                        return [3, 2];
                                    return [2, this.resolveTyping(true, packageName, sourceName, address)];
                                case 2: return [4, this._lookup(address)];
                                case 3:
                                    metadata = _a.sent();
                                    return [2, this.resolveTyping(metadata.typings, packageName, sourceName, address)];
                            }
                        });
                    });
                };
                Resolver.prototype.getPackageName = function (importName) {
                    var packageParts = importName.split('/');
                    if ((packageParts[0].indexOf('@') === 0) && (packageParts.length > 1)) {
                        return packageParts[0] + '/' + packageParts[1];
                    }
                    else {
                        return packageParts[0];
                    }
                };
                Resolver.prototype.resolveTyping = function (typings, packageName, sourceName, address) {
                    return __awaiter(this, void 0, void 0, function () {
                        var typingsName;
                        return __generator(this, function (_a) {
                            if (typings === true) {
                                return [2, convertToDts(address)];
                            }
                            else if (typeof (typings) === 'string') {
                                typingsName = isRelative(typings) ? typings.slice(2) : typings;
                                return [2, this._resolve(packageName + '/' + typingsName, sourceName)];
                            }
                            else if (typings) {
                                throw new Error("invalid 'typings' value [" + typings + "] [" + address + "]");
                            }
                            else {
                                return [2, undefined];
                            }
                            return [2];
                        });
                    });
                };
                Resolver.prototype.lookupAtType = function (importName, sourceName, options) {
                    return __awaiter(this, void 0, void 0, function () {
                        var packageName, resolved;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    packageName = this.getPackageName(importName);
                                    if (options.types.indexOf(packageName) < 0)
                                        return [2, undefined];
                                    return [4, this._resolve('@types/' + packageName, sourceName)];
                                case 1:
                                    resolved = _a.sent();
                                    if (isJavaScript(resolved))
                                        resolved = resolved.slice(0, -3);
                                    if (!isTypescriptDeclaration(resolved))
                                        resolved = resolved + '/index.d.ts';
                                    return [2, resolved];
                            }
                        });
                    });
                };
                return Resolver;
            }());
            logger$6 = new Logger({ debug: false });
            TypeChecker = (function () {
                function TypeChecker(host) {
                    this._host = host;
                }
                TypeChecker.prototype.getTypeCheckOptions = function (options) {
                    var result = typescript_1.clone(options);
                    result.inlineSourceMap = false;
                    result.sourceMap = false;
                    result.declaration = false;
                    result.isolatedModules = false;
                    result.skipDefaultLibCheck = true;
                    return result;
                };
                TypeChecker.prototype.check = function (options) {
                    var typeCheckOptions = this.getTypeCheckOptions(options);
                    var candidates = this.getCandidates(false);
                    if (candidates.some(function (candidate) { return !candidate.file.checked && candidate.checkable && !isTypescriptDeclaration(candidate.name); }))
                        return this.getAllDiagnostics(candidates, typeCheckOptions);
                    else
                        return [];
                };
                TypeChecker.prototype.forceCheck = function (options) {
                    var typeCheckOptions = this.getTypeCheckOptions(options);
                    var candidates = this.getCandidates(true);
                    if (candidates.some(function (candidate) { return !candidate.file.checked; }))
                        return this.getAllDiagnostics(candidates, typeCheckOptions);
                    else
                        return [];
                };
                TypeChecker.prototype.getFileDiagnostics = function (fileName) {
                    return this._host.getSourceFile(fileName).diags;
                };
                TypeChecker.prototype.hasErrors = function () {
                    return this._host.getAllFiles()
                        .some(function (file) { return file.checked && hasError(file.diags); });
                };
                TypeChecker.prototype.getCandidates = function (force) {
                    var _this = this;
                    var candidates = this._host
                        .getAllFiles()
                        .map(function (file) {
                        return ({
                            name: file.fileName,
                            file: file,
                            seen: false,
                            resolved: !!file.dependencies,
                            checkable: force || undefined,
                            deps: file.dependencies && file.dependencies.list
                        });
                    });
                    if (!force) {
                        var candidatesMap_1 = candidates.reduce(function (result, candidate) {
                            result[candidate.name] = candidate;
                            return result;
                        }, {});
                        candidates.forEach(function (candidate) { return candidate.checkable = _this.isCheckable(candidate, candidatesMap_1); });
                    }
                    return candidates;
                };
                TypeChecker.prototype.isCheckable = function (candidate, candidatesMap) {
                    var _this = this;
                    if (!candidate)
                        return false;
                    else {
                        if (!candidate.seen) {
                            candidate.seen = true;
                            candidate.checkable = candidate.resolved && candidate.deps.every(function (dep) { return _this.isCheckable(candidatesMap[dep], candidatesMap); });
                        }
                        return (candidate.checkable !== false);
                    }
                };
                TypeChecker.prototype.getAllDiagnostics = function (candidates, typeCheckOptions) {
                    var filelist = candidates.map(function (dep) { return dep.name; });
                    var program = typescript_1.createProgram(filelist, typeCheckOptions, this._host);
                    return candidates.reduce(function (diags, candidate) {
                        if (candidate.checkable && !candidate.file.checked) {
                            candidate.file.diags = [];
                            if (!candidate.file.isLibFile) {
                                candidate.file.diags = program.getSyntacticDiagnostics(candidate.file)
                                    .concat(program.getSemanticDiagnostics(candidate.file));
                            }
                            candidate.file.checked = true;
                            return diags.concat(candidate.file.diags);
                        }
                        else {
                            return diags;
                        }
                    }, program.getGlobalDiagnostics());
                };
                return TypeChecker;
            }());
            logger$1 = new Logger({ debug: false });
            logger = new Logger({ debug: false });
            factory = null;
        }
    };
});
