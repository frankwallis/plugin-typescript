export function isAbsolute(filename) {
	return (filename[0] == '/');
}

export function isRelative(filename) {
	return (filename[0] == '.');
}

export function isAmbientImport(filename) {
	return (!isRelative(filename) && !isAbsolute(filename) && !isTypescriptDeclaration(filename));
}

export function isTypescript(file) {
	return (/\.ts$/i).test(file);
}

export function isTypescriptDeclaration(file) {
	return (/\.d\.ts$/i).test(file);
}
