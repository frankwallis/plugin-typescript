import fs = require('fs');
import path = require('path');
import chai = require('chai');
import * as ts from 'typescript';

import {createFactory} from '../src/factory';
import {formatErrors} from '../src/format-errors';

const should = chai.should();

const defaultFile = require.resolve('./fixtures-es6/tsconfig/default.json');
const alternateFile = require.resolve('./fixtures-es6/tsconfig/alternate.json');
const declarationFile = require.resolve('./fixtures-es6/tsconfig/declaration.json');
const theirModuleFile = require.resolve('./fixtures-es6/tsconfig/theirmodule.d.ts');
const defaultLib = require.resolve('typescript/lib/lib.es6.d.ts');

let filelist = [];
function fetch(filename) {
	//console.log("fetching " + filename);
	filelist.push(filename);
   try {
      return Promise.resolve(fs.readFileSync(filename, 'utf8'));   
   }
   catch (err) {
      return Promise.reject(err);
   }
}

function resolve(dep, parent) {
	let result = undefined;
	//console.log('resolving ' + parent + ' -> ' + dep);

	try {
		if (dep === "tsconfig.json")
			result = defaultFile;
		else if (dep == "theirmodule")
			result = "theirmodule.js";
		else if (dep[0] === ".")
			result = path.resolve(path.dirname(parent), dep);
		else if (dep.indexOf(".") < 0)
			result = dep + '.js';
		else
			result = require.resolve(dep);

		//console.log("resolved " + parent + " -> " + dep + " = " + result);
		return Promise.resolve(result);
	}
	catch(err) {
		console.error(err);
		return Promise.reject(err);
	}
}

describe('Factory', () => {

	beforeEach(function() {
		filelist = [];
	});

	it('handles sjsconfig = undefined', async () => {
		let config = undefined;
		let {transpiler, typeChecker} = await createFactory(config, false, resolve, fetch);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      filelist.should.have.length(0);
	});

	it('handles tsconfig = undefined', async () => {
		let config = {};
		let {transpiler, typeChecker} = await createFactory(config, false, resolve, fetch);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      filelist.should.have.length(0);
	});

	it('creates typeChecker & resolver if typeCheck is true', async () => {
		let config = {
			typeCheck: true,
		};
		let {transpiler, typeChecker, resolver} = await createFactory(config, false, resolve, fetch);
      transpiler.should.be.defined;
      typeChecker.should.be.defined;
      resolver.should.be.defined;
	});

	it('does not create typeChecker & resolver when typeCheck is false', async () => {
		let config = {
			tsconfig: declarationFile,
			typeCheck: false
		};
		let {transpiler, typeChecker, resolver} = await createFactory(config, false, resolve, fetch);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      should.not.exist(resolver);
	});

	it('handles tsconfig = true', async () => {
		let config = {
			tsconfig: true
		};
		let {transpiler, typeChecker} = await createFactory(config, false, resolve, fetch);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      filelist.should.have.length(1);
      filelist[0].should.be.equal(defaultFile);
	});

	it('loads the compiler options from tsconfig', async () => {
		let config = {
			tsconfig: true
		};
		let {host} = await createFactory(config, false, resolve, fetch);
      host.options.noImplicitAny.should.be.true;
	});

	it('passes builder param to host', async () => {
		let config = {
			module: "system",
         target: "es6"
		};
		let {host} = await createFactory(config, true, resolve, fetch);
      host.options.module.should.equal(ts.ModuleKind.ES6);
	});

	it('SystemJS.typescriptOptions take precedence over tsconfig settings', async () => {
		let config = {
			tsconfig: true,
			noImplicitAny: false
		};
		let {host} = await createFactory(config, false, resolve, fetch);
      host.options.noImplicitAny.should.be.false;
	});

	it('handles tsconfig = <pathname>', async () => {
		let config = {
			tsconfig: alternateFile
		};
		let {transpiler, typeChecker} = await createFactory(config, false, resolve, fetch);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      filelist.should.have.length(1);
      filelist[0].should.be.equal(alternateFile);
	});

	it('adds the default library', async () => {
		let config = {
			typeCheck: true
		};
		let {resolver} = await createFactory(config, false, resolve, fetch);
      resolver.should.be.defined;
      resolver._declarationFiles.should.have.length(1);
	});

	it('adds declaration files into resolver', async () => {
		let config = {
			tsconfig: declarationFile,
			typeCheck: true
		};
		let {resolver} = await createFactory(config, false, resolve, fetch);
      resolver.should.be.defined;
      resolver._declarationFiles.should.have.length(2);
      resolver._declarationFiles[0].should.be.equal(defaultLib);
      resolver._declarationFiles[1].should.be.equal(theirModuleFile);
	});

	it('observes the noLib option', async () => {
		let config = {
			noLib: true,
			typeCheck: true
		};
		let {resolver} = await createFactory(config, false, resolve, fetch);
      resolver.should.be.defined;
      resolver._declarationFiles.should.have.length(0);
	});
});
