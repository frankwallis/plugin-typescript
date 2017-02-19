/* */
import ts from 'typescript'

export function isAbsolute(filename: string) {
	return (filename[0] === '/')
}

export function isRelative(filename: string) {
	return (filename[0] === '.')
}

export function isAmbientImport(filename: string) {
	return (isAmbient(filename) && !isTypescriptDeclaration(filename))
}

export function isAmbientReference(filename: string) {
	return (isAmbient(filename) && isTypescriptDeclaration(filename))
}

export function isAmbient(filename: string) {
	return (!isRelative(filename) && !isAbsolute(filename))
}

const typescriptRegex = /\.tsx?$/i
export function isTypescript(filename: string) {
	return typescriptRegex.test(filename)
}

const javascriptRegex = /\.js$/i
export function isJavaScript(filename: string) {
	return javascriptRegex.test(filename)
}

const jsxRegex = /\.jsx$/i
export function isJSX(filename: string) {
	return jsxRegex.test(filename)
}

const mapRegex = /\.map$/i
export function isSourceMap(filename: string) {
	return mapRegex.test(filename)
}

const declarationRegex = /\.d\.tsx?$/i
export function isTypescriptDeclaration(filename: string) {
	return declarationRegex.test(filename)
}

const jsonRegex = /\.json$/i
export function isJson(filename: string) {
	return jsonRegex.test(filename)
}

export function tsToJs(tsFile: string) {
	return tsFile.replace(typescriptRegex, '.js')
}

export function tsToJsMap(tsFile: string) {
	return tsFile.replace(typescriptRegex, '.js.map')
}

const convertRegex = /\.[^\.]+$/
export function convertToDts(anyFile: string) {
	return anyFile.replace(convertRegex, '.d.ts')
}

export function getExtension(normalized: string) {
	const baseName = (ts as any).getBaseFileName(normalized)
	const parts = baseName.split('.')
	return parts.length > 1 ? parts.pop() : undefined
}

export function stripDoubleExtension(normalized: string) {
	const parts = normalized.split('.')

	if (parts.length > 1) {
		const extensions = ["js", "jsx", "ts", "tsx", "json"]

		if (extensions.indexOf(parts[parts.length - 2]) >= 0) {
			return parts.slice(0, -1).join('.')
		}
	}
	return normalized
}

export function hasError(diags: Array<ts.Diagnostic>): boolean {
	return diags.some(diag => (diag.category === ts.DiagnosticCategory.Error))
}
