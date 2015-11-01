import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import * as chai from 'chai';
import * as ts from 'typescript';

import {createFactory} from '../lib/factory';
import {formatErrors} from '../lib/format-errors';

let should = chai.should();

let defaultFile = require.resolve('./fixtures-es6/tsconfig/default.json');
let alternateFile = require.resolve('./fixtures-es6/tsconfig/alternate.json');
let declarationFile = require.resolve('./fixtures-es6/tsconfig/declaration.json');
let theirModuleFile = require.resolve('./fixtures-es6/tsconfig/theirmodule.d.ts');
let filelist = [];

function fetch(filename) {
	//console.log("fetching " + filename);
	filelist.push(filename);
	let readFile = Promise.promisify(fs.readFile.bind(fs));
	return readFile(filename, 'utf8');
}

function resolve(dep, parent) {
	let result = undefined;

	if (dep === "ts")
		result = __filename;
	else if (dep === "tsconfig.json")
		result = defaultFile;
	else if (dep[0] === ".")
		result = require.resolve('./' + path.join('./fixtures-es6/tsconfig', dep));
	else if (dep.indexOf(".") < 0)
		return dep + '.js';
	else
		result = require.resolve(dep);

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
			should.not.exist(typeChecker);
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
			typeChecker.should.be.defined;
		});
	});

	it('handles tsconfig = true', () => {
		let config = {
			tsconfig: true
		};
		let factory = createFactory(config, resolve, fetch);
		return factory.then(({transpiler, typeChecker}) => {
			transpiler.should.be.defined;
			should.not.exist(typeChecker);
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
			should.not.exist(typeChecker);
			filelist.should.have.length(1);
			filelist[0].should.be.equal(alternateFile);
		});
	});

	it('adds declaration files into type-checker', () => {
		let config = {
			tsconfig: declarationFile,
			typeCheck: true
		};
		let factory = createFactory(config, resolve, fetch);
		return factory.then(({transpiler, typeChecker}) => {
			transpiler.should.be.defined;
			typeChecker.should.be.defined;

			let filename = "mymodule.ts";
			let text = "import {theirvariable} from 'theirmodule'; if (theirvariable == 20) throw new Error('help!');";

			typeChecker._host.addFile(filename, text);
			return typeChecker.check(filename, text)
				.then(diags => {
					formatErrors(diags, console);

					diags.should.have.length(0);
					filelist.should.have.length(3);
					filelist[0].should.be.equal(declarationFile);
					filelist[2].should.be.equal(theirModuleFile);
				});
		});
	});
});
