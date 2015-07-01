import fs from 'fs';
import should from 'should';

import {CompilerHost} from '../lib/compiler-host';
import {Transpiler} from '../lib/transpiler';
import {formatErrors} from '../lib/format-errors';

let oneImport = fs.readFileSync(require.resolve('./fixtures-es6/program1/one-import.ts'), 'utf8');
let es6Symbol = fs.readFileSync(require.resolve('./fixtures-es6/program1/symbol.ts'), 'utf8');
let syntaxError = fs.readFileSync(require.resolve('./fixtures-es6/program1/syntax-error.ts'), 'utf8');
let constEnums = require.resolve('./fixtures-es6/program1/const-enums.ts');

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
         output.should.have.property('js').with.lengthOf(320);
      });
      
      it('removes SourceMappingURL', () => {
         let output = transpiler.transpile('one-import.ts', oneImport);
         output.js.should.not.containEql("SourceMappingURL");
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
         let output = transpiler.transpile('syntax-error.ts', syntaxError);
         //formatErrors(output.errors, console);
         output.should.have.property('failure', true);
         output.should.have.property('errors').with.lengthOf(1);
      });

      it('uses config options', () => {
         let options = {
            sourceMap: false
         };
         let host = new CompilerHost(options);
         transpiler = new Transpiler(host);
         let output = transpiler.transpile('symbol.ts', es6Symbol);
         (output.sourceMap === undefined).should.be.true;
      });
   });
});
