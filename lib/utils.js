/* */
function isAbsolute(filename) {
    return (filename[0] == '/');
}
exports.isAbsolute = isAbsolute;
function isRelative(filename) {
    return (filename[0] == '.');
}
exports.isRelative = isRelative;
function isAmbientImport(filename) {
    return (isAmbient(filename) && !isTypescriptDeclaration(filename));
}
exports.isAmbientImport = isAmbientImport;
function isAmbientReference(filename) {
    return (isAmbient(filename) && isTypescriptDeclaration(filename));
}
exports.isAmbientReference = isAmbientReference;
function isAmbient(filename) {
    return (!isRelative(filename) && !isAbsolute(filename));
}
exports.isAmbient = isAmbient;
var typescriptRegex = /\.tsx?$/i;
function isTypescript(filename) {
    return typescriptRegex.test(filename);
}
exports.isTypescript = isTypescript;
var javascriptRegex = /\.js$/i;
function isJavaScript(filename) {
    return javascriptRegex.test(filename);
}
exports.isJavaScript = isJavaScript;
var mapRegex = /\.map$/i;
function isSourceMap(filename) {
    return mapRegex.test(filename);
}
exports.isSourceMap = isSourceMap;
var declarationRegex = /\.d\.tsx?$/i;
function isTypescriptDeclaration(filename) {
    return declarationRegex.test(filename);
}
exports.isTypescriptDeclaration = isTypescriptDeclaration;
var htmlRegex = /\.html$/i;
function isHtml(filename) {
    return htmlRegex.test(filename);
}
exports.isHtml = isHtml;
function tsToJs(tsFile) {
    return tsFile.replace(typescriptRegex, '.js');
}
exports.tsToJs = tsToJs;
function tsToJsMap(tsFile) {
    return tsFile.replace(typescriptRegex, '.js.map');
}
exports.tsToJsMap = tsToJsMap;
