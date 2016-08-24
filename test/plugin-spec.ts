import chai = require('chai');
import * as ts from 'typescript';
import SystemJS = require('systemjs');

const should = chai.should();

describe('Plugin', () => {
	let System = null;

	beforeEach(() => {
		var constructor = SystemJS['constructor'] as () => void;
		System = new constructor();
	})

	function defaultConfig() {
		return {
			baseUrl: "../",
			transpiler: "plugin",
			typescriptOptions: {
				"module": "system",
				"target": "es5",
				"jsx": "react",
				"noImplicitAny": false,
				"typeCheck": "strict",
				"tsconfig": false,
				"types": undefined
			},
			packages: {
				"testsrc": {
					"main": "index.ts",
					"defaultExtension": "ts",
					"meta": {
						"*.ts": {
							"loader": "plugin"
						},
						"*.tsx": {
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
				},
				"reacty": {
					"main": "index.js",
				},
				"@types/reacty": {
					"main": "index.d.ts",
				}
			},
			map: {
				"testsrc": "test/fixtures-es6/plugin/elisions/",
				"external": "test/fixtures-es6/plugin/external/",
				"plugin": "lib/",
				"typescript": "node_modules/typescript/",
				"reacty": "test/fixtures-es6/plugin/attypes/reacty/",
				"@types/reacty": "test/fixtures-es6/plugin/attypes/@types/reacty/"
			}
		};
   }

   describe('elided imports', () => {
      it('brings in elided import files', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions/bad";
			System.config(config);
			return System.import('testsrc')
				.then(result => {
					(result == undefined).should.be.true;
				})
				.catch(err => {
					err.should.be.defined;
					err.originalErr.toString().indexOf('compilation failed').should.not.be.equal(-1);
				})
      });

      xit('brings in elided import files when outputting to es6', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions/bad";
			config.typescriptOptions.module = "es6";
			config.typescriptOptions.target = "es6";
			System.config(config);
			return System.import('testsrc')
				.catch(err => {
					console.log(err.originalErr);
					err.should.be.defined;
				})
				.then(result => {
					// elided files are brought in, but this build still passes
					(result == undefined).should.be.true;
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

      xit('does not execute elided modules', () => {
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
      it('fails build when enabled', () => {
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
			config.typescriptOptions.typeCheck = true as any;
			System.config(config);
			return System.import('testsrc/fail.ts')
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

		it('compile with custom lib', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/es6";
			config.typescriptOptions['lib'] = ["es5", "es2015.promise"];
			System.config(config);
			return System.import('testsrc/promise.ts')
				.then(result => {
					(result == undefined).should.be.false;
				})
      });
	});

   describe('types', () => {
      it('supports types config option', () => {
			const config = defaultConfig() as any;
			config.defaultJsExtensions = true;
			config.defaultJSExtensions = true;
			config.map["testsrc"] = "test/fixtures-es6/plugin/attypes";
			config.packages["testsrc"].main = "index.tsx";
			config.packages["testsrc"].defaultExtension = "tsx";
			config.typescriptOptions.types = ["reacty"];
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
