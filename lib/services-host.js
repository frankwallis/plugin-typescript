/**
 * @copyright 2015, Andrey Popp <me@andreypopp.com>
 */
'use strict';

var util          = require('util');
var path          = require('path');
var ts            = require('typescript');
var objectAssign  = require('object-assign');
var Promise       = require('bluebird');
var convert = require('convert-source-map');

var Logger = require("./logger");
var logger = new Logger({ verbose: false });

var DEFAULT_OPTIONS = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  sourceMap: true,
  verbose: false
  //,preserveConstEnums: true
};

function TypeScriptSystemJsHost(options, resolve, fetch) {
  this.options = {};
  objectAssign(this.options, DEFAULT_OPTIONS);
  objectAssign(this.options, options);

  this._files = {};
  this._pendingFiles = {};

  this._services = ts.createLanguageService(this, ts.createDocumentRegistry());
  this._runtimeRead = null;

  this.resolve = resolve;
  this.fetch = fetch;
}

/**
 * Implementation of TypeScript Language Services Host interface.
 */
TypeScriptSystemJsHost.prototype.getScriptFileNames = function getScriptFileNames() {
  return Object.keys(this._files);
};

/**
 * Implementation of TypeScript Language Services Host interface.
 */
TypeScriptSystemJsHost.prototype.getScriptVersion = function getScriptVersion(filename) {
  return this._files[filename] && this._files[filename].version.toString();
};

/**
 * Implementation of TypeScript Language Services Host interface.
 */
TypeScriptSystemJsHost.prototype.getScriptSnapshot = function getScriptSnapshot(filename) {
  logger.debug('getting ' + filename + ' from ' + JSON.stringify(Object.keys(this._files)) )
  return ts.ScriptSnapshot.fromString(this._files[filename].text);
};

/**
 * Implementation of TypeScript Language Services Host interface.
 */
TypeScriptSystemJsHost.prototype.getCurrentDirectory = function getCurrentDirectory() {
  return process.cwd();
};

/**
 * Implementation of TypeScript Language Services Host interface.
 */
TypeScriptSystemJsHost.prototype.getScriptIsOpen = function getScriptIsOpen() {
  return true;
};

/**
 * Implementation of TypeScript Language Services Host interface.
 */
TypeScriptSystemJsHost.prototype.getCompilationSettings = function getCompilationSettings() {
  return this.options;
};

/**
 * Implementation of TypeScript Language Services Host interface.
 */
TypeScriptSystemJsHost.prototype.getDefaultLibFilename = function getDefaultLibFilename(options) {
  return this.resolve('', 'typescript/bin/lib.d.ts');
};

/**
 * Implementation of TypeScript Language Services Host interface.
 */
TypeScriptSystemJsHost.prototype.log = function log(message) {
  if (this.options.verbose)
      console.log(message);
};

/**
 * Return an array of import declarations found in source file.
 */
TypeScriptSystemJsHost.prototype._findImportDeclarations2 = function _findImportDeclarations(filename) {
  var node = this._services.getSourceFile(filename);
  var result = [];

  if (!this.addedDefaultLib) {
    result.push(this.getDefaultLibFilename());
    this.addedDefaultLib = true;
  }

  visit(node);
  logger.debug(filename + ' deps: ' + JSON.stringify(result));
  return result;

  function visit(node) {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
      result.push(node.moduleReference.expression.text);
    } else if (node.kind === ts.SyntaxKind.SourceFile) {
      result = result.concat(node.referencedFiles.map(function(f) {
        return f.filename;
      }));
    }
    ts.forEachChild(node, visit);
  }
};

TypeScriptSystemJsHost.prototype._findImportDeclarations = function (filename, text) {

  console.log("prepreprocessing " + filename);
  var result = [];
  console.log("preprocessing " + filename);
  var info = ts.preProcessFile(text, true);

  console.log('got ' + JSON.stringify(info));

          // if (!this.addedDefaultLib) {
  //   result.push(this.getDefaultLibFilename());
  //   this.addedDefaultLib = true;
  // }

  info.referencedFiles.forEach(function(ref) {
    result.push(ref.filename);
  })

  info.importedFiles.forEach(function(imp) {
    result.push(imp.filename);
  })

  //isLibFile: boolean;
  logger.debug(filename + ' deps: ' + JSON.stringify(result));
  return result;
};

/**
 * Loads all the dependencies of this file, both imports and references
 */
TypeScriptSystemJsHost.prototype._addDependencies = function(filename, text) {

  var dependencies = [];

  if (filename == this.getDefaultLibFilename())
    return Promise.resolve();

  if (!this.addedDefaultLib) {
    dependencies.push(this.load(this.getDefaultLibFilename()));
    this.addedDefaultLib = true;
  }

  console.log('_adddeps ' + filename)
  var deps = this._findImportDeclarations(filename, text);

  console.log(JSON.stringify(deps));

  deps.forEach(function(dep) {
      var parent = filename;

      console.log('dep ' + dep);
      if (!this._isExternal(dep)) {
        var resolved = this.resolve(parent, dep);

        if (!this._files[resolved]) {
          var loaded = this.load(resolved, !isTypescriptDeclaration(dep));
          dependencies.push(loaded);
        }
      }
    }.bind(this));

  return Promise.all(dependencies);
}

