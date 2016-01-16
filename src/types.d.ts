interface Module {
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

interface ResolveFunction {
	(dep: string, parent?: string): Promise<string>;
}

interface FetchFunction {
	(address: string): Promise<string>;
}

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
