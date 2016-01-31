System.register(['typescript', "./utils", './logger'], function(exports_1) {
    var ts, utils_1, logger_1;
    var logger, Transpiler;
    return {
        setters:[
            function (ts_1) {
                ts = ts_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            }],
        execute: function() {
            logger = new logger_1.default({ debug: false });
            Transpiler = (function () {
                function Transpiler(host) {
                    this._host = host;
                    this._options = ts.clone(this._host.options);
                    this._options.isolatedModules = true;
                    if (this._options.sourceMap === undefined)
                        this._options.sourceMap = this._options.inlineSourceMap;
                    if (this._options.sourceMap === undefined)
                        this._options.sourceMap = true;
                    this._options.inlineSourceMap = false;
                    this._options.declaration = false;
                    this._options.noEmitOnError = false;
                    this._options.out = undefined;
                    this._options.outFile = undefined;
                    this._options.noLib = true;
                    this._options.outDir = '/__transpiler_output__';
                }
                Transpiler.prototype.transpile = function (sourceName) {
                    logger.debug("transpiling " + sourceName);
                    var file = this._host.getSourceFile(sourceName);
                    if (!file)
                        throw new Error("file [" + sourceName + "] has not been added");
                    if (!file.output) {
                        var program = ts.createProgram([sourceName], this._options, this._host);
                        var jstext = undefined;
                        var maptext = undefined;
                        var emitResult = program.emit(undefined, function (outputName, output) {
                            if (utils_1.isJavaScript(outputName))
                                jstext = output.slice(0, output.lastIndexOf("//#"));
                            else if (utils_1.isSourceMap(outputName))
                                maptext = output;
                            else
                                throw new Error("unexpected ouput file " + outputName);
                        });
                        var diagnostics = emitResult.diagnostics
                            .concat(program.getOptionsDiagnostics())
                            .concat(program.getSyntacticDiagnostics());
                        file.output = {
                            failure: utils_1.hasError(diagnostics),
                            errors: diagnostics,
                            js: jstext,
                            sourceMap: maptext
                        };
                    }
                    return file.output;
                };
                return Transpiler;
            })();
            exports_1("Transpiler", Transpiler);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc3BpbGVyLnRzIl0sIm5hbWVzIjpbIlRyYW5zcGlsZXIiLCJUcmFuc3BpbGVyLmNvbnN0cnVjdG9yIiwiVHJhbnNwaWxlci50cmFuc3BpbGUiXSwibWFwcGluZ3MiOiI7O1FBTU0sTUFBTTs7Ozs7Ozs7Ozs7OztZQUFOLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUU1QztnQkFJQ0Esb0JBQVlBLElBQWtCQTtvQkFDN0JDLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO29CQUNsQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBU0EsRUFBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBRXBEQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFHckNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEtBQUtBLFNBQVNBLENBQUNBO3dCQUN6Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7b0JBRXpEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxLQUFLQSxTQUFTQSxDQUFDQTt3QkFDekNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO29CQUVoQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBR3RDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDbENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO29CQUNwQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsR0FBR0EsU0FBU0EsQ0FBQ0E7b0JBQzlCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxHQUFHQSxTQUFTQSxDQUFDQTtvQkFHbENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO29CQUd2QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsR0FBR0Esd0JBQXdCQSxDQUFDQTtnQkFDckRBLENBQUNBO2dCQUVNRCw4QkFBU0EsR0FBaEJBLFVBQWlCQSxVQUFrQkE7b0JBQ2xDRSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxpQkFBZUEsVUFBWUEsQ0FBQ0EsQ0FBQ0E7b0JBRTFDQSxJQUFNQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxhQUFhQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDOUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO3dCQUFDQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxXQUFTQSxVQUFVQSx5QkFBc0JBLENBQUNBLENBQUNBO29CQUV0RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2hCQSxJQUFJQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTt3QkFFeEVBLElBQUlBLE1BQU1BLEdBQVdBLFNBQVNBLENBQUNBO3dCQUMvQkEsSUFBSUEsT0FBT0EsR0FBV0EsU0FBU0EsQ0FBQ0E7d0JBR2hDQSxJQUFNQSxVQUFVQSxHQUFHQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFDQSxVQUFVQSxFQUFFQSxNQUFNQTs0QkFDM0RBLEVBQUVBLENBQUNBLENBQUNBLG9CQUFZQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtnQ0FDMUJBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBOzRCQUN2REEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsbUJBQVdBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO2dDQUM5QkEsT0FBT0EsR0FBR0EsTUFBTUEsQ0FBQ0E7NEJBQ3BCQSxJQUFJQTtnQ0FDREEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsMkJBQXlCQSxVQUFZQSxDQUFDQSxDQUFBQTt3QkFDNURBLENBQUNBLENBQUNBLENBQUNBO3dCQUVIQSxJQUFNQSxXQUFXQSxHQUFHQSxVQUFVQSxDQUFDQSxXQUFXQTs2QkFDdENBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7NkJBQ3ZDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSx1QkFBdUJBLEVBQUVBLENBQUNBLENBQUNBO3dCQUU5Q0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0E7NEJBQ1hBLE9BQU9BLEVBQUVBLGdCQUFRQSxDQUFDQSxXQUFXQSxDQUFDQTs0QkFDOUJBLE1BQU1BLEVBQUVBLFdBQVdBOzRCQUNuQkEsRUFBRUEsRUFBRUEsTUFBTUE7NEJBQ1ZBLFNBQVNBLEVBQUVBLE9BQU9BO3lCQUNwQkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtnQkFDeEJBLENBQUNBO2dCQUNGRixpQkFBQ0E7WUFBREEsQ0FBQ0EsQUFwRUQsSUFvRUM7WUFwRUQsbUNBb0VDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0NvbXBpbGVySG9zdCwgQ29tYmluZWRPcHRpb25zLCBUcmFuc3BpbGVSZXN1bHR9IGZyb20gJy4vY29tcGlsZXItaG9zdCc7XG5pbXBvcnQge2lzSmF2YVNjcmlwdCwgaXNTb3VyY2VNYXAsIGhhc0Vycm9yfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5cbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoeyBkZWJ1ZzogZmFsc2UgfSk7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIHtcblx0cHJpdmF0ZSBfaG9zdDogQ29tcGlsZXJIb3N0O1xuXHRwcml2YXRlIF9vcHRpb25zOiBDb21iaW5lZE9wdGlvbnM7XG5cblx0Y29uc3RydWN0b3IoaG9zdDogQ29tcGlsZXJIb3N0KSB7XG5cdFx0dGhpcy5faG9zdCA9IGhvc3Q7XG5cdFx0dGhpcy5fb3B0aW9ucyA9ICg8YW55PnRzKS5jbG9uZSh0aGlzLl9ob3N0Lm9wdGlvbnMpO1xuXG5cdFx0dGhpcy5fb3B0aW9ucy5pc29sYXRlZE1vZHVsZXMgPSB0cnVlO1xuXG5cdFx0LyogYXJyYW5nZSBmb3IgYW4gZXh0ZXJuYWwgc291cmNlIG1hcCAqL1xuXHRcdGlmICh0aGlzLl9vcHRpb25zLnNvdXJjZU1hcCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5fb3B0aW9ucy5zb3VyY2VNYXAgPSB0aGlzLl9vcHRpb25zLmlubGluZVNvdXJjZU1hcDtcblxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnNvdXJjZU1hcCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5fb3B0aW9ucy5zb3VyY2VNYXAgPSB0cnVlO1xuXG5cdFx0dGhpcy5fb3B0aW9ucy5pbmxpbmVTb3VyY2VNYXAgPSBmYWxzZTtcblxuXHRcdC8qIHRoZXNlIG9wdGlvbnMgYXJlIGluY29tcGF0aWJsZSB3aXRoIGlzb2xhdGVkTW9kdWxlcyAqL1xuXHRcdHRoaXMuX29wdGlvbnMuZGVjbGFyYXRpb24gPSBmYWxzZTtcblx0XHR0aGlzLl9vcHRpb25zLm5vRW1pdE9uRXJyb3IgPSBmYWxzZTtcblx0XHR0aGlzLl9vcHRpb25zLm91dCA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLl9vcHRpb25zLm91dEZpbGUgPSB1bmRlZmluZWQ7XG5cblx0XHQvKiB3aXRob3V0IHRoaXMgd2UgZ2V0IGEgJ2xpYi5kLnRzIG5vdCBmb3VuZCcgZXJyb3IgKi9cblx0XHR0aGlzLl9vcHRpb25zLm5vTGliID0gdHJ1ZTtcbiAgICAgIFxuICAgICAgLyogcmVkaXJlY3Qgb3V0cHV0IHRvIHByZXZlbnQgJ2Nhbm5vdCBvdmVyd3JpdGUgZXhpc3RpbmcgZmlsZScgZXJyb3Igd2l0aCAuanMgZmlsZXMgKi9cbiAgICAgIHRoaXMuX29wdGlvbnMub3V0RGlyID0gJy9fX3RyYW5zcGlsZXJfb3V0cHV0X18nO1xuXHR9XG5cblx0cHVibGljIHRyYW5zcGlsZShzb3VyY2VOYW1lOiBzdHJpbmcpOiBUcmFuc3BpbGVSZXN1bHQge1xuXHRcdGxvZ2dlci5kZWJ1ZyhgdHJhbnNwaWxpbmcgJHtzb3VyY2VOYW1lfWApO1xuICAgICAgXG5cdFx0Y29uc3QgZmlsZSA9IHRoaXMuX2hvc3QuZ2V0U291cmNlRmlsZShzb3VyY2VOYW1lKTsgICAgICBcbiAgICAgIGlmICghZmlsZSkgdGhyb3cgbmV3IEVycm9yKGBmaWxlIFske3NvdXJjZU5hbWV9XSBoYXMgbm90IGJlZW4gYWRkZWRgKTtcbiAgICAgIFxuICAgICAgaWYgKCFmaWxlLm91dHB1dCkge1xuICAgICAgICAgbGV0IHByb2dyYW0gPSB0cy5jcmVhdGVQcm9ncmFtKFtzb3VyY2VOYW1lXSwgdGhpcy5fb3B0aW9ucywgdGhpcy5faG9zdCk7XG5cbiAgICAgICAgIGxldCBqc3RleHQ6IHN0cmluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgIGxldCBtYXB0ZXh0OiBzdHJpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgIC8vIEVtaXRcbiAgICAgICAgIGNvbnN0IGVtaXRSZXN1bHQgPSBwcm9ncmFtLmVtaXQodW5kZWZpbmVkLCAob3V0cHV0TmFtZSwgb3V0cHV0KSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNKYXZhU2NyaXB0KG91dHB1dE5hbWUpKVxuICAgICAgICAgICAgICAganN0ZXh0ID0gb3V0cHV0LnNsaWNlKDAsIG91dHB1dC5sYXN0SW5kZXhPZihcIi8vI1wiKSk7IC8vIHJlbW92ZSBzb3VyY2VNYXBwaW5nVVJMXG4gICAgICAgICAgICBlbHNlIGlmIChpc1NvdXJjZU1hcChvdXRwdXROYW1lKSlcbiAgICAgICAgICAgICAgIG1hcHRleHQgPSBvdXRwdXQ7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgb3VwdXQgZmlsZSAke291dHB1dE5hbWV9YClcbiAgICAgICAgIH0pO1xuXG4gICAgICAgICBjb25zdCBkaWFnbm9zdGljcyA9IGVtaXRSZXN1bHQuZGlhZ25vc3RpY3NcbiAgICAgICAgICAgIC5jb25jYXQocHJvZ3JhbS5nZXRPcHRpb25zRGlhZ25vc3RpY3MoKSlcbiAgICAgICAgICAgIC5jb25jYXQocHJvZ3JhbS5nZXRTeW50YWN0aWNEaWFnbm9zdGljcygpKTtcblxuICAgICAgICAgZmlsZS5vdXRwdXQgPSB7XG4gICAgICAgICAgICBmYWlsdXJlOiBoYXNFcnJvcihkaWFnbm9zdGljcyksXG4gICAgICAgICAgICBlcnJvcnM6IGRpYWdub3N0aWNzLFxuICAgICAgICAgICAganM6IGpzdGV4dCxcbiAgICAgICAgICAgIHNvdXJjZU1hcDogbWFwdGV4dFxuICAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGZpbGUub3V0cHV0O1xuXHR9XG59XG4iXX0=