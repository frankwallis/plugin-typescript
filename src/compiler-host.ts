/* */
import * as ts from 'typescript';
import Logger from './logger';
import {isHtml, isTypescriptDeclaration, isJavaScript} from './utils';

const logger = new Logger({ debug: false });
export const __HTML_MODULE__ = "__html_module__";

export type CombinedOptions = PluginOptions & ts.CompilerOptions;

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
   private _options: CombinedOptions;
   private _files: { [s: string]: SourceFile; };

   constructor(options: any, builder: boolean = false) {
      this._options = options || {};
      this._options.module = this.getEnum(this._options.module, ts.ModuleKind, ts.ModuleKind.System);
      this._options.target = this.getEnum(this._options.target, ts.ScriptTarget, ts.ScriptTarget.ES5);
      this._options.jsx = this.getEnum(this._options.jsx, ts.JsxEmit, ts.JsxEmit.None);
      this._options.allowNonTsExtensions = (this._options.allowNonTsExtensions !== false);
      this._options.skipDefaultLibCheck = (this._options.skipDefaultLibCheck !== false);
      this._options.supportHtmlImports = (options.supportHtmlImports === true);
      this._options.resolveAmbientRefs = (options.resolveAmbientRefs === true);
		this._options.noResolve = true;
		this._options.allowSyntheticDefaultImports = (this._options.allowSyntheticDefaultImports !== false);

      // Force module resolution into 'classic' mode, to prevent node module resolution from kicking in
      this._options.moduleResolution = ts.ModuleResolutionKind.Classic;
		this._options.types = this._options.types || [];

      // When bundling automatically output es6 modules instead of system to enable rollup support
      // if (builder) {
      //    if (this._options.module === ts.ModuleKind.System) {
		// 		logger.log('switching output from system.register -> es modules to support rollup');
      //       this._options.module = ts.ModuleKind.ES6;
      //    }
      // }

      this._files = {};

      // support for importing html templates until
      // https://github.com/Microsoft/TypeScript/issues/2709#issuecomment-91968950 gets implemented
      // note - this only affects type-checking, not runtime!
      let source = "var __html__: string = ''; export default __html__;";
		if ((this._options.target != ts.ScriptTarget.ES6) && (this._options.module != ts.ModuleKind.ES6))
         source = source + "export = __html__;";

      const file = this.addFile(__HTML_MODULE__, source);
      file.dependencies = { list: [], mappings: {} };
      file.checked = true;
      file.errors = [];

		if (this._options.supportHtmlImports) {
			logger.warn("The 'supportHtmlImports' option is deprecated and will shortly be removed");
			logger.warn("Please use TypeScript's new 'wildcard declarations' feature instead");
		}

		if (this._options.resolveAmbientRefs) {
			logger.warn("The 'resolveAmbientRefs' option is deprecated and will shortly be removed");
			logger.warn("Please use External Typings support instead");
		}

		if (this._options.targetLib) {
			logger.warn("The 'targetLib' option is deprecated and will shortly be removed");
			logger.warn("Please use the 'lib' option instead");
			this.options.targetLib = this.getEnum(this._options.targetLib, ts.ScriptTarget, ts.ScriptTarget.ES6);
		}
		else if (!this._options.lib) {
			this._options.lib = ['es6'];
		}
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
		return this.getDefaultLibFilePaths()[0];
   }

	/**
	 * Based on the compiler options returns the lib files that should be included.
	 */
	public getDefaultLibFilePaths(): string[] {
		if (this._options.targetLib === ts.ScriptTarget.ES5)
			return ['typescript/lib/lib.d.ts'];
		else if (this._options.targetLib === ts.ScriptTarget.ES5)
			return ['typescript/lib/lib.es6.d.ts'];
		else
			return this._options.lib.map(libName => `typescript/lib/lib.${libName}.d.ts`);
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

   public getDirectories(): string[] {
		throw new Error("Not implemented");
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

	private _reportedFiles = [];
	/*
		Overrides the standard resolution algorithm used by the compiler so that we can use systemjs
		resolution. Because TypeScript requires synchronous resolution, everything is pre-resolved
		by the type-checker and registered with the host before type-checking.
	*/
   public resolveModuleNames(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
      return moduleNames.map((modName) => {
         const dependencies = this._files[containingFile].dependencies;

         if (isHtml(modName) && this._options.supportHtmlImports) {
            return { resolvedFileName: __HTML_MODULE__ };
         }
         else if (dependencies) {
            const resolvedFileName = dependencies.mappings[modName];

				if (!resolvedFileName) {
					// don't spam the console, only show one error per file.
					if (this._reportedFiles.indexOf(resolvedFileName) < 0) {
						logger.warn(containingFile + ' -> ' + modName + ' could not be resolved');
						this._reportedFiles.push(resolvedFileName);
					}
					return undefined;
				}
				else {
					const isExternalLibraryImport = isTypescriptDeclaration(resolvedFileName);
					return { resolvedFileName, isExternalLibraryImport };
				}
         }
         else {
            return ts.resolveModuleName(modName, containingFile, this._options, this).resolvedModule;
            // 	throw new Error(`containing file ${containingFile} has not been loaded`);
         }
      });
   }
}
