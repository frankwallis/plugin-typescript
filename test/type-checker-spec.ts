import fs = require('fs');
import path = require('path');
import chai = require('chai');
import ts = require('typescript');

import {Resolver} from '../src/resolver';
import {TypeChecker} from '../src/type-checker';
import {CompilerHost} from '../src/compiler-host';
import {formatErrors} from '../src/format-errors';

const should = chai.should();

const missingFile = '/somefolder/fixtures-es6/program1/missing-file.ts';
const missingImport = require.resolve('./fixtures-es6/program1/missing-import.ts');
const syntaxError = require.resolve('./fixtures-es6/program1/syntax-error.ts');
const referenceSyntaxError = require.resolve('./fixtures-es6/program1/ref-syntax-error.ts');
const typeError = require.resolve('./fixtures-es6/program1/type-error.ts');
const nestedTypeError = require.resolve('./fixtures-es6/program1/nested-type-error.ts');
const noImports = require.resolve('./fixtures-es6/program1/no-imports.ts');
const oneImport = require.resolve('./fixtures-es6/program1/one-import.ts');
const ambientReference = require.resolve('./fixtures-es6/ambients/ambient-reference.ts');
const ambientReferenceDisabled = require.resolve('./fixtures-es6/ambients/ambient-reference-disabled.ts');
const nestedReference = require.resolve('./fixtures-es6/ambients/ambient-nested.ts');
const backslashReference = require.resolve('./fixtures-es6/ambients/backslash-reference.ts');
const ambientImportJs = require.resolve('./fixtures-es6/ambients/ambient-import-js.ts');
const ambientImportTs = require.resolve('./fixtures-es6/ambients/ambient-import-ts.ts');
const ambientResolveTs = require.resolve('./fixtures-es6/ambients/ambient-resolve.ts');
const ambientDuplicate = require.resolve('./fixtures-es6/ambients/ambient-duplicate.ts');
const ambientRequires = require.resolve('./fixtures-es6/ambients/ambient-requires.ts');
const refImport = require.resolve('./fixtures-es6/program1/ref-import.ts');
const externalEntry = require.resolve('./fixtures-es6/external/entry.ts');
const circularFile = require.resolve('./fixtures-es6/circular/circular.ts');
const importCss = require.resolve('./fixtures-es6/css/import-css.ts');
const importHtml = require.resolve('./fixtures-es6/html/import-html.ts');
const importHtmlCjs = require.resolve('./fixtures-es6/html/import-html-cjs.ts');
const angular2Typings = require.resolve('./fixtures-es6/typings/angular2-typings.ts');
const rxjsTypings = require.resolve('./fixtures-es6/typings/rxjs-typings.ts');
const missingTypings = require.resolve('./fixtures-es6/typings/missing-typings.ts');
const missingPackage = require.resolve('./fixtures-es6/typings/missing-package.ts');
const augGlobal = require.resolve('./fixtures-es6/augmentation/global.ts');
const augAmbient = require.resolve('./fixtures-es6/augmentation/ambient.ts');
const augAmbientGlobal = require.resolve('./fixtures-es6/augmentation/ambient-global.ts');
const augExternal = require.resolve('./fixtures-es6/augmentation/external.ts');

let metadata = {};
function lookup(address: string): any {
   return Promise.resolve(metadata[address] || {});
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

         if (dep === "ambient/ambient")
            result = result + ".ts";

         if (path.extname(result) === "")
            result = result + ".js";
      }

      if (path.extname(result) === "")
         result = result + ".ts";

      //console.log("resolved " + parent + " -> " + result);
      return Promise.resolve((ts as any).normalizePath(result));
   }
   catch (err) {
      console.error(err);
      return Promise.reject(err)
   }
}

