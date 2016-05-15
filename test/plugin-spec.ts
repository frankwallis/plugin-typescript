import chai = require('chai');
import * as ts from 'typescript';
import SystemJS = require('systemjs');

const should = chai.should();

describe('Plugin', () => {
	let System = null;

	beforeEach(() => {
		System = new SystemJS.constructor();
	})

	function defaultConfig() {
		return {
			baseUrl: "../",
			transpiler: "plugin",
			typescriptOptions: {
				"module": "system",
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
			System.config(config);
			return System.import('testsrc')
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
			System.config(config);
			return System.import('testsrc')
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
			System.config(config);
			return System.import('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
				})
      });

      it('only executes modules once', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/execute";
			System.config(config);
			return System.import('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
					result.counter.index.should.equal(1);
					result.counter.imported.should.equal(1);
				})
      });

      it('does not execute elided modules', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/execute";
			System.config(config);
			return System.import('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					true.should.be.false;
				})
				.then(result => {
					result.should.be.defined;
					result.counter.elided.should.equal(0);
				})
      });
	});

   describe('strict mode', () => {
      xit('fails build when enabled', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			System.config(config);
			return System.import('testsrc/fail.ts')
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
			System.config(config);
			return System.import('testsrc/pass.ts')
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
			System.config(config);
			return System.import('testsrc/missing.ts')
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
			System.config(config);
			return System.import('testsrc')
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
			System.config(config);
			return System.import('testsrc')
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
