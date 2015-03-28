/// <reference path="./ambient-requires.d.ts" />

import a = require("exposed-ambient");

if (a.internalAmbient.someInternalNumber == 42)
   console.log("correct!");

var b: number = a.internalAmbient.someInternalNumber;
export = b;
