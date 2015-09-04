/// <reference path="./_references.d.ts" />

// these should probably be shimmed in jspm registry
import "zone";
import "reflect-metadata";

import {bootstrap} from 'angular2/angular2';
import {ExampleComponent} from './example-component';
//import "./index.css";

setTimeout(() => bootstrap(ExampleComponent), 0);
