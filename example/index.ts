/// <reference path="./_references.d.ts" />
declare var angular: any;
declare var require: any;

require("angular.js");

export var Module = angular.module("example", [ 
    
]);

import ExampleService = require('./example-service');
Module.service("exampleService", ExampleService);
