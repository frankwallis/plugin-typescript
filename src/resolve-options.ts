import ts from 'typescript'
import Logger from './logger'
import { formatErrors } from './format-errors'

const logger = new Logger({ debug: false })
export type CombinedOptions = PluginOptions & ts.CompilerOptions

export async function resolveOptions(
	globalOptions: any,
	fileOptions: any,
	fileAddress: string,
	fetchJson: FetchFunction): Promise<CombinedOptions> {

	const globalTsconfigOptions = await loadTsconfigOptions(globalOptions, '', fetchJson)
	const fileTsconfigOptions = await loadTsconfigOptions(fileOptions, fileAddress, fetchJson)
	const mergedOptions = {
		...globalTsconfigOptions,
		...globalOptions,
		...fileTsconfigOptions,
		...fileOptions
	}

	const finalOptions = parseOptions(mergedOptions)
	validateOptions(finalOptions)

	return finalOptions
}

async function loadTsconfigOptions(
	options: CombinedOptions,
	parentAddress: string,
	fetchJson: FetchFunction): Promise<ts.CompilerOptions> {

	let tsconfigName = options && options.tsconfig
	if (tsconfigName === true) tsconfigName = 'tsconfig.json'

	if (tsconfigName) {
		return loadTsconfigFile(tsconfigName, parentAddress, fetchJson);
	}
	else {
		return undefined;
	}
}

async function loadTsconfigFile(
	filename: string,
	parentAddress: string,
	fetchJson: FetchFunction): Promise<ts.CompilerOptions> {

	const tsconfigText = await fetchJson(filename, parentAddress)
	const result = ts.parseConfigFileTextToJson(filename, tsconfigText)

	if (result.error) {
		formatErrors([result.error], logger)
		throw new Error(`failed to load tsconfig from ${filename}`)
	}
	else {
		const extendedTsconfig = result.config.extends
			? await loadTsconfigFile(result.config.extends, filename, fetchJson)
			: undefined
		return {
			...extendedTsconfig,
			...result.config.compilerOptions
		}
	}
}

export function parseOptions(options: any): CombinedOptions {
	const result = options || {}
	result.module = getEnum(result.module, ts.ModuleKind, ts.ModuleKind.System)
	result.target = getEnum(result.target, ts.ScriptTarget, ts.ScriptTarget.ES5)
	result.jsx = getEnum(result.jsx, ts.JsxEmit, ts.JsxEmit.None)
	result.allowNonTsExtensions = (result.allowNonTsExtensions !== false)
	result.skipDefaultLibCheck = (result.skipDefaultLibCheck !== false)
	result.noResolve = true
	result.allowSyntheticDefaultImports = (result.allowSyntheticDefaultImports !== false)

	// Force module resolution into 'classic' mode, to prevent node module resolution from kicking in
	result.moduleResolution = ts.ModuleResolutionKind.Classic

	// When bundling automatically output es6 modules instead of system to enable rollup support
	// if (builder) {
	//    if (result.module === ts.ModuleKind.System) {
	// 		logger.log('switching output from system.register -> es modules to support rollup')
	//       result.module = ts.ModuleKind.ES6
	//    }
	// }

	return result
}

function getEnum(enumValue: any, enumType: any, defaultValue: number): number {
	if (enumValue == undefined) return defaultValue

	for (var enumProp in enumType) {
		if (enumProp.toLowerCase() === enumValue.toString().toLowerCase()) {
			if (typeof enumType[enumProp] === "string")
				return enumType[enumType[enumProp]]
			else
				return enumType[enumProp]
		}
	}

	throw new Error(`Unrecognised value [${enumValue}]`)
}

function validateOptions(options: CombinedOptions) {
   /* The only time you don't want to output in 'm format is when you are using rollup or babel
      downstream to compile es6 output (e.g. for async/await support) */
	if ((options.module !== ts.ModuleKind.System) && (options.module !== ts.ModuleKind.ES2015) && (options.module !== ts.ModuleKind.ESNext)) {
		logger.warn(`transpiling to ${ts.ModuleKind[options.module]}, consider setting module: "system" in typescriptOptions to transpile directly to System.register format`)
	}

	if (options['supportHtmlImports']) {
		logger.warn("The 'supportHtmlImports' option is no longer supported")
	}

	if (options['resolveAmbientRefs']) {
		logger.warn("The 'resolveAmbientRefs' option is no longer supported")
	}

	if (options['targetLib']) {
		logger.warn("The 'targetLib' option is no longer supported")
	}

	if (options['typeCheck']) {
		logger.error("The 'typeCheck' option is no longer supported")
	}
}
