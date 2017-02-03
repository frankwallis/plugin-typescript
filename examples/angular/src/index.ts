import angular from 'angular';
import './index.css';

import exampleTemplate from './example-template.html';
import {ExampleService} from './example-service';
import {ExampleController} from './example-controller';

export var Module = angular.module("example", []);

Module.service("exampleService", ExampleService);

Module.component('exampleForm', {
	template: exampleTemplate,
	controller: ExampleController,
	controllerAs: 'cx'
});
