/// <reference path="./ambient-requires.d.ts" />

import a from "exposed-ambient";

if (a == 42)
   console.log("correct!");

var b: number = a;;
export default b;
