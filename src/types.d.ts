interface Module {
	name: string
	address: string
	source?: string
	metadata?: any
}

type FetchFunction = (fileName: string, parentAddress: string) => Promise<string>

interface PluginOptions {
	tsconfig?: boolean | string
}

interface StructuredError {
	messageText: string
	locationText: string
	errorCode: number
	category: number
}

declare module "jspm" {
	export const Builder: any
}