/**
 * Is this an external dependency?
 */
TypeScriptSystemJsHost.prototype._isExternal = function(dep) {
    return ((dep[0] != '.') && (dep[0] != '/') && !isTypescriptDeclaration(dep))
}

/**
 * Maintain a versioned cache of all the source files
 */
TypeScriptSystemJsHost.prototype._addFile = function _addFile(filename, text) {
  var prevFile = this._files[filename];
  var version = 0;
  if (prevFile) {
    version = prevFile.version;
    if (prevFile.text !== text) {
      version = version + 1;
    }
  }
  this._files[filename] = {text: text, version: version};

  //console.log('added ' + filename + ': ' + JSON.stringify(this._files[filename]));
};

/**
 * Load the file and it's dependencies, returns a promise to the file contents
 */
TypeScriptSystemJsHost.prototype.load = function(filename, nodeps) {
  logger.log("loading " + filename);

  // only load the file once, and cache the promises
  if (!this._pendingFiles[filename]) {
    this._pendingFiles[filename] = this.fetch(filename)
        .then(function(text) {
          this._addFile(filename, text);

          console.log('added ' + filename)
          // now load all the dependencies so that we can compile the file

          if (!nodeps)
            return this._addDependencies(filename, text)
              .then(function() { return text; }); // and ultimately yield the contents
        }.bind(this));
  }

  return this._pendingFiles[filename];
};

/**
 * Get the compilation result for a specified filename.
 */
TypeScriptSystemJsHost.prototype.compile = function(filename) {
  logger.log("compiling " + filename);

  var output = this._services.getEmitOutput(filename);

  if (output.emitOutputStatus === ts.EmitReturnStatus.Succeeded) {

    console.log(JSON.stringify(output));

    var jsname = tsToJs(filename);
    console.log(jsname);
    var jstext = output.outputFiles.filter(function(file) {
        return file.name == jsname;
      })[0].text

    // strip out source urls
    if (jstext)
      jstext = jstext.replace(convert.mapFileCommentRegex, '');

    var mapname = tsToJsMap(filename);
    console.log(mapname);
    var maptext = output.outputFiles.filter(function(file) {
        return file.name == mapname;
      })[0].text;

    var mapobj = JSON.parse(maptext);
    //mapobj.setProperty('sources', [filename]);
    mapobj['sources'] = [filename];
    //map.setProperty('sourcesContent', [self.host.cachedInput[inputPath].ts.text]);  

    return {
      failure: false,
      errors: [],
      js: jstext,
      map: mapobj
    }
  } else {
    var diagnostics = this._services.getCompilerOptionsDiagnostics()
      .concat(this._services.getSyntacticDiagnostics(filename))
      .concat(this._services.getSemanticDiagnostics(filename));

    this.outputDiagnostics(diagnostics);

    return {
      failure: true,
      errors: diagnostics,
      js: undefined,
      map: undefined
    }
  }
};

/**
 * Write the compiler errors to console
 *
 * @param {string} the entry file
 * @param {array} the TypeScript compiler errors
 * @return {boolean} success
 * @api private
 */
TypeScriptSystemJsHost.prototype.outputDiagnostics = function(diags) {
  // feature: don't spam the console, only display the first 10 errors
  diags.slice(0, 10)
    .forEach(function(diag) {
      // feature: print the compiler output over 2 lines! file then message
      if (diag.file) {
        var loc = diag.file.getLineAndCharacterFromPosition(diag.start);
        var filename = diag.file.filename;//Compiler.normalizePath(path.relative(entry.root, diag.file.filename));
        var output = filename + "(" + loc.line + "," + loc.character + "): ";

        // TODO - get these to work as source hyperlinks in chrome?
        if (diag.category === ts.DiagnosticCategory.Error)
          logger.error(output)
        else
          logger.warn(output)
      }

      if (diag.category === 1)
        logger.error(diag.messageText + " (TS" + diag.code + ")");
      else
        logger.warn(diag.messageText + " (TS" + diag.code + ")");
    });
}

function isTypescript(file) {
  return (/\.ts$/i).test(file);
}

function isTypescriptDeclaration(file) {
  return (/\.d\.ts$/i).test(file);
}

function tsToJs(tsFile) {
  return tsFile.replace(/\.ts$/i, '.js');
}

function tsToJsMap(tsFile) {
  return tsFile.replace(/\.ts$/i, '.js.map');
}

module.exports = TypeScriptSystemJsHost;
module.exports.isTypescript = isTypescript;
module.exports.isTypescriptDeclaration = isTypescriptDeclaration;
module.exports.tsToJs = tsToJs;
module.exports.normalizePath = ts.normalizePath;
