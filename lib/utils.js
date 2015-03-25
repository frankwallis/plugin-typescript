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

export function isTypescript(file) {
	return (/\.ts$/i).test(file);
}

export function isTypescriptDeclaration(file) {
	return (/\.d\.ts$/i).test(file);
}

export function tsToJs(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js');
}

export function tsToJsMap(tsFile) {
	return tsFile.replace(/\.ts$/i, '.js.map');
}
