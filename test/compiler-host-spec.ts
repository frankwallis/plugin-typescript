import chai = require('chai')
import ts from 'typescript'
import { CompilerHost } from '../src/compiler-host'

const should = chai.should()

describe('Host', () => {

	let host
	beforeEach(function () {
		host = new CompilerHost()
	})

	describe('addFile', () => {
		it('adds files', () => {
			const filename = 'filea.ts'
			const sourceFile = host.addFile(filename, 'sometext')
			const sourceFile1 = host.getSourceFile(filename)
			sourceFile.should.be.equal(sourceFile1)
		})

		it('keeps same file if it has not changed', () => {
			const filename = 'filea.ts'
			const sourceFile1 = host.addFile(filename, 'sometext')
			const sourceFile2 = host.addFile(filename, 'sometext')
			sourceFile1.should.be.equal(sourceFile2)
		})

		it('overwrites file if it has changed', () => {
			const filename = 'filea.ts'
			const sourceFile1 = host.addFile(filename, 'sometext')
			const sourceFile2 = host.addFile(filename, 'differenttext')
			sourceFile1.should.not.be.equal(sourceFile2)
			const sourceFile3 = host.getSourceFile(filename)
			sourceFile2.should.be.equal(sourceFile3)
		})
	})
})
