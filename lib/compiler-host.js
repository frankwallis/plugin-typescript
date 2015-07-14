import ts from 'typescript';
import Logger from './logger';

let logger = new Logger({debug: false});

export class CompilerHost {
   constructor(options) {
      this._options = options || {};
      this._options.module = this._options.module || ts.ModuleKind.System;
      this._options.target = this._options.target || ts.ScriptTarget.ES5;
		this._options.allowNonTsExtensions = (this._options.allowNonTsExtensions !== false);

      this._files = {};
   }
   
   get options() {
      return this._options;
   }
   
   getSourceFile(fileName, target) {
      return this._files[fileName]; 
   }
   
   writeFile(name, text, writeByteOrderMark) {
      throw new Error("Not implemented");
   }

   getDefaultLibFileName() { 
      return "typescript/bin/lib.es6.d.ts"; 
   }
   
   useCaseSensitiveFileNames() { 
      return false; 
   }
   
   getCanonicalFileName(fileName) { 
      return fileName; 
   }
   
   getCurrentDirectory() { 
      return "/"; 
   }
   
   getNewLine() { 
      return ts.getNewLineCharacter(this._options); 
   }
   
   addFile(filename, text) {
      this._files[filename] = ts.createSourceFile(filename, text, this._options.target);

      logger.debug(`added ${filename}`);
      return this._files[filename];
   }
}
