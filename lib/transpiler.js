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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc3BpbGVyLnRzIl0sIm5hbWVzIjpbIlRyYW5zcGlsZXIiLCJUcmFuc3BpbGVyLmNvbnN0cnVjdG9yIiwiVHJhbnNwaWxlci50cmFuc3BpbGUiXSwibWFwcGluZ3MiOiI7O1FBTU0sTUFBTTs7Ozs7Ozs7Ozs7OztZQUFOLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUU1QztnQkFJQ0Esb0JBQVlBLElBQWtCQTtvQkFDN0JDLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO29CQUNsQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBU0EsRUFBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBRXBEQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFHckNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEtBQUtBLFNBQVNBLENBQUNBO3dCQUN6Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7b0JBRXpEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxLQUFLQSxTQUFTQSxDQUFDQTt3QkFDekNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO29CQUVoQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBR3RDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDbENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO29CQUNwQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsR0FBR0EsU0FBU0EsQ0FBQ0E7b0JBQzlCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxHQUFHQSxTQUFTQSxDQUFDQTtvQkFHbENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO2dCQUM1QkEsQ0FBQ0E7Z0JBRU1ELDhCQUFTQSxHQUFoQkEsVUFBaUJBLFVBQWtCQTtvQkFDbENFLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLGlCQUFlQSxVQUFZQSxDQUFDQSxDQUFDQTtvQkFFMUNBLElBQU1BLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLGFBQWFBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUM5Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7d0JBQUNBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLFdBQVNBLFVBQVVBLHlCQUFzQkEsQ0FBQ0EsQ0FBQ0E7b0JBRXRFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDaEJBLElBQUlBLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO3dCQUV4RUEsSUFBSUEsTUFBTUEsR0FBV0EsU0FBU0EsQ0FBQ0E7d0JBQy9CQSxJQUFJQSxPQUFPQSxHQUFXQSxTQUFTQSxDQUFDQTt3QkFHaENBLElBQU1BLFVBQVVBLEdBQUdBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLFVBQUNBLFVBQVVBLEVBQUVBLE1BQU1BOzRCQUMzREEsRUFBRUEsQ0FBQ0EsQ0FBQ0Esb0JBQVlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO2dDQUMxQkEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3ZEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxtQkFBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7Z0NBQzlCQSxPQUFPQSxHQUFHQSxNQUFNQSxDQUFDQTs0QkFDcEJBLElBQUlBO2dDQUNEQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSwyQkFBeUJBLFVBQVlBLENBQUNBLENBQUFBO3dCQUM1REEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBRUhBLElBQU1BLFdBQVdBLEdBQUdBLFVBQVVBLENBQUNBLFdBQVdBOzZCQUN0Q0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EscUJBQXFCQSxFQUFFQSxDQUFDQTs2QkFDdkNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7d0JBRTlDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQTs0QkFDWEEsT0FBT0EsRUFBRUEsZ0JBQVFBLENBQUNBLFdBQVdBLENBQUNBOzRCQUM5QkEsTUFBTUEsRUFBRUEsV0FBV0E7NEJBQ25CQSxFQUFFQSxFQUFFQSxNQUFNQTs0QkFDVkEsU0FBU0EsRUFBRUEsT0FBT0E7eUJBQ3BCQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7b0JBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO2dCQUN4QkEsQ0FBQ0E7Z0JBQ0ZGLGlCQUFDQTtZQUFEQSxDQUFDQSxBQWpFRCxJQWlFQztZQWpFRCxtQ0FpRUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qICovXHJcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xyXG5pbXBvcnQge0NvbXBpbGVySG9zdCwgQ29tYmluZWRPcHRpb25zLCBUcmFuc3BpbGVSZXN1bHR9IGZyb20gJy4vY29tcGlsZXItaG9zdCc7XHJcbmltcG9ydCB7aXNKYXZhU2NyaXB0LCBpc1NvdXJjZU1hcCwgaGFzRXJyb3J9IGZyb20gXCIuL3V0aWxzXCI7XHJcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xyXG5cclxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7IGRlYnVnOiBmYWxzZSB9KTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIHtcclxuXHRwcml2YXRlIF9ob3N0OiBDb21waWxlckhvc3Q7XHJcblx0cHJpdmF0ZSBfb3B0aW9uczogQ29tYmluZWRPcHRpb25zO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihob3N0OiBDb21waWxlckhvc3QpIHtcclxuXHRcdHRoaXMuX2hvc3QgPSBob3N0O1xyXG5cdFx0dGhpcy5fb3B0aW9ucyA9ICg8YW55PnRzKS5jbG9uZSh0aGlzLl9ob3N0Lm9wdGlvbnMpO1xyXG5cclxuXHRcdHRoaXMuX29wdGlvbnMuaXNvbGF0ZWRNb2R1bGVzID0gdHJ1ZTtcclxuXHJcblx0XHQvKiBhcnJhbmdlIGZvciBhbiBleHRlcm5hbCBzb3VyY2UgbWFwICovXHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy5zb3VyY2VNYXAgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0dGhpcy5fb3B0aW9ucy5zb3VyY2VNYXAgPSB0aGlzLl9vcHRpb25zLmlubGluZVNvdXJjZU1hcDtcclxuXHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy5zb3VyY2VNYXAgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0dGhpcy5fb3B0aW9ucy5zb3VyY2VNYXAgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuX29wdGlvbnMuaW5saW5lU291cmNlTWFwID0gZmFsc2U7XHJcblxyXG5cdFx0LyogdGhlc2Ugb3B0aW9ucyBhcmUgaW5jb21wYXRpYmxlIHdpdGggaXNvbGF0ZWRNb2R1bGVzICovXHJcblx0XHR0aGlzLl9vcHRpb25zLmRlY2xhcmF0aW9uID0gZmFsc2U7XHJcblx0XHR0aGlzLl9vcHRpb25zLm5vRW1pdE9uRXJyb3IgPSBmYWxzZTtcclxuXHRcdHRoaXMuX29wdGlvbnMub3V0ID0gdW5kZWZpbmVkO1xyXG5cdFx0dGhpcy5fb3B0aW9ucy5vdXRGaWxlID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdC8qIHdpdGhvdXQgdGhpcyB3ZSBnZXQgYSAnbGliLmQudHMgbm90IGZvdW5kJyBlcnJvciAqL1xyXG5cdFx0dGhpcy5fb3B0aW9ucy5ub0xpYiA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdHJhbnNwaWxlKHNvdXJjZU5hbWU6IHN0cmluZyk6IFRyYW5zcGlsZVJlc3VsdCB7XHJcblx0XHRsb2dnZXIuZGVidWcoYHRyYW5zcGlsaW5nICR7c291cmNlTmFtZX1gKTtcclxuICAgICAgXHJcblx0XHRjb25zdCBmaWxlID0gdGhpcy5faG9zdC5nZXRTb3VyY2VGaWxlKHNvdXJjZU5hbWUpOyAgICAgIFxyXG4gICAgICBpZiAoIWZpbGUpIHRocm93IG5ldyBFcnJvcihgZmlsZSBbJHtzb3VyY2VOYW1lfV0gaGFzIG5vdCBiZWVuIGFkZGVkYCk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIWZpbGUub3V0cHV0KSB7XHJcbiAgICAgICAgIGxldCBwcm9ncmFtID0gdHMuY3JlYXRlUHJvZ3JhbShbc291cmNlTmFtZV0sIHRoaXMuX29wdGlvbnMsIHRoaXMuX2hvc3QpO1xyXG5cclxuICAgICAgICAgbGV0IGpzdGV4dDogc3RyaW5nID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICBsZXQgbWFwdGV4dDogc3RyaW5nID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgLy8gRW1pdFxyXG4gICAgICAgICBjb25zdCBlbWl0UmVzdWx0ID0gcHJvZ3JhbS5lbWl0KHVuZGVmaW5lZCwgKG91dHB1dE5hbWUsIG91dHB1dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNKYXZhU2NyaXB0KG91dHB1dE5hbWUpKVxyXG4gICAgICAgICAgICAgICBqc3RleHQgPSBvdXRwdXQuc2xpY2UoMCwgb3V0cHV0Lmxhc3RJbmRleE9mKFwiLy8jXCIpKTsgLy8gcmVtb3ZlIHNvdXJjZU1hcHBpbmdVUkxcclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNTb3VyY2VNYXAob3V0cHV0TmFtZSkpXHJcbiAgICAgICAgICAgICAgIG1hcHRleHQgPSBvdXRwdXQ7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmV4cGVjdGVkIG91cHV0IGZpbGUgJHtvdXRwdXROYW1lfWApXHJcbiAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgY29uc3QgZGlhZ25vc3RpY3MgPSBlbWl0UmVzdWx0LmRpYWdub3N0aWNzXHJcbiAgICAgICAgICAgIC5jb25jYXQocHJvZ3JhbS5nZXRPcHRpb25zRGlhZ25vc3RpY3MoKSlcclxuICAgICAgICAgICAgLmNvbmNhdChwcm9ncmFtLmdldFN5bnRhY3RpY0RpYWdub3N0aWNzKCkpO1xyXG5cclxuICAgICAgICAgZmlsZS5vdXRwdXQgPSB7XHJcbiAgICAgICAgICAgIGZhaWx1cmU6IGhhc0Vycm9yKGRpYWdub3N0aWNzKSxcclxuICAgICAgICAgICAgZXJyb3JzOiBkaWFnbm9zdGljcyxcclxuICAgICAgICAgICAganM6IGpzdGV4dCxcclxuICAgICAgICAgICAgc291cmNlTWFwOiBtYXB0ZXh0XHJcbiAgICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJldHVybiBmaWxlLm91dHB1dDtcclxuXHR9XHJcbn1cclxuIl19