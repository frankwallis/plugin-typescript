//var _ = require('lodash');
var path = require('path');
var should  = require('should');

var Compiler = require('../lib/incremental-compiler');

var noImports = path.join(__dirname, './fixtures/program1/no-imports.ts');
var missingImport = path.join(__dirname, './fixtures/program1/missing-import.ts');
var syntaxError = path.join(__dirname, './fixtures/program1/syntax-error.ts');
var typeError = path.join(__dirname, './fixtures/program1/type-error.ts');

describe( 'Incremental Compiler', function () {

    describe( 'load', function () {
        it('loads the file successfully', function (done) { 
            var compiler = new Compiler();
            compiler.load(noImports).then(function(res) {
                console.log('here');
                res.should.be.ok;
                done();
            });
        });

        // it('returns syntax errors', function () {
        //     var compiler = new Compiler();
        //     var results = compiler.compileSource("./anyfile1.js", "val b = a export = c");
        //     results.should.have.property('failure', true);
        //     results.should.have.property('errors').with.lengthOf(1);
        // });

        // it('returns resolution errors', function () {
        //     var compiler = new Compiler();
        //     var results = compiler.compileSource("./anyfile1.js", "import a = require('./anotherfile');");
        //     results.should.have.property('failure', true);
        //     results.should.have.property('errors').with.lengthOf(1);
        // });
    });

    // it('returns missing file errors', function () {
    //     var compiler = new Compiler();
    //     var results = compiler.compile([missingFile]);
    //     results.should.have.property('failure', true);
    //     results.should.have.property('errors').with.lengthOf(3);
    // });

    // it('returns type-checker errors', function () {
    //     var compiler = new Compiler();
    //     var results = compiler.compile([typeError]);
    //     results.should.have.property('failure', true);
    //     results.should.have.property('errors').with.lengthOf(1);
    // });


    // it('only recompiles when something has changed', function () {
    //     var compiler = new Compiler();

    // });

    // it('returns cached output', function () {
    //     var compiler = new Compiler();

    // });

});
