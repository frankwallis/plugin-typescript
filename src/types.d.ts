interface Module {
	name: string
	address: string
	source?: string
	metadata?: any
}

// augment SystemJS
declare namespace SystemJSLoader {
	interface System {
		normalize(dep: string, parent?: string): Promise<string>
		resolve(dep: string, parent?: string): Promise<string>
		typescriptOptions?: PluginOptions
	}
}

declare var __moduleName: string
declare var self: any

declare type FetchFunction = (fileName: string, parentAddress: string) => Promise<string>

interface PluginOptions {
	tsconfig?: boolean | string

	/* reveal some hidden typescript options */
	suppressOutputPathCheck?: boolean
	allowNonTsExtensions?: boolean
}

declare interface StructuredError {
	messageText: string
	locationText: string
	errorCode: number
	category: number
}

declare module Chai {
	interface Assertion {
		defined: any
	}
}

declare module "jspm" {
	export const Builder: any
}
