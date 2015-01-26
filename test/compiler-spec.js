//var _ = require('lodash');
var path = require('path');
var should  = require('should');

var Compiler = require('../lib/compiler');

var goodFile = path.join(__dirname, './fixtures/program1/file1.ts');
var missingFile = path.join(__dirname, './fixtures/program1/missing-file.ts');
var syntaxError = path.join(__dirname, './fixtures/program1/syntax-error.ts');
var typeError = path.join(__dirname, './fixtures/program1/type-error.ts');

describe( 'compiler', function () {

    it('compiles successfully', function () {
        var compiler = new Compiler();
        var results = compiler.compile([goodFile]);
        results.should.have.property('failure', false);
        //results.should.have.property('output').with.lengthOf(1);
        results.should.have.property('errors').with.lengthOf(0);
    });

    it('returns missing file errors', function () {
        var compiler = new Compiler();
        var results = compiler.compile([missingFile]);
        results.should.have.property('failure', true);
        results.should.have.property('errors').with.lengthOf(3);
    });

    it('returns type-checker errors', function () {
        var compiler = new Compiler();
        var results = compiler.compile([typeError]);
        results.should.have.property('failure', true);
        results.should.have.property('errors').with.lengthOf(1);
    });

    it('returns syntax errors', function () {
        var compiler = new Compiler();
        var results = compiler.compile([syntaxError]);
        results.should.have.property('failure', true);
        results.should.have.property('errors').with.lengthOf(1);
    });

    it('only recompiles when something has changed', function () {
        var compiler = new Compiler();

    });

    it('returns cached output', function () {
        var compiler = new Compiler();

    });

});
