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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc3BpbGVyLnRzIl0sIm5hbWVzIjpbIlRyYW5zcGlsZXIiLCJUcmFuc3BpbGVyLmNvbnN0cnVjdG9yIiwiVHJhbnNwaWxlci50cmFuc3BpbGUiXSwibWFwcGluZ3MiOiI7O1FBTU0sTUFBTTs7Ozs7Ozs7Ozs7OztZQUFOLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUU1QztnQkFJQ0Esb0JBQVlBLElBQWtCQTtvQkFDN0JDLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO29CQUNsQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBU0EsRUFBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBRXBEQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFHckNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEtBQUtBLFNBQVNBLENBQUNBO3dCQUN6Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7b0JBRXpEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxLQUFLQSxTQUFTQSxDQUFDQTt3QkFDekNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO29CQUVoQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBR3RDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDbENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO29CQUNwQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsR0FBR0EsU0FBU0EsQ0FBQ0E7b0JBQzlCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxHQUFHQSxTQUFTQSxDQUFDQTtvQkFHbENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO2dCQUM1QkEsQ0FBQ0E7Z0JBRU1ELDhCQUFTQSxHQUFoQkEsVUFBaUJBLFVBQWtCQTtvQkFDbENFLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLGlCQUFlQSxVQUFZQSxDQUFDQSxDQUFDQTtvQkFFMUNBLElBQU1BLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLGFBQWFBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUM5Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7d0JBQUNBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLFdBQVNBLFVBQVVBLHlCQUFzQkEsQ0FBQ0EsQ0FBQ0E7b0JBRXRFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDaEJBLElBQUlBLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO3dCQUV4RUEsSUFBSUEsTUFBTUEsR0FBV0EsU0FBU0EsQ0FBQ0E7d0JBQy9CQSxJQUFJQSxPQUFPQSxHQUFXQSxTQUFTQSxDQUFDQTt3QkFHaENBLElBQU1BLFVBQVVBLEdBQUdBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLFVBQUNBLFVBQVVBLEVBQUVBLE1BQU1BOzRCQUMzREEsRUFBRUEsQ0FBQ0EsQ0FBQ0Esb0JBQVlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO2dDQUMxQkEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3ZEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxtQkFBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7Z0NBQzlCQSxPQUFPQSxHQUFHQSxNQUFNQSxDQUFDQTs0QkFDcEJBLElBQUlBO2dDQUNEQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSwyQkFBeUJBLFVBQVlBLENBQUNBLENBQUFBO3dCQUM1REEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBRUhBLElBQU1BLFdBQVdBLEdBQUdBLFVBQVVBLENBQUNBLFdBQVdBOzZCQUN0Q0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EscUJBQXFCQSxFQUFFQSxDQUFDQTs2QkFDdkNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7d0JBRTlDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQTs0QkFDWEEsT0FBT0EsRUFBRUEsZ0JBQVFBLENBQUNBLFdBQVdBLENBQUNBOzRCQUM5QkEsTUFBTUEsRUFBRUEsV0FBV0E7NEJBQ25CQSxFQUFFQSxFQUFFQSxNQUFNQTs0QkFDVkEsU0FBU0EsRUFBRUEsT0FBT0E7eUJBQ3BCQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7b0JBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO2dCQUN4QkEsQ0FBQ0E7Z0JBQ0ZGLGlCQUFDQTtZQUFEQSxDQUFDQSxBQWpFRCxJQWlFQztZQWpFRCxtQ0FpRUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7Q29tcGlsZXJIb3N0LCBDb21iaW5lZE9wdGlvbnMsIFRyYW5zcGlsZVJlc3VsdH0gZnJvbSAnLi9jb21waWxlci1ob3N0JztcbmltcG9ydCB7aXNKYXZhU2NyaXB0LCBpc1NvdXJjZU1hcCwgaGFzRXJyb3J9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcblxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7IGRlYnVnOiBmYWxzZSB9KTtcblxuZXhwb3J0IGNsYXNzIFRyYW5zcGlsZXIge1xuXHRwcml2YXRlIF9ob3N0OiBDb21waWxlckhvc3Q7XG5cdHByaXZhdGUgX29wdGlvbnM6IENvbWJpbmVkT3B0aW9ucztcblxuXHRjb25zdHJ1Y3Rvcihob3N0OiBDb21waWxlckhvc3QpIHtcblx0XHR0aGlzLl9ob3N0ID0gaG9zdDtcblx0XHR0aGlzLl9vcHRpb25zID0gKDxhbnk+dHMpLmNsb25lKHRoaXMuX2hvc3Qub3B0aW9ucyk7XG5cblx0XHR0aGlzLl9vcHRpb25zLmlzb2xhdGVkTW9kdWxlcyA9IHRydWU7XG5cblx0XHQvKiBhcnJhbmdlIGZvciBhbiBleHRlcm5hbCBzb3VyY2UgbWFwICovXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMuc291cmNlTWFwID09PSB1bmRlZmluZWQpXG5cdFx0XHR0aGlzLl9vcHRpb25zLnNvdXJjZU1hcCA9IHRoaXMuX29wdGlvbnMuaW5saW5lU291cmNlTWFwO1xuXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMuc291cmNlTWFwID09PSB1bmRlZmluZWQpXG5cdFx0XHR0aGlzLl9vcHRpb25zLnNvdXJjZU1hcCA9IHRydWU7XG5cblx0XHR0aGlzLl9vcHRpb25zLmlubGluZVNvdXJjZU1hcCA9IGZhbHNlO1xuXG5cdFx0LyogdGhlc2Ugb3B0aW9ucyBhcmUgaW5jb21wYXRpYmxlIHdpdGggaXNvbGF0ZWRNb2R1bGVzICovXG5cdFx0dGhpcy5fb3B0aW9ucy5kZWNsYXJhdGlvbiA9IGZhbHNlO1xuXHRcdHRoaXMuX29wdGlvbnMubm9FbWl0T25FcnJvciA9IGZhbHNlO1xuXHRcdHRoaXMuX29wdGlvbnMub3V0ID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMuX29wdGlvbnMub3V0RmlsZSA9IHVuZGVmaW5lZDtcblxuXHRcdC8qIHdpdGhvdXQgdGhpcyB3ZSBnZXQgYSAnbGliLmQudHMgbm90IGZvdW5kJyBlcnJvciAqL1xuXHRcdHRoaXMuX29wdGlvbnMubm9MaWIgPSB0cnVlO1xuXHR9XG5cblx0cHVibGljIHRyYW5zcGlsZShzb3VyY2VOYW1lOiBzdHJpbmcpOiBUcmFuc3BpbGVSZXN1bHQge1xuXHRcdGxvZ2dlci5kZWJ1ZyhgdHJhbnNwaWxpbmcgJHtzb3VyY2VOYW1lfWApO1xuICAgICAgXG5cdFx0Y29uc3QgZmlsZSA9IHRoaXMuX2hvc3QuZ2V0U291cmNlRmlsZShzb3VyY2VOYW1lKTsgICAgICBcbiAgICAgIGlmICghZmlsZSkgdGhyb3cgbmV3IEVycm9yKGBmaWxlIFske3NvdXJjZU5hbWV9XSBoYXMgbm90IGJlZW4gYWRkZWRgKTtcbiAgICAgIFxuICAgICAgaWYgKCFmaWxlLm91dHB1dCkge1xuICAgICAgICAgbGV0IHByb2dyYW0gPSB0cy5jcmVhdGVQcm9ncmFtKFtzb3VyY2VOYW1lXSwgdGhpcy5fb3B0aW9ucywgdGhpcy5faG9zdCk7XG5cbiAgICAgICAgIGxldCBqc3RleHQ6IHN0cmluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgIGxldCBtYXB0ZXh0OiBzdHJpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgIC8vIEVtaXRcbiAgICAgICAgIGNvbnN0IGVtaXRSZXN1bHQgPSBwcm9ncmFtLmVtaXQodW5kZWZpbmVkLCAob3V0cHV0TmFtZSwgb3V0cHV0KSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNKYXZhU2NyaXB0KG91dHB1dE5hbWUpKVxuICAgICAgICAgICAgICAganN0ZXh0ID0gb3V0cHV0LnNsaWNlKDAsIG91dHB1dC5sYXN0SW5kZXhPZihcIi8vI1wiKSk7IC8vIHJlbW92ZSBzb3VyY2VNYXBwaW5nVVJMXG4gICAgICAgICAgICBlbHNlIGlmIChpc1NvdXJjZU1hcChvdXRwdXROYW1lKSlcbiAgICAgICAgICAgICAgIG1hcHRleHQgPSBvdXRwdXQ7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgb3VwdXQgZmlsZSAke291dHB1dE5hbWV9YClcbiAgICAgICAgIH0pO1xuXG4gICAgICAgICBjb25zdCBkaWFnbm9zdGljcyA9IGVtaXRSZXN1bHQuZGlhZ25vc3RpY3NcbiAgICAgICAgICAgIC5jb25jYXQocHJvZ3JhbS5nZXRPcHRpb25zRGlhZ25vc3RpY3MoKSlcbiAgICAgICAgICAgIC5jb25jYXQocHJvZ3JhbS5nZXRTeW50YWN0aWNEaWFnbm9zdGljcygpKTtcblxuICAgICAgICAgZmlsZS5vdXRwdXQgPSB7XG4gICAgICAgICAgICBmYWlsdXJlOiBoYXNFcnJvcihkaWFnbm9zdGljcyksXG4gICAgICAgICAgICBlcnJvcnM6IGRpYWdub3N0aWNzLFxuICAgICAgICAgICAganM6IGpzdGV4dCxcbiAgICAgICAgICAgIHNvdXJjZU1hcDogbWFwdGV4dFxuICAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGZpbGUub3V0cHV0O1xuXHR9XG59XG4iXX0=