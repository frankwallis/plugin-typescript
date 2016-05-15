import chai = require('chai');
import * as ts from 'typescript';
import {Builder} from 'jspm';

const should = chai.should();

describe('Builder', () => {
	let builder = null;

	beforeEach(() => {
		builder = new Builder('./');
	})

	function defaultConfig() {
		return {
			baseUrl: "../",
			transpiler: "plugin",
			typescriptOptions: {
				"module": "system",
				"target": "es5",
				"noImplicitAny": false,
				"typeCheck": "strict",
				"tsconfig": false
			},
			packages: {
				"testsrc": {
					"main": "index.ts",
					"defaultExtension": "ts",
					"meta": {
						"*.ts": {
							"loader": "plugin"
						}
					}
				},
				"lib": {
					"main": "plugin.js"
				},
				"external": {
					"main": "external.js",
					"meta": {
						"*.js": {
							"typings": true
						}
					}
				},
				"typescript": {
					"main": "lib/typescript.js",
					"meta": {
						"lib/typescript.js": {
							"exports": "ts"
						}
					}
				}
			},
			map: {
				"testsrc": "test/fixtures-es6/plugin/elisions/",
				"external": "test/fixtures-es6/plugin/external/",
				"plugin": "lib/",
				"typescript": "node_modules/typescript/"
			}
		};
   }

   describe('elided imports', () => {
      it('brings in elided import files', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions";
			builder.config(config);
			return builder.bundle('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
				})
      });

      it('brings in elided import files when outputting to es6', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions";
			config.typescriptOptions.module = "es6";
			config.typescriptOptions.target = "es6";
			builder.config(config);
			return builder.bundle('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
				})
      });

      it('brings in ambient external typings', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/ambient";
			builder.config(config);
			return builder.bundle('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
				})
      });

      it('handles elided files which have exports', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions-exports";
			builder.config(config);
			return builder.bundle('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
				})
      });
	});

   describe('strict mode', () => {
      it('fails build when enabled', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			builder.config(config);
			return builder.bundle('testsrc/fail')
				.catch(err => {
					console.log(err.originalErr);
					err.should.be.defined;
				})
				.then(result => {
					(result == undefined).should.be.true;
				})
      });

      it('passes build when disabled', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			config.typescriptOptions.typeCheck = true as any;
			builder.config(config);
			return builder.bundle('testsrc/fail')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
				})
      });

      it('detects missing files', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			builder.config(config);
			return builder.bundle('testsrc/missing')
				.catch(err => {
					console.log(err.originalErr);
					err.should.be.defined;
				})
				.then(result => {
					(result == undefined).should.be.true;
				})
      });
	});

   describe('commonjs', () => {
      it('supports module.id when outputting commonjs', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/commonjs";
			config.typescriptOptions.module = "commonjs";
			builder.config(config);
			return builder.bundle('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
				})
      });

      it('compiles js files when default transpiler', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/es6";
			config.packages["testsrc"].main = "index.js";
			config.packages["testsrc"].defaultExtension = "js";
			config.typescriptOptions.module = "commonjs";
			builder.config(config);
			return builder.bundle('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
				})
      });
	});
});
