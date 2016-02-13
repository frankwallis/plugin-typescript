plugin-typescript
============================
TypeScript loader for SystemJS

[![build status](https://secure.travis-ci.org/frankwallis/plugin-typescript.png?branch=master)](http://travis-ci.org/frankwallis/plugin-typescript)

## Overview ##

A plugin for [SystemJS](https://github.com/systemjs/systemjs) which enables you to ```System.import``` TypeScript files directly. The files are compiled in the browser and compilation errors written to the console.

plugin-typescript uses version 1.9.0-dev.20160206 of the typescript compiler.

For JSPM version 0.15 and below, use [plugin-typescript 1.0.x](https://github.com/frankwallis/plugin-typescript/tree/1.0).  
For TypeScript 1.7.5 and below use [plugin-typescript 2.x.x](https://github.com/frankwallis/plugin-typescript/tree/2.0).

## Installation ##

#### SystemJS ####

Add SystemJS map configuration for plugin-typescript and typescript:

```js
SystemJS.config({
  map: {
    "ts": "path/to/plugin-typescript/lib/plugin.js",
    "typescript": "path/to/typescript/lib/typescript.js"
  }
});
```
#### JSPM ####

Install plugin-typescript like this:

```sh
jspm install ts
```

## Setup ##

#### Either: make plugin-typescript the default transpiler ####

```js
System.config({
  transpiler: "ts"
  packages: {
    "app": {
      "defaultExtension": "ts",
    }
  }
});
```

This will tell SystemJS to load all modules (.js and .ts) through plugin-typescript.

#### Or: target specific files, using ```packages``` configuration ####

```js
System.config({
  transpiler: "plugin-babel",
  packages: {
    "app": {
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        }
      }
    }
  }
});
```

This will cause all .ts files in the "src" package to be loaded through plugin-typescript.

See the example projects contained within this repository for a working setup.

## Configuration ##

Configuration settings can be passed to the compiler via "typescriptOptions":

```js
System.config({
  typescriptOptions: {
    module: "system",
    noImplicitAny: true,
    typeCheck: true,				// also accepts "strict"
    tsconfig: true               // also accepts a path
  }
});
```

All the usual TypeScript compiler options are supported, as well as these additional ones:

#### typeCheck ####

A boolean flag which controls whether the files are type-checked or simply transpiled. Type-checking does add some overhead to the build process as reference files need to be loaded and the compiler has more work to do. 

By default compiler errors are written to the console but the build is allowed to continue. To change this behaviour you can use ```typeCheck: "strict"``` in which case the build will be failed when compiler errors are encountered.

#### tsconfig ####

A boolean flag which instructs the plugin to load configuration from "tsconfig.json". To override the location of the file set this option to the path of the configuration file, which will be resolved using normal SystemJS resolution.

Compiler options which do not conflict with those required by plugin-typescript will be loaded from the ```compilerOptions``` section of the file. Any declaration files contained in the ```files``` array will also be loaded if type-checking is enabled.

#### targetLib ####

Specify whether to use lib.d.ts ```targetLib: "es5"``` or lib.es6.d.ts ```targetLib: "es6"``` (default) 

#### resolveTypings ####

In TypeScript 1.6.2 the ```typings``` field was introduced in package.json to enable delivery of type declaration files alongside javascript libraries. This boolean flag controls whether the type-checker will look for the ```typings``` field in package.json when importing external dependencies, and load the declaration file when it is present. For more information see [here](https://github.com/Microsoft/TypeScript/wiki/Typings-for-npm-packages).

The default value is ```false```. See the angular2 example project for an example of this feature working.

*(this feature is "under improvement")*

#### resolveAmbientRefs ####
*(deprecated)*

A boolean flag which controls how reference files are resolved. When it is set then SystemJS will be used to resolve references, so

```
/// <reference path="./common/angular.d.ts" />
```
will resolve relative to the current directory because of the ```"./"```, but
```
/// <reference path="angular2/bundles/typings/angular2/angular2.d.ts" />
```
will resolve to ```jspm_packages/npm/angular2@2.0.0/bundles/typings/angular2/angular2.d.ts```

This can be useful when compiling over multiple projects as all the projects can easily reference declaration files from their dependencies, and they will be automatically updated with new versions etc.  

The default value is ```false```. As it is incompatible with other tools (editors etc), **this setting is deprecated** in favour of using ```typings``` as described above.

## Features ##

#### Link to source from compiler errors ####

When compiling in the browser, compiler errors contain a link to the exact location of the error in the source. This is particularly helpful if you are using Chrome DevTools as your IDE.

#### Type-checking over Multiple Packages ####

The type-checker runs across multiple packages if the imported file resolves to a typescript file. This means that if you do ```import "mypackage/index"``` and that resolves to a typescript file then that import will be properly type-checked. You no longer have to handcraft an external declaration file for 'mypackage'! 

See the angular2 example project for an example of this feature working.

#### HTML Imports ####

The type-checker automatically resolves any file with a .html extension to have a default export which is a string. This enables importing of html templates using plugin-text with full type-checking and no errors.

See the angular2 example project for an example of this feature working.

#### Override TypeScript Version ####

To override the version of TypeScript used by the plugin, add an override to the ```jspm``` section of your package.json

```json
	"devDependencies": {
		"css": "systemjs/plugin-css@0.1.10",
		"ts": "frankwallis/plugin-typescript@^2.2.0"
	},
	"overrides": {
		"github:frankwallis/plugin-typescript@2.2.1": {
	 		"dependencies": {
	    		"typescript": "npm:typescript@1.8.0-dev.20160108"
	  		}
		}
	}
```

## Examples ##

To run the example projects:
```
> git clone https://github.com/frankwallis/plugin-typescript.git
> cd plugin-typescript
> npm install
> cd example/react  		// or example/angular2 or example/angular
> jspm install
> npm start
```
To bundle each example project:
```
> npm run build 			// or jspm bundle-sfx src build/build.js
```
