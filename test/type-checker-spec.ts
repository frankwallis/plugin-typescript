import fs = require('fs');
import path = require('path');
import Promise = require('bluebird');
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
const angular2Typings = require.resolve('./fixtures-es6/typings/angular2-typings.ts');
const rxjsTypings = require.resolve('./fixtures-es6/typings/rxjs-typings.ts');
const missingTypings = require.resolve('./fixtures-es6/typings/missing-typings.ts');
const missingPackage = require.resolve('./fixtures-es6/typings/missing-package.ts');

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

         if (dep == "ambient/ambient")
            result = result + ".ts";
            
         if (path.extname(result) == "")
            result = result + ".js";
      }
      
		if (path.extname(result) == "")
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

   function resolveAll(filelist: string[]) {
      var resolutions = filelist.map((filename) => {
         let text = fs.readFileSync(filename, 'utf8');
         host.addFile(filename, text);
         return resolver.resolve(filename);
      });
      
      return Promise.all(resolutions)
         .then(resolved => {
            const unfetched = resolved.reduce((result, deps) => {
               const files = deps.list.filter(dep => !host.fileExists(dep) && (result.indexOf(dep) < 0));
               return result.concat(files);
            }, []);
            
            if (unfetched.length > 0) {
               return resolveAll(unfetched);
            }
         });
   }
   
	function typecheckAll(filename: string) {
		resolver.registerDeclarationFile(require.resolve(host.getDefaultLibFileName()));
      return resolveAll([filename]).then(() => {
         var result = typeChecker.check();
         
         if (result.length == 0)
            result = typeChecker.forceCheck();
            
         return result;         
      });
	}

	beforeEach(() => {
		filelist = [];
		host = new CompilerHost({});
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
	});

	it('compiles successfully', () => {
		return typecheckAll(noImports)
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('uses config options', () => {
		let options = {
			noImplicitAny: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(oneImport)
			.then((diags) => {
				diags.should.have.length(1);
				diags[0].code.should.be.equal(7005);
			});
	});

	it('compiles ambient imports', () => {
		return typecheckAll(ambientImportJs)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

	it('catches type errors', () => {
		return typecheckAll(typeError)
			.then((diags) => {
				diags.should.have.length(1);
				diags[0].code.should.be.equal(2322);
			});
	});

	it('only checks full resolved typescript files', () => {
		let options = {
			noImplicitAny: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
      host.addFile("declaration.d.ts", "export var a: string = 10;");
      return resolver.resolve("declaration.d.ts")
         .then(() => {
            let diags = typeChecker.check();
            diags.should.have.length(0);
            
            host.addFile("index.ts", '/// <reference path="declaration.d.ts" />');
            return resolver.resolve("index.ts")
               .then(() => {
                  let diags = typeChecker.check(); 
                  diags.should.not.have.length(0);                  
               })            
         })
	});

	it('handles backslash in references', () => {
		return typecheckAll(backslashReference)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

	it('loads nested reference files', () => {
		return typecheckAll(nestedReference)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

	it('catches syntax errors', () => {
		return typecheckAll(syntaxError)
			.then((diags) => {
				diags.should.have.length(3);
			});
	});

	it('catches syntax errors in reference files', () => {
		return typecheckAll(referenceSyntaxError)
			.then((diags) => {
				diags.should.have.length(8);
			});
	});

	it('handles ambient references when resolveAmbientRefs option is false', () => {
		return typecheckAll(ambientReferenceDisabled)
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('resolves ambient references when resolveAmbientRefs option is true', () => {
		let options = {
			resolveAmbientRefs: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(ambientReference)
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('handles ambient javascript imports', () => {
		return typecheckAll(ambientImportJs)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

	it('handles circular references', () => {
		return typecheckAll(circularFile)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

	it('handles ambient typescript imports', () => {
		let options = {
			resolveAmbientRefs: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(ambientImportTs)
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('resolves ambient typescript imports', () => {
		return typecheckAll(ambientResolveTs)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

	it('handles ambients with subset names', () => {
		let options = {
			resolveAmbientRefs: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(ambientDuplicate)
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('handles ambients with internal requires', () => {
		return typecheckAll(ambientRequires)
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('handles external imports', () => {
		return typecheckAll(externalEntry)
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('imports .css files', () => {
		return typecheckAll(importCss)
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('imports .html files', () => {
		return typecheckAll(importHtml)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});
   
   it('resolve typings files when resolveTypings is true', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(angular2Typings)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

   it('doesnt resolve typings files when resolveTypings is false', () => {
		let options = {
			resolveTypings: false
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(angular2Typings)
			.then((diags) => {
				//formatErrors(diags, console as any);
				diags.should.have.length(1);
				diags[0].code.should.be.equal(2307);
			});
	});

	it('handles missing typings field in package.json', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(missingTypings)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

	it('handles non-relative typings field in package.json', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(rxjsTypings)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

	it('handles package.json not found', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host);
      resolver = new Resolver(host, resolve, fetch);
		return typecheckAll(missingPackage)
			.then((diags) => {
				formatErrors(diags, console as any);
				diags.should.have.length(0);
			});
	});

});
