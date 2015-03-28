var should  = require('should');
var Traceur = require('traceur');

// Traceur will compile all JS aside from node modules
Traceur.require.makeDefault(function(filename) {
   return !(/node_modules/.test(filename));
});

var isRelative = require('../lib/utils').isRelative;
var isAbsolute = require('../lib/utils').isAbsolute;
var isAmbientImport = require('../lib/utils').isAmbientImport;
var isTypescript = require('../lib/utils').isTypescript;
var isTypescriptDeclaration = require('../lib/utils').isTypescriptDeclaration;
var tsToJs = require('../lib/utils').tsToJs;
var tsToJsMap = require('../lib/utils').tsToJsMap;

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

   describe( 'tsToJs', function () {
      it('changes the file extension', function () {
         tsToJs('a.ts').should.be.equal('a.js');
         tsToJs('a.ts.ts').should.be.equal('a.ts.js');
      });

      it('ignores files with wrong extension', function () {
         tsToJs('a.jts').should.be.equal('a.jts');
      });
   });

   describe( 'tsToJsMap', function () {
      it('changes the file extension', function () {
         tsToJsMap('a.ts').should.be.equal('a.js.map');
         tsToJsMap('a.ts.ts').should.be.equal('a.ts.js.map');
      });

      it('ignores files with wrong extension', function () {
         tsToJsMap('a.jts').should.be.equal('a.jts');
      });
   });

   describe( 'isTypescript', function () {
      it('detects source files', function () {
         isTypescript('a.ts').should.be.true;
         isTypescript('a.js').should.be.false;
         isTypescript('a.ts.js').should.be.false;
         isTypescript('a.ts.ats').should.be.false;
      });

      it('detects declaration files', function () {
         isTypescript('a.d.ts').should.be.true;
      });
   });

   describe( 'isTypescriptDeclaration', function () {
      it('detects declaration files', function () {
         isTypescriptDeclaration('a.d.ts').should.be.true;
         isTypescriptDeclaration('a.js').should.be.false;
         isTypescriptDeclaration('a.d.ts.js').should.be.false;
         isTypescriptDeclaration('a.ts.ats').should.be.false;
      });

      it('ignores source files', function () {
         isTypescriptDeclaration('a.ts').should.be.false;
      });
   });

});
