import ts from 'typescript'
import { CompilerHost, TranspileResult } from './compiler-host'
import { isJavaScript, isJSX, isSourceMap, hasError } from './utils'
import Logger from './logger'

const logger = new Logger({ debug: false })

export function transpile(
	sourceName: string,
	options: ts.CompilerOptions,
	host: CompilerHost): TranspileResult {

	logger.debug(`transpiling ${sourceName}`)

	const file = host.getSourceFile(sourceName)
	if (!file) throw new Error(`file [${sourceName}] has not been added`)

	if (!file.output) {
		const transpileOptions = getTranspileOptions(options)
		const program = ts.createProgram([sourceName], transpileOptions, host)

		let jstext: string = undefined
		let maptext: string = undefined

		// Emit
		const emitResult = program.emit(undefined, (outputName, output) => {
			if (isJavaScript(outputName) || isJSX(outputName))
				jstext = output.slice(0, output.lastIndexOf("//#")) // remove sourceMappingURL
			else if (isSourceMap(outputName))
				maptext = output
			else
				throw new Error(`unexpected ouput file ${outputName}`)
		})

		const diagnostics = emitResult.diagnostics
			.concat(program.getOptionsDiagnostics())
			.concat(program.getSyntacticDiagnostics())

		file.output = {
			failure: hasError(diagnostics),
			diags: diagnostics,
			js: jstext,
			sourceMap: maptext
		}
	}

	return file.output
}

function getTranspileOptions(options: ts.CompilerOptions): ts.CompilerOptions {
	const result = (<any>ts).clone(options) as ts.CompilerOptions;

	result.isolatedModules = true

	/* arrange for an external source map */
	if (result.sourceMap === undefined)
		result.sourceMap = result.inlineSourceMap

	if (result.sourceMap === undefined)
		result.sourceMap = true

	result.inlineSourceMap = false

	/* these options are incompatible with isolatedModules */
	result.declaration = false
	result.noEmitOnError = false
	result.out = undefined
	result.outFile = undefined

	/* without this we get a 'lib.d.ts not found' error */
	result.noLib = true
	result.lib = undefined // incompatible with noLib

	/* without this we get a 'cannot find type-reference' error */
	result.types = []

	/* without this we get 'cannot overwrite existing file' when transpiling js files */
	result.suppressOutputPathCheck = true

	/* with this we don't get any files */
	result.noEmit = false

	return result
}
