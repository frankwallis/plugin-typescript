/// <reference path="./_references.d.ts" />
import "reflect-metadata";

import {bootstrap} from 'angular2/angular2';
import {ExampleComponent} from './example-component';
import "./index.css";

export function main() {
  bootstrap(ExampleComponent);
}
