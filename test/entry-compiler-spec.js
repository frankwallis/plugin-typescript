//var _ = require('lodash');
var path = require('path');
var should  = require('should');
var ts = require("typescript");
var Compiler = require('../lib/compiler');

var EntryCompiler = require('../lib/entry-compiler');
var MockCompiler = require('./mock-compiler');

//var goodFile = ts.normalizePath(path.join(__dirname, './fixtures/program1/file1.ts'));
var goodFile = ts.normalizePath(path.join(__dirname, './fixtures/program1/file1.ts'));
var goodFileOutput = Compiler.tsToJs(goodFile);
var goodFileMap = Compiler.tsToJs(goodFile) + ".map";

var missingFile = ts.normalizePath(path.join(__dirname, './m_i_s_s_i_n_g.ts'));

describe( 'entry-compiler', function () {

    it('returns true on success', function () {
        var compiler = new MockCompiler({
                "failure": false,
                "errors": [],
                "output": {
                    "anything.ts": 'anything'
                }
            });

        var entryCompiler = new EntryCompiler(console, compiler);
        var res = entryCompiler.compile(['anything.ts']);
        res.should.be.true;
    });

    it('updates a file with the compiled output', function () {
        var output = {};
        output[goodFileOutput] = "somesource";

        var compiler = new MockCompiler({
                "failure": false,
                "errors": [],
                "output": output
            });

        var file = {
            "path": goodFile
        };

        var entryCompiler = new EntryCompiler(console, compiler);
        entryCompiler.compile(file).should.be.true;

        entryCompiler.update(file, file).should.be.true;
        file.src.should.be.equal("somesource");
        file.type.should.be.equal("js");
        (file.sourceMap === undefined).should.be.true;
    });

    it('errors if a file cannot be found', function () {
        var output = {};
        output[goodFileOutput] = "somesource";

        var compiler = new MockCompiler({
                "failure": false,
                "errors": [],
                "output": output
            });

        var file = {
            "path": goodFile
        };

        var missing = {
            "path": missingFile
        };

        var entryCompiler = new EntryCompiler(console, compiler);
        entryCompiler.compile(file).should.be.true;
        entryCompiler.update(missing, file).should.be.false;
    });

    it('updates a file with the source map', function () {
        var output = {};
        output[goodFileOutput] = "somesource";
        output[goodFileMap] = "{}";

        var compiler = new MockCompiler({
                "failure": false,
                "errors": [],
                "output": output
            });

        var file = {
            "path": goodFile
        };

        var entryCompiler = new EntryCompiler(console, compiler, { sourceMap: true });
        entryCompiler.compile(file).should.be.true;

        entryCompiler.update(file, file).should.be.true;
        file.src.should.be.equal("somesource");
        file.type.should.be.equal("js");
        file.sourceMap.should.be.ok;
    });

});
