interface INgStatic {
	bootstrap(name: string, deps: any);
}

declare module "angular" {
	var angular: INgStatic;
	export default angular;
	// not too happy about this
	//	export default var angular: INgStatic;
	//export function bootstrap(name: string, deps: any);
}