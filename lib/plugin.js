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
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
    function convertErrors(diags) {
        return diags.reduce(function (result, diag) {
            var locationText = undefined;
            if (diag.file) {
                var position = diag.file.getLineAndCharacterOfPosition(diag.start);
                var filename = diag.file.fileName;
                locationText = filename + ":" + (position.line + 1) + ":" + (position.character + 1);
            }
            var messageText = typescript_1["default"].flattenDiagnosticMessageText(diag.messageText, "\n");
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
            var write = (error.category === typescript_1["default"].DiagnosticCategory.Error) ? logger.error : logger.warn;
            if (error.locationText)
                write(error.locationText);
            write(error.messageText);
        });
    }
    function formatErrors(diags, logger) {
        var errors = convertErrors(diags);
        outputErrors(errors, logger);
    }
    function resolveOptions(globalOptions, fileOptions, fileAddress, fetchJson) {
        return __awaiter(this, void 0, void 0, function () {
            var globalTsconfigOptions, fileTsconfigOptions, mergedOptions, finalOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, loadTsconfigOptions(globalOptions, '', fetchJson)];
                    case 1:
                        globalTsconfigOptions = _a.sent();
                        return [4, loadTsconfigOptions(fileOptions, fileAddress, fetchJson)];
                    case 2:
                        fileTsconfigOptions = _a.sent();
                        mergedOptions = __assign({}, globalTsconfigOptions, globalOptions, fileTsconfigOptions, fileOptions);
                        finalOptions = parseOptions(mergedOptions);
                        validateOptions(finalOptions);
                        return [2, finalOptions];
                }
            });
        });
    }
    function loadTsconfigOptions(options, parentAddress, fetchJson) {
        return __awaiter(this, void 0, void 0, function () {
            var tsconfigName, tsconfigText, result, extendedTsconfig, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tsconfigName = options && options.tsconfig;
                        if (tsconfigName === true)
                            tsconfigName = 'tsconfig.json';
                        if (!tsconfigName)
                            return [3, 7];
                        return [4, fetchJson(tsconfigName, parentAddress)];
                    case 1:
                        tsconfigText = _b.sent();
                        result = typescript_1["default"].parseConfigFileTextToJson(tsconfigName, tsconfigText);
                        if (!result.error)
                            return [3, 2];
                        formatErrors([result.error], logger$2);
                        throw new Error("failed to load tsconfig from " + tsconfigName);
                    case 2:
                        if (!result.config["extends"])
                            return [3, 4];
                        return [4, loadTsconfigOptions(options, result.config["extends"], fetchJson)];
                    case 3:
                        _a = _b.sent();
                        return [3, 5];
                    case 4:
                        _a = undefined;
                        _b.label = 5;
                    case 5:
                        extendedTsconfig = _a;
                        return [2, __assign({}, extendedTsconfig, result.config.compilerOptions)];
                    case 6: return [3, 8];
                    case 7: return [2, undefined];
                    case 8: return [2];
                }
            });
        });
    }
    function parseOptions(options) {
        var result = options || {};
        result.module = getEnum(result.module, typescript_1["default"].ModuleKind, typescript_1["default"].ModuleKind.System);
        result.target = getEnum(result.target, typescript_1["default"].ScriptTarget, typescript_1["default"].ScriptTarget.ES5);
        result.jsx = getEnum(result.jsx, typescript_1["default"].JsxEmit, typescript_1["default"].JsxEmit.None);
        result.allowNonTsExtensions = (result.allowNonTsExtensions !== false);
        result.skipDefaultLibCheck = (result.skipDefaultLibCheck !== false);
        result.noResolve = true;
        result.allowSyntheticDefaultImports = (result.allowSyntheticDefaultImports !== false);
        result.moduleResolution = typescript_1["default"].ModuleResolutionKind.Classic;
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
    function validateOptions(options) {
        if ((options.module !== typescript_1["default"].ModuleKind.System) && (options.module !== typescript_1["default"].ModuleKind.ES2015) && (options.module !== typescript_1["default"].ModuleKind.ESNext)) {
            logger$2.warn("transpiling to " + typescript_1["default"].ModuleKind[options.module] + ", consider setting module: \"system\" in typescriptOptions to transpile directly to System.register format");
        }
        if (options['supportHtmlImports']) {
            logger$2.warn("The 'supportHtmlImports' option is no longer supported");
        }
        if (options['resolveAmbientRefs']) {
            logger$2.warn("The 'resolveAmbientRefs' option is no longer supported");
        }
        if (options['targetLib']) {
            logger$2.warn("The 'targetLib' option is no longer supported");
        }
        if (options['typeCheck']) {
            logger$2.error("The 'typeCheck' option is no longer supported");
        }
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
    function isJson(filename) {
        return jsonRegex.test(filename);
    }
    function hasError(diags) {
        return diags.some(function (diag) { return (diag.category === typescript_1["default"].DiagnosticCategory.Error); });
    }
    function transpile(sourceName, options, host) {
        logger$3.debug("transpiling " + sourceName);
        var file = host.getSourceFile(sourceName);
        if (!file)
            throw new Error("file [" + sourceName + "] has not been added");
        if (!file.output) {
            var transpileOptions = getTranspileOptions(options);
            var program = typescript_1["default"].createProgram([sourceName], transpileOptions, host);
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
    }
    function getTranspileOptions(options) {
        var result = typescript_1["default"].clone(options);
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
    }
    function getHost() {
        var __global = typeof (self) !== 'undefined' ? self : global;
        __global.tsHost = __global.tsHost || new CompilerHost();
        return __global.tsHost;
    }
    function translate(load) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = this;
                        logger.debug("systemjs translating " + load.address);
                        if (isJson(load.address))
                            return [2, load.source];
                        return [4, resolveOptions(load.metadata.typescriptOptions, SystemJS.typescriptOptions, load.address, _fetchJson)];
                    case 1:
                        options = _a.sent();
                        host.addFile(load.address, load.source, options.target);
                        if (isTypescriptDeclaration(load.address)) {
                            load.source = '';
                        }
                        else {
                            result = transpile(load.address, options, host);
                            load.metadata.tserrors = convertErrors(result.diags);
                            outputErrors(load.metadata.tserrors, logger);
                            if (result.failure)
                                throw new Error('TypeScript transpilation failed');
                            load.source = result.js;
                            if (isTypescript(load.address)) {
                                if (options.module === typescript_1["default"].ModuleKind.System)
                                    load.metadata.format = 'register';
                                else if (options.module === typescript_1["default"].ModuleKind.ES2015)
                                    load.metadata.format = 'esm';
                                else if (options.module === typescript_1["default"].ModuleKind.CommonJS)
                                    load.metadata.format = 'cjs';
                                else if (options.module === typescript_1["default"].ModuleKind.AMD)
                                    load.metadata.format = 'amd';
                            }
                            if (result.sourceMap)
                                load.metadata.sourceMap = JSON.parse(result.sourceMap);
                        }
                        return [2, load.source];
                }
            });
        });
    }
    exports_1("translate", translate);
    function instantiate(load, origInstantiate) {
        logger.debug("systemjs instantiating " + load.address);
        return isJson(load.address) ? JSON.parse(load.source) : origInstantiate(load);
    }
    exports_1("instantiate", instantiate);
    function _fetchJson(fileName, parentAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, SystemJS["import"](fileName + '!' + __moduleName, parentAddress)];
                    case 1:
                        json = _a.sent();
                        logger.debug("fetched " + fileName);
                        return [2, JSON.stringify(json)];
                }
            });
        });
    }
    var typescript_1, __assign, Logger, logger$1, CompilerHost, logger$2, typescriptRegex, javascriptRegex, jsxRegex, mapRegex, declarationRegex, jsonRegex, logger$3, logger, host;
    return {
        setters: [
            function (typescript_1_1) {
                typescript_1 = typescript_1_1;
            }
        ],
        execute: function () {
            __assign = Object.assign || function __assign(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
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
            logger$1 = new Logger({ debug: false });
            CompilerHost = (function () {
                function CompilerHost() {
                    this._files = {};
                }
                CompilerHost.prototype.getDefaultLibFileName = function (options) {
                    return this.getDefaultLibFilePaths(options)[0];
                };
                CompilerHost.prototype.getDefaultLibFilePaths = function (options) {
                    return options.lib ? options.lib.map(function (libName) { return "typescript/lib/lib." + libName + ".d.ts"; }) : ['typescript/lib/lib.d.ts'];
                };
                CompilerHost.prototype.useCaseSensitiveFileNames = function () {
                    return false;
                };
                CompilerHost.prototype.getCanonicalFileName = function (fileName) {
                    return typescript_1["default"].normalizePath(fileName);
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
                        this._files[fileName] = typescript_1["default"].createSourceFile(fileName, text, target);
                        logger$1.debug("added " + fileName);
                    }
                    else if (file.text != text) {
                        this._files[fileName] = typescript_1["default"].createSourceFile(fileName, text, target);
                        logger$1.debug("updated " + fileName);
                    }
                    return this._files[fileName];
                };
                return CompilerHost;
            }());
            logger$2 = new Logger({ debug: false });
            typescriptRegex = /\.tsx?$/i;
            javascriptRegex = /\.js$/i;
            jsxRegex = /\.jsx$/i;
            mapRegex = /\.map$/i;
            declarationRegex = /\.d\.tsx?$/i;
            jsonRegex = /\.json$/i;
            logger$3 = new Logger({ debug: false });
            logger = new Logger({ debug: false });
            host = getHost();
        }
    };
});
