var fs = require('fs');
var path = require('path');
var should  = require('should');
var Promise = require('bluebird');

var Host = require('../lib/services-host');

var missingImport = require.resolve('./fixtures/program1/missing-import.ts');
var syntaxError = require.resolve('./fixtures/program1/syntax-error.ts');
var typeError = require.resolve('./fixtures/program1/type-error.ts');
var noImports = require.resolve('./fixtures/program1/no-imports.ts');
var oneImport = require.resolve('./fixtures/program1/one-import.ts');
var externalImport = require.resolve('./fixtures/program1/external-import.ts');
var refImport = require.resolve('./fixtures/program1/ref-import.ts');

var filelist = [];

function fetch(filename) {
    console.log("fetching " + filename);
    filelist.push(filename);
    var readFile = Promise.promisify(fs.readFile.bind(fs));
    return readFile(filename).then(function(buf) {
        return buf.toString('utf8');
    });
}

function resolve(parent, dep) {
    console.log("resolving " + parent + " -> " + dep);
    var result = "";

    if (dep[0] == '/')
        result = dep;
    else
        result = path.join(path.dirname(parent), dep);

    if (path.extname(result) != '.ts')
        result = result + ".ts";

    return result;
}

describe('Host', function () {

    var host;

    describe('load', function () {

        beforeEach(function() {
            host = new Host();
            filelist = [];
        });

        it('loads the correct file', function (done) {
            host.load(noImports, resolve, fetch).then(function(txt) {
                txt.should.be.equal("var a = 1;\nexport = a;");
                filelist.length.should.be.equal(2);
                done();
            }).catch(done);
        });

        it('loads lib.d.ts', function (done) {
            host.load(noImports, resolve, fetch).then(function(txt) {
                txt.should.be.equal("var a = 1;\nexport = a;");
                filelist.length.should.be.equal(2);
                done();
            }).catch(done);
        });

        it('resolves imported dependencies', function (done) {
            host.load(oneImport, resolve, fetch).then(function(txt) {
                filelist.length.should.be.equal(3);
                done();
            }).catch(done);
        });

        it('resolves referenced dependencies', function (done) {
            host.load(refImport, resolve, fetch).then(function(txt) {
                filelist.length.should.be.equal(3);
                done();
            }).catch(done);
        });

        it('ignores external dependencies', function (done) {
            host.load(externalImport, resolve, fetch).then(function(txt) {
                filelist.length.should.be.equal(2);
                done();
            }).catch(done);
        });

        it('errors if a file is missing', function (done) {
            host.load(missingImport, resolve, fetch).then(function(txt) {
                txt.should.be.equal(42);
                done();
            }, function(err) {
                err.should.have.property("code", "ENOENT");
                done();
            });
        });

        it('only fetches each file once', function (done) {
            host.load(oneImport, resolve, fetch).then(function(txt) {
                filelist.length.should.be.equal(3);
                filelist = [];

                host.load(noImports, resolve, fetch).then(function(txt) {
                    filelist.length.should.be.equal(0);
                    done();    
                });            
            }).catch(done);
        });

    });

    describe('compile', function () {
        beforeEach(function() {
            host = new Host();
            filelist = [];
        });

        it('compiles successfully', function (done) {
            host.load(oneImport, resolve, fetch).then(function(txt) {
                var output = host.compile(oneImport);
                output.should.have.property('failure', false);
                output.should.have.property('errors').with.lengthOf(0);
                //output.should.have.property('js').with.lengthOf(0);
                done();
            }).catch(done);
        });

        it('returns type-checker errors', function (done) {
            host.load(typeError, resolve, fetch).then(function(txt) {
                var output = host.compile(typeError);
                output.should.have.property('failure', true);
                output.should.have.property('errors').with.lengthOf(1);
                done();
            }).catch(done);
        });

        it('returns syntax errors', function (done) {
            host.load(syntaxError, resolve, fetch).then(function(txt) {
                var output = host.compile(syntaxError);
                output.should.have.property('failure', true);
                output.should.have.property('errors').with.lengthOf(3);
                done();
            }).catch(done);
        });

    });
});
