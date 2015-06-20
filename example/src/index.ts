/// <reference path="./_references.d.ts" />
import {module} from "angular";
import "./index.css!";

export var Module = module("example", [

]);

import {ExampleService} from './example-service';
import {ExampleController} from './example-controller';

Module.service("exampleService", ExampleService);
Module.controller("exampleController", ExampleController);
