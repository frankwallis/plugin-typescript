import fs from 'fs';
import should from 'should';
import Promise from 'bluebird';
import ts from 'typescript';

import {createFactory} from '../lib/factory';

let defaultFile = require.resolve('./fixtures-es6/tsconfig/default.json');
let alternateFile = require.resolve('./fixtures-es6/tsconfig/alternate.json');
let filelist = [];

function fetch(filename) {
	//console.log("fetching " + filename);
	filelist.push(filename);
	let readFile = Promise.promisify(fs.readFile.bind(fs));
	return readFile(filename, 'utf8');
}

function resolve(dep, parent) {
	let result = dep;

	if (dep === "tsconfig.json")
		result = defaultFile;

	//console.log("resolved " + parent + " -> " + dep + " = " + result);
	return Promise.resolve(result);
}

describe( 'Factory', () => {

	beforeEach(function() {
		filelist = [];
	});

	it('handles tsconfig = undefined', () => {
		let config = {};
		let factory = createFactory(config, resolve, fetch);
		return factory.then(({transpiler, typeChecker}) => {
			transpiler.should.be.defined;
			typeChecker.should.be.false;
			filelist.should.have.length(0);
		});
	});

	it('creates typeChecker if typeCheck is true', () => {
		let config = {
			typeCheck: true,
		};
		let factory = createFactory(config, resolve, fetch);
		return factory.then(({transpiler, typeChecker}) => {
			transpiler.should.be.defined;
			typeChecker.should.not.be.true;
		});
	});

	it('handles tsconfig = true', () => {
		let config = {
			tsconfig: true
		};
		let factory = createFactory(config, resolve, fetch);
		return factory.then(({transpiler, typeChecker}) => {
			transpiler.should.be.defined;
			transpiler.should.be.false;
			filelist.should.have.length(1);
			filelist[0].should.be.equal(defaultFile);
		});
	});

	it('loads the compiler options from tsconfig', () => {
		let config = {
			tsconfig: true
		};
		let factory = createFactory(config, resolve, fetch);
		return factory.then(({transpiler, typeChecker}) => {
			transpiler._options.noImplicitAny.should.be.true;
		});
	});

	it('SystemJS.typescriptOptions take precedence over tsconfig settings', () => {
		let config = {
			tsconfig: true,
			noImplicitAny: false
		};
		let factory = createFactory(config, resolve, fetch);
		return factory.then(({transpiler, typeChecker}) => {
			transpiler._options.noImplicitAny.should.be.false;
		});
	});

	it('handles tsconfig = <pathname>', () => {
		let config = {
			tsconfig: alternateFile
		};
		let factory = createFactory(config, resolve, fetch);
		return factory.then(({transpiler, typeChecker}) => {
			transpiler.should.be.defined;
			transpiler.should.be.false;
			filelist.should.have.length(1);
			filelist[0].should.be.equal(alternateFile);
		});
	});
});
