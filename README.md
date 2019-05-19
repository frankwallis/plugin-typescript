plugin-typescript
============================
TypeScript loader for SystemJS

[![build status](https://secure.travis-ci.org/frankwallis/plugin-typescript.png?branch=master)](http://travis-ci.org/frankwallis/plugin-typescript)

## Overview ##

A plugin for [SystemJS](https://github.com/systemjs/systemjs) which enables you to ```System.import``` TypeScript files directly. The files are transpiled in the browser and compilation errors written to the console.

Starting with JSPM 0.17.0 (currently in beta) this plugin will be the officially supported mechanism for transpiling TypeScript. It provides the ability to transpile TypeScript and ES2015+ files on the fly when then are loaded by SystemJS.

plugin-typescript supports TypeScript 2.0.0 and higher  
For TypeScript 1.8.1 use plugin-typescript 4.0.16  
For TypeScript 1.7.5 and below use plugin-typescript 2.x.x  

## Installation ##

#### JSPM ####

Install plugin-typescript like this:

```sh
jspm install ts
```

All the SystemJS configuration will be created automatically by JSPM.

#### If you are using SystemJS without JSPM ####

Add SystemJS map configuration for plugin-typescript and typescript:

```js
SystemJS.config({
  packages: {
    "ts": {
      "main": "lib/plugin.js"
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
    "ts": "path/to/plugin-typescript",
    "typescript": "path/to/typescript"
  },
  transpiler: 'ts'
});
```

## Setup ##

#### Make plugin-typescript the default transpiler for js and ts files ####

```js
System.config({
  transpiler: "ts",
  packages: {
    "app": {
      "defaultExtension": "ts",
    }
  }
});
```

This will tell SystemJS to transpile all modules (.js and .ts) using plugin-typescript. It is also possible to configure plugin-typescript to load specific files, using ```packages``` configuration

```js
System.config({
  transpiler: "babel",
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
    tsconfig: true                  // also accepts a path
  }
});
```

It is also possible to override the default configuration for specific files, using ```meta``` configuration:

```js
System.config({
  transpiler: "typescript",
  packages: {
    "src": {
      "defaultExtension": "ts",
      "meta": {
         "*.ts": {
            "typescriptOptions": {
               "noImplicitAny": true
            }
         }
      }
    }
  }
});
```

All the usual TypeScript compiler options are supported, as well as these additional ones:

#### tsconfig ####

A boolean flag which instructs the plugin to load configuration from "tsconfig.json". To override the location of the file set this option to the path of the configuration file, which will be resolved using normal SystemJS resolution.

The file location will be resolved using normal SystemJS resolution, and compiler options which do not conflict with those required by plugin-typescript will be loaded from the ```compilerOptions``` section of the file.

## Features ##

#### Hot-Reload support ####

The example projects show how to use plugin-typescript in conjuntion with [systemjs-hot-reloader](https://github.com/capaj/systemjs-hot-reloader)

#### Rollup support ####

Rollup is supported when transpiling with ```module: "es6"```. It can help to reduce the size of your bundles by stripping out unused modules. For more information see [here](https://github.com/rollup/rollup)

#### Link to source from transpiler errors ####

When compiling in the browser, transpiler errors contain a link to the exact location of the error in the source. This is particularly helpful if you are using Chrome DevTools as your IDE.

#### Override TypeScript version ####

To override the version of TypeScript used by the plugin, add an override to the ```jspm``` section of your package.json

```json
	"devDependencies": {
		"css": "systemjs/plugin-css@0.1.10",
		"ts": "frankwallis/plugin-typescript@^7.0.5"
	},
	"overrides": {
		"github:frankwallis/plugin-typescript@5.0.1": {
	 		"dependencies": {
	    		"typescript": "npm:typescript@2.3.0-dev.20170228"
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
> npm run build 			// or jspm build src build/build.js
```
