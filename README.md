plugin-typescript
============================
[![build status](https://secure.travis-ci.org/frankwallis/plugin-typescript.png?branch=master)](http://travis-ci.org/frankwallis/plugin-typescript)

TypeScript loader for SystemJS

# Overview #

A plugin for [SystemJS](https://github.com/systemjs/systemjs) which enables you to System.import TypeScript files directly. The files are compiled in the browser and compilation errors written to the console.

For JSPM version 0.15 and below, use [plugin-typescript 1.0.x](https://github.com/frankwallis/plugin-typescript/tree/1.0). For any later versions use version 2.x.

plugin-typescript uses version 1.7.3 of the typescript compiler

# Usage #

Install plugin-typescript like this:

```
jspm install ts
```

And add a 'packages' entry in your SystemJS config:

```
System.config({
  "transpiler": false,
  "packages": {
    "app": {
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        },
        "*.js": {
          "loader": "ts"
        }
      }
    }
  }
});
```

This will tell SystemJS to load all '.ts' and '.js' files through plugin-typescript.
See the example projects contained within this repository for a working setup.

# Configuration #

Configuration settings can be passed to the compiler via "typescriptOptions":

```
System.config({
  "baseURL": ".",
  "paths": {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  typescriptOptions: {
    "noImplicitAny": true,
    "typeCheck": true,				// also accepts "strict"
    "tsconfig": true				// also accepts a path
  }
});
```

All the usual TypeScript compiler options are supported, as well as these additional ones:

## typeCheck ##

A boolean flag which controls whether the files are type-checked or simply transpiled. Type-checking does add some overhead to the build process as reference files need to be loaded and the compiler has more work to do. 

By default compiler errors are written to the console but the build is allowed to continue. To change this behaviour you can use ```typeCheck: "strict"``` in which case the build will be failed when compiler errors are encountered.

## tsconfig ##

A boolean flag which instructs the plugin to load configuration from "tsconfig.json". To override the location of the file set this option to the path of the configuration file, which will be resolved using normal SystemJS resolution.

Compiler options which do not conflict with those required by plugin-typescript will be loaded from the ```compilerOptions``` section of the file. Any declaration files contained in the ```files``` array will also be loaded if type-checking is enabled.

## resolveTypings ##

In TypeScript 1.6.2 the ```typings``` field was introduced in package.json to enable delivery of type declaration files alongside javascript libraries. This boolean flag controls whether the type-checker will look for the ```typings``` field in package.json when importing external dependencies, and load the declaration file when it is present. For more information see [here](https://github.com/Microsoft/TypeScript/wiki/Typings-for-npm-packages).

The default value is ```false```. See the angular2 example project for an example of this feature working.

## resolveAmbientRefs 
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

# Features #

## Type-checking over Multiple Packages ##

The type-checker runs across multiple packages if the imported file resolves to a typescript file. This means that if you do ```import "mypackage/index"``` and that resolves to a typescript file then that import will be properly type-checked. You no longer have to handcraft an external declaration file for 'mypackage'! 

See the angular2 example project for an example of this feature working.

## HTML Imports ##

The type-checker automatically resolves any file with a .html extension to have a default export which is a string. This enables importing of html templates using plugin-text with full type-checking and no errors.

See the angular2 example project for an example of this feature working.

## Override TypeScript Version ##

To override the version of TypeScript used by the plugin, add an override to the ```jspm``` section of your package.json

```
	"devDependencies": {
		"css": "systemjs/plugin-css@0.1.10",
		"ts": "frankwallis/plugin-typescript@^2.2.0"
	},
	"overrides": {
		"github:frankwallis/plugin-typescript@2.2.1": {
	 		"dependencies": {
	    		"typescript": "npm:typescript@1.8.0-dev.20151108"
	  		}
		}
	}
```

# Example Projects #

To run the example projects:
```
> git clone https://github.com/frankwallis/plugin-typescript.git
> cd plugin-typescript
> npm install
> cd example/angular  		// or example/angular2 or example/react
> jspm install
> gulp example
```
To bundle each example project:
```
gulp bundle 					// or jspm bundle-sfx src build/build.js
```
To watch each example project and continuously report on type-errors:
```
gulp flow
```

For a more complex angular2 example see [here](https://github.com/frankwallis/redouble/tree/angular2)
