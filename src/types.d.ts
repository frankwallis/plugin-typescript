declare type Module = {
	name: string;
	address: string;
	source?: string;
	metadata?: any;
}

interface SystemJS {
	normalize(dep: string, parent: string): Promise<string>;
	fetch(load: Module): Promise<string>;

	typescriptOptions?: any;
   transpiler?: string;
}

declare var System: SystemJS;
declare var __moduleName: string;

declare type ResolveFunction = (dep: string, parent?: string) => Promise<string>;
declare type FetchFunction = (address: string) => Promise<string>;

interface PluginOptions {
	tsconfig?: boolean | string;
	typeCheck?: boolean | string;
	resolveAmbientRefs?: boolean;
	resolveTypings?: boolean | any;//string[];

	/* private */
	typings?: any;//string[];
	files?: any;
	tsconfigAddress?: string;

	// this is a hidden typescript option
	skipDefaultLibCheck?: boolean;
}

declare type DependencyInfo = {
   /* list of all typescript files required to compile this one */
   list: string[];
   
   /* map of imports/references used by this file to their resolved locations.
		These will include any redirections to a typings file if one is present. */
   mappings: { [s: string]: string; }
}