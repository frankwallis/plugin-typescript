/* */
import * as ts from 'typescript';
import Logger from './logger';
import {isTypescriptDeclaration, hasError} from './utils';
import {CompilerHost, CombinedOptions, SourceFile} from './compiler-host';
import {__HTML_MODULE__} from "./compiler-host";

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
   private _options: CombinedOptions;

	constructor(host: CompilerHost) {
		this._host = host;

      this._options = (<any>ts).clone(this._host.options);
		this._options.inlineSourceMap = false;
		this._options.sourceMap = false;
		this._options.declaration = false;
		this._options.isolatedModules = false;
		this._options.skipDefaultLibCheck = true; // don't check the default lib for better performance
	}

	/*
		returns a promise to an array of typescript errors for this file
	*/
	public check(): ts.Diagnostic[] {         
      const candidates = this.getCandidates();
      if (candidates.some(candidate => candidate.checkable && !isTypescriptDeclaration(candidate.name)))            
         return this.getAllDiagnostics(candidates); 
      else
         return [];
	}

	/*
		throws if there are compiler errors or unresolved files
	*/
	public forceCheck(): ts.Diagnostic[] {
      const files = this._host.getAllFiles()
         .filter(file => file.fileName != __HTML_MODULE__);
      const unchecked = files.filter(file => !file.checked);
      const errored = files.filter(file => file.checked && hasError(file.errors));
      
      if ((errored.length > 0) || (unchecked.length > 0)) {
         return [{
            file: undefined,
            start: undefined,
            length: undefined,
            code: 9999,
            category: ts.DiagnosticCategory.Error,
            messageText: `compilation failed [${files.length} files, ${errored.length} failed, ${unchecked.length} unchecked]`
         }];
      }
      
      return []; 
	}

   private getCandidates() {
      const candidates = this._host.getAllFiles()
         .filter(file => file.fileName != __HTML_MODULE__)
         .map(file => ({
            name: file.fileName,
            file: file,
            seen: false,
            resolved: !!file.dependencies,
            checkable: undefined,
            deps: file.dependencies && file.dependencies.list
         }));
      
      const candidatesMap = candidates.reduce((result, candidate) => {
         result[candidate.name] = candidate;
         return result;
      }, {} as CandidateMap);
      
      candidates.forEach(candidate => candidate.checkable = this.isCheckable(candidate, candidatesMap));
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
         
         return (candidate.checkable !== false); // handles circular graph because seen = true but checkable = undefiend
      }
   }
   
	/*
		Returns the diagnostics for this file and any files which it uses.
		Each file is only checked once.
	*/
	private getAllDiagnostics(candidates: Candidate[]): ts.Diagnostic[] {
		// hack to support html imports
      let filelist = candidates.map((dep) => dep.name).concat([__HTML_MODULE__]);
		let program = ts.createProgram(filelist, this._options, this._host);

		return candidates.reduce((errors, candidate) => {
			if (candidate.checkable && !candidate.file.checked) {
            candidate.file.errors = [];
            
            if (!candidate.file.isLibFile) {
               candidate.file.errors = program.getSyntacticDiagnostics(candidate.file)
                  .concat(program.getSemanticDiagnostics(candidate.file));
            }            

				candidate.file.checked = true;
            return errors.concat(candidate.file.errors);
			}
         else {
            return errors;
         }        			
		}, program.getGlobalDiagnostics());
	}
}