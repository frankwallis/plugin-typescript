/* */
import * as ts from 'typescript';
import Logger from './logger';
import {isHtml, isTypescriptDeclaration, isJavaScript} from './utils';

const logger = new Logger({ debug: false });
export const __HTML_MODULE__ = "__html_module__";

export interface CombinedOptions extends PluginOptions, ts.CompilerOptions { };

export type TranspileResult = {
	failure: boolean;
	errors: Array<ts.Diagnostic>;
	js: string;
	sourceMap: string;
}

export interface SourceFile extends ts.SourceFile {
   output?: TranspileResult;
   pendingDependencies?: Promise<DependencyInfo>;
   dependencies?: DependencyInfo;
   errors?: ts.Diagnostic[];
   checked?: boolean;
   isLibFile?: boolean;
}

export class CompilerHost implements ts.CompilerHost {
	private _options: any;
	private _files: { [s: string]: SourceFile; };

	constructor(options: any, builder: boolean = false) {
		this._options = options || {};
		this._options.module = this.getEnum(this._options.module, (<any>ts).ModuleKind, ts.ModuleKind.System);
		this._options.target = this.getEnum(this._options.target, (<any>ts).ScriptTarget, ts.ScriptTarget.ES5);
		this._options.targetLib = this.getEnum(this._options.targetLib, (<any>ts).ScriptTarget, ts.ScriptTarget.ES6);
		this._options.jsx = this.getEnum(this._options.jsx, (<any>ts).JsxEmit, ts.JsxEmit.None);
		this._options.allowNonTsExtensions = (this._options.allowNonTsExtensions !== false);
		this._options.skipDefaultLibCheck = (this._options.skipDefaultLibCheck !== false);
		this._options.noResolve = true;

		// Force module resolution into 'classic' mode, to prevent node module resolution from kicking in
		this._options.moduleResolution = ts.ModuleResolutionKind.Classic;

      // When bundling output es6 modules instead of system to enable rollup support
      // TypeScript currently cannot output ES6 modules with target ES5, see https://github.com/Microsoft/TypeScript/issues/6319
      if (builder) {
         if ((this._options.module === ts.ModuleKind.System) && (this._options.target === ts.ScriptTarget.ES6)) {
            this._options.module = ts.ModuleKind.ES6;
         }
      }
      
		this._files = {};

		// support for importing html templates until
		// https://github.com/Microsoft/TypeScript/issues/2709#issuecomment-91968950 gets implemented
		// note - this only affects type-checking, not runtime!
		const file = this.addFile(__HTML_MODULE__, "var __html__: string = ''; export default __html__;");
      file.dependencies = { list: [], mappings: {} };
      file.checked = true;
      file.errors = [];
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
   
	public getDefaultLibFileName(): string {
      if (this._options.targetLib === ts.ScriptTarget.ES6)
         return "typescript/lib/lib.es6.d.ts";
      else
         return "typescript/lib/lib.d.ts";
	}

	public useCaseSensitiveFileNames(): boolean {
		return false;
	}

	public getCanonicalFileName(fileName: string): string {
		return (ts as any).normalizePath(fileName);
	}

	public getCurrentDirectory(): string {
		return "";
	}

	public getNewLine(): string {
		return "\n";
	}

	public readFile(fileName: string): string {
		throw new Error("Not implemented");
	}

	public writeFile(name: string, text: string, writeByteOrderMark: boolean) {
		throw new Error("Not implemented");
	}

	public getSourceFile(fileName: string): SourceFile {
		fileName = this.getCanonicalFileName(fileName);
		return this._files[fileName];
	}

	public getAllFiles(): SourceFile[] {
      return Object.keys(this._files).map(key => this._files[key]);
	}

	public fileExists(fileName: string): boolean {
		return !!this.getSourceFile(fileName);
	}

	public addFile(fileName: string, text: string): SourceFile {
		fileName = this.getCanonicalFileName(fileName);      
      const file = this._files[fileName];
      
      if (!file) {
		   this._files[fileName] = ts.createSourceFile(fileName, text, this._options.target);
         logger.debug(`added ${fileName}`);         
      }
      else if (file.text != text) {
         // create a new one
         this._files[fileName] = ts.createSourceFile(fileName, text, this._options.target);
         this.invalidate(fileName);
         logger.debug(`updated ${fileName}`);         
      }
		
		return this._files[fileName];
	}

   private invalidate(fileName: string, seen?: string[]) {
      seen = seen || [];
      
      if (seen.indexOf(fileName) < 0) {
         seen.push(fileName);
         
         const file = this._files[fileName];
         
         if (file) {
            file.checked = false;
            file.errors = [];
         }
         
         Object.keys(this._files)
            .map(key => this._files[key])
            .forEach(file => {
               if (file.dependencies && file.dependencies.list.indexOf(fileName) >= 0) {
                  this.invalidate(file.fileName, seen);
               }
            });
      }
   }
   
	/*
		Overrides the standard resolution algorithm used by the compiler so that we can use systemjs
		resolution. Because TypeScript requires synchronous resolution, everything is pre-resolved
		by the type-checker and registered with the host before type-checking.
	*/
	public resolveModuleNames(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
		return moduleNames.map((modName) => {
			const dependencies = this._files[containingFile].dependencies;

			if (isHtml(modName)) {
				return { resolvedFileName: __HTML_MODULE__ };
			}
			else if (dependencies) {
				const resolvedFileName = dependencies.mappings[modName];
				const isExternalLibraryImport = isTypescriptDeclaration(resolvedFileName);

				return { resolvedFileName, isExternalLibraryImport };
			}
			else {
				return ts.resolveModuleName(modName, containingFile, this._options, this).resolvedModule;
				// 	throw new Error(`containing file ${containingFile} has not been loaded`);
			}
		});
	}
}
