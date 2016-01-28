System.register([], function(exports_1) {
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
                    console.log("TypeScript", msg);
                };
                Logger.prototype.error = function (msg) {
                    console.error("TypeScript", msg);
                };
                Logger.prototype.warn = function (msg) {
                    console.warn("TypeScript", msg);
                };
                Logger.prototype.debug = function (msg) {
                    if (this.options.debug) {
                        console.log("TypeScript", msg);
                    }
                };
                return Logger;
            })();
            exports_1("default",Logger);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6WyJMb2dnZXIiLCJMb2dnZXIuY29uc3RydWN0b3IiLCJMb2dnZXIubG9nIiwiTG9nZ2VyLmVycm9yIiwiTG9nZ2VyLndhcm4iLCJMb2dnZXIuZGVidWciXSwibWFwcGluZ3MiOiI7Ozs7O1lBS0E7Z0JBQ0NBLGdCQUFvQkEsT0FBc0JBO29CQUF0QkMsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBZUE7b0JBQ3pDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxPQUFPQSxJQUFJQSxFQUFFQSxDQUFDQTtnQkFDOUJBLENBQUNBO2dCQUVNRCxvQkFBR0EsR0FBVkEsVUFBV0EsR0FBV0E7b0JBQ3JCRSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDaENBLENBQUNBO2dCQUVNRixzQkFBS0EsR0FBWkEsVUFBYUEsR0FBV0E7b0JBQ3ZCRyxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDbENBLENBQUNBO2dCQUVNSCxxQkFBSUEsR0FBWEEsVUFBWUEsR0FBV0E7b0JBQ3RCSSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDakNBLENBQUNBO2dCQUVNSixzQkFBS0EsR0FBWkEsVUFBYUEsR0FBV0E7b0JBQ3ZCSyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDeEJBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO29CQUNoQ0EsQ0FBQ0E7Z0JBQ0ZBLENBQUNBO2dCQUNGTCxhQUFDQTtZQUFEQSxDQUFDQSxBQXRCRCxJQXNCQztZQUVELG9CQUFlLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qICovXHJcbnR5cGUgTG9nZ2VyT3B0aW9ucyA9IHtcclxuXHRkZWJ1Zz86IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIExvZ2dlciB7XHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBMb2dnZXJPcHRpb25zKSB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGxvZyhtc2c6IHN0cmluZykge1xyXG5cdFx0Y29uc29sZS5sb2coXCJUeXBlU2NyaXB0XCIsIG1zZyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZXJyb3IobXNnOiBzdHJpbmcpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoXCJUeXBlU2NyaXB0XCIsIG1zZyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgd2Fybihtc2c6IHN0cmluZykge1xyXG5cdFx0Y29uc29sZS53YXJuKFwiVHlwZVNjcmlwdFwiLCBtc2cpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRlYnVnKG1zZzogc3RyaW5nKSB7XHJcblx0XHRpZiAodGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVHlwZVNjcmlwdFwiLCBtc2cpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9nZ2VyO1xyXG4iXX0=