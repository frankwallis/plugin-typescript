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

var missingFile = '/somefolder/fixtures/program1/missing-file.ts';
var missingImport = require.resolve('./fixtures/program1/missing-import.ts');
var syntaxError = require.resolve('./fixtures/program1/syntax-error.ts');
var typeError = require.resolve('./fixtures/program1/type-error.ts');
var noImports = require.resolve('./fixtures/program1/no-imports.ts');
var oneImport = require.resolve('./fixtures/program1/one-import.ts');
var externalImport = require.resolve('./fixtures/program1/external-import.ts');
var refImport = require.resolve('./fixtures/program1/ref-import.ts');
var constEnums = require.resolve('./fixtures/program1/const-enums.ts');

var filelist = [];

function fetch(filename) {
    //console.log("fetching " + filename);
    filelist.push(filename);
    var readFile = Promise.promisify(fs.readFile.bind(fs));
    return readFile(filename, 'utf8');
}

function resolve(parent, dep) {
    //console.log("resolving " + parent + " -> " + dep);
    var result = "";

    if (dep[0] == '/')
        result = dep;
    else if (dep[0] == '.')
        result = path.join(path.dirname(parent), dep);
    else
        result = require.resolve(dep);

    if (path.extname(result) != '.ts')
        result = result + ".ts";

    //console.log("resolved " + parent + " -> " + result);
    return Promise.resolve(result);
}

describe('Incremental Compiler', function () {

    var compiler;

    describe('load', function () {

        beforeEach(function() {
            filelist = [];
            compiler = new Compiler(fetch, resolve);
        });

        it('loads the correct file', function (done) {
            compiler.load(noImports).then(function(txt) {
                txt.should.be.equal("var a = 1;\nexport = a;");
                filelist.length.should.be.equal(2);
                done();
            }).catch(done);
        });

        it('loads lib.d.ts', function (done) {
            compiler.load(noImports).then(function(txt) {
                txt.should.be.equal("var a = 1;\nexport = a;");

                compiler.compile(noImports).then(function(output) {
                    filelist.length.should.be.equal(2);
                    done();
                }).catch(done);
            }).catch(done);
        });

        it('resolves imported dependencies', function (done) {
            compiler.load(oneImport).then(function(txt) {
                compiler.compile(oneImport).then(function(output) {
                    filelist.length.should.be.equal(3);
                    done();
                }).catch(done);
            }).catch(done);
        });

        it('resolves referenced dependencies', function (done) {
            compiler.load(refImport).then(function(txt) {
                compiler.compile(refImport).then(function(output) {
                    filelist.length.should.be.equal(4);
                    done();
                }).catch(done);
            }).catch(done);
        });

        it('ignores external dependencies', function (done) {
            compiler.load(externalImport).then(function(txt) {
                compiler.compile(externalImport).then(function(output) {
                    filelist.length.should.be.equal(4);
                    done();
                }).catch(done);
            }).catch(done);
        });

        it('errors if a file is missing', function (done) {
            compiler.load(missingFile).then(function(txt) {
                txt.should.be.equal(42);
                done();
            }, function(err) {
                err.should.have.property("code", "ENOENT");
                done();
            }).catch(done);
        });

        it('only fetches each file once', function (done) {
            compiler.load(oneImport).then(function(txt) {
                filelist.length.should.be.equal(3);
                filelist = [];

                compiler.load(noImports, resolve, fetch).then(function(txt) {
                    filelist.length.should.be.equal(0);
                    done();
                }).catch(done);
            }).catch(done);
        });

    });

    describe('compile', function () {
        beforeEach(function() {
            filelist = [];
            compiler = new Compiler(fetch, resolve);
        });

        it('compiles successfully', function (done) {
            compiler.load(oneImport).then(function(txt) {
                compiler.compile(oneImport).then(function(output) {
                    output.should.have.property('failure', false);
                    output.should.have.property('errors').with.lengthOf(0);
                    //output.should.have.property('js').with.lengthOf(0);
                    done();
                }).catch(done);
            }).catch(done);
        });

        it('compiles external modules', function (done) {
            compiler.load(externalImport).then(function(txt) {
                compiler.compile(externalImport).then(function(output) {
                    output.should.have.property('failure', false);
                    output.should.have.property('errors').with.lengthOf(0);
                    //output.should.have.property('js').with.lengthOf(0);
                    done();
                }).catch(done);
            }).catch(done);
        });

        it('errors if an import is missing', function (done) {
            compiler.load(missingImport).then(function(txt) {
                compiler.compile(missingImport).then(function(output) {
                    output.should.have.property('failure', 42);
                    done();
                }, function(err) {
                    err.toString().should.be.containEql('ENOENT');
                    done();
                });
            }).catch(done);
        });

        it('returns type-checker errors', function (done) {
            compiler.load(typeError).then(function(txt) {
                compiler.compile(typeError).then(function(output) {
                    output.should.have.property('failure', true);
                    output.should.have.property('errors').with.lengthOf(1);
                    done();
                }).catch(done);
            }).catch(done);
        });

        it('returns syntax errors', function (done) {
            compiler.load(syntaxError).then(function(txt) {
                compiler.compile(syntaxError).then(function(output) {
                    output.should.have.property('failure', true);
                    output.should.have.property('errors').with.lengthOf(3);
                    done();
                }).catch(done);
            }).catch(done);
        });

        xit('handles const enums', function (done) {
            compiler.load(constEnums).then(function(txt) {
                compiler.compile(constEnums).then(function(output) {
                    output.should.have.property('failure', false);
                    output.should.have.property('errors').with.lengthOf(0);
                    output.js.should.containEql("return 1 /* Yes */;");
                    done();
                }).catch(done);
            }).catch(done);
        });
    });
});
