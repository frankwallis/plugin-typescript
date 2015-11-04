// this should probably be shimmed in jspm registry
import "reflect-metadata";

import {bootstrap} from 'angular2/angular2';
import {ExampleComponent} from './example-component';
import "./index.css";

setTimeout(() => bootstrap(ExampleComponent), 0);
