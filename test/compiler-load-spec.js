var fs = require('fs');
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
var circularFile = require.resolve('./fixtures/program1/circular.ts');
var missingImport = require.resolve('./fixtures/program1/missing-import.ts');
var syntaxError = require.resolve('./fixtures/program1/syntax-error.ts');
var typeError = require.resolve('./fixtures/program1/type-error.ts');
var nestedTypeError = require.resolve('./fixtures/program1/nested-type-error.ts');
var noImports = require.resolve('./fixtures/program1/no-imports.ts');
var oneImport = require.resolve('./fixtures/program1/one-import.ts');
var ambientImport = require.resolve('./fixtures/program1/ambient-import.ts');
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
   //console.log("resolving " + parent + " -> " + dep);
   var result = "";

   if (dep[0] == '/')
      result = dep;
   else if (dep[0] == '.')
      result = path.join(path.dirname(parent), dep);
   else
      result = require.resolve(dep);

   if (path.extname(result) != '.ts')
      result = result + ".ts";

   //console.log("resolved " + parent + " -> " + result);
   return Promise.resolve(result);
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
               console.log('loaded');
               file.text.should.be.equal("export var a = 1;\n");
               filelist.length.should.be.equal(2);
            })
            .then(done, done)
      });

      it('loads lib.d.ts', function (done) {
         compiler.load(noImports)
            .then(function(file) {
               file.text.should.be.equal("export var a = 1;\n");
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

      it('ignores ambient imports', function (done) {
         compiler.load(ambientImport)
            .then(function(file) {
               return compiler.compile(ambientImport);
            })
            .then(function(output) {
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
