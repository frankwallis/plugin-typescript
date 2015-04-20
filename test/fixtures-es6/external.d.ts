interface INgStatic {
	bootstrap(name: string, deps: any);
}

declare module "angular" {
	var angular: INgStatic;
	export default angular;
}