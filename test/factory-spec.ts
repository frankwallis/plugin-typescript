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
const defaultLibEs5 = require.resolve('typescript/lib/lib.es5.d.ts');
const defaultLibEs2015Promise = require.resolve('typescript/lib/lib.es2015.promise.d.ts');

let filelist = [];
function fetch(filename): Promise<any> {
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
   catch (err) {
      console.error(err);
      return Promise.reject(err);
   }
}

function lookup(address: string): any {
   return {};
}

describe('Factory', () => {

   beforeEach(function() {
      filelist = [];
   });

   it('handles sjsconfig = undefined', async () => {
      const config = undefined;
      const {transpiler, typeChecker} = await createFactory(config, false, resolve, fetch, lookup);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      filelist.should.have.length(0);
   });

   it('handles tsconfig = undefined', async () => {
      const config = {};
      const {transpiler, typeChecker} = await createFactory(config, false, resolve, fetch, lookup);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      filelist.should.have.length(0);
   });

   it('creates typeChecker & resolver if typeCheck is true', async () => {
      const config = {
         typeCheck: true
      };
      const {transpiler, typeChecker, resolver} = await createFactory(config, false, resolve, fetch, lookup);
      transpiler.should.be.defined;
      typeChecker.should.be.defined;
      resolver.should.be.defined;
   });

   it('does not create typeChecker & resolver when typeCheck is false', async () => {
      const config = {
         tsconfig: declarationFile,
         typeCheck: false
      };
      const {transpiler, typeChecker, resolver} = await createFactory(config, false, resolve, fetch, lookup);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      should.not.exist(resolver);
   });

   it('handles tsconfig = true', async () => {
      const config = {
         tsconfig: true
      };
      const {transpiler, typeChecker} = await createFactory(config, false, resolve, fetch, lookup);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      filelist.should.have.length(1);
      filelist[0].should.be.equal(defaultFile);
   });

   it('loads the compiler options from tsconfig', async () => {
      const config = {
         tsconfig: true
      };
      const {host} = await createFactory(config, false, resolve, fetch, lookup);
      host.options.noImplicitAny.should.be.true;
   });

   xit('passes builder param to host', async () => {
      const config = {
         module: "system",
         target: "es6"
      };
      const {host} = await createFactory(config, true, resolve, fetch, lookup);
      host.options.module.should.equal(ts.ModuleKind.ES6);
   });

   it('SystemJS.typescriptOptions take precedence over tsconfig settings', async () => {
      const config = {
         tsconfig: true,
         noImplicitAny: false
      };
      const {host} = await createFactory(config, false, resolve, fetch, lookup);
      host.options.noImplicitAny.should.be.false;
   });

   it('handles tsconfig = <pathname>', async () => {
      const config = {
         tsconfig: alternateFile
      };
      const {transpiler, typeChecker} = await createFactory(config, false, resolve, fetch, lookup);
      transpiler.should.be.defined;
      should.not.exist(typeChecker);
      filelist.should.have.length(1);
      filelist[0].should.be.equal(alternateFile);
   });

   it('adds declaration files into resolver', async () => {
      const config = {
         tsconfig: declarationFile,
         typeCheck: true
      };
      const {resolver} = await createFactory(config, false, resolve, fetch, lookup);
      resolver.should.be.defined;
      resolver._declarationFiles.should.have.length(2);
		resolver._declarationFiles[0].should.be.equal(defaultLib);
      resolver._declarationFiles[1].should.be.equal(theirModuleFile);
   });

   it('adds multiple lib files into resolver', async () => {
      const config = {
			lib: ['es5', 'es2015.promise'],
         typeCheck: true
      };
      const {resolver} = await createFactory(config, false, resolve, fetch, lookup);
      resolver.should.be.defined;
      resolver._declarationFiles.should.have.length(2);
		resolver._declarationFiles[0].should.be.equal(defaultLibEs5);
      resolver._declarationFiles[1].should.be.equal(defaultLibEs2015Promise);
   });

});
