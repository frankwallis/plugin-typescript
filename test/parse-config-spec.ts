import chai = require('chai');
import * as ts from 'typescript';

import {parseConfig} from '../src/parse-config';

const should = chai.should();

describe('Config', () => {

   describe('constructor', () => {
      it('defaults the config', () => {
			const options = parseConfig({});
         options.module.should.be.equal(ts.ModuleKind.System);
         options.target.should.be.equal(ts.ScriptTarget.ES5);
         options.jsx.should.be.equal(ts.JsxEmit.None);
         options.allowNonTsExtensions.should.be.true;
			options.types.should.deep.equal([]);
         options.should.not.have.property("noImplicitAny");
      });

      it('uses the config passed in', () => {
         const options = parseConfig({
            noImplicitAny: true
			});
         options.module.should.be.equal(ts.ModuleKind.System);
         options.target.should.be.equal(ts.ScriptTarget.ES5);
         options.allowNonTsExtensions.should.be.true;
         options.noImplicitAny.should.be.true;
      });

      it('handles the target option', () => {
         let options = parseConfig({
            target: "eS3"
         });
         options.target.should.be.equal(ts.ScriptTarget.ES3);
         options = parseConfig({
            target: ts.ScriptTarget.ES3
         });
         options.target.should.be.equal(ts.ScriptTarget.ES3);
         options = parseConfig({
            target: "Es5"
         });
         options.target.should.be.equal(ts.ScriptTarget.ES5);
      });

      it('handles the jsx option', () => {
         const options = parseConfig({
            jsx: "reAct"
         });
         options.jsx.should.be.equal(ts.JsxEmit.React);
      });

      it('forces moduleResolution to classic', () => {
         const options = parseConfig({
            moduleResolution: ts.ModuleResolutionKind.NodeJs
         });
         options.moduleResolution.should.be.equal(ts.ModuleResolutionKind.Classic);
      });

      it('defaults to lib.es6.d.ts', () => {
         const options = parseConfig({});
         options.lib.should.deep.equal(["es6"]);
      });

      it('handles the lib option', () => {
         const options = parseConfig({
				lib: ["es5", "es2015.promise"]
			});
         options.lib.should.deep.equal(["es5", "es2015.promise"]);
      });
   });
});
