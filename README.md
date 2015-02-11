plugin-typescript
============================
[![build status](https://secure.travis-ci.org/frankwallis/plugin-typescript.png?branch=master)](http://travis-ci.org/frankwallis/plugin-typescript)

TypeScript compiler plugin for SystemJS

# Overview #

A plugin for [SystemJS](https://github.com/systemjs/systemjs) which enables you to System.import TypeScript files directly. The files are compiled in the browser and compilation errors written to the console. 

plugin-typescript uses version 1.4 of the typescript compiler

# Usage #

Install plugin-typescript like this:

```
jspm install ts=github:frankwallis/plugin-typescript
```
You will then be able to import TypeScript source files like this:

```
System.import("./index.ts!");
```

# Examples #

To run the example project:

```
npm install
cd example
jspm install
cd ..
npm start
```

For a more complex example see https://github.com/frankwallis/tower/tree/systemjs

# Caveats #

This plugin uses the TypeScript LanguageServices API. Unfortunately there is an issue in TypeScript 1.4.1 where const enums are not correctly output in the generated js. I'm hopeful that a fix will be released soon, meanwhile you can track the issue [here](https://github.com/frankwallis/plugin-typescript/issues/4).


