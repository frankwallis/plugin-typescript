var ts = require('typescript');
var logger_1 = require('./logger');
var compiler_host_1 = require('./compiler-host');
var transpiler_1 = require('./transpiler');
var type_checker_1 = require('./type-checker');
var format_errors_1 = require('./format-errors');
var utils_1 = require("./utils");
var logger = new logger_1.default({ debug: false });
function createFactory(options, _resolve, _fetch) {
    options = options || {};
    if (options.tsconfig) {
        var tsconfig = (options.tsconfig === true) ? "tsconfig.json" : options.tsconfig;
        return _resolve(tsconfig)
            .then(function (tsconfigAddress) {
            return _fetch(tsconfigAddress)
                .then(function (tsconfigText) {
                return { tsconfigAddress: tsconfigAddress, tsconfigText: tsconfigText };
            });
        })
            .then(function (_a) {
            var tsconfigAddress = _a.tsconfigAddress, tsconfigText = _a.tsconfigText;
            var result = ts.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);
            if (result.error) {
                format_errors_1.formatErrors([result.error], logger);
                throw new Error("failed to load tsconfig from " + tsconfigAddress);
            }
            var config = Object.assign(result.config.compilerOptions, options);
            var files = result.config.files || [];
            return createServices(config, _resolve, _fetch)
                .then(function (services) {
                var resolutions = files
                    .filter(function (filename) { return utils_1.isTypescriptDeclaration(filename); })
                    .map(function (filename) { return _resolve(filename, tsconfigAddress); });
                return Promise.all(resolutions)
                    .then(function (resolvedFiles) {
                    resolvedFiles.forEach(function (resolvedFile) {
                        services.typeChecker.registerDeclarationFile(resolvedFile, false);
                    });
                    return services;
                });
            });
        });
    }
    else {
        return createServices(options, _resolve, _fetch);
    }
}
exports.createFactory = createFactory;
function createServices(config, _resolve, _fetch) {
    var host = new compiler_host_1.CompilerHost(config);
    var transpiler = new transpiler_1.Transpiler(host);
    var typeChecker = undefined;
    if (config.typeCheck) {
        typeChecker = new type_checker_1.TypeChecker(host, _resolve, _fetch);
        return _resolve(host.getDefaultLibFileName())
            .then(function (defaultLibAddress) {
            typeChecker.registerDeclarationFile(defaultLibAddress, true);
            return { transpiler: transpiler, typeChecker: typeChecker, host: host };
        });
    }
    else {
        return Promise.resolve({ transpiler: transpiler, typeChecker: typeChecker, host: host });
    }
}
