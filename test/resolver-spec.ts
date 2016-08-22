import fs = require('fs');
import path = require('path');
import chai = require('chai');

import {Resolver} from '../src/resolver';
import {CompilerHost} from '../src/compiler-host';
import {formatErrors} from '../src/format-errors';

const should = chai.should();

let metadata = {};
function lookup(address: string): any {
   return Promise.resolve(metadata[address] || {});
}

function resolve(dep, parent) {
   //console.log("resolving " + parent + " -> " + dep);
   let result = "";

   if (dep[0] === '/')
      result = dep;
   else if (dep[0] === '.')
      result = path.join(path.dirname(parent), dep);
   else {
      result = path.join(path.dirname(parent), "resolved", dep);

		if ((result.indexOf('@types') < 0) &&
			((path.extname(result) === "") || (dep.indexOf('/') < 0)))
				result = result + ".js";
	}

   if (path.extname(result) === "") {
      if (result.indexOf("@types") >= 0) {
			if (result.indexOf('/reacty') >= 0)
				result = result + "/index.d.ts";
		}
      else if (result.indexOf("/js/") >= 0)
         result = result + ".js";
      else
         result = result + ".ts";
   }

   //console.log("resolved " + parent + " -> " + result);
   return Promise.resolve(result);
}

describe('Resolver', () => {

   const AMBIENT_NAME = path.join(path.resolve(__dirname, "./fixtures-es6/ambients"), "somefile.ts");
   const TYPINGS_NAME = path.join(path.resolve(__dirname, "./fixtures-es6/typings"), "somefile.ts");
   const ANYFILE_NAME = "somefile.ts";

   let resolver;
   let host;

   beforeEach(() => {
      host = new CompilerHost({});
      resolver = new Resolver(host, resolve, lookup);
   });

   it('resolves successfully', async () => {
      host.addFile(ANYFILE_NAME, "export = 42;");
      const deps = await resolver.resolve(ANYFILE_NAME);
      deps.list.should.have.length(0);
   });

   it('adds declaration files', async () => {
      resolver.registerDeclarationFile("declarations.d.ts");
      host.addFile(ANYFILE_NAME, "export = 42;");
      const deps = await resolver.resolve(ANYFILE_NAME);
      deps.list.should.have.length(1);
      deps.list[0].should.equal("declarations.d.ts");
   });

   it('resolves ambient imports', async () => {
      const source = 'import "ambient";'
      host.addFile(AMBIENT_NAME, source);

      const deps = await resolver.resolve(AMBIENT_NAME);
      deps.list.should.have.length(0);
   });

   it('handles ambient references when resolveAmbientRefs option is false', async () => {
      const source = '/// <reference path="ambient/ambient.d.ts" />';
      const expected = path.resolve(__dirname, './fixtures-es6/ambients/ambient/ambient.d.ts');

      host.addFile(AMBIENT_NAME, source);

      const deps = await resolver.resolve(AMBIENT_NAME);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

   it('resolves ambient references when resolveAmbientRefs option is true', async () => {
      const options = {
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      resolver = new Resolver(host, resolve, lookup);

      const source = '/// <reference path="ambient/ambient.d.ts" />';
      const expected = path.resolve(__dirname, './fixtures-es6/ambients/resolved/ambient/ambient.d.ts');

      host.addFile(AMBIENT_NAME, source);

      const deps = await resolver.resolve(AMBIENT_NAME);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

   it('ignores non ambient refs resolveAmbientRefs option is true', async () => {
      const options = {
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      resolver = new Resolver(host, resolve, lookup);

      const source = '/// <reference path="not-ambient.d.ts" />';
      const expected = path.resolve(__dirname, './fixtures-es6/ambients/not-ambient.d.ts');
      host.addFile(AMBIENT_NAME, source);

      const deps = await resolver.resolve(AMBIENT_NAME);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

   it('resolves ambient external modules', async () => {
      const source = 'declare module "../../Observable" { interface a {} }';
      const sourceName = path.resolve(__dirname, './fixtures-es6/resolved/rxjs/add/operator/do.d.ts');
      const expected = path.resolve(__dirname, './fixtures-es6/resolved/rxjs/Observable.d.ts');
      host.addFile(sourceName, source);

      const deps = await resolver.resolve(sourceName);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

   it('resolves attypes files when configured', async () => {
      const source = 'import * as React from "reacty"; export class MyComponent extends React.Component {}';
      const sourceName = path.resolve(__dirname, './fixtures-es6/attypes/index.ts');
      const jsfile = path.resolve(__dirname, './fixtures-es6/attypes/resolved/reacty.js');
      const expected = path.resolve(__dirname, './fixtures-es6/attypes/resolved/@types/reacty/index.d.ts');

      const options = {
         types: ["reacty"]
      };
      host = new CompilerHost(options);
      resolver = new Resolver(host, resolve, lookup);

      host.addFile(sourceName, source);
      const deps = await resolver.resolve(sourceName);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

   it('defaults attypes main to index.d.ts', async () => {
      const source = 'import * as React from "react"; export class MyComponent extends React.Component {}';
      const sourceName = path.resolve(__dirname, './fixtures-es6/attypes/index.ts');
      const jsfile = path.resolve(__dirname, './fixtures-es6/attypes/resolved/react.js');
      const expected = path.resolve(__dirname, './fixtures-es6/attypes/resolved/@types/react/index.d.ts');

      const options = {
         types: ["react"]
      };
      host = new CompilerHost(options);
      resolver = new Resolver(host, resolve, lookup);

      host.addFile(sourceName, source);
      const deps = await resolver.resolve(sourceName);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

   it('resolves typings files when typings is true', async () => {
      const jsfile = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2.js');
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2.d.ts');

      metadata = {};
      metadata[jsfile] = {
         typings: true
      };

      const source = 'import {bootstrap} from "angular2";';
      host.addFile(TYPINGS_NAME, source);

      const deps = await resolver.resolve(TYPINGS_NAME);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

   it('resolves typings for relative imports when typings is true', async () => {
      const expected = path.resolve(__dirname, './fixtures-es6/typings/js/relative-import.d.ts');
      const jsfile = path.resolve(__dirname, './fixtures-es6/typings/js/relative-import.js');

      metadata = {};
      metadata[jsfile] = {
         typings: true
      };

      const source = 'import {bootstrap} from "./js/relative-import";';
      host.addFile(TYPINGS_NAME, source);

      const deps = await resolver.resolve(TYPINGS_NAME);
      deps.list.should.have.length(1);
      deps.mappings["./js/relative-import"].should.equal(expected);
   });

   it('resolves nested typings when typings is true', async () => {
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2/router.d.ts');
      const jsfile = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2/router.js');

      metadata = {};
      metadata[jsfile] = {
         typings: true
      };

      const source = 'import {bootstrap} from "angular2/router";';
      host.addFile(TYPINGS_NAME, source);

      const deps = await resolver.resolve(TYPINGS_NAME);
      deps.list.should.have.length(1);
      deps.mappings["angular2/router"].should.equal(expected);
   });

   it('resolves typings when typings is string path', async () => {
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/zone.js/dist/core.d.ts');
      const jsfile = path.resolve(__dirname, './fixtures-es6/typings/resolved/zone.js.js');

      metadata = {};
      metadata[jsfile] = {
         typings: "./dist/core.d.ts"
      };

      const source = 'import Zone from "zone.js";';
      host.addFile(TYPINGS_NAME, source);

      const deps = await resolver.resolve(TYPINGS_NAME);
      deps.list.should.have.length(1);
      deps.mappings["zone.js"].should.equal(expected);
   });

   it('resolves typings when typings meta is non-relative path', async () => {
      const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/rxjs/Rx.d.ts');
      const jsfile = path.resolve(__dirname, './fixtures-es6/typings/resolved/rxjs.js');

      metadata = {};
      metadata[jsfile] = {
         typings: "Rx.d.ts"
      };

      const source = 'import {Observable} from "rxjs";';
      host.addFile(TYPINGS_NAME, source);

      const deps = await resolver.resolve(TYPINGS_NAME);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

});
