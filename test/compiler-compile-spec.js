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
var missingImport = require.resolve('./fixtures/program1/missing-import.ts');
var syntaxError = require.resolve('./fixtures/program1/syntax-error.ts');
var referenceSyntaxError = require.resolve('./fixtures/program1/ref-syntax-error.ts');
var typeError = require.resolve('./fixtures/program1/type-error.ts');
var nestedTypeError = require.resolve('./fixtures/program1/nested-type-error.ts');
var noImports = require.resolve('./fixtures/program1/no-imports.ts');
var oneImport = require.resolve('./fixtures/program1/one-import.ts');
var ambientReference = require.resolve('./fixtures/ambients/ambient-reference.ts');
var ambientImportJs = require.resolve('./fixtures/ambients/ambient-import-js.ts');
var ambientImportTs = require.resolve('./fixtures/ambients/ambient-import-ts.ts');
var ambientDuplicate = require.resolve('./fixtures/ambients/ambient-duplicate.ts');
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
   //console.log("resolving " + parent + " -> " + dep);
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

   // if (result[0] == '/')
   //    result = result.slice(1);

   //console.log("resolved " + parent + " -> " + result);
   return Promise.resolve(result);
}

describe('Incremental Compiler', function () {

   var compiler;

   describe('compile', function () {
      beforeEach(function() {
         filelist = [];
         compiler = new Compiler(fetch, resolve);
      });

      it('compiles successfully', function (done) {
         compiler.load(oneImport)
            .then(function(txt) {
               return compiler.compile(oneImport);
            })
            .then(function(output) {
               output.should.have.property('failure', false);
               output.should.have.property('errors').with.lengthOf(0);
               //output.should.have.property('js').with.lengthOf(0);
            })
            .then(done, done);
      });

      it('compiles ambient imports', function (done) {
         compiler.load(ambientImportJs)
            .then(function(txt) {
               return compiler.compile(ambientImportJs);
            })
            .then(function(output) {
               output.should.have.property('failure', false);
               output.should.have.property('errors').with.lengthOf(0);
               //output.should.have.property('js').with.lengthOf(0);
            })
            .then(done, done);
      });

      it('errors if an import is missing', function (done) {
         compiler.load(missingImport)
            .then(function(txt) {
               return compiler.compile(missingImport);
            })
            .then(function(output) {
               output.should.have.property('failure', 42);
            })
            .catch(function(err) {
               err.toString().should.be.containEql('ENOENT');
            })
            .then(done, done);
      });

      it('catches type-checker errors', function (done) {
         compiler.load(typeError)
            .then(function(txt) {
               return compiler.compile(typeError);
            })
            .then(function(output) {
               //formatErrors(output.errors, console);
               output.should.have.property('failure', true);
               output.should.have.property('errors').with.lengthOf(1);
               output.errors[0].code.should.be.equal(2322);
            })
            .then(done, done);
      });

      it('catches nested type-checker errors', function (done) {
         compiler.load(nestedTypeError)
            .then(function(txt) {
               return compiler.compile(nestedTypeError);
            })
            .then(function(output) {
               //formatErrors(output.errors, console);
               output.should.have.property('failure', true);
               output.should.have.property('errors').with.lengthOf(1);
               output.errors[0].code.should.be.equal(2339);
            })
            .then(done, done);
      });

      it('fetches all the files needed for compilation', function (done) {
         compiler.load(nestedTypeError)
            .then(function(txt) {
               return compiler.compile(nestedTypeError);
            })
            .then(function(output) {
               //formatErrors(output.errors, console);
               filelist.length.should.be.equal(4);
            })
            .then(done, done);
      });

      it('catches syntax errors', function (done) {
         compiler.load(syntaxError)
            .then(function(txt) {
               return compiler.compile(syntaxError);
            })
            .then(function(output) {
               //formatErrors(output.errors, console);
               output.should.have.property('failure', true);
               output.should.have.property('errors').with.lengthOf(3);
            })
            .then(done, done);
      });

      it('catches syntax errors in references files', function (done) {
         compiler.load(referenceSyntaxError)
            .then(function(txt) {
               return compiler.compile(referenceSyntaxError);
            })
            .then(function(output) {
               //formatErrors(output.errors, console);
               output.should.have.property('failure', true);
               output.should.have.property('errors').with.lengthOf(8);
            })
            .then(done, done);
      });

      it('handles ambient references', function (done) {
         compiler.load(ambientReference)
            .then(function(txt) {
               return compiler.compile(ambientReference);
            })
            .then(function(output) {
               formatErrors(output.errors, console);
               output.should.have.property('failure', false);
               output.should.have.property('errors').with.lengthOf(0);
            })
            .then(done, done);
      });

      it('handles ambient javascript imports', function (done) {
         compiler.load(ambientImportJs)
            .then(function(txt) {
               return compiler.compile(ambientImportJs);
            })
            .then(function(output) {
               formatErrors(output.errors, console);
               output.should.have.property('failure', false);
               output.should.have.property('errors').with.lengthOf(0);
            })
            .then(done, done);
      });

      it('handles ambient typescript imports', function (done) {
         compiler.load(ambientImportTs)
            .then(function(txt) {
               return compiler.compile(ambientImportTs);
            })
            .then(function(output) {
               formatErrors(output.errors, console);
               output.should.have.property('failure', false);
               output.should.have.property('errors').with.lengthOf(0);
            })
            .then(done, done);
      });

      it('handles ambients with subset names', function (done) {
         compiler.load(ambientDuplicate)
            .then(function(txt) {
               return compiler.compile(ambientDuplicate);
            })
            .then(function(output) {
               formatErrors(output.errors, console);
               output.should.have.property('failure', false);
               output.should.have.property('errors').with.lengthOf(0);
            })
            .then(done, done);
      });

      it('handles ambients with internal requires', function (done) {
         compiler.load(ambientRequires)
            .then(function(txt) {
               return compiler.compile(ambientRequires);
            })
            .then(function(output) {
               formatErrors(output.errors, console);
               output.should.have.property('failure', false);
               output.should.have.property('errors').with.lengthOf(0);
            })
            .then(done, done);
      });

      xit('handles const enums', function (done) {
         compiler.load(constEnums)
            .then(function(txt) {
               return compiler.compile(constEnums);
            })
            .then(function(output) {
               //formatErrors(output.errors, console);
               output.should.have.property('failure', false);
               output.should.have.property('errors').with.lengthOf(0);
               output.js.should.containEql("return 1 /* Yes */;");
            })
            .then(done, done);
      });
   });
});
