var fs = require('fs');
var path = require('path');
var should  = require('should');
var Promise = require('bluebird');

var Traceur = require('traceur');

// Traceur will compile all JS aside from node modules
Traceur.require.makeDefault(function(filename) {
   return !(/node_modules/.test(filename));
});

var TypeChecker = require('../lib/type-checker').TypeChecker;
var CompilerHost = require('../lib/compiler-host').CompilerHost;
var formatErrors = require('../lib/format-errors').formatErrors;

var missingFile = '/somefolder/fixtures-es6/program1/missing-file.ts';
var missingImport = require.resolve('./fixtures-es6/program1/missing-import.ts');
var syntaxError = require.resolve('./fixtures-es6/program1/syntax-error.ts');
var referenceSyntaxError = require.resolve('./fixtures-es6/program1/ref-syntax-error.ts');
var typeError = require.resolve('./fixtures-es6/program1/type-error.ts');
var nestedTypeError = require.resolve('./fixtures-es6/program1/nested-type-error.ts');
var noImports = require.resolve('./fixtures-es6/program1/no-imports.ts');
var oneImport = require.resolve('./fixtures-es6/program1/one-import.ts');
var ambientReference = require.resolve('./fixtures-es6/ambients/ambient-reference.ts');
var ambientReferenceDisabled = require.resolve('./fixtures-es6/ambients/ambient-reference-disabled.ts');
var ambientImportJs = require.resolve('./fixtures-es6/ambients/ambient-import-js.ts');
var ambientImportTs = require.resolve('./fixtures-es6/ambients/ambient-import-ts.ts');
var ambientDuplicate = require.resolve('./fixtures-es6/ambients/ambient-duplicate.ts');
var ambientRequires = require.resolve('./fixtures-es6/ambients/ambient-requires.ts');
var refImport = require.resolve('./fixtures-es6/program1/ref-import.ts');
var constEnums = require.resolve('./fixtures-es6/program1/const-enums.ts');
var external = require.resolve('./fixtures-es6/external/entry.ts');
var importCss = require.resolve('./fixtures-es6/css/import-css.ts');
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
      result = require.resolve("./fixtures-es6/ambients/resolved/" + dep + ".ts");
   else if (dep.indexOf("ambient") == 0)
      result = require.resolve("./fixtures-es6/ambients/resolved/" + dep);
   else if (dep.indexOf("typescript/") == 0)
      result = require.resolve(dep);
   else
      result = dep + ".js";

   if ((path.extname(result) != '.ts') && (path.extname(result) != '.js') && (path.extname(result) != '.css'))
      result = result + ".ts";

   //console.log("resolved " + parent + " -> " + result);
   return Promise.resolve(result);
}

