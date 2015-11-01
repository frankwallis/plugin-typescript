var ts = require('typescript');
var logger_1 = require('./logger');
var utils_1 = require("./utils");
var compiler_host_1 = require("./compiler-host");
var logger = new logger_1.default({ debug: false });
var TypeChecker = (function () {
    function TypeChecker(host, resolve, fetch) {
        this._host = host;
        this._resolve = resolve;
        this._fetch = fetch;
        this._options = Object.assign(this._host.options);
        this._options.inlineSourceMap = false;
        this._options.sourceMap = false;
        this._options.declaration = false;
        this._options.isolatedModules = false;
        this._options.noLibCheck = true;
        this._files = new Map();
        this._declarationFiles = [];
    }
    TypeChecker.prototype.check = function (sourceName, source) {
        var file = this.registerFile(sourceName);
        this.registerSource(sourceName, source);
        return file.errors;
    };
    TypeChecker.prototype.registerDeclarationFile = function (sourceName, isDefaultLib) {
        var file = this.registerFile(sourceName, isDefaultLib);
        this._declarationFiles.push(file);
        return file;
    };
    TypeChecker.prototype.registerFile = function (sourceName, isDefaultLib) {
        var _this = this;
        if (isDefaultLib === void 0) { isDefaultLib = false; }
        if (!this._files[sourceName]) {
            var source = new Deferred();
            if (utils_1.isTypescriptDeclaration(sourceName)) {
                this._fetch(sourceName)
                    .then(function (source) {
                    _this._host.addFile(sourceName, source);
                    _this.registerSource(sourceName, source);
                });
            }
            var loaded = source.promise
                .then(function (source) { return _this.resolveDependencies(sourceName, source); })
                .then(function (depsMap) {
                _this._host.addResolutionMap(sourceName, depsMap);
                _this._files[sourceName].deps = Object.keys(depsMap)
                    .map(function (key) { return depsMap[key]; })
                    .filter(function (res) { return utils_1.isTypescript(res); })
                    .map(function (res) { return _this.registerFile(res); })
                    .concat(_this._declarationFiles);
            });
            var errors = loaded
                .then(function () { return _this.canEmit(_this._files[sourceName]); })
                .then(function () { return _this.getAllDiagnostics(_this._files[sourceName]); });
            this._files[sourceName] = {
                sourceName: sourceName,
                source: source,
                isDefaultLib: isDefaultLib,
                loaded: loaded,
                errors: errors,
                checked: false,
            };
        }
        return this._files[sourceName];
    };
    TypeChecker.prototype.registerSource = function (sourceName, source) {
        if (!this._files[sourceName])
            throw new Error(sourceName + " has not been registered");
        this._files[sourceName].source.resolve(source);
    };
    TypeChecker.prototype.resolveDependencies = function (sourceName, source) {
        var _this = this;
        var info = ts.preProcessFile(source, true);
        var references = info.referencedFiles
            .map(function (ref) {
            if ((utils_1.isAmbient(ref.fileName) && !_this._options.resolveAmbientRefs) || (ref.fileName.indexOf("/") == -1))
                return "./" + ref.fileName;
            else
                return ref.fileName;
        });
        var imports = info.importedFiles
            .map(function (imp) { return imp.fileName; });
        var refs = [].concat(references).concat(imports);
        var deps = refs.map(function (ref) { return _this._resolve(ref, sourceName); });
        return Promise.all(deps)
            .then(function (resolved) {
            return refs.reduce(function (result, ref, idx) {
                result[ref] = resolved[idx];
                return result;
            }, {});
        });
    };
    TypeChecker.prototype.canEmit = function (file, seen) {
        var _this = this;
        seen = seen || [];
        if (seen.indexOf(file) < 0) {
            seen.push(file);
            return file.loaded.then(function () { return Promise.all(file.deps.map(function (dep) { return _this.canEmit(dep, seen); })); });
        }
    };
    TypeChecker.prototype.accumulateDeps = function (file, result) {
        var _this = this;
        result = result || [];
        if (result.indexOf(file) < 0) {
            result.push(file);
            file.deps.forEach(function (dep) { return _this.accumulateDeps(dep, result); });
        }
        return result;
    };
    TypeChecker.prototype.getAllDiagnostics = function (file) {
        var _this = this;
        var deps = this.accumulateDeps(file);
        var filelist = deps.map(function (dep) { return dep.sourceName; }).concat([compiler_host_1.__HTML_MODULE__]);
        var program = ts.createProgram(filelist, this._options, this._host);
        return deps.reduce(function (diags, dep) {
            if (!dep.isDefaultLib && !dep.checked) {
                var sourceFile = _this._host.getSourceFile(dep.sourceName);
                diags = diags
                    .concat(program.getSyntacticDiagnostics(sourceFile))
                    .concat(program.getSemanticDiagnostics(sourceFile));
                dep.checked = true;
            }
            return diags;
        }, program.getGlobalDiagnostics());
    };
    return TypeChecker;
})();
exports.TypeChecker = TypeChecker;
var Deferred = (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    return Deferred;
})();
