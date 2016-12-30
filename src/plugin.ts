/* */
import * as ts from 'typescript';
import Logger from './logger';
import { createFactory, FactoryOutput } from './factory';
import { convertErrors, outputErrors, formatErrors } from './format-errors';
import { CombinedOptions } from './parse-config';
import { CompilerHost } from './compiler-host';
import { Transpiler } from './transpiler';
import { Resolver } from './resolver';
import { TypeChecker } from './type-checker';
import { isTypescript, isTypescriptDeclaration, stripDoubleExtension, hasError } from './utils';

const logger = new Logger({ debug: false });
let factory: Promise<FactoryOutput> = null;

function getFactory() {
	// persist factory between instantiations of the plugin and expose it to the world
	const __global: any = typeof (self) !== 'undefined' ? self : global;
	__global.tsfactory = __global.tsfactory || createFactory(System.typescriptOptions, false, _resolve, _fetch, _lookup)
		.then((output) => {
			validateOptions(output.options);
			return output;
		});
	return __global.tsfactory;
}

/*
 * load.name
 * load.address
 * load.metadata
 * load.source: the fetched source
 */
export async function translate(load: Module): Promise<string> {
	const loader = this;
	logger.debug(`systemjs translating ${load.address}`);

	factory = factory || getFactory();

	const {transpiler, resolver, typeChecker, host, options} = await factory;
	host.addFile(load.address, load.source, options.target);

	let typeErrors: StructuredError[] = [];
	let transpileErrors: StructuredError[] = [];

	// transpile
	if (isTypescriptDeclaration(load.address)) {
		// rollup support needs null/esm to strip out the empty modules,
		// for non-rollup & runtime use ''/cjs
		if (loader.builder && (options.module == ts.ModuleKind.ES2015)) {
			load.source = null;
			load.metadata.format = 'esm';
		}
		else {
			load.source = '';
			load.metadata.format = 'cjs';
		}
	}
	else {
		const result = transpiler.transpile(load.address, options);
		transpileErrors = convertErrors(result.diags);
		outputErrors(transpileErrors, logger);

		if (result.failure)
			throw new Error('TypeScript transpilation failed');

		load.source = result.js;

		if (result.sourceMap)
			load.metadata.sourceMap = JSON.parse(result.sourceMap);

		if (!options.autoDetectModule) {
			if (options.module === ts.ModuleKind.System)
				load.metadata.format = 'register';
			else if (options.module === ts.ModuleKind.ES2015)
				load.metadata.format = 'esm';
			else if (options.module === ts.ModuleKind.CommonJS)
				load.metadata.format = 'cjs';
		}
	}

	if (options.typeCheck && isTypescript(load.address)) {
		// in the browser the bundle hook is not called so fail the build immediately
		const failOnError = !loader.builder && (options.typeCheck === "strict");
		const depslist = await resolveDependencies(load, resolver, options);
		typeErrors = await typeCheck(load, typeChecker, options, failOnError);
		outputErrors(typeErrors, logger);
		load.metadata.deps = depslist;
	}

	load.metadata.tserrors = transpileErrors.concat(typeErrors);
	return load.source;
}

async function resolveDependencies(load: Module, resolver: Resolver, options: CombinedOptions): Promise<string[]> {
	const deps = await resolver.resolve(load.address, options);

	return deps.list
		.filter(d => isTypescript(d))
		.filter(d => d !== load.address)
		.map(d => isTypescriptDeclaration(d) ? d + '!' + __moduleName : d);
}

async function typeCheck(load: Module, typeChecker: TypeChecker, options: CombinedOptions, failOnError: boolean): Promise<StructuredError[]> {
	const diags = typeChecker.check(options);
	const errors = convertErrors(diags);

	if (failOnError && hasError(diags))
		throw new Error("Typescript compilation failed");

	return errors;
}

export async function bundle(): Promise<any[]> {
	if (!factory) return [];
	const {typeChecker, host, options} = await factory;

	if (options.typeCheck) {
		const diags = typeChecker.forceCheck(options);
		formatErrors(diags, logger);

		if ((options.typeCheck === "strict") && typeChecker.hasErrors())
			throw new Error("Typescript compilation failed");
	}

	return [];
}

function validateOptions(options) {
   /* The only time you don't want to output in system format is when you are using rollup or babel
      downstream to compile es6 output (e.g. for async/await support) */
	if ((options.module != ts.ModuleKind.System) && (options.module != ts.ModuleKind.ES2015)) {
		logger.warn(`transpiling to ${ts.ModuleKind[options.module]}, consider setting module: "system" in typescriptOptions to transpile directly to System.register format`);
	}
}

/*
 * called by the factory/resolver when it needs to resolve a file
 */
async function _resolve(dep: string, parent: string): Promise<string> {
	if (!parent) parent = __moduleName;

	let normalized = await System.normalize(dep, parent)
	normalized = normalized.split('!')[0];
	normalized = stripDoubleExtension(normalized);

	logger.debug(`resolved ${normalized} (${parent} -> ${dep})`);
	return (ts as any).normalizePath(normalized);
}

/*
 * called by the factory/resolver when it needs to fetch a file
 */
async function _fetch(address: string): Promise<string> {
	const text = await System.fetch({ name: address, address, metadata: {} });
	logger.debug(`fetched ${address}`);
	return text;
}

/*
 * called by the resolver when it needs to get metadata for a file
 */
async function _lookup(address: string): Promise<any> {
	const metadata = {};
	await System.locate({ name: address, address, metadata });

	// metadata.typings, metadata.typescriptOptions etc should all now be populated correctly,
	// respecting the composition of all global metadata, wildcard metadata and package metadata correctly
	logger.debug(`located ${address}`);
	return metadata;
}
