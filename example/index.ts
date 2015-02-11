/// <reference path="./_references.d.ts" />
import angular = require("angular");

export var Module = angular.module("example", [

]);

import ExampleService = require('./example-service');
import ExampleController = require('./example-controller');

Module.service("exampleService", ExampleService);
Module.controller("exampleController", ExampleController);
