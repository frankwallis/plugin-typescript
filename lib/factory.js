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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbImNyZWF0ZUZhY3RvcnkiLCJsb2FkT3B0aW9ucyIsInJlc29sdmVEZWNsYXJhdGlvbkZpbGVzIiwiY3JlYXRlU2VydmljZXMiXSwibWFwcGluZ3MiOiI7O1FBVU0sTUFBTTtJQWFaLHVCQUE4QixTQUE2QixFQUFFLFFBQXlCLEVBQUUsTUFBcUI7UUFBL0VBLHlCQUE2QkEsR0FBN0JBLGNBQTZCQTtRQUMxREEsSUFBTUEsYUFBYUEsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDekJBLElBQU1BLFlBQVlBLEdBQUdBLEVBQUVBLENBQUNBO1FBRXhCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxTQUFTQSxFQUFFQSxRQUFRQSxFQUFFQSxNQUFNQSxDQUFDQTthQUM3Q0EsSUFBSUEsQ0FBQ0EsVUFBQUEsT0FBT0E7WUFDWkEsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsT0FBT0EsRUFBRUEsUUFBUUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDbERBLENBQUNBLENBQUNBO2FBQ0RBLElBQUlBLENBQUNBLFVBQUFBLFFBQVFBO1lBQ2JBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNoQ0EsTUFBTUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQSxRQUFRQSxDQUFDQTtxQkFDeERBLElBQUlBLENBQUNBLFVBQUFBLGFBQWFBO29CQUNsQkEsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsWUFBWUE7d0JBQ2pDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSx1QkFBdUJBLENBQUNBLFlBQVlBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO29CQUNoRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ0hBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNB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QkFDMURBLE1BQU1BLENBQUNBLEVBQUNBLE1BQUFBLElBQUlBLEVBQUVBLFlBQUFBLFVBQVVBLEVBQUVBLFVBQUFBLFFBQVFBLEVBQUVBLGFBQUFBLFdBQVdBLEVBQUVBLFNBQUFBLE9BQU9BLEVBQUNBLENBQUNBO2dCQUMzREEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsRUFBQ0EsTUFBQUEsSUFBSUEsRUFBRUEsWUFBQUEsVUFBVUEsRUFBRUEsVUFBQUEsUUFBUUEsRUFBRUEsYUFBQUEsV0FBV0EsRUFBRUEsU0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDNUVBLENBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBcEdLLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qICovXHJcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xyXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcclxuaW1wb3J0IHtDb21waWxlckhvc3R9IGZyb20gJy4vY29tcGlsZXItaG9zdCc7XHJcbmltcG9ydCB7VHJhbnNwaWxlcn0gZnJvbSAnLi90cmFuc3BpbGVyJztcclxuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSAnLi9yZXNvbHZlcic7XHJcbmltcG9ydCB7VHlwZUNoZWNrZXJ9IGZyb20gJy4vdHlwZS1jaGVja2VyJztcclxuaW1wb3J0IHtmb3JtYXRFcnJvcnN9IGZyb20gJy4vZm9ybWF0LWVycm9ycyc7XHJcbmltcG9ydCB7aXNUeXBlc2NyaXB0RGVjbGFyYXRpb259IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHsgZGVidWc6IGZhbHNlIH0pO1xyXG5cclxudHlwZSBGYWN0b3J5T3V0cHV0ID0ge1xyXG5cdCBob3N0OiBDb21waWxlckhvc3Q7XHJcblx0IHRyYW5zcGlsZXI6IFRyYW5zcGlsZXI7XHJcbiAgICByZXNvbHZlcjogUmVzb2x2ZXI7XHJcblx0IHR5cGVDaGVja2VyOiBUeXBlQ2hlY2tlcjtcclxuXHQgb3B0aW9uczogUGx1Z2luT3B0aW9ucztcclxufVxyXG5cclxuLypcclxuXHRUaGlzIGNvZGUgbG9va3MgYSBsb3QgYmV0dGVyIHdpdGggYXN5bmMgZnVuY3Rpb25zLi4uXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGYWN0b3J5KHNqc2NvbmZpZzogUGx1Z2luT3B0aW9ucyA9IHt9LCBfcmVzb2x2ZTogUmVzb2x2ZUZ1bmN0aW9uLCBfZmV0Y2g6IEZldGNoRnVuY3Rpb24pOiBQcm9taXNlPEZhY3RvcnlPdXRwdXQ+IHtcclxuXHRjb25zdCB0c2NvbmZpZ0ZpbGVzID0gW107XHJcblx0Y29uc3QgdHlwaW5nc0ZpbGVzID0gW107XHJcblxyXG5cdHJldHVybiBsb2FkT3B0aW9ucyhzanNjb25maWcsIF9yZXNvbHZlLCBfZmV0Y2gpXHJcblx0XHQudGhlbihvcHRpb25zID0+IHtcclxuXHRcdFx0cmV0dXJuIGNyZWF0ZVNlcnZpY2VzKG9wdGlvbnMsIF9yZXNvbHZlLCBfZmV0Y2gpO1xyXG5cdFx0fSlcclxuXHRcdC50aGVuKHNlcnZpY2VzID0+IHtcclxuXHRcdFx0aWYgKHNlcnZpY2VzLm9wdGlvbnMudHlwZUNoZWNrKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlc29sdmVEZWNsYXJhdGlvbkZpbGVzKHNlcnZpY2VzLm9wdGlvbnMsIF9yZXNvbHZlKVxyXG5cdFx0XHRcdFx0LnRoZW4ocmVzb2x2ZWRGaWxlcyA9PiB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmVkRmlsZXMuZm9yRWFjaChyZXNvbHZlZEZpbGUgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdHNlcnZpY2VzLnJlc29sdmVyLnJlZ2lzdGVyRGVjbGFyYXRpb25GaWxlKHJlc29sdmVkRmlsZSwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHNlcnZpY2VzO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlcnZpY2VzO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZE9wdGlvbnMoc2pzY29uZmlnOiBQbHVnaW5PcHRpb25zLCBfcmVzb2x2ZTogUmVzb2x2ZUZ1bmN0aW9uLCBfZmV0Y2g6IEZldGNoRnVuY3Rpb24pOiBQcm9taXNlPFBsdWdpbk9wdGlvbnM+IHtcclxuXHRpZiAoc2pzY29uZmlnLnRzY29uZmlnKSB7XHJcblx0XHRjb25zdCB0c2NvbmZpZyA9IChzanNjb25maWcudHNjb25maWcgPT09IHRydWUpID8gXCJ0c2NvbmZpZy5qc29uXCIgOiBzanNjb25maWcudHNjb25maWcgYXMgc3RyaW5nO1xyXG5cclxuXHRcdHJldHVybiBfcmVzb2x2ZSh0c2NvbmZpZylcclxuXHRcdFx0LnRoZW4odHNjb25maWdBZGRyZXNzID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gX2ZldGNoKHRzY29uZmlnQWRkcmVzcykudGhlbih0c2NvbmZpZ1RleHQgPT4gKHt0c2NvbmZpZ1RleHQsIHRzY29uZmlnQWRkcmVzc30pKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LnRoZW4oKHt0c2NvbmZpZ0FkZHJlc3MsIHRzY29uZmlnVGV4dH0pID0+IHtcclxuXHRcdFx0XHRjb25zdCB0czEgPSB0cyBhcyBhbnk7IC8vIHN1cHBvcnQgVFMgMS42LjIgYW5kID4gMS43XHJcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdHMxLnBhcnNlQ29uZmlnRmlsZVRleHQgP1xyXG5cdFx0XHRcdFx0dHMxLnBhcnNlQ29uZmlnRmlsZVRleHQodHNjb25maWdBZGRyZXNzLCB0c2NvbmZpZ1RleHQpIDpcclxuXHRcdFx0XHRcdHRzMS5wYXJzZUNvbmZpZ0ZpbGVUZXh0VG9Kc29uKHRzY29uZmlnQWRkcmVzcywgdHNjb25maWdUZXh0KTtcclxuXHJcblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xyXG5cdFx0XHRcdFx0Zm9ybWF0RXJyb3JzKFtyZXN1bHQuZXJyb3JdLCBsb2dnZXIpO1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBmYWlsZWQgdG8gbG9hZCB0c2NvbmZpZyBmcm9tICR7dHNjb25maWdBZGRyZXNzfWApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgZmlsZXMgPSByZXN1bHQuY29uZmlnLmZpbGVzO1xyXG5cdFx0XHRcdHJldHVybiAoPGFueT50cykuZXh0ZW5kKCg8YW55PnRzKS5leHRlbmQoeyB0c2NvbmZpZ0FkZHJlc3MsIGZpbGVzIH0sIHNqc2NvbmZpZyksIHJlc3VsdC5jb25maWcuY29tcGlsZXJPcHRpb25zKTtcclxuXHRcdFx0fSk7XHJcblx0fVxyXG5cdGVsc2Uge1xyXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShzanNjb25maWcpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZURlY2xhcmF0aW9uRmlsZXMob3B0aW9uczogUGx1Z2luT3B0aW9ucywgX3Jlc29sdmU6IFJlc29sdmVGdW5jdGlvbik6IFByb21pc2U8c3RyaW5nW10+IHtcclxuXHRjb25zdCBmaWxlcyA9IG9wdGlvbnMuZmlsZXMgfHwgW107XHJcblxyXG5cdGxldCBkZWNsYXJhdGlvbkZpbGVzID0gZmlsZXNcclxuXHRcdC5maWx0ZXIoZmlsZW5hbWUgPT4gaXNUeXBlc2NyaXB0RGVjbGFyYXRpb24oZmlsZW5hbWUpKVxyXG5cdFx0Lm1hcChmaWxlbmFtZSA9PiBfcmVzb2x2ZShmaWxlbmFtZSwgb3B0aW9ucy50c2NvbmZpZ0FkZHJlc3MpKTtcclxuXHJcblx0cmV0dXJuIFByb21pc2UuYWxsPHN0cmluZz4oZGVjbGFyYXRpb25GaWxlcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2VzKG9wdGlvbnM6IFBsdWdpbk9wdGlvbnMsIF9yZXNvbHZlOiBSZXNvbHZlRnVuY3Rpb24sIF9mZXRjaDogRmV0Y2hGdW5jdGlvbik6IFByb21pc2U8RmFjdG9yeU91dHB1dD4ge1xyXG5cdGNvbnN0IGhvc3QgPSBuZXcgQ29tcGlsZXJIb3N0KG9wdGlvbnMpO1xyXG5cdGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcihob3N0KTtcclxuICAgXHJcbiAgIGxldCByZXNvbHZlciA9IHVuZGVmaW5lZDsgXHJcblx0bGV0IHR5cGVDaGVja2VyID0gdW5kZWZpbmVkO1xyXG4gICBcclxuXHRpZiAob3B0aW9ucy50eXBlQ2hlY2spIHtcclxuICAgICAgcmVzb2x2ZXIgPSBuZXcgUmVzb2x2ZXIoaG9zdCwgX3Jlc29sdmUsIF9mZXRjaCk7XHJcblx0XHR0eXBlQ2hlY2tlciA9IG5ldyBUeXBlQ2hlY2tlcihob3N0KTtcclxuXHJcblx0XHRpZiAoIWhvc3Qub3B0aW9ucy5ub0xpYikge1xyXG5cdFx0XHQvLyBUT0RPIC0gcmVtb3ZlIHRoaXMgd2hlbiBfX21vZHVsZU5hbWUgaXMgYXZhaWxhYmxlXHJcblx0XHRcdHJldHVybiBfcmVzb2x2ZSgndHMnLCAnJylcclxuXHRcdFx0XHQudGhlbihtb2R1bGVOYW1lID0+IHtcclxuXHRcdFx0XHRcdCByZXR1cm4gX3Jlc29sdmUoaG9zdC5nZXREZWZhdWx0TGliRmlsZU5hbWUoKSwgbW9kdWxlTmFtZSlcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC50aGVuKGRlZmF1bHRMaWJBZGRyZXNzID0+IHtcclxuXHRcdFx0XHRcdHJlc29sdmVyLnJlZ2lzdGVyRGVjbGFyYXRpb25GaWxlKGRlZmF1bHRMaWJBZGRyZXNzLCB0cnVlKTtcclxuXHRcdFx0XHRcdHJldHVybiB7aG9zdCwgdHJhbnNwaWxlciwgcmVzb2x2ZXIsIHR5cGVDaGVja2VyLCBvcHRpb25zfTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoe2hvc3QsIHRyYW5zcGlsZXIsIHJlc29sdmVyLCB0eXBlQ2hlY2tlciwgb3B0aW9uc30pO1xyXG59XHJcbiJdfQ==