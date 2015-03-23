var should  = require('should');
var Traceur = require('traceur');

// Traceur will compile all JS aside from node modules
Traceur.require.makeDefault(function(filename) {
   return !(/node_modules/.test(filename));
});

var isRelative = require('../lib/utils').isRelative;
var isAbsolute = require('../lib/utils').isAbsolute;
var isAmbientImport = require('../lib/utils').isAmbientImport;
var isTypeScript = require('../lib/utils').isTypeScript;
var isTypeScriptDeclaration = require('../lib/utils').isTypeScriptDeclaration;

describe( 'Utils', function () {

   describe( 'isRelative', function () {
      it('does not match absolute paths', function () {
         isRelative("/a/b.c").should.be.false;
         isRelative("/a/b").should.be.false;
      });

      it('matches relative paths', function () {
         isRelative("../a/b").should.be.true;
         isRelative("./a/b").should.be.true;
      });

      it('does not match external paths', function () {
         isRelative("b").should.be.false;
         isRelative("a/b.c").should.be.false;
      });
   });

   describe( 'isAbsolute', function () {
      it('matches absolute paths', function () {
         isAbsolute("/a/b.c").should.be.true;
         isAbsolute("/a/b").should.be.true;
      });

      it('does not match relative paths', function () {
         isAbsolute("../a/b").should.be.false;
         isAbsolute("./a/b").should.be.false;
      });

      it('does not match external paths', function () {
         isAbsolute("b").should.be.false;
         isAbsolute("a/b.c").should.be.false;
      });
   });

   describe( 'isAmbientImport', function () {
      it('does not match absolute paths', function () {
         isAmbientImport("/a/b.c").should.be.false;
         isAmbientImport("/a/b").should.be.false;
      });

      it('does not match relative paths', function () {
         isAmbientImport("../a/b").should.be.false;
         isAmbientImport("./a/b").should.be.false;
      });

      it('matches external paths', function () {
         isAmbientImport("b").should.be.true;
         isAmbientImport("a/b.c").should.be.true;
      });
   });
});
