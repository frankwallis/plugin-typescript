var fs = require('fs');
var os = require('os');
var path = require('path');
var should  = require('should');
var Promise = require('bluebird');

var Traceur = require('traceur');

// Traceur will compile all JS aside from node modules
Traceur.require.makeDefault(function(filename) {
   return !(/node_modules/.test(filename));
});

var Compiler = require('../lib/incremental-compiler').IncrementalCompiler;
var formatErrors = require('../lib/format-errors').formatErrors;

var missingFile = '/somefolder/fixtures/program1/missing-file.ts';
var circularFile = require.resolve('./fixtures/circular/circular.ts');
var missingImport = require.resolve('./fixtures/program1/missing-import.ts');
var syntaxError = require.resolve('./fixtures/program1/syntax-error.ts');
var typeError = require.resolve('./fixtures/program1/type-error.ts');
var nestedTypeError = require.resolve('./fixtures/program1/nested-type-error.ts');
var noImports = require.resolve('./fixtures/program1/no-imports.ts');
var oneImport = require.resolve('./fixtures/program1/one-import.ts');
var ambientImportJs = require.resolve('./fixtures/ambients/ambient-import-js.ts');
var ambientImportTs = require.resolve('./fixtures/ambients/ambient-import-ts.ts');
var ambientRequires = require.resolve('./fixtures/ambients/ambient-requires.ts');
var refImport = require.resolve('./fixtures/program1/ref-import.ts');
var constEnums = require.resolve('./fixtures/program1/const-enums.ts');

var filelist = [];

function fetch(filename) {
   //console.log("fetching " + filename);
   filelist.push(filename);
   var readFile = Promise.promisify(fs.readFile.bind(fs));
   return readFile(filename, 'utf8');
}

function resolve(dep, parent) {
   var result = "";

   if (dep[0] == '/')
      result = dep;
   else if (dep[0] == '.')
      result = path.join(path.dirname(parent), dep);
   else if (dep == "ambient")
      result = require.resolve("./fixtures/ambients/resolved/" + dep + ".ts");
   else if (dep.indexOf("ambient") == 0)
      result = require.resolve("./fixtures/ambients/resolved/" + dep);
   else if (dep.indexOf("typescript/") == 0)
      result = require.resolve(dep);
   else
      result = dep + ".js";

   if ((path.extname(result) != '.ts') && (path.extname(result) != '.js'))
      result = result + ".ts";

   //console.log("resolved " + parent + " -> " + result);
   return Promise.resolve(result);
}

function strip(str) {
   return str.replace("\r\n", "\n");
}

describe('Incremental Compiler', function () {

   var compiler;

   describe('load', function () {

      beforeEach(function() {
         filelist = [];
         compiler = new Compiler(fetch, resolve);
      });

      it('loads the correct file', function (done) {
         compiler.load(noImports)
            .then(function(file) {
               file.text.should.be.equal("export var a = 1;" + os.EOL);
               filelist.length.should.be.equal(2);
            })
            .then(done, done)
      });

      it('loads lib.d.ts', function (done) {
         compiler.load(noImports)
            .then(function(file) {
               file.text.should.be.equal("export var a = 1;" + os.EOL);
               return compiler.compile(noImports);
            })
            .then(function(output) {
               filelist.length.should.be.equal(2);
            })
            .then(done, done)
      });

      it('resolves imported dependencies', function (done) {
         compiler.load(oneImport)
            .then(function(file) {
               return compiler.compile(oneImport);
            })
            .then(function(output) {
               filelist.length.should.be.equal(3);
            })
            .then(done, done)
      });

      it('resolves referenced dependencies', function (done) {
         compiler.load(refImport)
            .then(function(file) {
               return compiler.compile(refImport);
            })
            .then(function(output) {
               filelist.length.should.be.equal(4);
            })
            .then(done, done)
      });

      it('ignores ambient javascript imports', function (done) {
         compiler.load(ambientImportJs)
            .then(function(file) {
               return compiler.compile(ambientImportJs);
            })
            .then(function(output) {
               //formatErrors(output.errors, console);
               filelist.length.should.be.equal(4);
            })
            .then(done, done)
      });

      it('loads ambient typescript imports', function (done) {
         compiler.load(ambientImportTs)
            .then(function(file) {
               return compiler.compile(ambientImportTs);
            })
            .then(function(output) {
               //formatErrors(output.errors, console);
               filelist.length.should.be.equal(4);
            })
            .then(done, done)
      });

      it('errors if a file is missing', function (done) {
         compiler.load(missingFile)
            .then(function(file) {
               txt.should.be.equal(42);
               done();
            }, function(err) {
               err.should.have.property("code", "ENOENT");
            })
            .then(done, done)
      });

      it('handles circular references', function (done) {
         compiler.load(circularFile)
            .then(function(file) {
               return compiler.compile(circularFile);
            })
            .then(function(output) {
               filelist.length.should.be.equal(4);
            })
            .then(done, done)
      });

      it('only fetches each file once', function (done) {
         compiler.load(oneImport)
            .then(function(file) {
               return compiler.compile(oneImport);
            })
            .then(function() {
               filelist.length.should.be.equal(3);
               filelist = [];
               return compiler.load(noImports, resolve, fetch);
            })
            .then(function() {
               filelist.length.should.be.equal(0);
            })
            .then(done, done)
      });
   });
});
