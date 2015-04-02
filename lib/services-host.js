import ts from 'typescript';
import Logger from './logger';

var logger = new Logger({debug: false});

/*
   allowNonTsExtensions?: boolean;
   charset?: string;
   codepage?: number;
   declaration?: boolean;
   diagnostics?: boolean;
   emitBOM?: boolean;
   help?: boolean;
   locale?: string;
   mapRoot?: string;
   module?: ModuleKind;
   noEmitOnError?: boolean;
   noErrorTruncation?: boolean;
   noImplicitAny?: boolean;
   noLib?: boolean;
   noLibCheck?: boolean;
   noResolve?: boolean;
   out?: string;
   outDir?: string;
   preserveConstEnums?: boolean;
   removeComments?: boolean;
   sourceMap?: boolean;
   sourceRoot?: string;
   suppressImplicitAnyIndexErrors?: boolean;
   target?: ScriptTarget;
   version?: boolean;
   watch?: boolean;
*/
export class LanguageServicesHost {
   constructor(options) {
      this._options = options || {};
      this._options.module = this._options.module || ts.ModuleKind.CommonJS;
      this._options.target = ts.ScriptTarget.ES5;
      this._options.sourceMap = (this._options.sourceMap != false);

      this._files = {};
      this._defaultLibName = undefined;
   }

   /**
    * Implementation of TypeScript Language Services Host interface.
    */
   getScriptFileNames() {
      return Object.keys(this._files);
   }

   /**
    * Implementation of TypeScript Language Services Host interface.
    */
   getScriptVersion(filename) {
      return this._files[filename] && this._files[filename].version.toString();
   }

   /**
    * Implementation of TypeScript Language Services Host interface.
    */
   getScriptSnapshot(filename) {
      logger.debug('getting ' + filename + ' from ' + JSON.stringify(Object.keys(this._files)))
      return ts.ScriptSnapshot.fromString(this._files[filename].text);
   }

   /**
    * Implementation of TypeScript Language Services Host interface.
    */
   getCurrentDirectory() {
      return '/';
   }

   /**
    * Implementation of TypeScript Language Services Host interface.
    */
   getScriptIsOpen(script) {
      return !(this.getDefaultLibFilename() == script);
   }

   /**
    * Implementation of TypeScript Language Services Host interface.
    */
   getCompilationSettings() {
      return this._options;
   }

   /**
    * Implementation of TypeScript Language Services Host interface.
    */
   getDefaultLibFilename(options) {
      return this._defaultLibName;
   }

   /**
    * set the resolved name of lib.d.ts
    */
   setDefaultLibFilename(resolved) {
      this._defaultLibName = resolved;
   }

   /**
    * Maintain a versioned cache of all the source files
    */
   addFile(filename, text) {
      var prevFile = this._files[filename];

      if (prevFile) {
         if (prevFile.text !== text) {
            prevFile.text = text;
            prevFile.version = prevFile.version + 1;
         }
      }
      else {
         this._files[filename] = {
            text: text,
            version: 0
         };
      }

      logger.debug('added ' + filename + ', version ' + this._files[filename].version);
   }
}
