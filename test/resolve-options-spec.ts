import chai = require('chai')
import sinon = require('sinon')
import ts from 'typescript'
import { parseOptions, resolveOptions } from '../src/resolve-options'

const should = chai.should()

function fetchJson(fileName: string, parentAddress: string): Promise<string> {
	return Promise.resolve(JSON.stringify({ compilerOptions: { target: 'es2016' } }))
}

describe('Options', () => {

	describe('resolveOptions', () => {
		it('handles undefined configuration', async () => {
			const fileOptions = undefined
			const finalOptions = await resolveOptions(undefined, undefined, 'file1.ts', null)
			finalOptions.target.should.equal(ts.ScriptTarget.ES5)
		})

		it('file metadata configuration takes precedence over global configuration', async () => {
			const globalConfig = { target: 'es2015' }
			const fileConfig = { target: 'es2017' }
			const finalOptions = await resolveOptions(globalConfig, fileConfig, 'file1.ts', null)
			finalOptions.target.should.equal(ts.ScriptTarget.ES2017)
		})

		it('handles global tsconfig = true', async () => {
			const globalConfig = { tsconfig: true }
			const fetchSpy = sinon.spy(fetchJson)
			const finalOptions = await resolveOptions(globalConfig, undefined, 'file1.ts', fetchSpy)
			fetchSpy.calledOnce.should.be.true
			fetchSpy.firstCall.args[0].should.equal('tsconfig.json')
			fetchSpy.firstCall.args[1].should.equal('')
		})

		it('handles file tsconfig = true', async () => {
			const fileConfig = { tsconfig: true }
			const fetchSpy = sinon.spy(fetchJson)
			const finalOptions = await resolveOptions(undefined, fileConfig, 'file1.ts', fetchSpy)
			fetchSpy.calledOnce.should.be.true
			fetchSpy.firstCall.args[0].should.equal('tsconfig.json')
			fetchSpy.firstCall.args[1].should.equal('file1.ts')
		})

		it('loads the compiler options from tsconfig', async () => {
			const globalConfig = { tsconfig: true }
			const finalOptions = await resolveOptions(globalConfig, undefined, 'file1.ts', fetchJson)
			finalOptions.target.should.equal(ts.ScriptTarget.ES2016)
		})

		it('handles tsconfig = <pathname>', async () => {
			const globalConfig = { tsconfig: 'anothertsconfig.json' }
			const fetchSpy = sinon.spy(fetchJson)
			const finalOptions = await resolveOptions(globalConfig, undefined, 'file1.ts', fetchSpy)
			fetchSpy.calledOnce.should.be.true
			fetchSpy.firstCall.args[0].should.equal('anothertsconfig.json')
			fetchSpy.firstCall.args[1].should.equal('')
		})

		it('fileConfig handles extends, fetching transitively', async () => {
			const fileConfig = { tsconfig: true }

			const fetchJson = (fileName, parentAddress) =>
				parentAddress !== 'tsconfig.extended.json'
					? Promise.resolve(JSON.stringify({
						extends: 'tsconfig.extended.json',
						compilerOptions: {
							target: 'es2017'
						}
					}))
					: Promise.resolve(JSON.stringify({
						compilerOptions: {
							downlevelIteration: true
						}
					}))

			const finalOptions = await resolveOptions(undefined, fileConfig, 'file1.ts', fetchJson)
			finalOptions.downlevelIteration.should.be.true
			finalOptions.target.should.equal(ts.ScriptTarget.ES2017)
		})

		it('fileConfig handles extends, traversing multiple files', async () => {
			const fileConfig = { tsconfig: true }

			const fetchJson = (fileName, parentAddress) =>
				parentAddress === 'tsconfig.extended.json'
					? Promise.resolve(JSON.stringify({
						extends: 'tsconfig.another-extended.json',
						compilerOptions: {
							target: 'es2017'
						}
					}))
					: parentAddress === 'tsconfig.another-extended.json'
						? Promise.resolve(JSON.stringify({
							compilerOptions: {
								downlevelIteration: true
							}
						}))
						: Promise.resolve(JSON.stringify({
							extends: 'tsconfig.extended.json',
							compilerOptions: {
								module: 'esnext'
							}
						}))

			const finalOptions = await resolveOptions(undefined, fileConfig, 'file1.ts', fetchJson)
			finalOptions.downlevelIteration.should.be.true
			finalOptions.target.should.equal(ts.ScriptTarget.ES2017)
			finalOptions.module.should.equal(ts.ModuleKind.ESNext)
		})

		it('fileConfig handles extends, giving precedence to extending file', async () => {
			const fileConfig = { tsconfig: true }

			const fetchJson = (fileName, parentAddress) =>
				parentAddress !== 'tsconfig.extended.json'
					? Promise.resolve(JSON.stringify({
						extends: 'tsconfig.extended.json',
						compilerOptions: {
							target: 'es2017'
						}
					}))
					: Promise.resolve(JSON.stringify({
						compilerOptions: {
							target: 'es5'
						}
					}))

			const finalOptions = await resolveOptions(undefined, fileConfig, 'file1.ts', fetchJson)
			finalOptions.target.should.equal(ts.ScriptTarget.ES2017)
		})

		it('globalConfig handles extends, fetching transitively', async () => {
			const globalConfig = { tsconfig: true }

			const fetchJson = (fileName, parentAddress) =>
				parentAddress !== 'tsconfig.extended.json'
					? Promise.resolve(JSON.stringify({
						extends: 'tsconfig.extended.json',
						compilerOptions: {
							target: 'es2017'
						}
					}))
					: Promise.resolve(JSON.stringify({
						compilerOptions: {
							downlevelIteration: true
						}
					}))

			const finalOptions = await resolveOptions(globalConfig, undefined, 'file1.ts', fetchJson)
			finalOptions.downlevelIteration.should.be.true
			finalOptions.target.should.equal(ts.ScriptTarget.ES2017)
		})

		it('globalConfig handles tsconfig.extends, traversing multiple files', async () => {
			const globalConfig = { tsconfig: true }

			const fetchJson = (fileName, parentAddress) =>
				parentAddress === 'tsconfig.extended.json'
					? Promise.resolve(JSON.stringify({
						extends: 'tsconfig.another-extended.json',
						compilerOptions: {
							target: 'es2017'
						}
					}))
					: parentAddress === 'tsconfig.another-extended.json'
						? Promise.resolve(JSON.stringify({
							compilerOptions: {
								downlevelIteration: true
							}
						}))
						: Promise.resolve(JSON.stringify({
							extends: 'tsconfig.extended.json',
							compilerOptions: {
								module: 'esnext'
							}
						}))

			const finalOptions = await resolveOptions(globalConfig, undefined, 'file1.ts', fetchJson)
			finalOptions.downlevelIteration.should.be.true
			finalOptions.target.should.equal(ts.ScriptTarget.ES2017)
			finalOptions.module.should.equal(ts.ModuleKind.ESNext)
		})

		it('globalConfig handles extends, giving precedence to extending file', async () => {
			const globalConfig = { tsconfig: true }

			const fetchJson = (fileName, parentAddress) =>
				parentAddress !== 'tsconfig.extended.json'
					? Promise.resolve(JSON.stringify({
						extends: 'tsconfig.extended.json',
						compilerOptions: {
							target: 'es2017'
						}
					}))
					: Promise.resolve(JSON.stringify({
						compilerOptions: {
							target: 'es5'
						}
					}))

			const finalOptions = await resolveOptions(globalConfig, undefined, 'file1.ts', fetchJson)
			finalOptions.target.should.equal(ts.ScriptTarget.ES2017)
		})

		it('specified configuration takes precedence over tsconfig configuration', async () => {
			const globalConfig = { tsconfig: true, target: 'es2017' }
			const finalOptions = await resolveOptions(globalConfig, undefined, 'file1.ts', fetchJson)
			finalOptions.target.should.equal(ts.ScriptTarget.ES2017)
		})
	})

	describe('parseOptions', () => {
		it('defaults the config', () => {
			const options = parseOptions({})
			options.module.should.be.equal(ts.ModuleKind.System)
			options.target.should.be.equal(ts.ScriptTarget.ES5)
			options.jsx.should.be.equal(ts.JsxEmit.None)
			options.allowNonTsExtensions.should.be.true
			options.should.not.have.property("noImplicitAny")
		})

		it('uses the config passed in', () => {
			const options = parseOptions({
				noImplicitAny: true
			})
			options.module.should.be.equal(ts.ModuleKind.System)
			options.target.should.be.equal(ts.ScriptTarget.ES5)
			options.allowNonTsExtensions.should.be.true
			options.noImplicitAny.should.be.true
		})

		it('handles the target option', () => {
			let options = parseOptions({
				target: "eS3"
			})
			options.target.should.be.equal(ts.ScriptTarget.ES3)
			options = parseOptions({
				target: ts.ScriptTarget.ES3
			})
			options.target.should.be.equal(ts.ScriptTarget.ES3)
			options = parseOptions({
				target: "Es5"
			})
			options.target.should.be.equal(ts.ScriptTarget.ES5)
		})

		it('handles the jsx option', () => {
			const options = parseOptions({
				jsx: "reAct"
			})
			options.jsx.should.be.equal(ts.JsxEmit.React)
		})

		it('forces moduleResolution to classic', () => {
			const options = parseOptions({
				moduleResolution: ts.ModuleResolutionKind.NodeJs
			})
			options.moduleResolution.should.be.equal(ts.ModuleResolutionKind.Classic)
		})

		it('handles the lib option', () => {
			const options = parseOptions({
				lib: ["es5", "es2015.promise"]
			})
			options.lib.should.deep.equal(["es5", "es2015.promise"])
		})
	})
})
