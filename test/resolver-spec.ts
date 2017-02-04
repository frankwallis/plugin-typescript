import ts from 'typescript';
import fs = require('fs');
import path = require('path');
import chai = require('chai');

import {Resolver} from '../src/resolver';
import {CompilerHost} from '../src/compiler-host';
import {formatErrors} from '../src/format-errors';
import {parseConfig} from '../src/parse-config';

const should = chai.should();
const defaultOptions = parseConfig({});

function resolve(dep, parent) {
   //console.log("resolving " + parent + " -> " + dep);
   let result = "";

   if (dep[0] === '/')
      result = dep;
   else if (dep[0] === '.')
      result = path.join(path.dirname(parent), dep);
   else {
      result = path.join(path.dirname(parent), "resolved", dep);

		if (dep === "@angular/core") {
			result = result + '/bundles/index.umd.js';
		}
		else if (dep === "@angular/core/testing") {
			result = result + '/bundles/core-testing.umd.js';
		}

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

   let resolver: Resolver;
   let host: CompilerHost;

   beforeEach(() => {
      host = new CompilerHost();
      resolver = new Resolver(host, resolve);
   });

   it('resolves successfully', async () => {
      host.addFile(ANYFILE_NAME, "export = 42;", defaultOptions.target);
      const deps = await resolver.resolve(ANYFILE_NAME, defaultOptions);
      deps.list.should.have.length(0);
   });

   it('adds declaration files', async () => {
      resolver.registerDeclarationFile("declarations.d.ts");
      host.addFile(ANYFILE_NAME, "export = 42;", defaultOptions.target);
      const deps = await resolver.resolve(ANYFILE_NAME, defaultOptions);
      deps.list.should.have.length(1);
      deps.list[0].should.equal("declarations.d.ts");
   });

   it('resolves ambient imports', async () => {
      const source = 'import "ambient";'
      host.addFile(AMBIENT_NAME, source, defaultOptions.target);

      const deps = await resolver.resolve(AMBIENT_NAME, defaultOptions);
      deps.list.should.have.length(0);
   });

   it('handles ambient references when resolveAmbientRefs option is false', async () => {
      const source = '/// <reference path="ambient/ambient.d.ts" />';
      const expected = path.resolve(__dirname, './fixtures-es6/ambients/ambient/ambient.d.ts');

      host.addFile(AMBIENT_NAME, source, defaultOptions.target);

      const deps = await resolver.resolve(AMBIENT_NAME, defaultOptions);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

   it('resolves ambient external modules', async () => {
      const source = 'declare module "../../Observable" { interface a {} }';
      const sourceName = path.resolve(__dirname, './fixtures-es6/resolved/rxjs/add/operator/do.d.ts');
      const expected = path.resolve(__dirname, './fixtures-es6/resolved/rxjs/Observable.d.ts');
      host.addFile(sourceName, source, defaultOptions.target);

      const deps = await resolver.resolve(sourceName, defaultOptions);
      deps.list.should.have.length(1);
      deps.list[0].should.equal(expected);
   });

	describe("@types", () => {
		it('resolves @types files when configured', async () => {
			const source = 'import * as React from "reacty"; export class MyComponent extends React.Component {}';
			const sourceName = path.resolve(__dirname, './fixtures-es6/attypes/index.ts');
			const jsfile = path.resolve(__dirname, './fixtures-es6/attypes/resolved/reacty.js');
			const expected = path.resolve(__dirname, './fixtures-es6/attypes/resolved/@types/reacty/index.d.ts');

			const options = parseConfig({
				types: ["reacty"]
			});

			host.addFile(sourceName, source, options.target);
			const deps = await resolver.resolve(sourceName, options);
			deps.list.should.have.length(1);
			deps.list[0].should.equal(expected);
		});

		it('defaults @types main to index.d.ts', async () => {
			const source = 'import * as React from "react"; export class MyComponent extends React.Component {}';
			const sourceName = path.resolve(__dirname, './fixtures-es6/attypes/index.ts');
			const jsfile = path.resolve(__dirname, './fixtures-es6/attypes/resolved/react.js');
			const expected = path.resolve(__dirname, './fixtures-es6/attypes/resolved/@types/react/index.d.ts');

			const options = parseConfig({
				types: ["react"]
			});
			host.addFile(sourceName, source, options.target);
			const deps = await resolver.resolve(sourceName, options);
			deps.list.should.have.length(1);
			deps.list[0].should.equal(expected);
		});

		it('resolves @types files for submodules', async () => {
			const source = 'import map from "lodash/map"; export var a = map([1], n => n * 2);';
			const sourceName = path.resolve(__dirname, './fixtures-es6/attypes/index.ts');
			const jsfile = path.resolve(__dirname, './fixtures-es6/attypes/resolved/lodash/map.js');
			const expected = path.resolve(__dirname, './fixtures-es6/attypes/resolved/@types/lodash/index.d.ts');

			const options = parseConfig({
				types: ["lodash"]
			});

			host.addFile(sourceName, source, options.target);
			const deps = await resolver.resolve(sourceName, options);
			deps.list.should.have.length(1);
			deps.list[0].should.equal(expected);
		});

	});

	describe("typings", () => {
		it('resolves typings files when typings is true', async () => {
			const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2.d.ts');

			const options = parseConfig({
				typings: {
					"angular2": true
				}
			});

			const source = 'import {bootstrap} from "angular2";';
			host.addFile(TYPINGS_NAME, source, defaultOptions.target);

			const deps = await resolver.resolve(TYPINGS_NAME, options);
			deps.list.should.have.length(1);
			deps.list[0].should.equal(expected);
		});

		it('resolves nested typings when typings is true', async () => {
			const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2/router.d.ts');

			const options = parseConfig({
				typings: {
					"angular2": true
				}
			});

			const source = 'import {bootstrap} from "angular2/router";';
			host.addFile(TYPINGS_NAME, source, defaultOptions.target);

			const deps = await resolver.resolve(TYPINGS_NAME, options);
			deps.list.should.have.length(1);
			deps.mappings["angular2/router"].should.equal(expected);
		});

		it('resolves typings when typings is string path', async () => {
			const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/@angular/core/index.d.ts');

			const options = parseConfig({
				typings: {
					"@angular/core": "index.d.ts"
				}
			});

			const source = 'import {bootstrap} from "@angular/core";';
			host.addFile(TYPINGS_NAME, source, options.target);

			const deps = await resolver.resolve(TYPINGS_NAME, options);
			deps.list.should.have.length(1);
			deps.mappings["@angular/core"].should.equal(expected);
		});

		xit('resolves typings when typings is a string path containing .js', async () => {
			const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/zone.js/dist/core.d.ts');

			const options = parseConfig({
				typings: {
					"zone.js": true
				}
			});

			const source = 'import Zone from "zone.js";';
			host.addFile(TYPINGS_NAME, source, defaultOptions.target);

			const deps = await resolver.resolve(TYPINGS_NAME, options);
			deps.list.should.have.length(1);
			deps.mappings["zone.js"].should.equal(expected);
		});

		it('resolves typings for nested files when string typing are present for entry', async () => {
			const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/rxjs/Observable.d.ts');
			const jsfile = path.resolve(__dirname, './fixtures-es6/typings/resolved/rxjs.js');

			const options = parseConfig({
				typings: {
					"rxjs": "Rx.d.ts"
				}
			});

			const source = 'import {Observable} from "rxjs/Observable";';
			host.addFile(TYPINGS_NAME, source, options.target);

			const deps = await resolver.resolve(TYPINGS_NAME, options);
			deps.list.should.have.length(1);
			deps.list[0].should.equal(expected);
		});

		it('typings for specific file take precedence over package typings', async () => {
			const expected = path.resolve(__dirname, './fixtures-es6/typings/resolved/rxjs/testing/index.d.ts');
			const jsfile = path.resolve(__dirname, './fixtures-es6/typings/resolved/testing.js');

			const options = parseConfig({
				typings: {
					"rxjs": "Rx.d.ts",
					"rxjs/testing": "testing/index.d.ts",
				}
			});

			const source = 'import * as Testing from "rxjs/testing";';
			host.addFile(TYPINGS_NAME, source, options.target);

			const deps = await resolver.resolve(TYPINGS_NAME, options);
			deps.list.should.have.length(1);
			deps.list[0].should.equal(expected);
		});
	});
});
