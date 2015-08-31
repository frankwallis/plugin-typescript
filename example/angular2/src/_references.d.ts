// This uses jspm resolution to locate the file because resolveAmbientRefs is set to true
/// <reference path="angular2/bundles/typings/angular2/angular2.d.ts" />

declare module "example-service" {
	export class ExampleService {
		public greet(name: string): string;
	}
}

declare var __moduleName;
