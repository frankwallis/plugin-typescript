/// This uses jspm resolution to locate the file
/// because resolveAmbientRefs is set to true

/// <reference path="angular2/bundles/typings/angular2/angular2.d.ts" />

/// This is resolved relative to current path
/// <reference path="./example-types.d.ts" />

declare var __moduleName;

// painful, also requires a mapping in config.js
// hopefull will be replaced by `import template: string from "./my-template.html"` syntax.
declare module "example-view" {
	var __html__: string;
	export default __html__;
}
