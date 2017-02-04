/* */
import ts from 'typescript';
import Logger from './logger';
import {isTypescriptDeclaration, getExtension} from './utils';
import {CombinedOptions} from './parse-config';

const logger = new Logger({ debug: false });

export type TranspileResult = {
   failure: boolean;
   diags: Array<ts.Diagnostic>;
   js: string;
   sourceMap: string;
}

export interface SourceFile extends ts.SourceFile {
   output?: TranspileResult;
   pendingDependencies?: Promise<DependencyInfo>;
   dependencies?: DependencyInfo;
   diags?: ts.Diagnostic[];
   checked?: boolean;
   isLibFile?: boolean;
}

export class CompilerHost implements ts.CompilerHost {
   private _files: { [s: string]: SourceFile; };

   constructor() {
      this._files = {};
   }

   public getDefaultLibFileName(options: CombinedOptions): string {
		return this.getDefaultLibFilePaths(options)[0];
   }

	/**
	 * Based on the compiler options returns the lib files that should be included.
	 */
	public getDefaultLibFilePaths(options: CombinedOptions): string[] {
		return options.lib.map(libName => `typescript/lib/lib.${libName}.d.ts`);
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

   public addFile(fileName: string, text: string, target: ts.ScriptTarget): SourceFile {
      fileName = this.getCanonicalFileName(fileName);
      const file = this._files[fileName];

      if (!file) {
         this._files[fileName] = ts.createSourceFile(fileName, text, target);
         logger.debug(`added ${fileName}`);
      }
      else if (file.text != text) {
         // create a new one
         this._files[fileName] = ts.createSourceFile(fileName, text, target);
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
            file.diags = [];
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

         if (dependencies) {
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
					const extension = getExtension(resolvedFileName);
					return { resolvedFileName, isExternalLibraryImport, extension };
				}
         }
         else {
				return undefined;
         }
      });
   }
}
