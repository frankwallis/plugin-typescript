/* */
import ts from 'typescript'
import Logger from './logger'

const logger = new Logger({ debug: false })

export type TranspileResult = {
	failure: boolean
	diags: Array<ts.Diagnostic>
	js: string
	sourceMap: string
}

export interface SourceFile extends ts.SourceFile {
	output?: TranspileResult
}

export class CompilerHost implements ts.CompilerHost {
	private _files: { [s: string]: SourceFile }

	constructor() {
		this._files = {}
	}

	public getDefaultLibFileName(options: ts.CompilerOptions): string {
		return this.getDefaultLibFilePaths(options)[0]
	}

	public getDefaultLibFilePaths(options: ts.CompilerOptions): string[] {
		return options.lib ? options.lib.map(libName => `typescript/lib/lib.${libName}.d.ts`) : ['typescript/lib/lib.d.ts'];
	}

	public useCaseSensitiveFileNames(): boolean {
		return false
	}

	public getCanonicalFileName(fileName: string): string {
		return (ts as any).normalizePath(fileName)
	}

	public getCurrentDirectory(): string {
		return ""
	}

	public getNewLine(): string {
		return "\n"
	}

	public readFile(fileName: string): string {
		throw new Error("Not implemented")
	}

	public writeFile(name: string, text: string, writeByteOrderMark: boolean) {
		throw new Error("Not implemented")
	}

	public getSourceFile(fileName: string): SourceFile {
		fileName = this.getCanonicalFileName(fileName)
		return this._files[fileName]
	}

	public getAllFiles(): SourceFile[] {
		return Object.keys(this._files).map(key => this._files[key])
	}

	public fileExists(fileName: string): boolean {
		return !!this.getSourceFile(fileName)
	}

	public getDirectories(): string[] {
		throw new Error("Not implemented")
	}

	public addFile(fileName: string, text: string, target: ts.ScriptTarget): SourceFile {
		fileName = this.getCanonicalFileName(fileName)
		const file = this._files[fileName]

		if (!file) {
			this._files[fileName] = ts.createSourceFile(fileName, text, target)
			logger.debug(`added ${fileName}`)
		}
		else if (file.text != text) {
			// create a new one
			this._files[fileName] = ts.createSourceFile(fileName, text, target)
			logger.debug(`updated ${fileName}`)
		}

		return this._files[fileName]
	}
}
