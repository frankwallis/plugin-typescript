/* */
import * as ts from 'typescript';
import * as path from 'path';
import Logger from './logger';
import {CompilerHost} from './compiler-host';
import {
	isTypescript, isTypescriptDeclaration,
	isJavaScript, isRelative,
	isAmbient, isAmbientImport,
   jsToDts
} from './utils';

const logger = new Logger({ debug: false });

export class Resolver {
	private _host: CompilerHost;
	private _resolve: ResolveFunction;
	private _fetch: FetchFunction;
	private _declarationFiles: string[];
	private _typings: { [s: string]: Promise<string>; };

	constructor(host: CompilerHost, resolve: ResolveFunction, fetch: FetchFunction) {
		this._host = host;
		this._resolve = resolve;
		this._fetch = fetch;

		// list of all registered declaration files
		this._declarationFiles = [];

		// map of external modules to their typings
		this._typings = {};
	}

	/*
		returns a promise to an array of typescript errors for this file
	*/
	public resolve(sourceName: string): Promise<DependencyInfo> {
		const file = this._host.getSourceFile(sourceName);
      if (!file) throw new Error(`file [${sourceName}] has not been added`);
      
      if (!file.pendingDependencies) {   
         const info = ts.preProcessFile(file.text, true);
         file.isLibFile = info.isLibFile;
         
         file.pendingDependencies = this.resolveDependencies(sourceName, info)
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
	*/
	public registerDeclarationFile(sourceName: string) {
		this._declarationFiles.push(sourceName);
	}
	
	/*
		process the source to get its dependencies and resolve and register them
		returns a promise to the list of registered dependency files
	*/
	private resolveDependencies(sourceName: string, info: ts.PreProcessedFileInfo): Promise<{ [s: string]: string; }> {
		/* build the list of file resolutions */
		/* references first */
		const resolvedReferences = info.referencedFiles
			.map((ref) => this.resolveReference(ref.fileName, sourceName));

		const resolvedImports = info.importedFiles
			.map((imp) => this.resolveImport(imp.fileName, sourceName));

		const refs = [].concat(info.referencedFiles).concat(info.importedFiles).map(pre => pre.fileName);
		const deps = resolvedReferences.concat(resolvedImports);

		/* and convert to promise to a map of local reference to resolved dependency */
		return Promise.all(deps)
			.then((resolved) => {
				return refs.reduce((result, ref, idx) => {
					result[ref] = resolved[idx];
					return result;
				}, {});
			});
	}

	private resolveReference(referenceName: string, sourceName: string): Promise<string> {
		if ((isAmbient(referenceName) && !this._host.options.resolveAmbientRefs) || (referenceName.indexOf("/") === -1))
			referenceName = "./" + referenceName;

		return this._resolve(referenceName, sourceName);
	}

	private resolveImport(importName: string, sourceName: string): Promise<string> {
		if (isRelative(importName) && isTypescriptDeclaration(sourceName) && !isTypescriptDeclaration(importName))
			importName = importName + ".d.ts";

		return this._resolve(importName, sourceName)
			.then(resolvedImport => {
            if (isAmbientImport(importName) && isJavaScript(resolvedImport)) {
               if (this._host.options.typingsMap) {
                  const mappedTyping = this.resolveMappedTyping(importName, resolvedImport);
                  if (mappedTyping) return mappedTyping;
               }

               if (this._host.options.resolveTypings) {
                  if (!this._typings[resolvedImport]) {
                     this._typings[resolvedImport] = this.resolveTyping(importName, sourceName)
                        .then(resolvedTyping => {
                           return resolvedTyping ? resolvedTyping : resolvedImport;
                        });
                  }

                  return this._typings[resolvedImport];
               }
            }
            
            return resolvedImport;
  			});
	}

	private resolveMappedTyping(importName: string, resolvedImportName: string): string {
      return Object.keys(this._host.options.typingsMap).reduce((result, key) => {
         if (this._host.options.typingsMap[key] === true) {
            if (importName.indexOf(key) === 0) {
               return jsToDts(resolvedImportName);
            }
         }
         else if (key === importName) {
            return path.join(path.dirname(resolvedImportName), importName, this._host.options.typingsMap[key]);
         }
         return result;
      }, undefined);      
   }
   
	private resolveTyping(importName: string, sourceName: string): Promise<string> {
		// we can only support packages registered without a slash in them
		const packageName = importName.split(/\//)[0];

		return this._resolve(packageName, sourceName)
			.then(exported => {
				return path.join(exported.slice(0, -3), "package.json");
			})
			.then(address => {
				return this._fetch(address)
					.then(packageText => {
						const typings = JSON.parse(packageText).typings;
						return typings ? this._resolve("./" + typings, address) : undefined;
					})
					.catch(err => {
						logger.warn(`unable to resolve typings for ${importName}, ${address} could not be found`);
						return undefined;
					});
			});
	}
}