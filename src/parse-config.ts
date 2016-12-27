import * as ts from 'typescript';
import Logger from './logger';

const logger = new Logger({ debug: false });

export type CombinedOptions = PluginOptions & ts.CompilerOptions;

export function parseConfig(config: any): CombinedOptions {
	const result = config || {};
	result.module = getEnum(result.module, ts.ModuleKind, ts.ModuleKind.System);
	result.target = getEnum(result.target, ts.ScriptTarget, ts.ScriptTarget.ES5);
	result.jsx = getEnum(result.jsx, ts.JsxEmit, ts.JsxEmit.None);
	result.allowNonTsExtensions = (result.allowNonTsExtensions !== false);
	result.skipDefaultLibCheck = (result.skipDefaultLibCheck !== false);
	result.noResolve = true;
	result.allowSyntheticDefaultImports = (result.allowSyntheticDefaultImports !== false);

	// Force module resolution into 'classic' mode, to prevent node module resolution from kicking in
	result.moduleResolution = ts.ModuleResolutionKind.Classic;
	result.types = result.types || [];
	result.typings = result.typings || {};

	// When bundling automatically output es6 modules instead of system to enable rollup support
	// if (builder) {
	//    if (result.module === ts.ModuleKind.System) {
	// 		logger.log('switching output from system.register -> es modules to support rollup');
	//       result.module = ts.ModuleKind.ES6;
	//    }
	// }

	if (result.supportHtmlImports) {
		logger.error("The 'supportHtmlImports' option is no longer supported");
		logger.error("Please use TypeScript's new 'wildcard declarations' feature instead");
	}

	if (result.resolveAmbientRefs) {
		logger.error("The 'resolveAmbientRefs' option is no longer supported");
		logger.error("Please use External Typings support instead");
	}

	if (result.targetLib) {
		logger.error("The 'targetLib' option is no longer supported");
		logger.error("Please use the 'lib' option instead");
	}

	if (!result.lib) {
		result.lib = ['es6'];
	}

	return result;
}

function getEnum(enumValue: any, enumType: any, defaultValue: number): number {
	if (enumValue == undefined) return defaultValue;

	for (var enumProp in enumType) {
		if (enumProp.toLowerCase() === enumValue.toString().toLowerCase()) {
			if (typeof enumType[enumProp] === "string")
				return enumType[enumType[enumProp]];
			else
				return enumType[enumProp];
		}
	}

	throw new Error(`Unrecognised value [${enumValue}]`);
}
