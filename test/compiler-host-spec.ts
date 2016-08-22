import chai = require('chai');
import * as ts from 'typescript';

import {CompilerHost} from '../src/compiler-host';

const should = chai.should();

describe('Host', () => {

   let host;
   beforeEach(function() {
      host = new CompilerHost({});
   });

   describe('constructor', () => {
      it('defaults the config', () => {
         const options = host._options;
         options.module.should.be.equal(ts.ModuleKind.System);
         options.target.should.be.equal(ts.ScriptTarget.ES5);
         options.jsx.should.be.equal(ts.JsxEmit.None);
         options.allowNonTsExtensions.should.be.true;
			options.types.should.deep.equal([]);
         options.should.not.have.property("noImplicitAny");
      });

      it('uses the config passed in', () => {
         const config = {
            noImplicitAny: true
         };
         host = new CompilerHost(config);
         const options = host._options;
         options.module.should.be.equal(ts.ModuleKind.System);
         options.target.should.be.equal(ts.ScriptTarget.ES5);
         options.allowNonTsExtensions.should.be.true;
         options.noImplicitAny.should.be.true;
      });

      it('handles the target option', () => {
         host = new CompilerHost({
            target: "eS3"
         });
         host.options.target.should.be.equal(ts.ScriptTarget.ES3);
         host = new CompilerHost({
            target: ts.ScriptTarget.ES3
         });
         host.options.target.should.be.equal(ts.ScriptTarget.ES3);
         host = new CompilerHost({
            target: "Es5"
         });
         host.options.target.should.be.equal(ts.ScriptTarget.ES5);
      });

      it('handles the jsx option', () => {
         host = new CompilerHost({
            jsx: "reAct"
         });
         host.options.jsx.should.be.equal(ts.JsxEmit.React);
      });

      it('forces moduleResolution to classic', () => {
         host = new CompilerHost({
            moduleResolution: ts.ModuleResolutionKind.NodeJs
         });
         host.options.moduleResolution.should.be.equal(ts.ModuleResolutionKind.Classic);
      });

      xit('switches from system output to es6 module output when building', () => {
         host = new CompilerHost({
            module: "system"
         }, true);
         host.options.module.should.be.equal(ts.ModuleKind.ES6);
      });

      it('doesnt switch from system output to es6 module output when not building', () => {
         host = new CompilerHost({
            module: "system"
         }, false);
         host.options.module.should.be.equal(ts.ModuleKind.System);
      });

      it('defaults to lib.es6.d.ts', () => {
         host.getDefaultLibFilePaths().should.deep.equal(["typescript/lib/lib.es6.d.ts"]);
         host.getDefaultLibFileName().should.be.equal("typescript/lib/lib.es6.d.ts");
      });

      it('handles the targetLib option', () => {
         host = new CompilerHost({
            targetLib: "es5"
         });
         host.getDefaultLibFilePaths().should.deep.equal(["typescript/lib/lib.d.ts"]);
         host.getDefaultLibFileName().should.be.equal("typescript/lib/lib.d.ts");
      });

      it('handles the lib option', () => {
         host = new CompilerHost({
            lib: ["es5", "es2015.promise"]
         });
			const defaultLibPaths = host.getDefaultLibFilePaths();
			defaultLibPaths.should.have.length(2);
         defaultLibPaths[0].should.be.equal("typescript/lib/lib.es5.d.ts");
			defaultLibPaths[1].should.be.equal("typescript/lib/lib.es2015.promise.d.ts");
      });
   });

   describe('addFile', () => {
      it('adds files', () => {
         const filename = 'filea.ts';
         const sourceFile = host.addFile(filename, 'sometext');
         const sourceFile1 = host.getSourceFile(filename);
         sourceFile.should.be.equal(sourceFile1);
      });

      it('keeps same file if it has not changed', () => {
         const filename = 'filea.ts';
         const sourceFile1 = host.addFile(filename, 'sometext');
         const sourceFile2 = host.addFile(filename, 'sometext');
         sourceFile1.should.be.equal(sourceFile2);
      });

      it('overwrites file if it has changed', () => {
         const filename = 'filea.ts';
         const sourceFile1 = host.addFile(filename, 'sometext');
         const sourceFile2 = host.addFile(filename, 'differenttext');
         sourceFile1.should.not.be.equal(sourceFile2);
         const sourceFile3 = host.getSourceFile(filename);
         sourceFile2.should.be.equal(sourceFile3);
      });
   });
});
