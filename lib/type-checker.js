/* */
import ts from 'typescript';
import Logger from './logger';
import {formatErrors} from './format-errors';
import {isTypescript, isTypescriptDeclaration, isAmbient} from "./utils";

let logger = new Logger({debug: !false});

class Deferred {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}

export class TypeChecker {
	constructor(host, resolve, fetch) {
      this._host = host;
		this._resolve = resolve;
		this._fetch = fetch;
		
		this._options = ts.clone(this._host._options);
		this._options.inlineSourceMap = false;
		this._options.sourceMap = false;
		this._options.declaration = false;
		this._options.isolatedModules = false;
		this._options.noResolve = true;
		this._options.noLibCheck = true;
		this._options.noLib = true;
		this._options.module = ts.ModuleKind.System;

		// map of all typescript files -> entry containing their status
		this._files = {};
	}

	check(sourceName, source) {	
		var file = this.registerFile(sourceName);
		this.registerSource(sourceName, source);
		return file.errors;
	}

	registerFile(sourceName) {
		if (!this._files[sourceName]) {
			let file = {
				sourceName: sourceName,
				source: new Deferred()
			};

			if (isTypescriptDeclaration(sourceName)) {
				this._fetch(sourceName)
					.then((source) => {
						this._host.addFile(sourceName, source);
						this.registerSource(sourceName, source);
					});
			}
			
			/* deps is a promise to a list of file entries 
				which we need to compile this file */
			file.deps = file.source.promise
				.then((source) => this.resolveDependencies(sourceName, source));

			/* errors is a promise to the compilation results */
			file.errors = file.deps
				.then(() => this.canEmit(file))
				.then(() => this.getAllDiagnostics(file));
				
			this._files[sourceName] = file;
		}
		
		return this._files[sourceName];
	}	
	
	registerSource(sourceName, source) {
		if (!this._files[sourceName])
			throw new Error(`${sourceName} has not been registered`);
			
		this._files[sourceName].source.resolve(source);
	}
	
	/* 
		process the source to get its dependencies and resolve and register them
		returns a promise to the list of registered dependency files
	*/
	resolveDependencies(sourceName, source) {
		let info = ts.preProcessFile(source, true);
		
		/* build the list of files we need to resolve */
		/* references first */
		let references = info.referencedFiles
			.map((ref) => {
				if (isAmbient(ref.fileName) && !this._options.resolveAmbientRefs)
					return "./" + ref.fileName;
				else
					return ref.fileName;
			});
			
		//references.push(this._host.getDefaultLibFileName());
		references.push("typescript/bin/lib.es6.d.ts");
		/* now imports, ignoring ambient imports */
		let imports = info.importedFiles
			.filter((imp) => !isAmbient(imp.fileName))
			.map((imp) => imp.fileName);

		/* convert to list of promises to resolved addresses */
		let deps = [].concat(references).concat(imports)
			.map((dep) => this._resolve(dep, sourceName));
			
		/* and convert to promise to list of registered files */
		return Promise.all(deps)
			.then((resolved) => {
				return resolved
					.filter((res) => isTypescript(res)) 
					.map((res) => this.registerFile(res));
			});
	}
	
	/* 
		returns promise resolved when file can be emitted 
	*/
	canEmit(file, seen) {
		/* avoid circular references */
		seen = seen || [];
		
		if (seen.indexOf(file) >= 0)
			return;
		else
			seen.push(file);

		return file.deps
			.then((deps) => {
				if (deps.length == 0)
					return;
				else
					return Promise.all(deps.map((dep) => this.canEmit(dep, seen)));
			});	
	}
	
	getAllDiagnostics(file) {
		//let program = ts.createProgram([file.sourceName], this._options, this._host);
		let program = ts.createProgram(Object.keys(this._files), this._options, this._host);
		let sourceFile = this._host.getSourceFile(file.sourceName)
		return program.getGlobalDiagnostics()
			.concat(program.getSyntacticDiagnostics(sourceFile))
			.concat(program.getSemanticDiagnostics(sourceFile));
	}

	/**
	 * accumulates the diagnostics for the file and any reference files it uses
	 */
	getAllDiagnostics1(filename, seen) {
		/* ignore circular references */
		seen = seen || [];

		if (seen.indexOf(filename) >= 0)
			return [];
		else
			seen.push(filename);

		let depDiagnostics = this._files[filename].deps
			.filter((dep) => isTypescriptDeclaration(dep))
			.reduce((result, dep) => {
				return result.concat(this.getAllDiagnostics(dep, seen));
			}, []);

		return this.getFileDiagnostics(filename).concat(depDiagnostics);
	}

	/**
	 * gets the diagnostics for the file
	 * caches results
	 */
	getFileDiagnostics(filename) {
		if (!this._files[filename].diagnostics) {
			this._files[filename].diagnostics = this._services.getSemanticDiagnostics(this._files[filename].tsname)
				.concat(this._services.getSyntacticDiagnostics(this._files[filename].tsname));
		}
		return this._files[filename].diagnostics;
	}
}