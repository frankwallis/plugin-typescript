System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Logger;
    return {
        setters:[],
        execute: function() {
            Logger = (function () {
                function Logger(options) {
                    this.options = options;
                    this.options = options || {};
                }
                Logger.prototype.log = function (msg) {
                    console.log("TypeScript", "[info]", msg);
                };
                Logger.prototype.error = function (msg) {
                    console.error("TypeScript", "[error]", msg);
                };
                Logger.prototype.warn = function (msg) {
                    console.warn("TypeScript", "[warning]", msg);
                };
                Logger.prototype.debug = function (msg) {
                    if (this.options.debug) {
                        console.log("TypeScript", msg);
                    }
                };
                return Logger;
            }());
            exports_1("default",Logger);
        }
    }
});
