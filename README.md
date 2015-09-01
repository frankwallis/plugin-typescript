plugin-typescript
============================
[![build status](https://secure.travis-ci.org/frankwallis/plugin-typescript.png?branch=master)](http://travis-ci.org/frankwallis/plugin-typescript)

TypeScript loader for SystemJS

# Overview #

A plugin for [SystemJS](https://github.com/systemjs/systemjs) which enables you to System.import TypeScript files directly. The files are compiled in the browser and compilation errors written to the console.

For JSPM version 0.15 and below, use [plugin-typescript 1.0.x](https://github.com/frankwallis/plugin-typescript/tree/1.0). For any later versions use version 2.x.

plugin-typescript uses version 1.7.0-dev.20150901 of the typescript compiler

# Usage #

Install plugin-typescript like this:

```
jspm install ts
```

And add a 'packages' entry in your SystemJS config:

```
System.config({
  "packages": {
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

This will tell SystemJS to load all '.ts' files through plugin-typescript.
See the example project contained within this repository for a working setup.

# Configuration #

Configuration settings can be passed to the compiler via "typescriptOptions":

```
System.config({
  "baseURL": ".",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  },
  typescriptOptions: {
    "noImplicitAny": true
  }
});
```

All the usual TypeScript compiler options are supported, as well as these additional ones:

## resolveAmbientRefs ##

A boolean flag which controls how reference files are resolved. When it is set then SystemJS will be used to resolve references, so

```
/// <reference path="./common/angular.d.ts" />
```
will resolve relative to the current directory, but
```
/// <reference path="common/angular.d.ts" />
```
will resolve to ```jspm_packages/github/frankwallis/common@1.0.0/angular.d.ts``` (or wherever 'common' is mapped to)

This can be extremely useful when compiling over multiple projects as all the projects can easily reference declaration files from their dependencies, and they will be automatically updated with new versions etc. 
The default value is false (this is a breaking change from version 1.0), which means that both of the above references will resolve relative to the current file.

## typeCheck ##

A boolean flag which controls whether the files are type-checked or simply transpiled. Type-checking does add some overhead to the build process as reference files need to be loaded and the compiler has more work to do.

# Features #

## Type-checking over Multiple Packages ##

The type-checker runs across multiple packages if the imported file resolves to a typescript file. This means that if you do ```import "mypackage/index"``` and that resolves to a typescript file then that import will be properly type-checked. You no longer have to handcraft an external declaration file for mypackage! 

## HTML Imports ##

The type-checker automatically resolves any file with a .html extension to have a default export which is a string. This enables importing of html templates using plugin-text with full type-checking an no errors.

See the angular2 example project for a demonstration of both these features working.

# Example Projects #

To setup the example project:
```
npm install
cd example
jspm install
```

To run the example project, compiling in the browser:
```
gulp example
```

To bundle the example project:
```
gulp bundle
```

To watch the example project and continuously report on type-errors:
```
gulp flow
```

For a more complex angular2 example see [here](https://github.com/frankwallis/redouble/tree/angular2)
