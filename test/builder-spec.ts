import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');

import ts from 'typescript';
import {Builder} from 'jspm';

chai.use(chaiAsPromised);
const should = chai.should();

describe('Builder', () => {
	let builder = null;

	beforeEach(() => {
		global['tsfactory'] = undefined;
		builder = new Builder('./');
		builder.reset();
	})

	function defaultConfig() {
		return {
			baseUrl: "../",
			transpiler: "plugin",
			rollup: false,
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
					"main": "index",
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
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions";
			builder.config(config);
			return builder.bundle('testsrc')
				.should.be.fulfilled;
      });

      it('brings in elided import files when outputting to es6', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions";
			config.typescriptOptions.module = "es2015";
			config.typescriptOptions.target = "es2015";
			builder.config(config);
			return builder.bundle('testsrc')
				.should.be.fulfilled;
      });

      it('brings in ambient external typings', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/ambient";
			builder.config(config);
			return builder.bundle('testsrc')
				.should.be.fulfilled;
      });

      it('handles elided files which have exports', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions-exports";
			builder.config(config);
			return builder.bundle('testsrc')
				.should.be.fulfilled;
      });
	});

   describe('typeCheck', () => {
      it('fails build when strict', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			builder.config(config);
			return builder.bundle('testsrc/fail')
				.should.be.rejected;
      });

      it('passes build when true', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			config.typescriptOptions.typeCheck = true;
			builder.config(config);
			return builder.bundle('testsrc/fail')
				.should.be.fulfilled;
      });

      it('detects missing files', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			builder.config(config);
			return builder.bundle('testsrc/missing')
				.should.be.rejected;
      });

      it('sets tserrors on metadata', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			config.typescriptOptions.typeCheck = true;
			builder.config(config);
			const output = await builder.bundle('testsrc/fail')
				.should.be.fulfilled;

			const resolved = 'test/fixtures-es6/plugin/strict/fail.ts';
			output.tree[resolved].metadata.tserrors.should.have.length(1);
			output.tree[resolved].metadata.tserrors[0].errorCode.should.equal(2322);
      });

      it('does not set tserrors when false', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/strict";
			config.typescriptOptions.typeCheck = false;
			builder.config(config);
			const output = await builder.bundle('testsrc/fail')
				.should.be.fulfilled;

			const resolved = 'test/fixtures-es6/plugin/strict/fail.ts';
			(output.tree[resolved].metadata.tserrors === undefined).should.be.true;
      });
	});

   describe('types', () => {
      it('supports types config option', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/attypes";
			config.packages["testsrc"].main = "index.tsx";
			config.packages["testsrc"].defaultExtension = "tsx";
			config.typescriptOptions.types = ["reacty"];
			builder.config(config);
			return builder.bundle('testsrc')
				.should.be.fulfilled;
      });
	});

   describe('tsconfig', () => {
      it('supports tsconfig config option', () => {
			const config = defaultConfig() as any;
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig";
			delete config.typescriptOptions.module;
			config.typescriptOptions.typeCheck = false;
			config.typescriptOptions.tsconfig = "testsrc/tsconfig.json";
			builder.config(config);
			return builder.bundle('testsrc')
				.should.be.rejectedWith(/transpilation failed/);
      });
	});

   describe('commonjs', () => {
      it('supports module.id when outputting commonjs', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/commonjs";
			config.typescriptOptions.module = "commonjs";
			builder.config(config);
			return builder.bundle('testsrc')
				.should.be.fulfilled;
      });

      it('compiles js files when default transpiler', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/es6";
			config.packages["testsrc"].main = "index.js";
			config.packages["testsrc"].defaultExtension = "js";
			config.typescriptOptions.module = "commonjs";
			builder.config(config);
			return builder.bundle('testsrc')
				.should.be.fulfilled;
      });
	});

	describe('rollup', () => {
      it('strips out reference files when rolled up', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "es2015";
			builder.config(config);
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled;
			//console.log(result.source);
			result.source.length.should.equal(454);
			result.source.should.not.contain('test/fixtures-es6/plugin/reference/types.d.ts');
      });

      it('bundles when outputting commonjs', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "commonjs";
			builder.config(config);
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled;
			//console.log(result.source);
			//result.source.should.contain('test/fixtures-es6/plugin/reference/types.d.ts');
			result.source.length.should.equal(4688);
      });

      it('bundles without rollup when not building SFX', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "system";
			builder.config(config);
			const result = await builder.build('testsrc', { rollup: false })
				.should.be.fulfilled;
			//console.log(result.source);
			result.source.should.contain('test/fixtures-es6/plugin/reference/types.d.ts');
      });

      xit('automatically changes module from system -> es6 when building', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "system";
			config.typescriptOptions.target = "es2015";
			builder.config(config);
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled;
			//console.log(result.source);
			result.source.should.contain('const aconstant = 1234;');
			result.source.length.should.equal(482);
      });

      it('supports es6 modules with target es5', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "es2015";
			config.typescriptOptions.target = "es5";
			builder.config(config);
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled;
			//console.log(result.source);
			result.source.should.contain('var aconstant = 1234;');
			result.source.length.should.equal(454);
      });

      it('supports syntheticDefaultImports when outputting es2015 modules', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/synthetic";
			config.map["somelib"] = "test/fixtures-es6/plugin/js/somelib.js";
			config.typescriptOptions.module = "es2015";
			config.typescriptOptions.target = "es5";

			builder.config(config);
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled;
			//console.log(result.source);
			result.source.should.contain('module.exports = 42;');
      });

      it('strips out elided modules when rolled up', async () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions";
			config.typescriptOptions.module = "es2015";
			config.typescriptOptions.target = "es5";
			builder.config(config);
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled
			//console.log(result.source);
			result.source.length.should.equal(441);
      });

	});
});
