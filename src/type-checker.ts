/* */
import ts from 'typescript';
import Logger from './logger';
import { isTypescriptDeclaration, hasError } from './utils';
import { CompilerHost, SourceFile } from './compiler-host';

const logger = new Logger({ debug: false });

type Candidate = {
	name: string;
	file: SourceFile;
	seen: boolean;
	resolved: boolean;
	deps: string[];
	checkable: boolean;
}

type CandidateMap = { [s: string]: Candidate };

export class TypeChecker {
	private _host: CompilerHost;

	constructor(host: CompilerHost) {
		this._host = host;
	}

	private getTypeCheckOptions(options: ts.CompilerOptions): ts.CompilerOptions {
		const result = (<any>ts).clone(options);
		result.inlineSourceMap = false;
		result.sourceMap = false;
		result.declaration = false;
		result.isolatedModules = false;
		result.skipDefaultLibCheck = true; // don't check the default lib for better performance
		return result;
	}

	/*
		returns an array of typescript errors for this file
	*/
	public check(options: ts.CompilerOptions): ts.Diagnostic[] {
		const typeCheckOptions = this.getTypeCheckOptions(options)
		const candidates = this.getCandidates(false);

		if (candidates.some(candidate => !candidate.file.checked && candidate.checkable && !isTypescriptDeclaration(candidate.name)))
			return this.getAllDiagnostics(candidates, typeCheckOptions);
		else
			return [];
	}

	/*
		type-checks any unchecked files even if all dependencies have not been loaded
	*/
	public forceCheck(options: ts.CompilerOptions): ts.Diagnostic[] {
		const typeCheckOptions = this.getTypeCheckOptions(options)
		const candidates = this.getCandidates(true);

		if (candidates.some(candidate => !candidate.file.checked))
			return this.getAllDiagnostics(candidates, typeCheckOptions);
		else
			return [];
	}

	/*
		returns errors for all files
	*/
	public getFileDiagnostics(fileName: string): ts.Diagnostic[] {
		return this._host.getSourceFile(fileName).diags;
	}

	public hasErrors(): boolean {
		return this._host.getAllFiles()
			.some(file => file.checked && hasError(file.diags));
	}

	private getCandidates(force: boolean) {
		const candidates: Candidate[] = this._host
			.getAllFiles()
			.map(file => ({
				name: file.fileName,
				file: file,
				seen: false,
				resolved: !!file.dependencies,
				checkable: force || undefined,
				deps: file.dependencies && file.dependencies.list
			}));

		if (!force) {
			const candidatesMap = candidates.reduce((result, candidate) => {
				result[candidate.name] = candidate;
				return result;
			}, {} as CandidateMap);

			candidates.forEach(candidate => candidate.checkable = this.isCheckable(candidate, candidatesMap));
		}

		return candidates;
	}

	private isCheckable(candidate: Candidate, candidatesMap: CandidateMap): boolean {
		if (!candidate)
			return false;
		else {
			if (!candidate.seen) {
				candidate.seen = true;
				candidate.checkable = candidate.resolved && candidate.deps.every(dep => this.isCheckable(candidatesMap[dep], candidatesMap));
			}

			return (candidate.checkable !== false); // handles circular graph because seen = true but checkable = undefined
		}
	}

	/*
		Returns the diagnostics for this file and any files which it uses.
		Each file is only checked once.
	*/
	private getAllDiagnostics(candidates: Candidate[], typeCheckOptions: ts.CompilerOptions): ts.Diagnostic[] {
		// hack to support html imports
		const filelist = candidates.map((dep) => dep.name);
		const program = ts.createProgram(filelist, typeCheckOptions, this._host);

		return candidates.reduce((diags, candidate) => {
			if (candidate.checkable && !candidate.file.checked) {
				candidate.file.diags = [];

				if (!candidate.file.isLibFile) {
					candidate.file.diags = program.getSyntacticDiagnostics(candidate.file)
						.concat(program.getSemanticDiagnostics(candidate.file));
				}

				candidate.file.checked = true;
				return diags.concat(candidate.file.diags);
			}
			else {
				return diags;
			}
		}, program.getGlobalDiagnostics());
	}
}
