// This uses jspm resolution to locate the file because resolveAmbientRefs is set to true
/// <reference path="angular2/bundles/typings/angular2/angular2.d.ts" />

// painful, also requires a mapping in config.js
// hopefully will be replaced by ```import template: string from "./my-template.html"``` syntax.
declare module "example-view" {
	var __html__: string;
	export default __html__;
}

declare module "example-service" {
	export class ExampleService {
		public greet(name: string): string;
	}
}

declare var __moduleName;
