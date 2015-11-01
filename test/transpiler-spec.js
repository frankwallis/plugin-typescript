import fs from 'fs';
import * as chai from 'chai';

import {CompilerHost} from '../lib/compiler-host';
import {Transpiler} from '../lib/transpiler';
import {formatErrors} from '../lib/format-errors';

let should = chai.should();

let oneImport = fs.readFileSync(require.resolve('./fixtures-es6/program1/one-import.ts'), 'utf8');
let es6Symbol = fs.readFileSync(require.resolve('./fixtures-es6/program1/symbol.ts'), 'utf8');
let syntaxError = fs.readFileSync(require.resolve('./fixtures-es6/program1/syntax-error.ts'), 'utf8');
let constEnums = fs.readFileSync(require.resolve('./fixtures-es6/program1/const-enums.ts'), 'utf8');
let trailingComma = fs.readFileSync(require.resolve('./fixtures-es6/es3/trailing-comma.ts'), 'utf8');

describe('Transpiler ES6', () => {

	let transpiler;

	describe('transpile', () => {
		beforeEach(function() {
			let host = new CompilerHost({});
			transpiler = new Transpiler(host);
		});

		it('transpiles successfully', () => {
			let output = transpiler.transpile('one-import.ts', oneImport);
			output.should.have.property('failure', false);
			output.should.have.property('errors').with.lengthOf(0);
			output.should.have.property('js').with.lengthOf(322);
		});

		it('removes SourceMappingURL', () => {
			let output = transpiler.transpile('one-import.ts', oneImport);
			output.js.should.not.contain("SourceMappingURL");
		});

		it('returns sourceMap', () => {
			let output = transpiler.transpile('one-import.ts', oneImport);
			output.should.have.property('sourceMap').with.lengthOf(143);
		});

		it('catches syntax errors', () => {
			let output = transpiler.transpile('syntax-error.ts', syntaxError);
			//formatErrors(output.errors, console);
			output.should.have.property('failure', true);
			output.should.have.property('errors').with.lengthOf(1);
		});

		xit('errors on const enums', () => {
			let output = transpiler.transpile('const-enums.ts', constEnums);
			//formatErrors(output.errors, console);
			output.should.have.property('failure', true);
			output.should.have.property('errors').with.lengthOf(1);
		});

		it('uses sourceMap option', () => {
			let options = {
				sourceMap: false
			};
			let host = new CompilerHost(options);
			transpiler = new Transpiler(host);
			let output = transpiler.transpile('symbol.ts', es6Symbol);
			(output.sourceMap === undefined).should.be.true;
		});

		it('uses target option', () => {
			let host = new CompilerHost({
				target: "es3"
			});
			transpiler = new Transpiler(host);
			let es3output = transpiler.transpile('trailing-comma.ts', trailingComma);

			host = new CompilerHost({
				target: "es5"
			});
			transpiler = new Transpiler(host);
			let es5output = transpiler.transpile('trailing-comma.ts', trailingComma);
			es3output.should.not.be.equal(es5output);
		});
	});
});
