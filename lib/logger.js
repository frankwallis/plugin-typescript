var Logger = (function () {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logger;
