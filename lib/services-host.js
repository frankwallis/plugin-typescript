var ts = require('typescript');

var Logger = require("./logger");
var logger = new Logger({verbose: false});

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

var DEFAULT_OPTIONS = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  sourceMap: true,
  verbose: false
};

class LanguageServicesHost {
  constructor() {
    this._options = DEFAULT_OPTIONS;
    this._files = {};
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
    return process.cwd();
  }

  /**
   * Implementation of TypeScript Language Services Host interface.
   */
  getScriptIsOpen() {
    return true;
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
    return 'typescript/bin/lib.d.ts';
  }

  /**
   * Maintain a versioned cache of all the source files
   */
  addFile(filename, text) {
    var prevFile = this._files[filename];
    var version = 0;
    
    if (prevFile) {
      version = prevFile.version;
      if (prevFile.text !== text) {
        version = version + 1;
      }
    }

    this._files[filename] = {
      text: text,
      version: version
    };

    logger.debug('added ' + filename + ', version ' + version);
  }
}

module.exports = LanguageServicesHost;