import os = require('os')
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import * as ts from 'typescript'
import SystemJS = require('systemjs')

chai.use(chaiAsPromised)
const should = chai.should()

describe('Plugin', () => {
	let System = null

	beforeEach(() => {
		global['tsHost'] = undefined
		var constructor = SystemJS['constructor'] as any
		System = new constructor()
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
				"tsconfig": false
			} as any,
			packages: {
				"testsrc": {
					"main": "index",
					"defaultExtension": "ts",
					"meta": {
						"*.html": {
							"loader": "plugin-text"
						}
					}
				},
				"lib": {
					"main": "plugin.js"
				},
				"plugin-text": {
					"main": "plugin-text.js"
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
				"testsrc": "test/fixtures-es6/plugin/elisions",
				"plugin": "lib",
				"plugin-text": "test/fixtures-es6",
				"typescript": "node_modules/typescript"
			}
		}
	}

	describe('transpiler', () => {
		it('transpiles when configured as transpiler', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/execute"
			System.config(config)
			const mod = await System.import('testsrc')
				.should.be.fulfilled
			mod.counter.should.deep.equal({ index: 1, elided: 0, imported: 1 })
		})

		it('transpiles when configured via metadata', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/execute"

			const meta = {
				"*.ts": {
					"loader": "plugin"
				},
				"*.tsx": {
					"loader": "plugin"
				}
			}
			config.transpiler = undefined
			config.packages["testsrc"].meta = meta
			System.config(config)
			const mod = await System.import('testsrc')
				.should.be.fulfilled
			mod.counter.should.deep.equal({ index: 1, elided: 0, imported: 1 })
		})

		it('fails build on syntax errors in ts files', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/syntax"
			System.config(config)
			return System.import('testsrc')
				.should.be.rejectedWith(/transpilation failed/)
		})

		it('fails build on syntax errors in js files', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/syntax"
			config.packages["testsrc"].defaultExtension = 'js'
			System.config(config)
			return System.import('testsrc')
				.should.be.rejectedWith(/transpilation failed/)
		})

		it('supports loading html files', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/html"
			System.config(config)
			const mod = await System.import('testsrc')
				.should.be.fulfilled
			mod.default.should.equal('<div>hello</div>' + os.EOL)
		})

		it('compiles js commonjs files', async () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/commonjs"
			config.packages["testsrc"].defaultExtension = "js"
			System.config(config)
			const mod = await System.import('testsrc')
				.should.be.fulfilled
			mod.name.should.equal(42)
		})
	})

	describe('tsconfig', () => {
		it('does not load tsconfig when not configured', () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			System.config(config)
			return System.import('testsrc')
				.should.be.fulfilled
		})

		it('supports global tsconfig config option', () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			delete config.typescriptOptions.module
			config.typescriptOptions.tsconfig = "testsrc/tsconfig.json"
			System.config(config)
			return System.import('testsrc')
				.should.be.rejectedWith(/transpilation failed/)
		})

		it('supports file tsconfig config option', () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			delete config.typescriptOptions.module

			const meta = {
				"*.ts": {
					"typescriptOptions": {
						"tsconfig": "testsrc/tsconfig.json"
					}
				}
			}
			config.packages.testsrc.meta = meta
			System.config(config)

			return System.import('testsrc')
				.should.be.rejectedWith(/transpilation failed/)
		})

		it('file option overrides file tsconfig option', () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			delete config.typescriptOptions.module

			const meta = {
				"*.ts": {
					"typescriptOptions": {
						"tsconfig": "testsrc/tsconfig.json",
						"module": "system"
					}
				}
			}
			config.packages.testsrc.meta = meta
			System.config(config)

			return System.import('testsrc')
				.should.be.fulfilled
		})
	})

	xdescribe('commonjs', () => {
		it('supports module.id when outputting commonjs', () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/commonjs"
			config.typescriptOptions.module = "commonjs"

			System.config(config)
			return System.import('testsrc')
				.should.be.fulfilled
		})
	})
})
