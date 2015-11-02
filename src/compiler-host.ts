/* */
import * as ts from 'typescript';
import Logger from './logger';
import {isHtml} from './utils';

let logger = new Logger({ debug: false });
export let __HTML_MODULE__ = "__html_module__";

export interface CombinedOptions extends PluginOptions, ts.CompilerOptions { };

export class CompilerHost implements ts.CompilerHost {
	private _options: any;
	private _files: Map<string, ts.SourceFile>;
	private _fileResMaps: Map<string, any>;

	constructor(options: any) {
		this._options = options || {};
		this._options.module = this.getEnum(this._options.module, ts.ModuleKind, ts.ModuleKind.System);
		this._options.target = this.getEnum(this._options.target, ts.ScriptTarget, ts.ScriptTarget.ES5);
		this._options.jsx = this.getEnum(this._options.jsx, ts.JsxEmit, ts.JsxEmit.None);
		this._options.allowNonTsExtensions = (this._options.allowNonTsExtensions !== false);

		this._options.noResolve = true;
		this._options.noLib = true;

		this._files = new Map<string, ts.SourceFile>();
		this._fileResMaps = new Map<string, any>();

		// support for importing html templates until
		// https://github.com/Microsoft/TypeScript/issues/2709#issuecomment-91968950 gets implemented
		// note - this only affects type-checking, not runtime!
		this.addFile(__HTML_MODULE__, "var __html__: string = ''; export default __html__;");
	}

	private getEnum<T>(enumValue: any, enumType: any, defaultValue: T): T {
		if (enumValue == undefined) return defaultValue;

		for (var enumProp in enumType) {
			if (enumProp.toLowerCase() === enumValue.toString().toLowerCase()) {
				if (typeof enumType[enumProp] === "string")
					return enumType[enumType[enumProp]];
				else
					return enumType[enumProp];
			}
		}

		throw new Error(`Unrecognised value [${enumValue}]`);
	}

	public get options(): CombinedOptions {
		return this._options;
	}

	public getSourceFile(fileName: string): ts.SourceFile {
		return this._files[fileName];
	}

	public fileExists(fileName: string): boolean {
		return !!this._files[fileName];
	}

	public readFile(fileName: string): string {
		throw new Error("Not implemented");
	}

	public writeFile(name: string, text: string, writeByteOrderMark: boolean) {
		throw new Error("Not implemented");
	}

	public getDefaultLibFileName(): string {
		return "typescript/lib/lib.es6.d.ts";
	}

	public useCaseSensitiveFileNames(): boolean {
		return false;
	}

	public getCanonicalFileName(fileName: string): string {
		return fileName;
	}

	public getCurrentDirectory(): string {
		return "";
	}

	public getNewLine(): string {
		return "\n";
	}

	public addFile(filename: string, text: string) {
		this._files[filename] = ts.createSourceFile(filename, text, this._options.target);

		logger.debug(`added ${filename}`);
		return this._files[filename];
	}

	public addResolutionMap(filename: string, map: Map<string, string>) {
		this._fileResMaps[filename] = map;
	}

	public resolveModuleNames(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
		return moduleNames.map((modName) => {
			if (isHtml(modName))
				return { resolvedFileName: __HTML_MODULE__ };
			else if (this._fileResMaps[containingFile])
				return { resolvedFileName: this._fileResMaps[containingFile][modName] };
			else
				return ts.resolveModuleName(modName, containingFile, this._options, this).resolvedModule;
				// 	throw new Error(`containing file ${containingFile} has not been loaded`);
		});
	}
}