describe('TypeChecker', () => {

   let typeChecker;
   let resolver;
   let host;

   async function resolveAll(filelist: string[]) {
      const resolutions = filelist.map((filename) => {
         filename = (ts as any).normalizePath(filename);
         let text = fs.readFileSync(filename, 'utf8');
         host.addFile(filename, text);
         return resolver.resolve(filename);
      });

      const resolved = await Promise.all(resolutions);
      const unlookuped = resolved.reduce((result, deps) => {
         const files = deps.list.filter(dep => !host.fileExists(dep) && (result.indexOf(dep) < 0));
         return result.concat(files);
      }, []);

      if (unlookuped.length > 0) {
         await resolveAll(unlookuped);
      }
   }

   async function typecheckAll(filename: string) {
		host.getDefaultLibFilePaths().forEach(libFile => {
			resolver.registerDeclarationFile((ts as any).normalizePath(require.resolve(libFile)));
		});
      await resolveAll([filename]);
      let result = typeChecker.check();

      if (result.length == 0)
         result = typeChecker.forceCheck();

      return result;
   }

   beforeEach(() => {
      host = new CompilerHost({});
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);
   });

   it('compiles successfully', async () => {
      const diags = await typecheckAll(noImports);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('uses config options', async () => {
      const options = {
         noImplicitAny: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

      const diags = await typecheckAll(oneImport);
      diags.should.have.length(1);
      diags[0].code.should.be.equal(7005);
   });

   it('compiles ambient imports', async () => {
      const diags = await typecheckAll(ambientImportJs);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('catches type errors', async () => {
      const diags = await typecheckAll(typeError);
      diags.should.have.length(1);
      diags[0].code.should.be.equal(2322);
   });

   it('only checks fully resolved typescript files', async () => {
      const options = {
         noImplicitAny: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);
      host.addFile("declaration.d.ts", "export var a: string = 10;");

      await resolver.resolve("declaration.d.ts");
      let diags = typeChecker.check();
      diags.should.have.length(0);

      host.addFile("index.ts", '/// <reference path="declaration.d.ts" />');
      await resolver.resolve("index.ts")
      diags = typeChecker.check();
      diags.should.not.have.length(0);
   });

   it('forceChecks files even if dependencies have not been loaded', async () => {
      const options = {
         noImplicitAny: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

		const libName = (ts as any).normalizePath(require.resolve(host.getDefaultLibFileName()));
		resolver.registerDeclarationFile(libName);
		host.addFile(libName, fs.readFileSync(libName, 'utf8'));

      // should pass normal check and fail forceCheck
      host.addFile("index.ts", '/// <reference path="declaration.d.ts" />\n import a from "amodule"; export = a;');
      await resolver.resolve("index.ts")
      let diags = typeChecker.check();
      diags.should.have.length(0);
      diags = typeChecker.forceCheck();
      diags.should.not.have.length(0);

      // now passes forceCheck
      host.addFile("declaration.d.ts", "declare module 'amodule' { export var a: number; }");
      await resolver.resolve("declaration.d.ts");
      diags = typeChecker.forceCheck();
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('handles backslash in references', async () => {
      const diags = await typecheckAll(backslashReference);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('loads nested reference files', async () => {
      const diags = await typecheckAll(nestedReference)
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('catches syntax errors', async () => {
      const diags = await typecheckAll(syntaxError);
      diags.should.have.length(3);
   });

   it('catches syntax errors in reference files', async () => {
      const diags = await typecheckAll(referenceSyntaxError);
      diags.should.have.length(8);
   });

   it('handles ambient references when resolveAmbientRefs option is false', async () => {
      const diags = await typecheckAll(ambientReferenceDisabled);
      diags.should.have.length(0);
   });

   it('resolves ambient references when resolveAmbientRefs option is true', async () => {
      const options = {
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

      const diags = await typecheckAll(ambientReference);
      diags.should.have.length(0);
   });

   it('handles ambient javascript imports', async () => {
      const diags = await typecheckAll(ambientImportJs);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('handles circular references', async () => {
      const diags = await typecheckAll(circularFile);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('handles ambient typescript imports', async () => {
      const options = {
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

      const diags = await typecheckAll(ambientImportTs);
      diags.should.have.length(0);
   });

   it('resolves ambient typescript imports', async () => {
      const diags = await typecheckAll(ambientResolveTs);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('handles ambients with subset names', async () => {
      const options = {
         resolveAmbientRefs: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

      const diags = await typecheckAll(ambientDuplicate);
      diags.should.have.length(0);
   });

   it('handles ambients with internal requires', async () => {
      const diags = await typecheckAll(ambientRequires);
      diags.should.have.length(0);
   });

   it('handles external imports', async () => {
      const diags = await typecheckAll(externalEntry);
      diags.should.have.length(0);
   });

   it('imports .css files', async () => {
      const diags = await typecheckAll(importCss);
      diags.should.have.length(0);
   });

   it('imports .html files', async () => {
      const options = {
         supportHtmlImports: true
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

      const diags = await typecheckAll(importHtmlCjs);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('imports es6 .html files', async () => {
      const options = {
         supportHtmlImports: true,
         module: "es6"
      };
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

      const diags = await typecheckAll(importHtml);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('loads lib.es6.d.ts', async () => {
      const options = {};
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

      const diags = await typecheckAll(noImports);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });

   it('loads es5, es2015.promise', async () => {
      const options = {
			lib: ['es5', 'es2015.promise']
		};
      host = new CompilerHost(options);
      typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, lookup);

      const diags = await typecheckAll(noImports);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
   });


   it('hasErrors returns true when errors are present', async () => {
      const diags = await typecheckAll(syntaxError);
      diags.should.have.length(3);
      typeChecker.hasErrors().should.be.true;
   });

   it('hasErrors returns false when errors are not present', async () => {
      const diags = await typecheckAll(noImports);
      formatErrors(diags, console as any);
      diags.should.have.length(0);
      typeChecker.hasErrors().should.be.false;
   });

	describe("Typings", () => {
		it('resolve typings files when typings meta is present', async () => {
			let jsfile = path.resolve(__dirname, './fixtures-es6/typings/resolved/angular2/angular2.js');
			jsfile = (ts as any).normalizePath(jsfile);

			metadata = {};
			metadata[jsfile] = {
				typings: true
			};

			const diags = await typecheckAll(angular2Typings);
			formatErrors(diags, console as any);
			diags.should.have.length(0);
		});

		it('doesnt resolve typings files when typings meta not present', async () => {
			metadata = {};

			const diags = await typecheckAll(angular2Typings);
			//formatErrors(diags, console as any);
			diags.should.have.length(1);
			diags[0].code.should.be.equal(2307);
		});

		it('resolves typings when typings is non-relative path', async () => {
			let  jsfile = path.resolve(__dirname, './fixtures-es6/typings/resolved/rxjs.js');
			jsfile = (ts as any).normalizePath(jsfile);

			metadata = {};
			metadata[jsfile] = {
				typings: "Rx.d.ts"
			};

			const diags = await typecheckAll(rxjsTypings);
			formatErrors(diags, console as any);
			diags.should.have.length(0);
		});
	});

	describe("Augmentation", () => {
		it('handles global augmentation', async () => {
			const diags = await typecheckAll(augGlobal);
			formatErrors(diags, console as any);
			diags.should.have.length(0);
			typeChecker.hasErrors().should.be.false;
		});

		it('handles ambient augmentation', async () => {
			const diags = await typecheckAll(augAmbient);
			formatErrors(diags, console as any);
			diags.should.have.length(0);
			typeChecker.hasErrors().should.be.false;
		});

		it('handles ambient global augmentation', async () => {
			const diags = await typecheckAll(augAmbientGlobal);
			formatErrors(diags, console as any);
			diags.should.have.length(0);
			typeChecker.hasErrors().should.be.false;
		});

		it('handles external augmentation', async () => {
			let  jsfile = path.resolve(__dirname, './fixtures-es6/augmentation/resolved/somelib.js');
			jsfile = (ts as any).normalizePath(jsfile);

			metadata = {};
			metadata[jsfile] = {
				typings: "somelib.d.ts"
			};

			const diags = await typecheckAll(augExternal);
			formatErrors(diags, console as any);
			diags.should.have.length(0);
			typeChecker.hasErrors().should.be.false;
		});

	})
});
