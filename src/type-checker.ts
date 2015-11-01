/* */
import * as ts from 'typescript';
import Logger from './logger';
import {CompilerHost} from './compiler-host';
import {formatErrors} from './format-errors';
import {isTypescript, isTypescriptDeclaration, isAmbient} from "./utils";
import {__HTML_MODULE__} from "./compiler-host";

let logger = new Logger({ debug: false });

interface FileEntry {
	sourceName: string;
	source: Deferred<string>;
	deps?: FileEntry[];
	loaded: Promise<any>;
	errors: Promise<ts.Diagnostic[]>;
	isDefaultLib: boolean;
	checked: boolean;
}

export class TypeChecker {
	private _host: CompilerHost;
	private _resolve: ResolveFunction;
	private _fetch: FetchFunction;
   private _options: any;
	private _files: Map<string, FileEntry>;
	private _declarationFiles: FileEntry[];

	constructor(host: CompilerHost, resolve: ResolveFunction, fetch: FetchFunction) {
		this._host = host;
		this._resolve = resolve;
		this._fetch = fetch;

      this._options = Object.assign(this._host.options);
		this._options.inlineSourceMap = false;
		this._options.sourceMap = false;
		this._options.declaration = false;
		this._options.isolatedModules = false;
		this._options.noLibCheck = true;

		// map of all typescript files -> file-entry
		this._files = new Map<string, FileEntry>();

		// list of all registered declaration files
		this._declarationFiles = [];
	}

	/*
		returns a promise to an array of typescript errors for this file
	*/
	public check(sourceName: string, source: string) {
		var file = this.registerFile(sourceName);
		this.registerSource(sourceName, source);
		return file.errors;
	}

	/*
		register declaration files from config
	*/
	public registerDeclarationFile(sourceName: string, isDefaultLib: boolean) {
		let file = this.registerFile(sourceName, isDefaultLib);
		this._declarationFiles.push(file);
		return file;
	}

	/* private */

	private registerFile(sourceName: string, isDefaultLib: boolean = false) {
		if (!this._files[sourceName]) {
			let source = new Deferred<string>()

			/* we need to fetch declaration files ourselves */
			if (isTypescriptDeclaration(sourceName)) {
				this._fetch(sourceName)
					.then((source) => {
						this._host.addFile(sourceName, source);
						this.registerSource(sourceName, source);
					});
			}

			/* loaded is a promise resolved when the source has been added to the
				host and all the dependencies used by this file have been resolved */
			let loaded = source.promise
				.then((source) => this.resolveDependencies(sourceName, source))
				.then((depsMap) => {
					this._host.addResolutionMap(sourceName, depsMap);

					this._files[sourceName].deps = Object.keys(depsMap)
						.map((key) => depsMap[key])
						.filter((res) => isTypescript(res)) // ignore e.g. css files
						.map((res) => this.registerFile(res))
						.concat(this._declarationFiles);
				});

			/* errors is a promise to the compilation results */
			let errors = loaded
				.then(() => this.canEmit(this._files[sourceName]))
				.then(() => this.getAllDiagnostics(this._files[sourceName]));

			this._files[sourceName] = {
				sourceName,
				source,
				isDefaultLib,
				loaded,
				errors,
				checked: false,
			};
		}

		return this._files[sourceName];
	}

	private registerSource(sourceName: string, source: string) {
		if (!this._files[sourceName])
			throw new Error(`${sourceName} has not been registered`);

		this._files[sourceName].source.resolve(source);
	}

	/*
		process the source to get its dependencies and resolve and register them
		returns a promise to the list of registered dependency files
	*/
	private resolveDependencies(sourceName: string, source: string) {
		let info = ts.preProcessFile(source, true);

		/* build the list of files we need to resolve */
		/* references first */
		let references = info.referencedFiles
			.map((ref) => {
				if ((isAmbient(ref.fileName) && !this._options.resolveAmbientRefs) || (ref.fileName.indexOf("/") == -1))
					return "./" + ref.fileName;
				else
					return ref.fileName;
			});

		/* now imports */
		let imports = info.importedFiles
			.map((imp) => imp.fileName);

		let refs = [].concat(references).concat(imports);

		/* convert to list of promises to resolved addresses */
		let deps = refs.map((ref) => this._resolve(ref, sourceName));

		/* and convert to promise to a map of local reference to resolved dependency */
		return Promise.all(deps)
			.then((resolved) => {
				return refs.reduce((result, ref, idx) => {
					result[ref] = resolved[idx];
					return result;
				}, {});
			});
	}

	/*
		returns promise resolved when file can be emitted
	*/
	private canEmit(file: FileEntry, seen?: FileEntry[]) {
		/* avoid circular references */
		seen = seen || [];

		if (seen.indexOf(file) < 0) {
			seen.push(file);

			return file.loaded.then(() => Promise.all(file.deps.map((dep) => this.canEmit(dep, seen))));
		}
	}

	/*
		Returns a flattened list of the dependency tree for this file.
	*/
	private accumulateDeps(file: FileEntry, result?: FileEntry[]): FileEntry[] {
		result = result || [];

		if (result.indexOf(file) < 0) {
			result.push(file);
			file.deps.forEach((dep) => this.accumulateDeps(dep, result));
		}

		return result;
	}

	/*
		Returns the diagnostics for this file and any files which it uses.
		Each file is only checked once.
	*/
	private getAllDiagnostics(file: FileEntry): ts.Diagnostic[] {
		let deps = this.accumulateDeps(file);

		// hack to support html imports
		let filelist = deps.map((dep) => dep.sourceName).concat([__HTML_MODULE__]);
		let program = ts.createProgram(filelist, this._options, this._host);

		return deps.reduce((diags, dep) => {
			// don't check the default lib for better performance
			if (!dep.isDefaultLib && !dep.checked) {
				let sourceFile = this._host.getSourceFile(dep.sourceName);

				diags = diags
					.concat(program.getSyntacticDiagnostics(sourceFile))
					.concat(program.getSemanticDiagnostics(sourceFile));

				dep.checked = true;
			}
			return diags;
		}, program.getGlobalDiagnostics());
	}
}

class Deferred<T> {
	public resolve: (result: T) => void;
	public reject: (err: Error) => void;
	public promise: Promise<T>;

	constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}
