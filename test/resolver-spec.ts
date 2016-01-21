import fs = require('fs');
import path = require('path');
import Promise = require('bluebird');
import chai = require('chai');

import {Resolver} from '../src/resolver';
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

xdescribe('Resolver', () => {

	let resolver;
	let host;

	function resolve(filename) {
      let text = fs.readFileSync(filename, 'utf8');
      host.addFile(filename, text);
      return resolver.resolve(filename, text);
	}

	beforeEach(() => {
		filelist = [];
		host = new CompilerHost({});
		resolver = new Resolver(host, resolve, fetch);
	});

	it('resolves successfully', () => {
		return resolve(noImports)
			.then((deps) => {
				deps.list.should.have.length(0);
			});
	});

	it('adds declaration files', () => {
      resolver.registerDeclarationFile("declations.d.ts");
		return resolve(noImports)
			.then((deps) => {
				deps.list.should.have.length(1);
            deps.list[0].should.equal("declations.d.ts");
			});
	});

	it('flags the default library', () => {
      let defaultLib = require.resolve(host.getDefaultLibFileName());
      resolver.registerDeclarationFile(defaultLib);
		return resolve(noImports)
			.then((deps) => {
				deps.list.should.have.length(1);
            deps.list[0].should.equal(defaultLib);
            host.getSourceFile(defaultLib).isLibFile.should.be.true;
			});
	});

	xit('compiles ambient imports', () => {
      resolver.registerDeclarationFile(defaultLib);
		return resolve([ambientImportJs])
			.then((deps) => {
				deps.list.should.have.length(3);
            deps.list[0].should.equal(defaultLib);
            deps.list[0].should.equal(ambientImportJs);
			});
	});

	xit('handles ambient references when resolveAmbientRefs option is false', () => {
		return typecheckAll([ambientReferenceDisabled])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	xit('resolves ambient references when resolveAmbientRefs option is true', () => {
		let options = {
			resolveAmbientRefs: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host, resolve, fetch);
		return typecheckAll([ambientReference, ambientReference2])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	xit('handles ambient javascript imports', () => {
		return typecheckAll([ambientImportJs])
			.then((diags) => {
				formatErrors(diags, console);
				diags.should.have.length(0);
			});
	});

	xit('handles ambient typescript imports', () => {
		let options = {
			resolveAmbientRefs: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host, resolve, fetch);
		return typecheckAll([ambientImportTs])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	xit('resolves ambient typescript imports', () => {
		return typecheckAll([ambientResolveTs, ambientResolvedTs])
			.then((diags) => {
				formatErrors(diags, console);
				diags.should.have.length(0);
			});
	});

	xit('handles ambients with subset names', () => {
		let options = {
			resolveAmbientRefs: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host, resolve, fetch);
		return typecheckAll([ambientDuplicate, ambientImportTs])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	xit('handles ambients with internal requires', () => {
		return typecheckAll([ambientRequires])
			.then((diags) => {
				diags.should.have.length(0);
			});
	});

	it('resolves typings files from package.json when resolveTypings is true', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
      
      resolver.registerDeclarationFile(defaultLib);
		return resolve([ambientImportJs])
			.then((deps) => {
				deps.list.should.have.length(3);
            deps.list[0].should.equal(defaultLib);
            deps.list[0].should.equal(ambientImportJs);
			});
	});

	it('doesnt resolve typings files when resolveTypings is false', () => {
		let options = {
			resolveTypings: false
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host, resolve, fetch);
		return typecheckAll([angular2Typings])
			.then((diags) => {
				//formatErrors(diags, console);
				diags.should.have.length(1);
				diags[0].code.should.be.equal(2307);
			});
	});

	it('handles missing typings field in package.json', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host, resolve, fetch);
		return typecheckAll([missingTypings])
			.then((diags) => {
				formatErrors(diags, console);
				diags.should.have.length(0);
			});
	});

	it('handles non-relative typings field in package.json', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host, resolve, fetch);
		return typecheckAll([rxjsTypings])
			.then((diags) => {
				formatErrors(diags, console);
				diags.should.have.length(0);
			});
	});

	it('handles package.json not found', () => {
		let options = {
			resolveTypings: true
		};
		host = new CompilerHost(options);
		typeChecker = new TypeChecker(host, resolve, fetch);
		return typecheckAll([missingPackage])
			.then((diags) => {
				formatErrors(diags, console);
				diags.should.have.length(0);
			});
	});

});
