import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import ts from 'typescript'
import { Builder } from 'jspm'
import { Config } from 'systemjs'

chai.use(chaiAsPromised)
const should = chai.should()

describe('Builder', () => {
	interface Builder {
		builderStatic(build: string, options?: object): Promise<{source: string}>
		reset(): void
		bundle(bundleSpec: string, options?: object): Promise<{source: string}>
		buildStatic(bundleSpec: string, options?: object): Promise<{source: string}>
		config<T extends Config | {transpiler}>(config?: T): void
	}

	let builder: Builder = null

	beforeEach(() => {
		global['tsHost'] = undefined
		builder = new Builder('./')
		builder.reset()
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
				"tsconfig": false
			},
			packages: {
				"testsrc": {
					"main": "index",
					"defaultExtension": "ts",
					"meta": {}
				},
				"lib": {
					"main": "plugin.js"
				},
				"typescript": {
					"main": "typescript.js",
					"meta": {
						"typescript.js": {
							"exports": "ts"
						}
					}
				}
			},
			map: {
				"testsrc": "test/fixtures-es6/plugin/elisions",
				"plugin": "lib",
				"typescript": "node_modules/typescript/lib",
				"extend1": "test/fixtures-es6/plugin/tsconfig/extend1",
				"extend2": "test/fixtures-es6/plugin/tsconfig/extend2"
			}
		}
	}

	describe('tsconfig', () => {
		it('does not load tsconfig when not configured', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			config.packages["testsrc"].main = "good"
			builder.config(config)
			await builder.bundle('testsrc')
				.should.be.fulfilled

			const config2 = defaultConfig() as any
			config2.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			builder.config(config2)
			await builder.bundle('testsrc')
				.should.be.rejectedWith(/Octal literals are not allowed in strict mode/)
		})

		xit('supports tsconfig config option true', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			config.typescriptOptions.tsconfig = true;
			builder.config(config)
			await builder.bundle('testsrc').should.be.fulfilled
		})

		it('tsconfig file "extends" supports relative path', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			config.typescriptOptions.tsconfig = "test/fixtures-es6/plugin/tsconfig/extends-relative.json"
			builder.config(config)
			await builder.bundle('testsrc').should.be.fulfilled
		})

		it('tsconfig file "extends" supports package path', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			config.typescriptOptions.tsconfig = "test/fixtures-es6/plugin/tsconfig/extends-package.json"
			builder.config(config)

			await builder.bundle('testsrc').should.be.fulfilled
		})

		it('tsconfig file extends supports transitive package path', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			config.typescriptOptions.tsconfig = "test/fixtures-es6/plugin/tsconfig/extends-transitive.json"
			builder.config(config)

			await builder.bundle('testsrc').should.be.fulfilled
		})

		it('supports file meta tsconfig config option', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"

			const meta = {
				"*.ts": {
					"typescriptOptions": {
						"tsconfig": "testsrc/tsconfig.json"
					}
				}
			}
			config.packages.testsrc.meta = meta
			builder.config(config)
			await builder.bundle('testsrc').should.be.fulfilled
		})

		it('file meta option overrides global tsconfig option', async () => {
			const config = defaultConfig() as any
			config.map["testsrc"] = "test/fixtures-es6/plugin/tsconfig"
			config.typescriptOptions.noImplicitUseStrict = false;

			const meta = {
				"*.ts": {
					"typescriptOptions": {
						"noImplicitUseStrict": true
					}
				}
			}
			config.packages.testsrc.meta = meta
			builder.config(config)
			await builder.bundle('testsrc').should.be.fulfilled
		})
	})

	xdescribe('commonjs', () => {
		it('supports module.id when outputting commonjs', () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/commonjs"
			config.typescriptOptions.module = "commonjs"
			builder.config(config)
			return builder.bundle('testsrc')
				.should.be.fulfilled
		})

		it('compiles js files when default transpiler', () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/es6"
			config.packages["testsrc"].main = "index.js"
			config.packages["testsrc"].defaultExtension = "js"
			config.typescriptOptions.module = "commonjs"
			builder.config(config)
			return builder.bundle('testsrc')
				.should.be.fulfilled
		})
	})

	describe('rollup', () => {
		it('strips out reference files when rolled up', async () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference"
			config.typescriptOptions.module = "es2015"
			builder.config(config)
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled
			//console.log(result.source)
			result.source.length.should.equal(476)
			result.source.indexOf('(function (global, factory').should.equal(0)
		})

		xit('bundles without rollup when outputting commonjs', async () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference"
			config.typescriptOptions.module = "commonjs"
			builder.config(config)
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled
			//console.log(result.source)
			result.source.length.should.equal(4401)
			result.source.indexOf('(function (global, factory').should.not.equal(0)
		})

		it('does not use rollup when bundling', async () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference"
			config.typescriptOptions.module = "system"
			builder.config(config)
			const result = await builder.bundle('testsrc', { rollup: false })
				.should.be.fulfilled
			//console.log(result.source)
			result.source.length.should.equal(420)
			result.source.indexOf('(function (global, factory').should.not.equal(0)
		})

		xit('automatically changes module from system -> es6 when building', async () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference"
			config.typescriptOptions.module = "system"
			config.typescriptOptions.target = "es2015"
			builder.config(config)
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled
			//console.log(result.source)
			result.source.should.contain('const aconstant = 1234')
			result.source.length.should.equal(482)
		})

		it('supports es6 modules with target es5', async () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/reference"
			config.typescriptOptions.module = "es2015"
			config.typescriptOptions.target = "es5"
			builder.config(config)
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled
			//console.log(result.source)
			result.source.should.contain('var aconstant = 1234')
			result.source.length.should.equal(476)
			result.source.indexOf('(function (global, factory').should.equal(0)
		})

		it('supports syntheticDefaultImports when outputting es2015 modules', async () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/synthetic"
			config.map["somelib"] = "test/fixtures-es6/plugin/js/somelib.js"
			config.typescriptOptions.module = "es2015"
			config.typescriptOptions.target = "es5"

			builder.config(config)
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled
			//console.log(result.source)
			result.source.should.contain('module.exports = 42')
		})

		it('strips out elided modules when rolled up', async () => {
			const config = defaultConfig()
			config.map["testsrc"] = "test/fixtures-es6/plugin/execute"
			config.typescriptOptions.module = "es2015"
			config.typescriptOptions.target = "es5"
			builder.config(config)
			const result = await builder.buildStatic('testsrc', { rollup: true, globalName: 'testsrc' })
				.should.be.fulfilled
			//console.log(result.source)
			result.source.indexOf('counter.imported += 1').should.be.above(-1);
			result.source.indexOf('counter.elided += 1').should.be.equal(-1);
		})
	})

	it('supports dynamic import when bundling to esnext modules', async () => {
		const config = defaultConfig()
		config.map["testsrc"] = "test/fixtures-es6/plugin/dynamic"
		config.typescriptOptions.module = "esnext"
		config.typescriptOptions.target = "es5"
		builder.config(config)
		const result = await builder.bundle('testsrc', {})
		//console.log(result.source)
		result.source.should.contain('_context.import(\'')
	})

	it('supports dynamic import when building to esnext modules', async () => {
		const config = defaultConfig()
		config.map["testsrc"] = "test/fixtures-es6/plugin/dynamic"
		config.typescriptOptions.module = "esnext"
		config.typescriptOptions.target = "es5"
		builder.config(config)
		const result = await builder.buildStatic('testsrc', {})
		//console.log(result.source)
		result.source.should.contain('_context.import(\'')
	})
})
