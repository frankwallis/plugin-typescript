/* */
import ts from 'typescript'
import Logger from './logger'
import { convertErrors, outputErrors } from './format-errors'
import { CompilerHost } from './compiler-host'
import { resolveOptions } from './resolve-options'
import { transpile } from './transpiler'
import { isTypescript, isTypescriptDeclaration, isJson, stripDoubleExtension } from './utils'

const logger = new Logger({ debug: false })
const host = getHost()

/*
 * persist CompilerHost instance between instantiations of the plugin and expose it to the world
 */
function getHost(): CompilerHost {
	const __global: any = typeof (self) !== 'undefined' ? self : global
	__global.tsHost = __global.tsHost || new CompilerHost()
	return __global.tsHost
}

/*
 * SystemJS translate hook
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export async function translate(load: Module): Promise<string> {
	const loader = this
	logger.debug(`systemjs translating ${load.address}`)

	/* No need to translate tsconfig.json files */
	if (isJson(load.address)) return load.source

	/* resolve the typescript options for this file, this may involve loading tsconfig.json */
	const options = await resolveOptions(
		SystemJS.typescriptOptions,
		load.metadata.typescriptOptions,
		load.address,
		_fetchJson)

	/* create/update the source file in typescript */
	host.addFile(load.address, load.source, options.target)

	/* typescript declaration files have no executable source */
	if (isTypescriptDeclaration(load.address)) {
		load.source = ''
	}
	else {
		/* transpile the source */
		const result = transpile(load.address, options, host)

		load.metadata.tserrors = convertErrors(result.diags)
		outputErrors(load.metadata.tserrors, logger)

		if (result.failure)
			throw new Error('TypeScript transpilation failed')

		load.source = result.js

		if (isTypescript(load.address)) {
			if (options.module === ts.ModuleKind.System)
				load.metadata.format = 'register'
			else if (options.module === ts.ModuleKind.ES2015)
				load.metadata.format = 'esm'
			else if (options.module === ts.ModuleKind.CommonJS)
				load.metadata.format = 'cjs'
			else if (options.module === ts.ModuleKind.AMD)
				load.metadata.format = 'amd'
		}

		if (result.sourceMap)
			load.metadata.sourceMap = JSON.parse(result.sourceMap)
	}

	return load.source
}

/*
 * SystemJS instantiate hook
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export function instantiate(load: Module, origInstantiate: any) {
	logger.debug(`systemjs instantiating ${load.address}`)
	return isJson(load.address) ? JSON.parse(load.source) : origInstantiate(load)
}

/*
 * called by resolveOptions when it needs to fetch tsconfig.json
 */
async function _fetchJson(fileName: string, parentAddress: string): Promise<string> {
	const address = await SystemJS.normalize(fileName, parentAddress);
	const json = await SystemJS.import(stripDoubleExtension(address) + '!' + __moduleName, parentAddress)
	logger.debug(`fetched ${fileName}`)
	return JSON.stringify(json)
}
