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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6WyJMb2dnZXIiLCJMb2dnZXIuY29uc3RydWN0b3IiLCJMb2dnZXIubG9nIiwiTG9nZ2VyLmVycm9yIiwiTG9nZ2VyLndhcm4iLCJMb2dnZXIuZGVidWciXSwibWFwcGluZ3MiOiI7Ozs7O1lBS0E7Z0JBQ0NBLGdCQUFvQkEsT0FBc0JBO29CQUF0QkMsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBZUE7b0JBQ3pDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxPQUFPQSxJQUFJQSxFQUFFQSxDQUFDQTtnQkFDOUJBLENBQUNBO2dCQUVNRCxvQkFBR0EsR0FBVkEsVUFBV0EsR0FBV0E7b0JBQ3JCRSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDaENBLENBQUNBO2dCQUVNRixzQkFBS0EsR0FBWkEsVUFBYUEsR0FBV0E7b0JBQ3ZCRyxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDbENBLENBQUNBO2dCQUVNSCxxQkFBSUEsR0FBWEEsVUFBWUEsR0FBV0E7b0JBQ3RCSSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDakNBLENBQUNBO2dCQUVNSixzQkFBS0EsR0FBWkEsVUFBYUEsR0FBV0E7b0JBQ3ZCSyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDeEJBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO29CQUNoQ0EsQ0FBQ0E7Z0JBQ0ZBLENBQUNBO2dCQUNGTCxhQUFDQTtZQUFEQSxDQUFDQSxBQXRCRCxJQXNCQztZQUVELG9CQUFlLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qICovXG5pbnRlcmZhY2UgTG9nZ2VyT3B0aW9ucyB7XG5cdGRlYnVnPzogYm9vbGVhbjtcbn1cblxuY2xhc3MgTG9nZ2VyIHtcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zOiBMb2dnZXJPcHRpb25zKSB7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0fVxuXG5cdHB1YmxpYyBsb2cobXNnOiBzdHJpbmcpIHtcblx0XHRjb25zb2xlLmxvZyhcIlR5cGVTY3JpcHRcIiwgbXNnKTtcblx0fVxuXG5cdHB1YmxpYyBlcnJvcihtc2c6IHN0cmluZykge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJUeXBlU2NyaXB0XCIsIG1zZyk7XG5cdH1cblxuXHRwdWJsaWMgd2Fybihtc2c6IHN0cmluZykge1xuXHRcdGNvbnNvbGUud2FybihcIlR5cGVTY3JpcHRcIiwgbXNnKTtcblx0fVxuXG5cdHB1YmxpYyBkZWJ1Zyhtc2c6IHN0cmluZykge1xuXHRcdGlmICh0aGlzLm9wdGlvbnMuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiVHlwZVNjcmlwdFwiLCBtc2cpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dnZXI7XG4iXX0=