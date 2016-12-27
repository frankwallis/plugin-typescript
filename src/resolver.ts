/* */
import * as ts from 'typescript';
import Logger from './logger';
import {CompilerHost} from './compiler-host';
import {
   isTypescript, isTypescriptDeclaration,
   isJavaScript, isRelative,
   isAmbient, convertToDts
} from './utils';
import {CombinedOptions} from './parse-config'

const logger = new Logger({ debug: false });

export class Resolver {
   private _host: CompilerHost;
   private _resolve: ResolveFunction;
   private _lookup: LookupFunction;
   private _declarationFiles: string[];

   constructor(host: CompilerHost, resolve: ResolveFunction, lookup: LookupFunction) {
      this._host = host;
      this._resolve = resolve;
      this._lookup = lookup;

      // list of all registered declaration files
      this._declarationFiles = [];
   }

	/*
		returns a promise to the dependency information for this file
	*/
   public resolve(sourceName: string, options: CombinedOptions): Promise<DependencyInfo> {
      const file = this._host.getSourceFile(sourceName);
      if (!file) throw new Error(`file [${sourceName}] has not been added`);

      if (!file.pendingDependencies) {
         const info = ts.preProcessFile(file.text, true);
         file.isLibFile = info.isLibFile;

         file.pendingDependencies = this.resolveDependencies(sourceName, info, options)
            .then(mappings => {
               const deps = Object.keys(mappings)
                  .map((key) => mappings[key])
                  .filter((res) => isTypescript(res)) // ignore e.g. js, css files

               /* add the fixed declaration files */
               const refs = this._declarationFiles.filter(decl => {
                  return (decl != sourceName) && (deps.indexOf(decl) < 0);
               });

               const list = deps.concat(refs);

               file.dependencies = { mappings, list };
               return file.dependencies;
            });
      }

      return file.pendingDependencies;
   }

	/*
		register declaration files from config
      these will be included as dependencies for every file
	*/
   public registerDeclarationFile(sourceName: string) {
      this._declarationFiles.push(sourceName);
   }

	/*
		process the source to get its dependencies and resolve and register them
		returns a promise to a map of import/reference name  -> resolved file
	*/
   private resolveDependencies(sourceName: string, info: ts.PreProcessedFileInfo, options: CombinedOptions): Promise<{ [s: string]: string; }> {
      /* build the list of file resolutions */
      /* references first */
      const resolvedReferences = info.referencedFiles
         .map((ref) => this.resolveReference(ref.fileName, sourceName, options));

      const resolvedTypes = info.typeReferenceDirectives
         .map((typ) => this.resolveTypeReference(typ.fileName, sourceName, options));

      const resolvedImports = info.importedFiles
         .map((imp) => this.resolveImport(imp.fileName, sourceName, options));

      const resolvedExternals = info.ambientExternalModules && info.ambientExternalModules
         .map((ext) => this.resolveImport(ext, sourceName, options));

      const refs = []
			.concat(info.referencedFiles)
			.concat(info.typeReferenceDirectives)
			.concat(info.importedFiles)
			.map(pre => pre.fileName)
			.concat(info.ambientExternalModules);

      const deps = []
			.concat(resolvedReferences)
			.concat(resolvedTypes)
			.concat(resolvedImports)
			.concat(resolvedExternals);

      /* and convert to promise to a map of local reference to resolved dependency */
      return Promise.all(deps)
         .then((resolved) => {
            return refs.reduce((result, ref, idx) => {
               result[ref] = resolved[idx];
               return result;
            }, {});
         });
   }

   private resolveReference(referenceName: string, sourceName: string, options: CombinedOptions): Promise<string> {
		if (isAmbient(referenceName)) {
			referenceName = "./" + referenceName;
		}

      return this._resolve(referenceName, sourceName);
   }

   private resolveTypeReference(referenceName: string, sourceName: string, options: CombinedOptions): Promise<string> {
		return this.lookupAtType(referenceName, sourceName, options)
   }

   private async resolveImport(importName: string, sourceName: string, options: CombinedOptions): Promise<string> {
      if (isRelative(importName) && isTypescriptDeclaration(sourceName) && !isTypescriptDeclaration(importName))
         importName = importName + ".d.ts";

		const address = await this._resolve(importName, sourceName);

		if (!isTypescript(address)) {
			const atTypeAddress = await this.lookupAtType(importName, sourceName, options);
			if (atTypeAddress) return atTypeAddress;

			const typingAddress = await this.lookupTyping(importName, sourceName, address, options);
			if (typingAddress) return typingAddress;
		}

		return address;
   }

	private async lookupTyping(importName: string, sourceName: string, address: string, options: CombinedOptions): Promise<string> {
		const packageName = this.getPackageName(importName);
		const packageTypings = options.typings[packageName];
		const importTypings = options.typings[importName];

		if (importTypings) {
			return this.resolveTyping(importTypings, packageName, sourceName, address);
		}
		else if (packageTypings) {
			// if typings are available for the entry point of the package, we
			// assume that all other files have typings with the same name
			// (this is for rxjs specifically)
			return this.resolveTyping(true, packageName, sourceName, address);
		}
		else {
			const metadata = await this._lookup(address);
   	   return this.resolveTyping(metadata.typings, packageName, sourceName, address);
		}
	}

	private getPackageName(importName: string): string {
		const packageParts = importName.split('/');
		if ((packageParts[0].indexOf('@') === 0) && (packageParts.length > 1)) {
			return packageParts[0] + '/' + packageParts[1];
		}
		else {
			return packageParts[0];
		}
	}

   private async resolveTyping(typings: boolean | string, packageName: string, sourceName: string, address: string): Promise<string> {
		if (typings === true) {
			return convertToDts(address);
		}
		else if (typeof (typings) === 'string') {
			const typingsName = isRelative(typings) ? typings.slice(2) : typings;
			return this._resolve(packageName + '/' + typingsName, sourceName);
		}
		else if (typings) {
			throw new Error("invalid 'typings' value [" + typings + "] [" + address + "]");
		}
		else {
			return undefined;
		}
   }

   private async lookupAtType(importName: string, sourceName: string, options: CombinedOptions): Promise<string> {
		const packageName = this.getPackageName(importName);

		if (options.types.indexOf(packageName) < 0)
			return undefined;

		let resolved = await this._resolve('@types/' + packageName, sourceName);

		// needed for jspm@0.16
		if (isJavaScript(resolved))
			resolved = resolved.slice(0, -3);

		if (!isTypescriptDeclaration(resolved))
			resolved = resolved + '/index.d.ts';

		return resolved;
	}
}
