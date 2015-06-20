var path = require('path');
var should  = require('should');
var ts = require('typescript');

var Traceur = require('traceur');

// Traceur will compile all JS aside from node modules
Traceur.require.makeDefault(function(filename) {
   return !(/node_modules/.test(filename));
});

var Host = require('../lib/compiler-host').CompilerHost;

describe( 'Compiler Host', function () {

   var host;
   beforeEach(function() {
      host = new Host({});
   });

   describe( 'constructor', function () {
      it('defaults the config', function () {
         var options = host._options;
         options.module.should.be.equal(ts.ModuleKind.System);
         options.target.should.be.equal(ts.ScriptTarget.ES5);
         options.allowNonTsExtensions.should.be.true;
      });

      it('defaults the config', function () {
         var config = {
            noImplicitAny: true
         };
         host = new Host(config);
         var options = host._options;
         options.module.should.be.equal(ts.ModuleKind.System);
         options.target.should.be.equal(ts.ScriptTarget.ES5);
         options.allowNonTsExtensions.should.be.true;
         options.noImplicitAny.should.be.true;
      });
   });
   
   describe( 'addFile', function () {
      it('adds files', function () {
         var filename = 'filea.ts';
         var sourceFile = host.addFile(filename, 'sometext');
         var sourceFile1 = host.getSourceFile(filename);
         sourceFile.should.be.equal(sourceFile1);
      });

      it('overwrites file if it has changed', function () {
         var filename = 'filea.ts';
         var sourceFile1 = host.addFile(filename, 'sometext');
         var sourceFile2 = host.addFile(filename, 'sometext');
         sourceFile1.should.not.be.equal(sourceFile2);
         var sourceFile3 = host.getSourceFile(filename);
         sourceFile2.should.be.equal(sourceFile3);
      });
   });
});
