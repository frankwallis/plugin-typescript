plugin-typescript
============================
TypeScript loader for SystemJS

[![build status](https://secure.travis-ci.org/frankwallis/plugin-typescript.png?branch=master)](http://travis-ci.org/frankwallis/plugin-typescript)
[![Support](https://supporterhq.com/api/b/6nfr47qjvmqc3inntlc9em5az/plugin-typescript)](https://supporterhq.com/support/6nfr47qjvmqc3inntlc9em5az/plugin-typescript)

## Overview ##

A plugin for [SystemJS](https://github.com/systemjs/systemjs) which enables you to ```System.import``` TypeScript files directly. The files are compiled in the browser and compilation errors written to the console.

Starting with JSPM 0.17.0 (currently in beta) this plugin will be the officially supported mechanism for transpiling TypeScript. It provides the ability to type-check files while loading them, which is not currently possible with the built-in SystemJS TypeScript transpiler.

plugin-typescript uses TypeScript 2.0.0  
For TypeScript 1.8.1 use plugin-typescript 4.0.16  
For TypeScript 1.7.5 and below use plugin-typescript 2.x.x  

## Installation ##

#### SystemJS ####

Add SystemJS map configuration for plugin-typescript and typescript:

```js
SystemJS.config({
  packages: {
    "ts": {
      "main": "plugin.js"
    },
    "typescript": {
      "main": "lib/typescript.js",
      "meta": {
        "lib/typescript.js": {
          "exports": "ts"
        }
      }
    }
  },
  map: {
    "ts": "path/to/plugin-typescript/lib/",
    "typescript": "path/to/typescript/lib/"
  }
});
```
#### JSPM ####

Install plugin-typescript like this:

```sh
jspm install ts
```

## Setup ##

#### Make plugin-typescript the default transpiler for js and ts files ####

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

This will tell SystemJS to transpile all modules (.js and .ts) using plugin-typescript.

#### Plus: for full type-checking add ```packages``` configuration ####

```js
System.config({
  transpiler: "ts",
  packages: {
    "src": {
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
    tsconfig: true                  // also accepts a path
  }
});
```

All the usual TypeScript compiler options are supported, as well as these additional ones:

#### typeCheck ####

A boolean flag which controls whether the files are type-checked or simply transpiled. Type-checking does add some overhead to the build process as typings need to be loaded and the compiler has more work to do. 

By default compiler errors are written to the console but the build is allowed to continue. To change this behaviour you can use ```typeCheck: "strict"``` in which case the build will be failed when compiler errors are encountered.

#### tsconfig ####

A boolean flag which instructs the plugin to load configuration from "tsconfig.json". To override the location of the file set this option to the path of the configuration file, which will be resolved using normal SystemJS resolution.

Compiler options which do not conflict with those required by plugin-typescript will be loaded from the ```compilerOptions``` section of the file. Any declaration files contained in the ```files``` array will also be loaded if type-checking is enabled.

## Features ##

#### Hot-Reload Support ####

This plugin provides incremental type-checking when using [systemjs-hot-reloader](https://github.com/capaj/systemjs-hot-reloader)
See any of the example projects for a working hot-reloading setup.

#### @types support ####

The ```types``` compiler option is a string array containing package names for which typings are available in '@types', for example if you have installed typings using ```jspm install npm:@types/react``` then you should add ```types: ["react"]``` to your config:

```json
{
	"typescriptOptions": {
		"types": ["react"]
	}
}
```
and the installed typings will then be used by the type-checker.

#### External Typings Support ####

The plugin will automatically load typings for packages if it knows that they are present. In order tell the plugin that a package exposes external typings, use SystemJS metadata configuration which can be specified in ```packages``` configuration or in package.json overrides, or in the jspm registry.

```js
    "overrides": {
      "npm:@angular/core@2.0.0-rc.1": {
        "meta": {
          "*.js": {
            "typings": true      // can also be path of a typings bundle
          }
        }
      }
	 }
```

If external typings are present for all js files in the package set ```"typings": true```. If external typings are in a single bundled file then specify the path of that file, relative to the root of the project.   
For more information on setting SystemJS metadata, see [here](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#packages)

#### Rollup Support ####

Rollup is supported when transpiling with ```module: "es6"```. It can help to reduce the size of your bundles by stripping out unused modules. For more information see [here](https://github.com/rollup/rollup)

#### Link to source from compiler errors ####

When compiling in the browser, compiler errors contain a link to the exact location of the error in the source. This is particularly helpful if you are using Chrome DevTools as your IDE.

#### Type-checking over Multiple Packages ####

The type-checker runs across multiple packages if the imported file resolves to a typescript file. This means that if you do ```import "mypackage/index"``` and that resolves to a typescript file then that import will be properly type-checked. You no longer have to handcraft an external declaration file for 'mypackage'.

#### Override TypeScript Version ####

To override the version of TypeScript used by the plugin, add an override to the ```jspm``` section of your package.json

```json
	"devDependencies": {
		"css": "systemjs/plugin-css@0.1.10",
		"ts": "frankwallis/plugin-typescript@^5.0.1"
	},
	"overrides": {
		"github:frankwallis/plugin-typescript@5.0.1": {
	 		"dependencies": {
	    		"typescript": "npm:typescript@2.1.0-dev.20160730"
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
> cd examples/react  		// or examples/angular2 or examples/angular
> jspm install
> npm start
```
To bundle each example project:
```
> npm run build 			// or jspm bundle-sfx src build/build.js
```
