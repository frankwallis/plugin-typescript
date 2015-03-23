var should  = require('should');
var Traceur = require('traceur');

// Traceur will compile all JS aside from node modules
Traceur.require.makeDefault(function(filename) {
   return !(/node_modules/.test(filename));
});

var fixRequires = require('../lib/fix-requires').fixRequires;

describe( 'Fix Requires', function () {

   it('ignores external requires', function () {
      var input = 'require("angular");';
      var output = input;
      fixRequires('a.js', input).should.be.equal(output);
   });

   it('converts relative paths', function () {
      var input = 'require("./my-file");';
      var output = 'require("./my-file.ts!");';
      fixRequires('a.js', input).should.be.equal(output);
   });

   it('converts absolute paths', function () {
      var input = 'require("/my-file");';
      var output = 'require("/my-file.ts!");';
      fixRequires('a.js', input).should.be.equal(output);
   });

   it('converts parent paths', function () {
      var input = 'require("../my-file");';
      var output = 'require("../my-file.ts!");';
      fixRequires('a.js', input).should.be.equal(output);
   });

   it('ignores files with extensions', function () {
      var input = 'require("./my-file.html");';
      var output = input;
      fixRequires('a.js', input).should.be.equal(output);
   });
});
