/* */
export function isAbsolute(filename: string) {
	return (filename[0] == '/');
}

export function isRelative(filename: string) {
	return (filename[0] == '.');
}

export function isAmbientImport(filename: string) {
	return (isAmbient(filename) && !isTypescriptDeclaration(filename));
}

export function isAmbientReference(filename: string) {
	return (isAmbient(filename) && isTypescriptDeclaration(filename));
}

export function isAmbient(filename: string) {
	return (!isRelative(filename) && !isAbsolute(filename));
}

var typescriptRegex = /\.tsx?$/i;
export function isTypescript(filename: string) {
	return typescriptRegex.test(filename);
}

var javascriptRegex = /\.js$/i;
export function isJavaScript(filename: string) {
	return javascriptRegex.test(filename);
}

var mapRegex = /\.map$/i;
export function isSourceMap(filename: string) {
	return mapRegex.test(filename);
}

var declarationRegex = /\.d\.tsx?$/i;
export function isTypescriptDeclaration(filename: string) {
	return declarationRegex.test(filename);
}

var htmlRegex = /\.html$/i;
export function isHtml(filename: string) {
	return htmlRegex.test(filename);
}

export function tsToJs(tsFile: string) {
	return tsFile.replace(typescriptRegex, '.js');
}

export function tsToJsMap(tsFile: string) {
	return tsFile.replace(typescriptRegex, '.js.map');
}