describe('Type Checker ES6', function () {

   var typeChecker;
   var host;
   var read = function(filename) {
      var source = fs.readFileSync(filename, 'utf8');
      host.addFile(filename, source);
      return source;   
   }

   beforeEach(function() {
      filelist = [];
		host = new CompilerHost({});
      typeChecker = new TypeChecker(host, resolve, fetch);
   });

   it('compiles successfully', function () {
      return typeChecker.check(noImports, read(noImports))
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('loads lib.d.ts', function () {
      return typeChecker.check(noImports, read(noImports))
         .then(function(diags) {
            filelist.should.have.length(1);
         });
   });

   xit('uses config options', function (done) {
      var options = {
         sourceMap: false
      };
      compiler = new Compiler(fetch, resolve, options);
      compiler.load(oneImport)
         .then(function(txt) {
            return compiler.compile(oneImport);
         })
         .then(function(output) {
            output.should.have.property('failure', false);
            output.should.have.property('errors').with.lengthOf(0);
            output.should.have.property('js').with.lengthOf(80);
         })
         .then(done)
         .catch(done);
   });

   xit('compiles ambient imports', function (done) {
      compiler.load(ambientImportJs)
         .then(function(txt) {
            return compiler.compile(ambientImportJs);
         })
         .then(function(output) {
            output.should.have.property('failure', false);
            output.should.have.property('errors').with.lengthOf(0);
            //output.should.have.property('js').with.lengthOf(0);
         })
         .then(done)
         .catch(done);
   });

   xit('errors if an import is missing', function (done) {
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
         .then(done)
         .catch(done);
   });

   xit('catches type-checker errors', function (done) {
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
         .then(done)
         .catch(done);
   });

   xit('catches nested type-checker errors', function (done) {
      compiler.load(nestedTypeError)
         .then(function(txt) {
            return compiler.compile(nestedTypeError);
         })
         .then(function(output) {
            formatErrors(output.errors, console);
            output.should.have.property('failure', true);
            output.should.have.property('errors').with.lengthOf(1);
            output.errors[0].code.should.be.equal(2339);
         })
         .then(done)
         .catch(done);
   });

   xit('fetches all the files needed for compilation', function (done) {
      compiler.load(nestedTypeError)
         .then(function(txt) {
            return compiler.compile(nestedTypeError);
         })
         .then(function(output) {
            //formatErrors(output.errors, console);
            filelist.length.should.be.equal(4);
         })
         .then(done)
         .catch(done);
   });

   it('catches syntax errors', function () {
      return typeChecker.check(syntaxError, read(syntaxError))
         .then(function(diags) {
            diags.should.have.length(3);
         });
   });

   xit('catches syntax errors in references files', function (done) {
      compiler.load(referenceSyntaxError)
         .then(function(txt) {
            return compiler.compile(referenceSyntaxError);
         })
         .then(function(output) {
            //formatErrors(output.errors, console);
            output.should.have.property('failure', true);
            output.should.have.property('errors').with.lengthOf(8);
         })
         .then(done)
         .catch(done);
   });

   it('handles ambient references', function () {
      return typeChecker.check(ambientReferenceDisabled, read(ambientReferenceDisabled))
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   xit('resolves ambient references when resolveAmbientRefs option is true', function () {
      var options = {
         sourceMap: false,
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host, resolve, fetch);
      return typeChecker.check(ambientReference, read(ambientReference))
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   xit('handles ambient javascript imports', function (done) {
      compiler.load(ambientImportJs)
         .then(function(txt) {
            return compiler.compile(ambientImportJs);
         })
         .then(function(output) {
            formatErrors(output.errors, console);
            output.should.have.property('failure', false);
            output.should.have.property('errors').with.lengthOf(0);
         })
         .then(done)
         .catch(done);
   });

   xit('handles ambient typescript imports', function (done) {
      compiler.load(ambientImportTs)
         .then(function(txt) {
            return compiler.compile(ambientImportTs);
         })
         .then(function(output) {
            formatErrors(output.errors, console);
            output.should.have.property('failure', false);
            output.should.have.property('errors').with.lengthOf(0);
         })
         .then(done)
         .catch(done);
   });

   xit('handles ambients with subset names', function (done) {
      compiler.load(ambientDuplicate)
         .then(function(txt) {
            return compiler.compile(ambientDuplicate);
         })
         .then(function(output) {
            formatErrors(output.errors, console);
            output.should.have.property('failure', false);
            output.should.have.property('errors').with.lengthOf(0);
         })
         .then(done)
         .catch(done);
   });

   it('handles ambients with internal requires', function () {
      return typeChecker.check(ambientRequires, read(ambientRequires))
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   xit('handles external imports ', function (done) {
      compiler.load(external)
         .then(function(txt) {
            return compiler.compile(external);
         })
         .then(function(output) {
            formatErrors(output.errors, console);
            output.should.have.property('failure', false);
            output.should.have.property('errors').with.lengthOf(0);
         })
         .then(done)
         .catch(done);
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
         .then(done)
         .catch(done);
   });

   it('imports css', function () {
      return typeChecker.check(importCss, read(importCss))
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });
});
