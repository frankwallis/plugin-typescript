System.register(['typescript', './logger', './utils', "./compiler-host"], function(exports_1) {
    var ts, logger_1, utils_1, compiler_host_1;
    var logger, TypeChecker;
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
            },
            function (compiler_host_1_1) {
                compiler_host_1 = compiler_host_1_1;
            }],
        execute: function() {
            logger = new logger_1.default({ debug: false });
            TypeChecker = (function () {
                function TypeChecker(host) {
                    this._host = host;
                    this._options = ts.clone(this._host.options);
                    this._options.inlineSourceMap = false;
                    this._options.sourceMap = false;
                    this._options.declaration = false;
                    this._options.isolatedModules = false;
                    this._options.skipDefaultLibCheck = true;
                }
                TypeChecker.prototype.check = function () {
                    var candidates = this.getCandidates();
                    if (candidates.some(function (candidate) { return candidate.checkable; }))
                        return this.getAllDiagnostics(candidates);
                    else
                        return [];
                };
                TypeChecker.prototype.forceCheck = function () {
                    var files = this._host.getAllFiles();
                    var unchecked = files.filter(function (file) { return !file.checked; });
                    var errored = files.filter(function (file) { return file.checked && utils_1.hasError(file.errors); });
                    if ((errored.length > 0) || (unchecked.length > 0)) {
                        return [{
                                file: undefined,
                                start: undefined,
                                length: undefined,
                                code: 9999,
                                category: ts.DiagnosticCategory.Error,
                                messageText: "compilation failed [" + files.length + " files, " + errored.length + " errored, " + unchecked.length + " unchecked]"
                            }];
                    }
                    return [];
                };
                TypeChecker.prototype.getCandidates = function () {
                    var _this = this;
                    var candidates = this._host.getAllFiles()
                        .filter(function (file) { return file.fileName != compiler_host_1.__HTML_MODULE__; })
                        .map(function (file) { return ({
                        name: file.fileName,
                        file: file,
                        seen: false,
                        resolved: !!file.dependencies,
                        checkable: undefined,
                        deps: file.dependencies && file.dependencies.list
                    }); });
                    var candidatesMap = candidates.reduce(function (result, candidate) {
                        result[candidate.name] = candidate;
                        return result;
                    }, {});
                    candidates.forEach(function (candidate) { return candidate.checkable = _this.isCheckable(candidate, candidatesMap); });
                    return candidates;
                };
                TypeChecker.prototype.isCheckable = function (candidate, candidatesMap) {
                    var _this = this;
                    if (!candidate)
                        return false;
                    else {
                        if (!candidate.seen) {
                            candidate.seen = true;
                            candidate.checkable = candidate.resolved && candidate.deps.every(function (dep) { return _this.isCheckable(candidatesMap[dep], candidatesMap); });
                        }
                        return (candidate.checkable !== false);
                    }
                };
                TypeChecker.prototype.getAllDiagnostics = function (candidates) {
                    var filelist = candidates.map(function (dep) { return dep.name; }).concat([compiler_host_1.__HTML_MODULE__]);
                    var program = ts.createProgram(filelist, this._options, this._host);
                    return candidates.reduce(function (errors, candidate) {
                        if (candidate.checkable && !candidate.file.checked) {
                            if (!candidate.file.isLibFile) {
                                errors = errors
                                    .concat(program.getSyntacticDiagnostics(candidate.file))
                                    .concat(program.getSemanticDiagnostics(candidate.file));
                            }
                            candidate.file.errors = errors;
                            candidate.file.checked = true;
                        }
                        return errors;
                    }, program.getGlobalDiagnostics());
                };
                return TypeChecker;
            })();
            exports_1("TypeChecker", TypeChecker);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS1jaGVja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3R5cGUtY2hlY2tlci50cyJdLCJuYW1lcyI6WyJUeXBlQ2hlY2tlciIsIlR5cGVDaGVja2VyLmNvbnN0cnVjdG9yIiwiVHlwZUNoZWNrZXIuY2hlY2siLCJUeXBlQ2hlY2tlci5mb3JjZUNoZWNrIiwiVHlwZUNoZWNrZXIuZ2V0Q2FuZGlkYXRlcyIsIlR5cGVDaGVja2VyLmlzQ2hlY2thYmxlIiwiVHlwZUNoZWNrZXIuZ2V0QWxsRGlhZ25vc3RpY3MiXSwibWFwcGluZ3MiOiI7O1FBT0ksTUFBTTs7Ozs7Ozs7Ozs7Ozs7OztZQUFOLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQWExQztnQkFJQ0EscUJBQVlBLElBQWtCQTtvQkFDN0JDLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO29CQUVkQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFTQSxFQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtvQkFDeERBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGVBQWVBLEdBQUdBLEtBQUtBLENBQUNBO29CQUN0Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7b0JBQ2hDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDbENBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGVBQWVBLEdBQUdBLEtBQUtBLENBQUNBO29CQUN0Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsbUJBQW1CQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDMUNBLENBQUNBO2dCQUtNRCwyQkFBS0EsR0FBWkE7b0JBQ0tFLElBQU1BLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLGFB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VUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQ0EsR0FBR0EsSUFBS0EsT0FBQUEsR0FBR0EsQ0FBQ0EsSUFBSUEsRUFBUkEsQ0FBUUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsK0JBQWVBLENBQUNBLENBQUNBLENBQUNBO29CQUMvRUEsSUFBSUEsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBRXBFQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFDQSxNQUFNQSxFQUFFQSxTQUFTQTt3QkFDMUNBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBOzRCQUM1Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzdCQSxNQUFNQSxHQUFHQSxNQUFNQTtxQ0FDWEEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtxQ0FDdkRBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLHNCQUFzQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQzlEQSxDQUFDQTs0QkFDREEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0E7NEJBQ3ZDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTt3QkFDL0JBLENBQUNBO3dCQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtvQkFDZkEsQ0FBQ0EsRUFBRUEsT0FBT0EsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDcENBLENBQUNBO2dCQUNGTixrQkFBQ0E7WUFBREEsQ0FBQ0EsQUF4R0QsSUF3R0M7WUF4R0QscUNBd0dDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7aGFzRXJyb3J9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtDb21waWxlckhvc3QsIENvbWJpbmVkT3B0aW9ucywgU291cmNlRmlsZX0gZnJvbSAnLi9jb21waWxlci1ob3N0JztcbmltcG9ydCB7X19IVE1MX01PRFVMRV9ffSBmcm9tIFwiLi9jb21waWxlci1ob3N0XCI7XG5cbmxldCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHsgZGVidWc6IGZhbHNlIH0pO1xuXG50eXBlIENhbmRpZGF0ZSA9IHtcbiAgIG5hbWU6IHN0cmluZztcbiAgIGZpbGU6IFNvdXJjZUZpbGU7ICAgXG4gICBzZWVuOiBib29sZWFuO1xuICAgcmVzb2x2ZWQ6IGJvb2xlYW47XG4gICBkZXBzOiBzdHJpbmdbXTtcbiAgIGNoZWNrYWJsZTogYm9vbGVhbjtcbn1cblxudHlwZSBDYW5kaWRhdGVNYXAgPSB7IFtzOiBzdHJpbmddOiBDYW5kaWRhdGUgfTtcblxuZXhwb3J0IGNsYXNzIFR5cGVDaGVja2VyIHtcblx0cHJpdmF0ZSBfaG9zdDogQ29tcGlsZXJIb3N0O1xuICAgcHJpdmF0ZSBfb3B0aW9uczogQ29tYmluZWRPcHRpb25zO1xuXG5cdGNvbnN0cnVjdG9yKGhvc3Q6IENvbXBpbGVySG9zdCkge1xuXHRcdHRoaXMuX2hvc3QgPSBob3N0O1xuXG4gICAgICB0aGlzLl9vcHRpb25zID0gKDxhbnk+dHMpLmNsb25lKHRoaXMuX2hvc3Qub3B0aW9ucyk7XG5cdFx0dGhpcy5fb3B0aW9ucy5pbmxpbmVTb3VyY2VNYXAgPSBmYWxzZTtcblx0XHR0aGlzLl9vcHRpb25zLnNvdXJjZU1hcCA9IGZhbHNlO1xuXHRcdHRoaXMuX29wdGlvbnMuZGVjbGFyYXRpb24gPSBmYWxzZTtcblx0XHR0aGlzLl9vcHRpb25zLmlzb2xhdGVkTW9kdWxlcyA9IGZhbHNlO1xuXHRcdHRoaXMuX29wdGlvbnMuc2tpcERlZmF1bHRMaWJDaGVjayA9IHRydWU7IC8vIGRvbid0IGNoZWNrIHRoZSBkZWZhdWx0IGxpYiBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXG5cdH1cblxuXHQvKlxuXHRcdHJldHVybnMgYSBwcm9taXNlIHRvIGFuIGFycmF5IG9mIHR5cGVzY3JpcHQgZXJyb3JzIGZvciB0aGlzIGZpbGVcblx0Ki9cblx0cHVibGljIGNoZWNrKCk6IHRzLkRpYWdub3N0aWNbXSB7ICAgICAgICAgXG4gICAgICBjb25zdCBjYW5kaWRhdGVzID0gdGhpcy5nZXRDYW5kaWRhdGVzKCk7XG4gICAgICBpZiAoY2FuZGlkYXRlcy5zb21lKGNhbmRpZGF0ZSA9PiBjYW5kaWRhdGUuY2hlY2thYmxlKSkgICAgICAgICAgICBcbiAgICAgICAgIHJldHVybiB0aGlzLmdldEFsbERpYWdub3N0aWNzKGNhbmRpZGF0ZXMpOyBcbiAgICAgIGVsc2VcbiAgICAgICAgIHJldHVybiBbXTtcblx0fVxuXG5cdC8qXG5cdFx0dGhyb3dzIGlmIHRoZXJlIGFyZSBjb21waWxlciBlcnJvcnMgb3IgdW5yZXNvbHZlZCBmaWxlc1xuXHQqL1xuXHRwdWJsaWMgZm9yY2VDaGVjaygpOiB0cy5EaWFnbm9zdGljW10ge1xuICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLl9ob3N0LmdldEFsbEZpbGVzKCk7XG4gICAgICBjb25zdCB1bmNoZWNrZWQgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiAhZmlsZS5jaGVja2VkKTtcbiAgICAgIGNvbnN0IGVycm9yZWQgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLmNoZWNrZWQgJiYgaGFzRXJyb3IoZmlsZS5lcnJvcnMpKTtcbiAgICAgIFxuICAgICAgaWYgKChlcnJvcmVkLmxlbmd0aCA+IDApIHx8ICh1bmNoZWNrZWQubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3RhcnQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGxlbmd0aDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY29kZTogOTk5OSxcbiAgICAgICAgICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgICAgICAgICBtZXNzYWdlVGV4dDogYGNvbXBpbGF0aW9uIGZhaWxlZCBbJHtmaWxlcy5sZW5ndGh9IGZpbGVzLCAke2Vycm9yZWQubGVuZ3RofSBlcnJvcmVkLCAke3VuY2hlY2tlZC5sZW5ndGh9IHVuY2hlY2tlZF1gXG4gICAgICAgICB9XTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIFtdOyBcblx0fVxuXG4gICBwcml2YXRlIGdldENhbmRpZGF0ZXMoKSB7XG4gICAgICBjb25zdCBjYW5kaWRhdGVzID0gdGhpcy5faG9zdC5nZXRBbGxGaWxlcygpXG4gICAgICAgICAuZmlsdGVyKGZpbGUgPT4gZmlsZS5maWxlTmFtZSAhPSBfX0hUTUxfTU9EVUxFX18pXG4gICAgICAgICAubWFwKGZpbGUgPT4gKHtcbiAgICAgICAgICAgIG5hbWU6IGZpbGUuZmlsZU5hbWUsXG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgc2VlbjogZmFsc2UsXG4gICAgICAgICAgICByZXNvbHZlZDogISFmaWxlLmRlcGVuZGVuY2llcyxcbiAgICAgICAgICAgIGNoZWNrYWJsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGVwczogZmlsZS5kZXBlbmRlbmNpZXMgJiYgZmlsZS5kZXBlbmRlbmNpZXMubGlzdFxuICAgICAgICAgfSkpO1xuICAgICAgXG4gICAgICBjb25zdCBjYW5kaWRhdGVzTWFwID0gY2FuZGlkYXRlcy5yZWR1Y2UoKHJlc3VsdCwgY2FuZGlkYXRlKSA9PiB7XG4gICAgICAgICByZXN1bHRbY2FuZGlkYXRlLm5hbWVdID0gY2FuZGlkYXRlO1xuICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sIHt9IGFzIENhbmRpZGF0ZU1hcCk7XG4gICAgICBcbiAgICAgIGNhbmRpZGF0ZXMuZm9yRWFjaChjYW5kaWRhdGUgPT4gY2FuZGlkYXRlLmNoZWNrYWJsZSA9IHRoaXMuaXNDaGVja2FibGUoY2FuZGlkYXRlLCBjYW5kaWRhdGVzTWFwKSk7XG4gICAgICByZXR1cm4gY2FuZGlkYXRlcztcbiAgIH1cbiAgIFxuICAgcHJpdmF0ZSBpc0NoZWNrYWJsZShjYW5kaWRhdGU6IENhbmRpZGF0ZSwgY2FuZGlkYXRlc01hcDogQ2FuZGlkYXRlTWFwKTogYm9vbGVhbiB7XG4gICAgICBpZiAoIWNhbmRpZGF0ZSlcbiAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICBcbiAgICAgIGVsc2Uge1xuICAgICAgICAgaWYgKCFjYW5kaWRhdGUuc2Vlbikge1xuICAgICAgICAgICAgY2FuZGlkYXRlLnNlZW4gPSB0cnVlO1xuICAgICAgICAgICAgY2FuZGlkYXRlLmNoZWNrYWJsZSA9IGNhbmRpZGF0ZS5yZXNvbHZlZCAmJiBjYW5kaWRhdGUuZGVwcy5ldmVyeShkZXAgPT4gdGhpcy5pc0NoZWNrYWJsZShjYW5kaWRhdGVzTWFwW2RlcF0sIGNhbmRpZGF0ZXNNYXApKTsgICAgICAgICAgICBcbiAgICAgICAgIH1cbiAgICAgICAgIFxuICAgICAgICAgcmV0dXJuIChjYW5kaWRhdGUuY2hlY2thYmxlICE9PSBmYWxzZSk7IC8vIGhhbmRsZXMgY2lyY3VsYXIgZ3JhcGggYmVjYXVzZSBzZWVuID0gdHJ1ZSBidXQgY2hlY2thYmxlID0gdW5kZWZpZW5kXG4gICAgICB9XG4gICB9XG4gICBcblx0Lypcblx0XHRSZXR1cm5zIHRoZSBkaWFnbm9zdGljcyBmb3IgdGhpcyBmaWxlIGFuZCBhbnkgZmlsZXMgd2hpY2ggaXQgdXNlcy5cblx0XHRFYWNoIGZpbGUgaXMgb25seSBjaGVja2VkIG9uY2UuXG5cdCovXG5cdHByaXZhdGUgZ2V0QWxsRGlhZ25vc3RpY3MoY2FuZGlkYXRlczogQ2FuZGlkYXRlW10pOiB0cy5EaWFnbm9zdGljW10ge1xuXHRcdC8vIGhhY2sgdG8gc3VwcG9ydCBodG1sIGltcG9ydHNcbiAgICAgIGxldCBmaWxlbGlzdCA9IGNhbmRpZGF0ZXMubWFwKChkZXApID0+IGRlcC5uYW1lKS5jb25jYXQoW19fSFRNTF9NT0RVTEVfX10pO1xuXHRcdGxldCBwcm9ncmFtID0gdHMuY3JlYXRlUHJvZ3JhbShmaWxlbGlzdCwgdGhpcy5fb3B0aW9ucywgdGhpcy5faG9zdCk7XG5cblx0XHRyZXR1cm4gY2FuZGlkYXRlcy5yZWR1Y2UoKGVycm9ycywgY2FuZGlkYXRlKSA9PiB7XG5cdFx0XHRpZiAoY2FuZGlkYXRlLmNoZWNrYWJsZSAmJiAhY2FuZGlkYXRlLmZpbGUuY2hlY2tlZCkge1xuICAgICAgICAgICAgaWYgKCFjYW5kaWRhdGUuZmlsZS5pc0xpYkZpbGUpIHtcbiAgICAgICAgICAgICAgIGVycm9ycyA9IGVycm9yc1xuICAgICAgICAgICAgICAgICAgLmNvbmNhdChwcm9ncmFtLmdldFN5bnRhY3RpY0RpYWdub3N0aWNzKGNhbmRpZGF0ZS5maWxlKSlcbiAgICAgICAgICAgICAgICAgIC5jb25jYXQocHJvZ3JhbS5nZXRTZW1hbnRpY0RpYWdub3N0aWNzKGNhbmRpZGF0ZS5maWxlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYW5kaWRhdGUuZmlsZS5lcnJvcnMgPSBlcnJvcnM7XG5cdFx0XHRcdGNhbmRpZGF0ZS5maWxlLmNoZWNrZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGVycm9ycztcblx0XHR9LCBwcm9ncmFtLmdldEdsb2JhbERpYWdub3N0aWNzKCkpO1xuXHR9XG59Il19