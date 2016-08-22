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
			rollup: false,
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

   describe('types', () => {
      it('supports types config option', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/attypes";
			config.packages["testsrc"].main = "index.tsx";
			config.packages["testsrc"].defaultExtension = "tsx";
			config.typescriptOptions.types = ["reacty"];
			builder.config(config);
			return builder.bundle('testsrc')
				.catch(err => {
					console.log(err);
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

	describe('rollup', () => {
      it('strips out reference files when rolled up', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "es6";
			builder.config(config);
			return builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.catch(err => {
					console.log(err);
					true.should.be.false;
				})
				.then(result => {
					//console.log(result.source);
					result.source.length.should.equal(494);
					result.source.should.not.contain('test/fixtures-es6/plugin/reference/types.d.ts');

				})
      });

      it('bundles when outputting commonjs', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "commonjs";
			builder.config(config);
			return builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.catch(err => {
					console.log(err);
					true.should.be.false;
				})
				.then(result => {
					//console.log(result.source);
					//result.source.should.contain('test/fixtures-es6/plugin/reference/types.d.ts');
					result.source.length.should.equal(5306);
				})
      });

      it('bundles without rollup when not building SFX', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "system";
			builder.config(config);
			return builder.build('testsrc', { rollup: false })
				.catch(err => {
					console.log(err);
					true.should.be.false;
				})
				.then(result => {
					//console.log(result.source);
					result.source.should.contain('test/fixtures-es6/plugin/reference/types.d.ts');
				})
      });

      xit('automatically changes module from system -> es6 when building', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "system";
			config.typescriptOptions.target = "es6";
			builder.config(config);
			return builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.catch(err => {
					console.log(err);
					true.should.be.false;
				})
				.then(result => {
					//console.log(result.source);
					result.source.should.contain('const aconstant = 1234;');
					result.source.length.should.equal(482);
				})
      });

      it('supports es6 modules with target es5', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference";
			config.typescriptOptions.module = "es6";
			config.typescriptOptions.target = "es5";
			builder.config(config);
			return builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.catch(err => {
					console.log(err);
					true.should.be.false;
				})
				.then(result => {
					//console.log(result.source);
					result.source.should.contain('var aconstant = 1234;');
					result.source.length.should.equal(494);
				})
      });

      it('supports syntheticDefaultImports when outputting es6 modules', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/synthetic";
			config.map["somelib"] = "test/fixtures-es6/plugin/js/somelib.js";
			config.typescriptOptions.module = "es6";
			config.typescriptOptions.target = "es5";

			builder.config(config);
			return builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.catch(err => {
					console.log(err);
					true.should.be.false;
				})
				.then(result => {
					//console.log(result.source);
					result.source.should.contain('module.exports = 42;');
				})
      });

      it('strips out elided modules when rolled up', () => {
			const config = defaultConfig();
			config.map["testsrc"] = "test/fixtures-es6/plugin/elisions";
			config.typescriptOptions.module = "es6";
			config.typescriptOptions.target = "es5";
			builder.config(config);
			return builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.catch(err => {
					console.log(err);
					true.should.be.false;
				})
				.then(result => {
					//console.log(result.source);
					result.source.length.should.equal(458);
				})
      });

	});
});
