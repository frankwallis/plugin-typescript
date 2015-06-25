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
var ambientReference2 = require.resolve('./fixtures-es6/ambients/module1/ambient-references2.ts');
var ambientReferenceDisabled = require.resolve('./fixtures-es6/ambients/ambient-reference-disabled.ts');
var ambientImportJs = require.resolve('./fixtures-es6/ambients/ambient-import-js.ts');
var ambientImportTs = require.resolve('./fixtures-es6/ambients/ambient-import-ts.ts');
var ambientDuplicate = require.resolve('./fixtures-es6/ambients/ambient-duplicate.ts');
var ambientRequires = require.resolve('./fixtures-es6/ambients/ambient-requires.ts');
var refImport = require.resolve('./fixtures-es6/program1/ref-import.ts');
var externalEntry = require.resolve('./fixtures-es6/external/entry.ts');
var externalOther = require.resolve('./fixtures-es6/external/other.ts');
var externalDependency = require.resolve('./fixtures-es6/external/dependency.ts');
var circularFile = require.resolve('./fixtures-es6/circular/circular.ts');
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

   function typecheckAll(filelist) {
      var fileChecks = [];
      
      /* read the files and feed them into the type-checker */
      filelist.forEach(function (filename) {
         var text = fs.readFileSync(filename, 'utf8');
         host.addFile(filename, text);
         fileChecks.push(typeChecker.check(filename, text));
      });
      
      /* concatenate all the errors */
      return Promise.all(fileChecks)
         .then(function(fileDiags) {
            return fileDiags.reduce(function(total, current) {
               return total.concat(current);
            }, []);
         });
   }

   beforeEach(function() {
      filelist = [];
		host = new CompilerHost({});
      typeChecker = new TypeChecker(host, resolve, fetch);
   });

   it('compiles successfully', function () {
      return typecheckAll([noImports])
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('loads lib.d.ts', function () {
      return typecheckAll([noImports])
         .then(function(diags) {
            filelist.should.have.length(1);
         });
   });

   it('uses config options', function () {
      var options = {
         noImplicitAny: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host, resolve, fetch);
      return typecheckAll([oneImport, noImports])
         .then(function(diags) {
            diags.should.have.length(1);
            diags[0].code.should.be.equal(7005);
         });
   });

   it('compiles ambient imports', function () {
      return typecheckAll([ambientImportJs])
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('catches type errors', function () {
      return typecheckAll([typeError])
         .then(function(diags) {
            diags.should.have.length(1);
            diags[0].code.should.be.equal(2322);
         });
   });

   it('catches nested type-checker errors', function () {
      return typecheckAll([nestedTypeError, oneImport, noImports])
         .then(function(diags) {
            diags.should.have.length(1);
            diags[0].code.should.be.equal(2339);
         });
   });

   it('fetches all the files needed for compilation', function () {
      return typecheckAll([refImport])
         .then(function(diags) {
            filelist.should.have.length(3);
            diags.should.have.length(0);
         });
   });

   it('catches syntax errors', function () {
      return typecheckAll([syntaxError])
         .then(function(diags) {
            diags.should.have.length(3);
         });
   });

   xit('catches syntax errors in reference files', function () {
      return typecheckAll([referenceSyntaxError])
         .then(function(diags) {
            diags.should.have.length(8);
         });
   });

   it('handles ambient references', function () {
      return typecheckAll([ambientReferenceDisabled])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('resolves ambient references when resolveAmbientRefs option is true', function () {
      var options = {
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host, resolve, fetch);
      return typecheckAll([ambientReference, ambientReference2])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('handles ambient javascript imports', function () {
      return typecheckAll([ambientImportJs])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('handles circular references', function () {
      return typecheckAll([circularFile])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('handles ambient typescript imports', function () {
      var options = {
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host, resolve, fetch);
      return typecheckAll([ambientImportTs])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('handles ambients with subset names', function () {
      var options = {
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host, resolve, fetch);
      return typecheckAll([ambientDuplicate, ambientImportTs])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('handles ambients with internal requires', function () {
      return typecheckAll([ambientRequires])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('handles external imports', function () {
      return typecheckAll([externalEntry, externalOther, externalDependency])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });

   it('imports css', function () {
      return typecheckAll([importCss])      
         .then(function(diags) {
            diags.should.have.length(0);
         });
   });
});
