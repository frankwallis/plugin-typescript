//var _ = require('lodash');
var should  = require('should');
var ts = require('typescript');
var fs = require('fs');
var path = require('path');
var touch = require('touch');

var CachingHost = require('../lib/caching-host');

var goodFile = path.resolve('./fixtures/program1/file1.ts');

describe( 'caching-host', function () {

    it('reuses the same file if it has not changed', function () {
		var host = new CachingHost();

		var file1 = host.getSourceFile(__filename, ts.ScriptTarget.ES3, function() {
			throw new Error(goodFile); // fix it.
		});

		host.reset();

		var file2 = host.getSourceFile(__filename, ts.ScriptTarget.ES3, function() {
			throw new Error(goodFile); // fix it.
		});

		file1.should.be.equal(file2);
    });

    it('detects when files have changed', function () {
		var host = new CachingHost();

		var file1 = host.getSourceFile(__filename, ts.ScriptTarget.ES3, function() {
			throw new Error(goodFile); // fix it.
		});
		
		touch.sync(__filename);
		host.reset();

		var file2 = host.getSourceFile(__filename, ts.ScriptTarget.ES3, function() {
			throw new Error(goodFile); // fix it.
		});

		file1.should.not.equal(file2);
    });

    it('calls the callback and returns a valid source file', function () {
		var host = new CachingHost();

		var called = false;
		var threw = false;
		var result = undefined;

		try {
			result = host.getSourceFile('kjkjk', ts.ScriptTarget.ES3, function() {
				called = true;
			})
		}
		catch(err) {
			threw = true;
		}

		called.should.be.true; 
		threw.should.be.false;
		result.should.have.property('text', '');
    });

    it('returns the output files', function () {
    	var host = new CachingHost();
    	host.writeFile(goodFile, 'good stuff');
    	var output = host.getOutput();
    	output.should.have.property(goodFile, "good stuff");
    });
});
