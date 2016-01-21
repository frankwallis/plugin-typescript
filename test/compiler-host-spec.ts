import chai = require('chai');
import * as ts from 'typescript';

import {CompilerHost} from '../src/compiler-host';

let should = chai.should();

describe( 'Compiler Host', () => {

	let host;
	beforeEach(function() {
		host = new CompilerHost({});
	});

	describe( 'constructor', () => {
		it('defaults the config', () => {
			let options = host._options;
			options.module.should.be.equal(ts.ModuleKind.System);
			options.target.should.be.equal(ts.ScriptTarget.ES5);
			options.jsx.should.be.equal(ts.JsxEmit.None);
			options.allowNonTsExtensions.should.be.true;
			options.should.not.have.property("noImplicitAny");
		});

		it('uses the config passed in', () => {
			let config = {
				noImplicitAny: true
			};
			host = new CompilerHost(config);
			let options = host._options;
			options.module.should.be.equal(ts.ModuleKind.System);
			options.target.should.be.equal(ts.ScriptTarget.ES5);
			options.allowNonTsExtensions.should.be.true;
			options.noImplicitAny.should.be.true;
		});

		it('handles the target option', () => {
			host = new CompilerHost({
				target: "eS3"
			});
			host.options.target.should.be.equal(ts.ScriptTarget.ES3);
			host = new CompilerHost({
				target: ts.ScriptTarget.ES3
			});
			host.options.target.should.be.equal(ts.ScriptTarget.ES3);
			host = new CompilerHost({
				target: "Es5"
			});
			host.options.target.should.be.equal(ts.ScriptTarget.ES5);
		});

		it('handles the jsx option', () => {
			host = new CompilerHost({
				jsx: "reAct"
			});
			host.options.jsx.should.be.equal(ts.JsxEmit.React);
		});

		it('forces moduleResolution to classic', () => {
			host = new CompilerHost({
				moduleResolution: ts.ModuleResolutionKind.NodeJs
			});
			host.options.moduleResolution.should.be.equal(ts.ModuleResolutionKind.Classic);
		});

	});

	describe( 'addFile', () => {
		it('adds files', () => {
			let filename = 'filea.ts';
			let sourceFile = host.addFile(filename, 'sometext');
			let sourceFile1 = host.getSourceFile(filename);
			sourceFile.should.be.equal(sourceFile1);
		});

		it('keeps same file if it has not changed', () => {
			let filename = 'filea.ts';
			let sourceFile1 = host.addFile(filename, 'sometext');
			let sourceFile2 = host.addFile(filename, 'sometext');
			sourceFile1.should.be.equal(sourceFile2);
		});

		it('overwrites file if it has changed', () => {
			let filename = 'filea.ts';
			let sourceFile1 = host.addFile(filename, 'sometext');
			let sourceFile2 = host.addFile(filename, 'differenttext');
			sourceFile1.should.not.be.equal(sourceFile2);
			let sourceFile3 = host.getSourceFile(filename);
			sourceFile2.should.be.equal(sourceFile3);
		});
	});
});
