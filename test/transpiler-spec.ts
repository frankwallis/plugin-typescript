import * as ts from 'typescript';
import fs = require('fs');
import path = require('path');
import chai = require('chai');

import {CompilerHost} from '../src/compiler-host';
import {Transpiler} from '../src/transpiler';
import {formatErrors} from '../src/format-errors';
import {parseConfig} from '../src/parse-config';

const should = chai.should();
const defaultOptions = parseConfig({});

const oneImport = fs.readFileSync(require.resolve('./fixtures-es6/program1/one-import.ts'), 'utf8');
const jsxPreserve = fs.readFileSync(require.resolve('./fixtures-es6/program1/jsx-preserve.tsx'), 'utf8');
const es6Symbol = fs.readFileSync(require.resolve('./fixtures-es6/program1/symbol.ts'), 'utf8');
const syntaxError = fs.readFileSync(require.resolve('./fixtures-es6/program1/syntax-error.ts'), 'utf8');
const constEnums = fs.readFileSync(require.resolve('./fixtures-es6/program1/const-enums.ts'), 'utf8');
const trailingComma = fs.readFileSync(require.resolve('./fixtures-es6/es3/trailing-comma.ts'), 'utf8');

describe('Transpiler', () => {

   function transpile(sourceName: string, source: string, options: ts.CompilerOptions = defaultOptions) {
      const host = new CompilerHost();
      const transpiler = new Transpiler(host);

      host.addFile(sourceName, source, options.target);
      return transpiler.transpile(sourceName, options);
   }

   it('transpiles typescript successfully', () => {
      const output = transpile('one-import.ts', oneImport);
      formatErrors(output.diags, console as any);
      output.should.have.property('failure', false);
      output.should.have.property('diags').with.lengthOf(0);
      output.should.have.property('js').with.lengthOf(407);
   });

   it('transpiles javascript successfully', () => {
      const output = transpile('no-import.js', "var a = 10; export default a;");
      formatErrors(output.diags, console as any);
      output.should.have.property('failure', false);
      output.should.have.property('diags').with.lengthOf(0);
      output.should.have.property('js').with.lengthOf(276);
   });

   it('supports jsx preserve', () => {
		const options = parseConfig({
			jsx: 'preserve'
		});
		const output = transpile('jsx-preserve.tsx', jsxPreserve, options);
      formatErrors(output.diags, console as any);
      output.should.have.property('failure', false);
      output.should.have.property('diags').with.lengthOf(0);
      output.js.should.contain('<div>hello</div>');
   });

   it('supports jsx react', () => {
		const options = parseConfig({
         jsx: 'react'
		});
      const output = transpile('jsx-preserve.tsx', jsxPreserve, options);
      formatErrors(output.diags, console as any);
      output.should.have.property('failure', false);
      output.should.have.property('diags').with.lengthOf(0);
      output.js.should.not.contain('<div>hello</div>');
		output.js.should.contain('React.createElement');
   });

   it('removes SourceMappingURL', () => {
      const output = transpile('one-import.ts', oneImport);
      output.js.should.not.contain("SourceMappingURL");
   });

   it('removes SourceMappingURL from jsx output', () => {
		const options = parseConfig({
			jsx: 'preserve'
		})
      const output = transpile('jsx-preserve.tsx', jsxPreserve, options);
      output.js.should.not.contain("SourceMappingURL");
   });

   it('returns sourceMap', () => {
      const output = transpile('one-import.ts', oneImport);
      output.should.have.property('sourceMap').with.lengthOf(137);
   });

   it('catches syntax errors', () => {
      const output = transpile('syntax-error.ts', syntaxError);
      //formatErrors(output.diags, console as any);
      output.should.have.property('failure', true);
      output.should.have.property('diags').with.lengthOf(1);
   });

   it('catches configuation errors', () => {
		const options = parseConfig({
         emitDecoratorMetadata: true,
         experimentalDecorators: false
		});
      const output = transpile('one-import.ts', oneImport, options);
      //formatErrors(output.diags, console as any);
      output.should.have.property('failure', true);
      output.should.have.property('diags').with.lengthOf(1);
      output.diags[0].code.should.be.equal(5052);
   });

   it('overrides invalid config options', () => {
		const options = parseConfig({
         noEmitOnError: true,
         out: "somefile.js",
         declaration: true,
         noLib: false,
         noEmit: true
		});
      const output = transpile('one-import.ts', oneImport, options);
      formatErrors(output.diags, console as any);
      output.should.have.property('failure', false);
      output.should.have.property('diags').with.lengthOf(0);
      output.js.length.should.be.greaterThan(0);
   });

   xit('errors on const enums', () => {
      const output = transpile('const-enums.ts', constEnums);
      //formatErrors(output.diags, console as any);
      output.should.have.property('failure', true);
      output.should.have.property('diags').with.lengthOf(1);
   });

   it('uses sourceMap option', () => {
		const options = parseConfig({
         sourceMap: false
		});
      const output = transpile('symbol.ts', es6Symbol, options);
      (output.sourceMap === undefined).should.be.true;
   });

   it('uses target option', () => {
		let options = parseConfig({
         target: "es3"
      });
      const es3output = transpile('trailing-comma.ts', trailingComma, options);

		options = parseConfig({
         target: "es5"
      });
      const es5output = transpile('trailing-comma.ts', trailingComma, options);
      es3output.should.not.be.equal(es5output);
   });
});
