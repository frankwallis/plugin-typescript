var fs = require('fs');
var should  = require('should');

var Traceur = require('traceur');

// Traceur will compile all JS aside from node modules
Traceur.require.makeDefault(function(filename) {
   return !(/node_modules/.test(filename));
});

var CompilerHost = require('../lib/compiler-host').CompilerHost;
var Transpiler = require('../lib/transpiler').Transpiler;
var formatErrors = require('../lib/format-errors').formatErrors;

var oneImport = fs.readFileSync(require.resolve('./fixtures-es6/program1/one-import.ts'), 'utf8');
var es6Symbol = fs.readFileSync(require.resolve('./fixtures-es6/program1/symbol.ts'), 'utf8');
var syntaxError = fs.readFileSync(require.resolve('./fixtures-es6/program1/syntax-error.ts'), 'utf8');
var constEnums = require.resolve('./fixtures-es6/program1/const-enums.ts');

describe('Transpiler ES6', function () {

   var transpiler;

   describe('transpile', function () {
      beforeEach(function() {
         var host = new CompilerHost({});
         transpiler = new Transpiler(host);
      });

      it('transpiles successfully', function () {
         var output = transpiler.transpile('one-import.ts', oneImport);
         output.should.have.property('failure', false);
         output.should.have.property('errors').with.lengthOf(0);
         output.should.have.property('js').with.lengthOf(337);
      });
      
      it('removes SourceMappingURL', function () {
         var output = transpiler.transpile('one-import.ts', oneImport);
         output.js.should.not.containEql("SourceMappingURL");
      });

      it('returns sourceMap', function () {
         var output = transpiler.transpile('one-import.ts', oneImport);
         output.should.have.property('sourceMap').with.lengthOf(143);
      });

      it('catches syntax errors', function () {
         var output = transpiler.transpile('syntax-error.ts', syntaxError);
         //formatErrors(output.errors, console);
         output.should.have.property('failure', true);
         output.should.have.property('errors').with.lengthOf(1);
      });
      
      xit('errors on const enums', function (done) {
         var output = transpiler.transpile('syntax-error.ts', syntaxError);
         //formatErrors(output.errors, console);
         output.should.have.property('failure', true);
         output.should.have.property('errors').with.lengthOf(1);
      });

      it('uses config options', function () {
         var options = {
            sourceMap: false
         };
         var host = new CompilerHost(options);
         transpiler = new Transpiler(host);
         var output = transpiler.transpile('symbol.ts', es6Symbol);
         (output.sourceMap === undefined).should.be.true;
      });
   });
});
