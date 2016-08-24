interface Module {
	name: string;
	address: string;
	source?: string;
	metadata?: any;
}

declare namespace SystemJSLoader {
	// augment System
	interface System {
		normalize(dep: string, parent: string): Promise<string>;
		fetch(load: Module): Promise<string>;
		locate(load: Module): Promise<string>;

		builder?: boolean;
		typescriptOptions?: PluginOptions;
	}
}

declare var __moduleName: string;

declare type ResolveFunction = (dep: string, parent?: string) => Promise<string>;
declare type LookupFunction = (address: string) => Promise<any>;
declare type FetchFunction = (address: string) => Promise<string>;

interface PluginOptions {
   tsconfig?: boolean | string;
   typeCheck?: boolean | "strict";
	typings?: string[];

   /* deprecated */
   supportHtmlImports?: boolean;
   resolveAmbientRefs?: boolean;
	targetLib?: number;

   /* private */
   files?: string[];
   tsconfigAddress?: string;

   /* reveal some hidden typescript options */
   suppressOutputPathCheck?: boolean;
	allowNonTsExtensions?: boolean;
}

declare type DependencyInfo = {
   /* list of all typescript files required to compile this one */
   list: string[];

   /* map of imports/references used by this file to their resolved locations.
		These will include any redirections to a typings file if one is present. */
   mappings: { [s: string]: string; }
}

declare module Chai {
   interface Assertion {
      defined: any;
   }
}

declare module "jspm" {
	export const Builder: any;
}
