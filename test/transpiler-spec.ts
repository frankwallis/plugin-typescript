import ts from 'typescript'
import fs = require('fs')
import path = require('path')
import chai = require('chai')
import { CompilerHost } from '../src/compiler-host'
import { transpile } from '../src/transpiler'
import { formatErrors } from '../src/format-errors'
import { parseOptions } from '../src/resolve-options'

const should = chai.should()
const defaultOptions = parseOptions({})

const oneImport = fs.readFileSync(require.resolve('./fixtures-es6/program1/one-import.ts'), 'utf8')
const jsxPreserve = fs.readFileSync(require.resolve('./fixtures-es6/program1/jsx-preserve.tsx'), 'utf8')
const es6Symbol = fs.readFileSync(require.resolve('./fixtures-es6/program1/symbol.ts'), 'utf8')
const syntaxError = fs.readFileSync(require.resolve('./fixtures-es6/program1/syntax-error.ts'), 'utf8')
const constEnums = fs.readFileSync(require.resolve('./fixtures-es6/program1/const-enums.ts'), 'utf8')
const trailingComma = fs.readFileSync(require.resolve('./fixtures-es6/es3/trailing-comma.ts'), 'utf8')

describe('Transpiler', () => {

	function doTranspile(sourceName: string, source: string, options: ts.CompilerOptions = defaultOptions) {
		const host = new CompilerHost()
		host.addFile(sourceName, source, options.target)
		return transpile(sourceName, parseOptions(options), host)
	}

	it('transpiles typescript successfully', () => {
		const output = doTranspile('one-import.ts', oneImport)
		formatErrors(output.diags, console as any)
		output.should.have.property('failure', false)
		output.should.have.property('diags').with.lengthOf(0)
		output.should.have.property('js').with.lengthOf(407)
	})

	it('transpiles javascript successfully', () => {
		const output = doTranspile('no-import.js', "var a = 10; export default a")
		formatErrors(output.diags, console as any)
		output.should.have.property('failure', false)
		output.should.have.property('diags').with.lengthOf(0)
		output.should.have.property('js').with.lengthOf(276)
	})

	it('supports jsx preserve', () => {
		const options = parseOptions({
			jsx: 'preserve'
		})
		const output = doTranspile('jsx-preserve.tsx', jsxPreserve, options)
		formatErrors(output.diags, console as any)
		output.should.have.property('failure', false)
		output.should.have.property('diags').with.lengthOf(0)
		output.js.should.contain('<div>hello</div>')
	})

	it('supports jsx react', () => {
		const options = parseOptions({
			jsx: 'react'
		})
		const output = doTranspile('jsx-preserve.tsx', jsxPreserve, options)
		formatErrors(output.diags, console as any)
		output.should.have.property('failure', false)
		output.should.have.property('diags').with.lengthOf(0)
		output.js.should.not.contain('<div>hello</div>')
		output.js.should.contain('React.createElement')
	})

	it('removes SourceMappingURL', () => {
		const output = doTranspile('one-import.ts', oneImport)
		output.js.should.not.contain("SourceMappingURL")
	})

	it('removes SourceMappingURL from jsx output', () => {
		const options = parseOptions({
			jsx: 'preserve'
		})
		const output = doTranspile('jsx-preserve.tsx', jsxPreserve, options)
		output.js.should.not.contain("SourceMappingURL")
	})

	it('returns sourceMap', () => {
		const output = doTranspile('one-import.ts', oneImport)
		output.should.have.property('sourceMap').with.lengthOf(137)
	})

	it('catches syntax errors', () => {
		const output = doTranspile('syntax-error.ts', syntaxError)
		//formatErrors(output.diags, console as any)
		output.should.have.property('failure', true)
		output.should.have.property('diags').with.lengthOf(1)
	})

	it('catches configuation errors', () => {
		const options = parseOptions({
			emitDecoratorMetadata: true,
			experimentalDecorators: false
		})
		const output = doTranspile('one-import.ts', oneImport, options)
		//formatErrors(output.diags, console as any)
		output.should.have.property('failure', true)
		output.should.have.property('diags').with.lengthOf(1)
		output.diags[0].code.should.be.equal(5052)
	})

	it('overrides invalid config options', () => {
		const options = parseOptions({
			noEmitOnError: true,
			out: "somefile.js",
			declaration: true,
			noLib: false,
			noEmit: true
		})
		const output = doTranspile('one-import.ts', oneImport, options)
		formatErrors(output.diags, console as any)
		output.should.have.property('failure', false)
		output.should.have.property('diags').with.lengthOf(0)
		output.js.length.should.be.greaterThan(0)
	})

	xit('errors on const enums', () => {
		const output = doTranspile('const-enums.ts', constEnums)
		//formatErrors(output.diags, console as any)
		output.should.have.property('failure', true)
		output.should.have.property('diags').with.lengthOf(1)
	})

	it('uses sourceMap option', () => {
		const options = parseOptions({
			sourceMap: false
		})
		const output = doTranspile('symbol.ts', es6Symbol, options)
		should.not.exist(output.sourceMap)
	})

	it('uses target option', () => {
		let options = parseOptions({
			target: "es3"
		})
		const es3output = doTranspile('trailing-comma.ts', trailingComma, options)

		options = parseOptions({
			target: "es5"
		})
		const es5output = doTranspile('trailing-comma.ts', trailingComma, options)
		es3output.should.not.be.equal(es5output)
	})
})
