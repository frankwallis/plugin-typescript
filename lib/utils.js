export function isAbsolute(filename) {
	return (filename[0] == '/');
}

export function isRelative(filename) {
	return (filename[0] == '.');
}