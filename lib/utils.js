export function isAbsolute(filename) {
	return (filename[0] == '/');
}

export function isRelative(filename) {
	return (filename[0] == '.');
}

export function isAmbientImport(filename) {
	return (isAmbient(filename) && !isTypescriptDeclaration(filename));
}

export function isAmbientReference(filename) {
	return (isAmbient(filename) && isTypescriptDeclaration(filename));
}

export function isAmbient(filename) {
	return (!isRelative(filename) && !isAbsolute(filename));
}

var typescriptRegex = /\.tsx?$/i;
export function isTypescript(file) {
	return typescriptRegex.test(file);
}

var javascriptRegex = /\.js$/i;
export function isJavaScript(file) {
	return javascriptRegex.test(file);
}

var mapRegex = /\.map$/i;
export function isSourceMap(file) {
	return mapRegex.test(file);
}

var declarationRegex = /\.d\.tsx?$/i;
export function isTypescriptDeclaration(file) {
	return declarationRegex.test(file);
}

export function tsToJs(tsFile) {
	return tsFile.replace(typescriptRegex, '.js');
}

export function tsToJsMap(tsFile) {
	return tsFile.replace(typescriptRegex, '.js.map');
}
