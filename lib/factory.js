System.register(['typescript', './logger', './compiler-host', './transpiler', './resolver', './type-checker', './format-errors', "./utils"], function(exports_1) {
    var ts, logger_1, compiler_host_1, transpiler_1, resolver_1, type_checker_1, format_errors_1, utils_1;
    var logger;
    function createFactory(sjsconfig, _resolve, _fetch) {
        if (sjsconfig === void 0) { sjsconfig = {}; }
        var tsconfigFiles = [];
        var typingsFiles = [];
        return loadOptions(sjsconfig, _resolve, _fetch)
            .then(function (options) {
            return createServices(options, _resolve, _fetch);
        })
            .then(function (services) {
            if (services.options.typeCheck) {
                return resolveDeclarationFiles(services.options, _resolve)
                    .then(function (resolvedFiles) {
                    resolvedFiles.forEach(function (resolvedFile) {
                        services.resolver.registerDeclarationFile(resolvedFile, false);
                    });
                    return services;
                });
            }
            else {
                return services;
            }
        });
    }
    exports_1("createFactory", createFactory);
    function loadOptions(sjsconfig, _resolve, _fetch) {
        if (sjsconfig.tsconfig) {
            var tsconfig = (sjsconfig.tsconfig === true) ? "tsconfig.json" : sjsconfig.tsconfig;
            return _resolve(tsconfig)
                .then(function (tsconfigAddress) {
                return _fetch(tsconfigAddress).then(function (tsconfigText) { return ({ tsconfigText: tsconfigText, tsconfigAddress: tsconfigAddress }); });
            })
                .then(function (_a) {
                var tsconfigAddress = _a.tsconfigAddress, tsconfigText = _a.tsconfigText;
                var ts1 = ts;
                var result = ts1.parseConfigFileText ?
                    ts1.parseConfigFileText(tsconfigAddress, tsconfigText) :
                    ts1.parseConfigFileTextToJson(tsconfigAddress, tsconfigText);
                if (result.error) {
                    format_errors_1.formatErrors([result.error], logger);
                    throw new Error("failed to load tsconfig from " + tsconfigAddress);
                }
                var files = result.config.files;
                return ts.extend(ts.extend({ tsconfigAddress: tsconfigAddress, files: files }, sjsconfig), result.config.compilerOptions);
            });
        }
        else {
            return Promise.resolve(sjsconfig);
        }
    }
    function resolveDeclarationFiles(options, _resolve) {
        var files = options.files || [];
        var declarationFiles = files
            .filter(function (filename) { return utils_1.isTypescriptDeclaration(filename); })
            .map(function (filename) { return _resolve(filename, options.tsconfigAddress); });
        return Promise.all(declarationFiles);
    }
    function createServices(options, _resolve, _fetch) {
        var host = new compiler_host_1.CompilerHost(options);
        var transpiler = new transpiler_1.Transpiler(host);
        var resolver = undefined;
        var typeChecker = undefined;
        if (options.typeCheck) {
            resolver = new resolver_1.Resolver(host, _resolve, _fetch);
            typeChecker = new type_checker_1.TypeChecker(host);
            if (!host.options.noLib) {
                return _resolve('ts', '')
                    .then(function (moduleName) {
                    return _resolve(host.getDefaultLibFileName(), moduleName);
                })
                    .then(function (defaultLibAddress) {
                    resolver.registerDeclarationFile(defaultLibAddress, true);
                    return { host: host, transpiler: transpiler, resolver: resolver, typeChecker: typeChecker, options: options };
                });
            }
        }
        return Promise.resolve({ host: host, transpiler: transpiler, resolver: resolver, typeChecker: typeChecker, options: options });
    }
    return {
        setters:[
            function (ts_1) {
                ts = ts_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (compiler_host_1_1) {
                compiler_host_1 = compiler_host_1_1;
            },
            function (transpiler_1_1) {
                transpiler_1 = transpiler_1_1;
            },
            function (resolver_1_1) {
                resolver_1 = resolver_1_1;
            },
            function (type_checker_1_1) {
                type_checker_1 = type_checker_1_1;
            },
            function (format_errors_1_1) {
                format_errors_1 = format_errors_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            logger = new logger_1.default({ debug: false });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbImNyZWF0ZUZhY3RvcnkiLCJsb2FkT3B0aW9ucyIsInJlc29sdmVEZWNsYXJhdGlvbkZpbGVzIiwiY3JlYXRlU2VydmljZXMiXSwibWFwcGluZ3MiOiI7O1FBVU0sTUFBTTtJQWFaLHVCQUE4QixTQUE2QixFQUFFLFFBQXlCLEVBQUUsTUFBcUI7UUFBL0VBLHlCQUE2QkEsR0FBN0JBLGNBQTZCQTtRQUMxREEsSUFBTUEsYUFBYUEsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDekJBLElBQU1BLFlBQVlBLEdBQUdBLEVBQUVBLENBQUNBO1FBRXhCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxTQUFTQSxFQUFFQSxRQUFRQSxFQUFFQSxNQUFNQSxDQUFDQTthQUM3Q0EsSUFBSUEsQ0FBQ0EsVUFBQUEsT0FBT0E7WUFDWkEsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsT0FBT0EsRUFBRUEsUUFBUUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDbERBLENBQUNBLENBQUNBO2FBQ0RBLElBQUlBLENBQUNBLFVBQUFBLFFBQVFBO1lBQ2JBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNoQ0EsTUFBTUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQSxRQUFRQSxDQUFDQTtxQkFDeERBLElBQUlBLENBQUNBLFVBQUFBLGFBQWFBO29CQUNsQkEsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsWUFBWUE7d0JBQ2pDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSx1QkFBdUJBLENBQUNBLFlBQVlBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO29CQUNoRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ0hBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNB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QkFDMURBLE1BQU1BLENBQUNBLEVBQUNBLE1BQUFBLElBQUlBLEVBQUVBLFlBQUFBLFVBQVVBLEVBQUVBLFVBQUFBLFFBQVFBLEVBQUVBLGFBQUFBLFdBQVdBLEVBQUVBLFNBQUFBLE9BQU9BLEVBQUNBLENBQUNBO2dCQUMzREEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsRUFBQ0EsTUFBQUEsSUFBSUEsRUFBRUEsWUFBQUEsVUFBVUEsRUFBRUEsVUFBQUEsUUFBUUEsRUFBRUEsYUFBQUEsV0FBV0EsRUFBRUEsU0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDNUVBLENBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBcEdLLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHtDb21waWxlckhvc3R9IGZyb20gJy4vY29tcGlsZXItaG9zdCc7XG5pbXBvcnQge1RyYW5zcGlsZXJ9IGZyb20gJy4vdHJhbnNwaWxlcic7XG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tICcuL3Jlc29sdmVyJztcbmltcG9ydCB7VHlwZUNoZWNrZXJ9IGZyb20gJy4vdHlwZS1jaGVja2VyJztcbmltcG9ydCB7Zm9ybWF0RXJyb3JzfSBmcm9tICcuL2Zvcm1hdC1lcnJvcnMnO1xuaW1wb3J0IHtpc1R5cGVzY3JpcHREZWNsYXJhdGlvbn0gZnJvbSBcIi4vdXRpbHNcIjtcblxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7IGRlYnVnOiBmYWxzZSB9KTtcblxudHlwZSBGYWN0b3J5T3V0cHV0ID0ge1xuXHQgaG9zdDogQ29tcGlsZXJIb3N0O1xuXHQgdHJhbnNwaWxlcjogVHJhbnNwaWxlcjtcbiAgICByZXNvbHZlcjogUmVzb2x2ZXI7XG5cdCB0eXBlQ2hlY2tlcjogVHlwZUNoZWNrZXI7XG5cdCBvcHRpb25zOiBQbHVnaW5PcHRpb25zO1xufVxuXG4vKlxuXHRUaGlzIGNvZGUgbG9va3MgYSBsb3QgYmV0dGVyIHdpdGggYXN5bmMgZnVuY3Rpb25zLi4uXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZhY3Rvcnkoc2pzY29uZmlnOiBQbHVnaW5PcHRpb25zID0ge30sIF9yZXNvbHZlOiBSZXNvbHZlRnVuY3Rpb24sIF9mZXRjaDogRmV0Y2hGdW5jdGlvbik6IFByb21pc2U8RmFjdG9yeU91dHB1dD4ge1xuXHRjb25zdCB0c2NvbmZpZ0ZpbGVzID0gW107XG5cdGNvbnN0IHR5cGluZ3NGaWxlcyA9IFtdO1xuXG5cdHJldHVybiBsb2FkT3B0aW9ucyhzanNjb25maWcsIF9yZXNvbHZlLCBfZmV0Y2gpXG5cdFx0LnRoZW4ob3B0aW9ucyA9PiB7XG5cdFx0XHRyZXR1cm4gY3JlYXRlU2VydmljZXMob3B0aW9ucywgX3Jlc29sdmUsIF9mZXRjaCk7XG5cdFx0fSlcblx0XHQudGhlbihzZXJ2aWNlcyA9PiB7XG5cdFx0XHRpZiAoc2VydmljZXMub3B0aW9ucy50eXBlQ2hlY2spIHtcblx0XHRcdFx0cmV0dXJuIHJlc29sdmVEZWNsYXJhdGlvbkZpbGVzKHNlcnZpY2VzLm9wdGlvbnMsIF9yZXNvbHZlKVxuXHRcdFx0XHRcdC50aGVuKHJlc29sdmVkRmlsZXMgPT4ge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZWRGaWxlcy5mb3JFYWNoKHJlc29sdmVkRmlsZSA9PiB7XG5cdFx0XHRcdFx0XHRcdHNlcnZpY2VzLnJlc29sdmVyLnJlZ2lzdGVyRGVjbGFyYXRpb25GaWxlKHJlc29sdmVkRmlsZSwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VydmljZXM7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHNlcnZpY2VzO1xuXHRcdFx0fVxuXHRcdH0pO1xufVxuXG5mdW5jdGlvbiBsb2FkT3B0aW9ucyhzanNjb25maWc6IFBsdWdpbk9wdGlvbnMsIF9yZXNvbHZlOiBSZXNvbHZlRnVuY3Rpb24sIF9mZXRjaDogRmV0Y2hGdW5jdGlvbik6IFByb21pc2U8UGx1Z2luT3B0aW9ucz4ge1xuXHRpZiAoc2pzY29uZmlnLnRzY29uZmlnKSB7XG5cdFx0Y29uc3QgdHNjb25maWcgPSAoc2pzY29uZmlnLnRzY29uZmlnID09PSB0cnVlKSA/IFwidHNjb25maWcuanNvblwiIDogc2pzY29uZmlnLnRzY29uZmlnIGFzIHN0cmluZztcblxuXHRcdHJldHVybiBfcmVzb2x2ZSh0c2NvbmZpZylcblx0XHRcdC50aGVuKHRzY29uZmlnQWRkcmVzcyA9PiB7XG5cdFx0XHRcdHJldHVybiBfZmV0Y2godHNjb25maWdBZGRyZXNzKS50aGVuKHRzY29uZmlnVGV4dCA9PiAoe3RzY29uZmlnVGV4dCwgdHNjb25maWdBZGRyZXNzfSkpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKCh7dHNjb25maWdBZGRyZXNzLCB0c2NvbmZpZ1RleHR9KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHRzMSA9IHRzIGFzIGFueTsgLy8gc3VwcG9ydCBUUyAxLjYuMiBhbmQgPiAxLjdcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdHMxLnBhcnNlQ29uZmlnRmlsZVRleHQgP1xuXHRcdFx0XHRcdHRzMS5wYXJzZUNvbmZpZ0ZpbGVUZXh0KHRzY29uZmlnQWRkcmVzcywgdHNjb25maWdUZXh0KSA6XG5cdFx0XHRcdFx0dHMxLnBhcnNlQ29uZmlnRmlsZVRleHRUb0pzb24odHNjb25maWdBZGRyZXNzLCB0c2NvbmZpZ1RleHQpO1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblx0XHRcdFx0XHRmb3JtYXRFcnJvcnMoW3Jlc3VsdC5lcnJvcl0sIGxvZ2dlcik7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gbG9hZCB0c2NvbmZpZyBmcm9tICR7dHNjb25maWdBZGRyZXNzfWApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgZmlsZXMgPSByZXN1bHQuY29uZmlnLmZpbGVzO1xuXHRcdFx0XHRyZXR1cm4gKDxhbnk+dHMpLmV4dGVuZCgoPGFueT50cykuZXh0ZW5kKHsgdHNjb25maWdBZGRyZXNzLCBmaWxlcyB9LCBzanNjb25maWcpLCByZXN1bHQuY29uZmlnLmNvbXBpbGVyT3B0aW9ucyk7XG5cdFx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHNqc2NvbmZpZyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZURlY2xhcmF0aW9uRmlsZXMob3B0aW9uczogUGx1Z2luT3B0aW9ucywgX3Jlc29sdmU6IFJlc29sdmVGdW5jdGlvbik6IFByb21pc2U8c3RyaW5nW10+IHtcblx0Y29uc3QgZmlsZXMgPSBvcHRpb25zLmZpbGVzIHx8IFtdO1xuXG5cdGxldCBkZWNsYXJhdGlvbkZpbGVzID0gZmlsZXNcblx0XHQuZmlsdGVyKGZpbGVuYW1lID0+IGlzVHlwZXNjcmlwdERlY2xhcmF0aW9uKGZpbGVuYW1lKSlcblx0XHQubWFwKGZpbGVuYW1lID0+IF9yZXNvbHZlKGZpbGVuYW1lLCBvcHRpb25zLnRzY29uZmlnQWRkcmVzcykpO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbDxzdHJpbmc+KGRlY2xhcmF0aW9uRmlsZXMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2aWNlcyhvcHRpb25zOiBQbHVnaW5PcHRpb25zLCBfcmVzb2x2ZTogUmVzb2x2ZUZ1bmN0aW9uLCBfZmV0Y2g6IEZldGNoRnVuY3Rpb24pOiBQcm9taXNlPEZhY3RvcnlPdXRwdXQ+IHtcblx0Y29uc3QgaG9zdCA9IG5ldyBDb21waWxlckhvc3Qob3B0aW9ucyk7XG5cdGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcihob3N0KTtcbiAgIFxuICAgbGV0IHJlc29sdmVyID0gdW5kZWZpbmVkOyBcblx0bGV0IHR5cGVDaGVja2VyID0gdW5kZWZpbmVkO1xuICAgXG5cdGlmIChvcHRpb25zLnR5cGVDaGVjaykge1xuICAgICAgcmVzb2x2ZXIgPSBuZXcgUmVzb2x2ZXIoaG9zdCwgX3Jlc29sdmUsIF9mZXRjaCk7XG5cdFx0dHlwZUNoZWNrZXIgPSBuZXcgVHlwZUNoZWNrZXIoaG9zdCk7XG5cblx0XHRpZiAoIWhvc3Qub3B0aW9ucy5ub0xpYikge1xuXHRcdFx0Ly8gVE9ETyAtIHJlbW92ZSB0aGlzIHdoZW4gX19tb2R1bGVOYW1lIGlzIGF2YWlsYWJsZVxuXHRcdFx0cmV0dXJuIF9yZXNvbHZlKCd0cycsICcnKVxuXHRcdFx0XHQudGhlbihtb2R1bGVOYW1lID0+IHtcblx0XHRcdFx0XHQgcmV0dXJuIF9yZXNvbHZlKGhvc3QuZ2V0RGVmYXVsdExpYkZpbGVOYW1lKCksIG1vZHVsZU5hbWUpXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGRlZmF1bHRMaWJBZGRyZXNzID0+IHtcblx0XHRcdFx0XHRyZXNvbHZlci5yZWdpc3RlckRlY2xhcmF0aW9uRmlsZShkZWZhdWx0TGliQWRkcmVzcywgdHJ1ZSk7XG5cdFx0XHRcdFx0cmV0dXJuIHtob3N0LCB0cmFuc3BpbGVyLCByZXNvbHZlciwgdHlwZUNoZWNrZXIsIG9wdGlvbnN9O1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtob3N0LCB0cmFuc3BpbGVyLCByZXNvbHZlciwgdHlwZUNoZWNrZXIsIG9wdGlvbnN9KTtcbn1cbiJdfQ==