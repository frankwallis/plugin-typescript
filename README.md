plugin-typescript
============================
[![build status](https://secure.travis-ci.org/frankwallis/plugin-typescript.png?branch=master)](http://travis-ci.org/frankwallis/plugin-typescript)

TypeScript compiler plugin for SystemJS

# Overview #

A plugin for [SystemJS](https://github.com/systemjs/systemjs) which enables you to System.import TypeScript files directly. The files are compiled in the browser and compilation errors written to the console.

plugin-typescript uses version 1.5.0-alpha of the typescript compiler

# Usage #

Install plugin-typescript like this:

```
jspm install ts
```
You will then be able to import TypeScript source files like this:

```
System.import("./index.ts!");
```

# Declaration files #

plugin-typescript uses SystemJS to resolve files from their require paths. This means it is also able to resolve declaration files in the same way. For example:

```
/// <reference path="./common/angular.d.ts" />
```
will resolve relative to the current directory, but
```
/// <reference path="common/angular.d.ts" />
```
will resolve to ```jspm_packages/github/frankwallis/common@1.0.0/angular.d.ts``` (or wherever 'common' is mapped to)

This can be extremely useful when compiling over multiple projects as all the projects can easily reference declaration files from their dependencies, and they will be automatically updated with new versions etc. It is *entirely optional* so if this causes issues in your IDE then just stick to relative paths prefixed with ./

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

# Examples #

To run the example project:

```
npm install
cd example
jspm install
jspm install --dev
gulp example
```

For a more complex example see [here](https://github.com/frankwallis/tower/tree/systemjs)

# Single-File Compilation #

Single-File compilation is not currently supported