import fs = require('fs');
import path = require('path');
import Promise = require('bluebird');
import chai = require('chai');

import {Resolver} from '../src/resolver';
import {TypeChecker} from '../src/type-checker';
import {CompilerHost} from '../src/compiler-host';
import {formatErrors} from '../src/format-errors';

let should = chai.should();

let missingFile = '/somefolder/fixtures-es6/program1/missing-file.ts';
let missingImport = require.resolve('./fixtures-es6/program1/missing-import.ts');
let syntaxError = require.resolve('./fixtures-es6/program1/syntax-error.ts');
let referenceSyntaxError = require.resolve('./fixtures-es6/program1/ref-syntax-error.ts');
let typeError = require.resolve('./fixtures-es6/program1/type-error.ts');
let nestedTypeError = require.resolve('./fixtures-es6/program1/nested-type-error.ts');
let noImports = require.resolve('./fixtures-es6/program1/no-imports.ts');
let oneImport = require.resolve('./fixtures-es6/program1/one-import.ts');
let ambientReference = require.resolve('./fixtures-es6/ambients/ambient-reference.ts');
let ambientReference2 = require.resolve('./fixtures-es6/ambients/module1/ambient-references2.ts');
let ambientReferenceDisabled = require.resolve('./fixtures-es6/ambients/ambient-reference-disabled.ts');
let ambientImportJs = require.resolve('./fixtures-es6/ambients/ambient-import-js.ts');
let ambientImportTs = require.resolve('./fixtures-es6/ambients/ambient-import-ts.ts');
let ambientResolveTs = require.resolve('./fixtures-es6/ambients/ambient-resolve.ts');
let ambientResolvedTs = require.resolve('./fixtures-es6/ambients/resolved/ambient.ts');
let ambientDuplicate = require.resolve('./fixtures-es6/ambients/ambient-duplicate.ts');
let ambientRequires = require.resolve('./fixtures-es6/ambients/ambient-requires.ts');
let refImport = require.resolve('./fixtures-es6/program1/ref-import.ts');
let externalEntry = require.resolve('./fixtures-es6/external/entry.ts');
let externalOther = require.resolve('./fixtures-es6/external/other.ts');
let externalDependency = require.resolve('./fixtures-es6/external/dependency.ts');
let circularFile = require.resolve('./fixtures-es6/circular/circular.ts');
let importCss = require.resolve('./fixtures-es6/css/import-css.ts');
let importHtml = require.resolve('./fixtures-es6/html/import-html.ts');
let angular2Typings = require.resolve('./fixtures-es6/typings/angular2-typings.ts');
let rxjsTypings = require.resolve('./fixtures-es6/typings/rxjs-typings.ts');
let missingTypings = require.resolve('./fixtures-es6/typings/missing-typings.ts');
let missingPackage = require.resolve('./fixtures-es6/typings/missing-package.ts');
let filelist = [];

function fetch(filename) {
	//console.log("fetching " + filename);
	filelist.push(filename);
	let readFile = Promise.promisify(fs.readFile.bind(fs));
	return readFile(filename, 'utf8');
}

function resolve(dep, parent) {
	//console.log("resolving " + parent + " -> " + dep);
	let result = "";

	try {
		if ((dep === "angular2") || (dep === "missing") || dep == "rxjs")
			result = require.resolve("./" + path.join('fixtures-es6/typings/', dep, dep +'.js'));
		else if ((dep.indexOf("angular2/") == 0) || (dep.indexOf("missing/") == 0) || (dep.indexOf("rxjs/") == 0))
			result = require.resolve("./" + path.join('fixtures-es6/typings/', dep));
		else if (dep === "ambient")
			result = require.resolve("./fixtures-es6/ambients/resolved/" + dep + ".js");
		else if (dep == "ambient/ambient")
			result = require.resolve("./fixtures-es6/ambients/resolved/ambient.ts");
		else if (path.dirname(dep) == "ambient")
			result = require.resolve("./fixtures-es6/ambients/resolved/" + dep.slice(8));
		else if (dep.indexOf("typescript/") == 0)
			result = require.resolve(dep);
		else if (dep[0] == '/')
			result = dep;
		else if (dep[0] == '.')
			result = path.join(path.dirname(parent), dep);
		else if (path.extname(dep) == "")
			result = dep + ".js";
		else
			result = dep;

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

describe('TypeChecker', () => {

	let typeChecker;
   let resolver;
	let host;

   function resolveAll(filelist) {
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
   
	function typecheckAll(filelist) {
		resolver.registerDeclarationFile(require.resolve(host.getDefaultLibFileName()));
      return resolveAll(filelist).then(() => {
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
		return typecheckAll([noImports])
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
		return typecheckAll([oneImport, noImports])
			.then((diags) => {
				diags.should.have.length(1);
				diags[0].code.should.be.equal(7005);
			});
	});

	it('compiles ambient imports', () => {
		return typecheckAll([ambientImportJs])
			.then((diags) => {
				formatErrors(diags, console);
				diags.should.have.length(0);
			});
	});

	it('catches type errors', () => {
		return typecheckAll([typeError])
			.then((diags) => {
				diags.should.have.length(1);
				diags[0].code.should.be.equal(2322);
			});
	});

	it('catches nested type-checker errors', () => {
		return typecheckAll([nestedTypeError, oneImport, noImports])
			.then((diags) => {
				diags.should.have.length(1);
				diags[0].code.should.be.equal(2339);
			});
	});

	it('catches syntax errors', () => {
		return typecheckAll([syntaxError])
			.then((diags) => {
				diags.should.have.length(3);
			});
	});

	it('catches syntax errors in reference files', () => {
		return typecheckAll([referenceSyntaxError])
			.then((diags) => {
				diags.should.have.length(8);
			});
	});

	it('handles ambient references when resolveAmbientRefs option is false', () => {
		return typecheckAll([ambientReferenceDisabled])
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
		return typecheckAll([ambientReference, ambientReference2])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('handles ambient javascript imports', () => {
		return typecheckAll([ambientImportJs])
			.then((diags) => {
				formatErrors(diags, console);
				diags.should.have.length(0);
			});
	});

	it('handles circular references', () => {
		return typecheckAll([circularFile])
			.then((diags) => {
				formatErrors(diags, console);
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
		return typecheckAll([ambientImportTs])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('resolves ambient typescript imports', () => {
		return typecheckAll([ambientResolveTs, ambientResolvedTs])
			.then((diags) => {
				formatErrors(diags, console);
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
		return typecheckAll([ambientDuplicate, ambientImportTs])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('handles ambients with internal requires', () => {
		return typecheckAll([ambientRequires])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('handles external imports', () => {
		return typecheckAll([externalEntry, externalOther, externalDependency])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('imports .css files', () => {
		return typecheckAll([importCss])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('imports .html files', () => {
		return typecheckAll([importHtml])
			.then((diags) => {
				formatErrors(diags, console);
				diags.should.have.length(0);
			});
	});
});
