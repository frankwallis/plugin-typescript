import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');

import * as ts from 'typescript';
import SystemJS = require('systemjs');

chai.use(chaiAsPromised);
const should = chai.should();

describe('Plugin', () => {
	let System = null;

	beforeEach(() => {
		global['tsfactory'] = undefined;
		var constructor = SystemJS['constructor'] as any;
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
			} as any,
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
				.should.be.rejectedWith(/compilation failed/);
      });

      xit('brings in elided import files when outputting to es2015', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions/bad";
			config.typescriptOptions.module = "es2015";
			config.typescriptOptions.target = "es2015";
			System.config(config);
			return System.import('testsrc')
				.should.be.rejected;
      });

      it('brings in ambient external typings', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/ambient";
			System.config(config);
			return System.import('testsrc')
				.should.be.fulfilled;
      });

      it('handles elided files which have exports', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions-exports";
			System.config(config);
			return System.import('testsrc')
				.should.be.fulfilled;
      });

      it('only executes modules once', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/execute";
			System.config(config);
			return System.import('testsrc')
				.should.become({ counter: { index: 1, imported: 1, elided: 1 }});
      });

      xit('does not execute elided modules', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/execute";
			System.config(config);
			return System.import('testsrc')
				.should.become({ counter: { index: 1, imported: 1, elided: 0 }});
      });
	});

   describe('typeCheck', () => {
      it('fails build when strict', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			System.config(config);
			return System.import('testsrc/fail.ts')
				.should.be.rejected;
      });

      it('passes build when true', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			config.typescriptOptions.typeCheck = true;
			System.config(config);
			return System.import('testsrc/fail.ts')
				.should.be.fulfilled;
      });

      it('detects missing files', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			System.config(config);
			return System.import('testsrc/missing.ts')
				.should.be.rejected;
      });

		it('successfully compiles with custom lib files', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/es6";
			config.typescriptOptions['lib'] = ['es5', 'es2015.promise'];
			System.config(config);
			return System.import('testsrc/promise.ts')
				.should.be.fulfilled;
      });

		it('fails to compile with custom lib files', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/es6";
			config.typescriptOptions['lib'] = ['es5'];
			System.config(config);
			return System.import('testsrc/promise.ts')
				.should.be.rejected;
      });
	});

   describe('tsconfig', () => {
      it('supports tsconfig config option', () => {
			const config = defaultConfig() as any;
			config.defaultJsExtensions = true;
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig";
			delete config.typescriptOptions.module;
			config.typescriptOptions.typeCheck = false;
			config.typescriptOptions.tsconfig = "testsrc/tsconfig.json";
			System.config(config);
			return System.import('testsrc')
				.should.be.rejectedWith(/transpilation failed/);
      });
	});

   describe('types', () => {
      it('supports types config option', () => {
			const config = defaultConfig() as any;
			config.defaultJSExtensions = true;
			config.map["testsrc"] = "test/fixtures-es6/plugin/attypes";
			config.packages["testsrc"].main = "index.tsx";
			config.packages["testsrc"].defaultExtension = "tsx";
			config.typescriptOptions.types = ["reacty"];
			System.config(config);
			return System.import('testsrc')
				.should.be.fulfilled;
      });
	});

   describe('commonjs', () => {
      it('supports module.id when outputting commonjs', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/commonjs";
			config.typescriptOptions.module = "commonjs";
			System.config(config);
			return System.import('testsrc')
				.should.be.fulfilled;
      });

      it('compiles js files when default transpiler', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/es6";
			config.packages["testsrc"].main = "index.js";
			config.packages["testsrc"].defaultExtension = "js";
			config.typescriptOptions.module = "commonjs";
			System.config(config);
			return System.import('testsrc')
				.should.be.fulfilled;
      });
	});
});
