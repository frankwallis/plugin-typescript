/**
 * @copyright 2015, Andrey Popp <me@andreypopp.com>
 */
'use strict';

var fs            = require('fs');
var util          = require('util');
var path          = require('path');
var ts            = require('typescript');
var objectAssign  = require('object-assign');
var Promise       = require('bluebird');

function prepareStaticSource(moduleId) {
  var filename = require.resolve(moduleId);
  var text = fs.readFileSync(filename, 'utf8');
  return {filename: filename, text: text};
}

//var RUNTIME = prepareStaticSource('./webpack-runtime.d.ts');
var LIB = prepareStaticSource('typescript/bin/lib.d.ts');

var DEFAULT_OPTIONS = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  sourceMap: true,
  verbose: false
};

function TypeScriptSystemJsHost(options) {
  this.options = {};
  objectAssign(this.options, DEFAULT_OPTIONS);
  objectAssign(this.options, options);

  this._files = {};
  this._pendingFiles = {};

  this._services = ts.createLanguageService(this, ts.createDocumentRegistry());
  this._runtimeRead = null;

//  this._addFile(RUNTIME.filename, RUNTIME.text);
  //this._addFile(LIB.filename, LIB.text);
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
  console.log('getting ' + filename + ' from ' + JSON.stringify(Object.keys(this._files)) )
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
  return require.resolve('typescript/bin/lib.d.ts');
  //return LIB.filename;
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
TypeScriptSystemJsHost.prototype._findImportDeclarations = function _findImportDeclarations(filename) {
  var node = this._services.getSourceFile(filename);
  var result = [this.getDefaultLibFilename()];
  visit(node);
  return result;

  function visit(node) {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
      result.push(node.moduleReference.expression.text);
    } else if (node.kind === ts.SyntaxKind.SourceFile) {
      result = result.concat(node.referencedFiles.map(function(f) {
        return f.filename;
        //return path.resolve(path.dirname(node.filename), f.filename);
      }));
    }
    ts.forEachChild(node, visit);
  }
};

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
};

TypeScriptSystemJsHost.prototype._addDependencies = function(filename, resolve, fetch) {

  var dependencies = [];

  this._findImportDeclarations(filename).forEach(function(dep) {
    if (!this._isExternal(dep)) {
      var resolved = resolve(filename, dep);

      if (!this._files[resolved]) {
        var loaded = this.load(resolved, resolve, fetch);

        if (isTypescriptDeclaration(resolved))
          loaded = loaded.then(function() {
            return this._addDependencies(resolved, resolve, fetch);      
          }.bind(this));

        dependencies.push(loaded);
      }
    }
  }.bind(this));

  return Promise.all(dependencies);
}

TypeScriptSystemJsHost.prototype._isExternal = function(dep) {
    return ((dep[0] != '.') && (dep[0] != '/'))
}

/**
 * Load the file and it's dependencies, return the source
 */
TypeScriptSystemJsHost.prototype.load = function(filename, resolve, fetch) {
  console.log("loading " + filename);

  if (!this._pendingFiles[filename]) {
    this._pendingFiles[filename] = 
      fetch(filename)
        .then(function(text) {
          this._addFile(filename, text);
          return this._addDependencies(filename, resolve, fetch)
            .then(function() {
              return text;
            });
        }.bind(this));
  }

  return this._pendingFiles[filename];
};

/**
 * Emit compilation result for a specified filename.
 */
TypeScriptSystemJsHost.prototype.compile = function(filename) {
  var output = this._services.getEmitOutput(filename);

  console.log(JSON.stringify(output, null, 4));

  if (output.emitOutputStatus === ts.EmitReturnStatus.Succeeded) {

    var jsname = tsToJs(filename);
    var mapname = tsToJs(filename) + ".map";

    return {
      failure: false,
      errors: [],
      js: output.outputFiles.filter(function(file) {
        return file.name == jsname;
      })[0].text, // TODO - strip out the sourceUrl
      map: output.outputFiles.filter(function(file) {
        return file.name == mapname;
      })[0].text,
    }
  } else {
    var diagnostics = this._services
      .getCompilerOptionsDiagnostics()
      .concat(this._services.getSyntacticDiagnostics(filename))
      .concat(this._services.getSemanticDiagnostics(filename));

    return {
      failure: true,
      errors: diagnostics,
      js: undefined,
      map: undefined
    }
  }
};

function isTypescript(file) {
  return (/\.ts$/i).test(file);
}

function isTypescriptDeclaration(file) {
  return (/\.d\.ts$/i).test(file);
}

function tsToJs(tsFile) {
  return tsFile.replace(/\.ts$/i, '.js');
}

function TypeScriptCompilationError(diagnostics) {
  this.diagnostics = diagnostics;
}
util.inherits(TypeScriptCompilationError, Error);

module.exports = TypeScriptSystemJsHost;
module.exports.TypeScriptCompilationError = TypeScriptCompilationError;
