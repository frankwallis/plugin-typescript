import fs = require('fs');
import path = require('path');
import Promise = require('bluebird');
import chai = require('chai');

import {Resolver} from '../src/resolver';
import {CompilerHost} from '../src/compiler-host';
import {formatErrors} from '../src/format-errors';

const should = chai.should();

let filelist = [];
const readFile: any = Promise.promisify(fs.readFile.bind(fs));
function fetch(filename) {
	//console.log("fetching " + filename);
	filelist.push(filename);
	return readFile(filename, 'utf8');
}

function resolve(dep, parent) {
	//console.log("resolving " + parent + " -> " + dep);
	let result = "";

	try {
      if (dep[0] === '/')
			result = dep;
		else if (dep[0] === '.')
			result = path.join(path.dirname(parent), dep);
		else {
         result = path.join(path.dirname(parent), "resolved", dep);
         
         if (dep.indexOf('/') < 0)
            result = path.join(result, dep);         

         if (path.extname(result) == "")
            result = result + ".js";
      }
      
		if (path.extname(result) == "")
			result = result + ".ts";

		//console.log("resolved " + parent + " -> " + result);
		return Promise.resolve(result);
	}
	catch (err) {
		console.error(err);
		return Promise.reject(err)
	}
}

describe('Resolver', () => {

   const AMBIENT_NAME = path.join(path.resolve(__dirname, "./fixtures-es6/ambients"), "somefile.ts");
   const TYPINGS_NAME = path.join(path.resolve(__dirname, "./fixtures-es6/typings"), "somefile.ts");
   const ANYFILE_NAME = "somefile.ts";
   
	let resolver;
	let host;

	beforeEach(() => {
		filelist = [];
		host = new CompilerHost({});
		resolver = new Resolver(host, resolve, fetch);
	});

	it('resolves successfully', () => {
      host.addFile(ANYFILE_NAME, "export = 42;");
		return resolver.resolve(ANYFILE_NAME)
			.then((deps) => {
				deps.list.should.have.length(0);
			});
	});

	it('adds declaration files', () => {
      resolver.registerDeclarationFile("declarations.d.ts");
      host.addFile(ANYFILE_NAME, "export = 42;");
		return resolver.resolve(ANYFILE_NAME)
			.then((deps) => {
				deps.list.should.have.length(1);
            deps.list[0].should.equal("declarations.d.ts");
			});
	});

	it('flags the default library', () => {
      const defaultLibName = require.resolve(host.getDefaultLibFileName());
      const defaultLibSource = fs.readFileSync(defaultLibName, 'utf8');
      const file = host.addFile(defaultLibName, defaultLibSource);
		return resolver.resolve(defaultLibName)
			.then((deps) => {
				deps.list.should.have.length(0);
            file.isLibFile.should.be.true;
			});
	});

   
	it('resolves ambient imports', () => {
      const source = 'import "ambient";'
      host.addFile(AMBIENT_NAME, source);
            
		return resolver.resolve(AMBIENT_NAME)
			.then((deps) => {
				deps.list.should.have.length(0);
			});
	});

	it('handles ambient references when resolveAmbientRefs option is false', () => {
      const source = '/// <reference path="ambient/ambient.d.ts" />';
      const expected = path.resolve(__dirname, './fixtures-es6/ambients/ambient/ambient.d.ts');
      
      host.addFile(AMBIENT_NAME, source);
            
		return resolver.resolve(AMBIENT_NAME)
			.then((deps) => {
				deps.list.should.have.length(1);
            deps.list[0].should.equal(expected);
			});
	});

	it('resolves ambient references when resolveAmbientRefs option is true', () => {
		let options = {
			resolveAmbientRefs: true
		};      
		host = new CompilerHost(options);
		resolver = new Resolver(host, resolve, fetch);
      
      const source = '/// <reference path="ambient/ambient.d.ts" />';
      const expected = path.resolve(__dirname, './fixtures-es6/ambients/resolved/ambient/ambient.d.ts');

      host.addFile(AMBIENT_NAME, source);
      
		return resolver.resolve(AMBIENT_NAME)
			.then((deps) => {
				deps.list.should.have.length(1);
            deps.list[0].should.equal(expected);
			});
	});

	it('ignores non ambient refs resolveAmbientRefs option is true', () => {
		let options = {
			resolveAmbientRefs: true
		};      
		host = new CompilerHost(options);
		resolver = new Resolver(host, resolve, fetch);
      
      const source = '/// <reference path="not-ambient.d.ts" />';
      const expected = path.resolve(__dirname, './fixtures-es6/ambients/not-ambient.d.ts');
      host.addFile(AMBIENT_NAME, source);
      
		return resolver.resolve(AMBIENT_NAME)
			.then((deps) => {
				deps.list.should.have.length(1);
            deps.list[0].should.equal(expected);
			});
	});

	it('resolves typings files from package.json when resolveTypings is true', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		resolver = new Resolver(host, resolve, fetch);
      
      const source = 'import {bootstrap} from "angular2";';
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2/angular2/angular2.d.ts');
      host.addFile(TYPINGS_NAME, source);
      
		return resolver.resolve(TYPINGS_NAME)
			.then((deps) => {
				deps.list.should.have.length(1);
            deps.list[0].should.equal(expected);
			});
	});

	it('doesnt resolve typings files when resolveTypings is false', () => {
		let options = {
			resolveTypings: false
		};
		host = new CompilerHost(options);
		resolver = new Resolver(host, resolve, fetch);
      
      const source = 'import {bootstrap} from "angular2";';
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2/angular2.js');
      host.addFile(TYPINGS_NAME, source);

		return resolver.resolve(TYPINGS_NAME)
			.then((deps) => {
				deps.list.should.have.length(0);
            deps.mappings["angular2"].should.equal(expected);
			});
	});

	it('handles missing typings field in package.json', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		resolver = new Resolver(host, resolve, fetch);
      
      const source = 'import * as missing from "missing";';
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/missing/missing.js');
      host.addFile(TYPINGS_NAME, source);

		return resolver.resolve(TYPINGS_NAME)
			.then((deps) => {
				deps.list.should.have.length(0);
            deps.mappings["missing"].should.equal(expected);
			});
	});

	it('handles non-relative typings field in package.json', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		resolver = new Resolver(host, resolve, fetch);
      
      const source = 'import {Observable} from "rxjs";';
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/rxjs/rxjs/Rx.d.ts');
      host.addFile(TYPINGS_NAME, source);

		return resolver.resolve(TYPINGS_NAME)
			.then((deps) => {
				deps.list.should.have.length(1);
            deps.list[0].should.equal(expected);
			});
	});

	it('handles package.json not found', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		resolver = new Resolver(host, resolve, fetch);
      
      const source = 'import * as missing from "missing_package";';
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/missing_package/missing_package.js');
      host.addFile(TYPINGS_NAME, source);

		return resolver.resolve(TYPINGS_NAME)
			.then((deps) => {
				deps.list.should.have.length(0);
            deps.mappings["missing_package"].should.equal(expected);
			});
	});
});
