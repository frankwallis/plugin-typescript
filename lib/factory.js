/* */
var ts = require('typescript');
var logger_1 = require('./logger');
var compiler_host_1 = require('./compiler-host');
var transpiler_1 = require('./transpiler');
var type_checker_1 = require('./type-checker');
var format_errors_1 = require('./format-errors');
var utils_1 = require("./utils");
let logger = new logger_1.default({ debug: false });
function createFactory(options, _resolve, _fetch) {
    options = options || {};
    if (options.tsconfig) {
        let tsconfig = (options.tsconfig === true) ? "tsconfig.json" : options.tsconfig;
        return _resolve(tsconfig)
            .then(tsconfigAddress => {
            return _fetch(tsconfigAddress)
                .then(tsconfigText => {
                return { tsconfigAddress, tsconfigText };
            });
        })
            .then(({ tsconfigAddress, tsconfigText }) => {
            //let result = ts.parseConfigFileText ? ts.parseConfigFileText(tsconfigAddress, tsconfigText) : ts.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);
            let result = ts.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);
            if (result.error) {
                format_errors_1.formatErrors([result.error], logger);
                throw new Error(`failed to load tsconfig from ${tsconfigAddress}`);
            }
            let config = Object.assign(result.config.compilerOptions, options);
            let files = result.config.files || [];
            return createServices(config, _resolve, _fetch)
                .then(services => {
                let resolutions = files
                    .filter(filename => utils_1.isTypescriptDeclaration(filename))
                    .map(filename => _resolve(filename, tsconfigAddress));
                return Promise.all(resolutions)
                    .then(resolvedFiles => {
                    resolvedFiles.forEach(resolvedFile => {
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
    let host = new compiler_host_1.CompilerHost(config);
    let transpiler = new transpiler_1.Transpiler(host);
    let typeChecker = undefined;
    if (config.typeCheck) {
        typeChecker = new type_checker_1.TypeChecker(host, _resolve, _fetch);
        return _resolve(host.getDefaultLibFileName())
            .then(defaultLibAddress => {
            typeChecker.registerDeclarationFile(defaultLibAddress, true);
            return { transpiler, typeChecker, host };
        });
    }
    else {
        return Promise.resolve({ transpiler, typeChecker, host });
    }
}
