System.register(['typescript', './logger', "./utils"], function(exports_1) {
    var ts, logger_1, utils_1;
    var logger, Transpiler;
    return {
        setters:[
            function (ts_1) {
                ts = ts_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
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
                Transpiler.prototype.transpile = function (sourceName, source) {
                    logger.debug("transpiling " + sourceName);
                    var sourceFile = this._host.addFile(sourceName, source);
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
                    return {
                        failure: this.hasError(diagnostics),
                        errors: diagnostics,
                        js: jstext,
                        sourceMap: maptext
                    };
                };
                Transpiler.prototype.hasError = function (diags) {
                    return diags.some(function (diag) { return (diag.category === ts.DiagnosticCategory.Error); });
                };
                return Transpiler;
            })();
            exports_1("Transpiler", Transpiler);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc3BpbGVyLnRzIl0sIm5hbWVzIjpbIlRyYW5zcGlsZXIiLCJUcmFuc3BpbGVyLmNvbnN0cnVjdG9yIiwiVHJhbnNwaWxlci50cmFuc3BpbGUiLCJUcmFuc3BpbGVyLmhhc0Vycm9yIl0sIm1hcHBpbmdzIjoiOztRQU1JLE1BQU07Ozs7Ozs7Ozs7Ozs7WUFBTixNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFTMUM7Z0JBSUNBLG9CQUFZQSxJQUFrQkE7b0JBQzdCQyxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFFbEJBLElBQUlBLENBQUNBLFFBQVFBLEdBQVNBLEVBQUdBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO29CQUVwREEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBR3JDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxLQUFLQSxTQUFTQSxDQUFDQTt3QkFDekNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGVBQWVBLENBQUNBO29CQUV6REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsS0FBS0EsU0FBU0EsQ0FBQ0E7d0JBQ3pDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFFaENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGVBQWVBLEdBQUdBLEtBQUtBLENBQUNBO29CQUd0Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsV0FBV0EsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBQ2xDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDcENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEdBQUdBLFNBQVNBLENBQUNBO29CQUM5QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsR0FBR0EsU0FBU0EsQ0FBQ0E7b0JBR2xDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFFNUJBLENBQUNBO2dCQUVNRCw4QkFBU0EsR0FBaEJBLFVBQWlCQSxVQUFrQkEsRUFBRUEsTUFBY0E7b0JBQ2xERSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxpQkFBZUEsVUFBWUEsQ0FBQ0EsQ0FBQ0E7b0JBRTFDQSxJQUFJQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFDeERBLElBQUlBLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUV4RUEsSUFBSUEsTUFBTUEsR0FBV0EsU0FBU0EsQ0FBQ0E7b0JBQy9CQSxJQUFJQSxPQUFPQSxHQUFXQSxTQUFTQSxDQUFDQTtvQkFHaENBLElBQUlBLFVBQVVBLEdBQUdBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLFVBQUNBLFVBQVVBLEVBQUVBLE1BQU1BO3dCQUMzREEsRUFBRUEsQ0FBQ0EsQ0FBQ0Esb0JBQVlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBOzRCQUM1QkEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxtQkFBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7NEJBQ2hDQSxPQUFPQSxHQUFHQSxNQUFNQSxDQUFDQTt3QkFDbEJBLElBQUlBOzRCQUNIQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSwyQkFBeUJBLFVBQVlBLENBQUNBLENBQUFBO29CQUN4REEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRUhBLElBQUlBLFdBQVdBLEdBQUdBLFVBQVVBLENBQUNBLFdBQVdBO3lCQUN0Q0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EscUJBQXFCQSxFQUFFQSxDQUFDQTt5QkFDdkNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBRTVDQSxNQUFNQSxDQUFDQTt3QkFDTkEsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7d0JBQ25DQSxNQUFNQSxFQUFFQSxXQUFXQTt3QkFDbkJBLEVBQUVBLEVBQUVBLE1BQU1BO3dCQUNWQSxTQUFTQSxFQUFFQSxPQUFPQTtxQkFDbEJBLENBQUFBO2dCQUNGQSxDQUFDQTtnQkFFT0YsNkJBQVFBLEdBQWhCQSxVQUFpQkEsS0FBMkJBO29CQUMzQ0csTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBQUEsSUFBSUEsSUFBSUEsT0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsS0FBS0EsRUFBRUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUEvQ0EsQ0FBK0NBLENBQUNBLENBQUFBO2dCQUMzRUEsQ0FBQ0E7Z0JBQ0ZILGlCQUFDQTtZQUFEQSxDQUFDQSxBQWpFRCxJQWlFQztZQWpFRCxtQ0FpRUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7Q29tcGlsZXJIb3N0LCBDb21iaW5lZE9wdGlvbnN9IGZyb20gJy4vY29tcGlsZXItaG9zdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7aXNKYXZhU2NyaXB0LCBpc1NvdXJjZU1hcH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IGxvZ2dlciA9IG5ldyBMb2dnZXIoeyBkZWJ1ZzogZmFsc2UgfSk7XG5cbmludGVyZmFjZSBUcmFuc3BpbGVSZXN1bHQge1xuXHRmYWlsdXJlOiBib29sZWFuO1xuXHRlcnJvcnM6IEFycmF5PHRzLkRpYWdub3N0aWM+O1xuXHRqczogc3RyaW5nO1xuXHRzb3VyY2VNYXA6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zcGlsZXIge1xuXHRwcml2YXRlIF9ob3N0OiBDb21waWxlckhvc3Q7XG5cdHByaXZhdGUgX29wdGlvbnM6IENvbWJpbmVkT3B0aW9ucztcblxuXHRjb25zdHJ1Y3Rvcihob3N0OiBDb21waWxlckhvc3QpIHtcblx0XHR0aGlzLl9ob3N0ID0gaG9zdDtcblxuXHRcdHRoaXMuX29wdGlvbnMgPSAoPGFueT50cykuY2xvbmUodGhpcy5faG9zdC5vcHRpb25zKTtcblxuXHRcdHRoaXMuX29wdGlvbnMuaXNvbGF0ZWRNb2R1bGVzID0gdHJ1ZTtcblxuXHRcdC8qIGFycmFuZ2UgZm9yIGFuIGV4dGVybmFsIHNvdXJjZSBtYXAgKi9cblx0XHRpZiAodGhpcy5fb3B0aW9ucy5zb3VyY2VNYXAgPT09IHVuZGVmaW5lZClcblx0XHRcdHRoaXMuX29wdGlvbnMuc291cmNlTWFwID0gdGhpcy5fb3B0aW9ucy5pbmxpbmVTb3VyY2VNYXA7XG5cblx0XHRpZiAodGhpcy5fb3B0aW9ucy5zb3VyY2VNYXAgPT09IHVuZGVmaW5lZClcblx0XHRcdHRoaXMuX29wdGlvbnMuc291cmNlTWFwID0gdHJ1ZTtcblxuXHRcdHRoaXMuX29wdGlvbnMuaW5saW5lU291cmNlTWFwID0gZmFsc2U7XG5cblx0XHQvKiB0aGVzZSBvcHRpb25zIGFyZSBpbmNvbXBhdGlibGUgd2l0aCBpc29sYXRlZE1vZHVsZXMgKi9cblx0XHR0aGlzLl9vcHRpb25zLmRlY2xhcmF0aW9uID0gZmFsc2U7XG5cdFx0dGhpcy5fb3B0aW9ucy5ub0VtaXRPbkVycm9yID0gZmFsc2U7XG5cdFx0dGhpcy5fb3B0aW9ucy5vdXQgPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5fb3B0aW9ucy5vdXRGaWxlID0gdW5kZWZpbmVkO1xuXG5cdFx0Lyogd2l0aG91dCB0aGlzIHdlIGdldCBhICdsaWIuZC50cyBub3QgZm91bmQnIGVycm9yICovXG5cdFx0dGhpcy5fb3B0aW9ucy5ub0xpYiA9IHRydWU7XG5cblx0fVxuXG5cdHB1YmxpYyB0cmFuc3BpbGUoc291cmNlTmFtZTogc3RyaW5nLCBzb3VyY2U6IHN0cmluZyk6IFRyYW5zcGlsZVJlc3VsdCB7XG5cdFx0bG9nZ2VyLmRlYnVnKGB0cmFuc3BpbGluZyAke3NvdXJjZU5hbWV9YCk7XG5cblx0XHRsZXQgc291cmNlRmlsZSA9IHRoaXMuX2hvc3QuYWRkRmlsZShzb3VyY2VOYW1lLCBzb3VyY2UpO1xuXHRcdGxldCBwcm9ncmFtID0gdHMuY3JlYXRlUHJvZ3JhbShbc291cmNlTmFtZV0sIHRoaXMuX29wdGlvbnMsIHRoaXMuX2hvc3QpO1xuXG5cdFx0bGV0IGpzdGV4dDogc3RyaW5nID0gdW5kZWZpbmVkO1xuXHRcdGxldCBtYXB0ZXh0OiBzdHJpbmcgPSB1bmRlZmluZWQ7XG5cblx0XHQvLyBFbWl0XG5cdFx0bGV0IGVtaXRSZXN1bHQgPSBwcm9ncmFtLmVtaXQodW5kZWZpbmVkLCAob3V0cHV0TmFtZSwgb3V0cHV0KSA9PiB7XG5cdFx0XHRpZiAoaXNKYXZhU2NyaXB0KG91dHB1dE5hbWUpKVxuXHRcdFx0XHRqc3RleHQgPSBvdXRwdXQuc2xpY2UoMCwgb3V0cHV0Lmxhc3RJbmRleE9mKFwiLy8jXCIpKTsgLy8gcmVtb3ZlIHNvdXJjZU1hcHBpbmdVUkxcblx0XHRcdGVsc2UgaWYgKGlzU291cmNlTWFwKG91dHB1dE5hbWUpKVxuXHRcdFx0XHRtYXB0ZXh0ID0gb3V0cHV0O1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgb3VwdXQgZmlsZSAke291dHB1dE5hbWV9YClcblx0XHR9KTtcblxuXHRcdGxldCBkaWFnbm9zdGljcyA9IGVtaXRSZXN1bHQuZGlhZ25vc3RpY3Ncblx0XHRcdC5jb25jYXQocHJvZ3JhbS5nZXRPcHRpb25zRGlhZ25vc3RpY3MoKSlcblx0XHRcdC5jb25jYXQocHJvZ3JhbS5nZXRTeW50YWN0aWNEaWFnbm9zdGljcygpKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmYWlsdXJlOiB0aGlzLmhhc0Vycm9yKGRpYWdub3N0aWNzKSxcblx0XHRcdGVycm9yczogZGlhZ25vc3RpY3MsXG5cdFx0XHRqczoganN0ZXh0LFxuXHRcdFx0c291cmNlTWFwOiBtYXB0ZXh0XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBoYXNFcnJvcihkaWFnczogQXJyYXk8dHMuRGlhZ25vc3RpYz4pOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZGlhZ3Muc29tZShkaWFnID0+IChkaWFnLmNhdGVnb3J5ID09PSB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IpKVxuXHR9XG59XG4iXX0=