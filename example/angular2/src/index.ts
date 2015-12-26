import {bootstrap} from 'angular2/bootstrap';
import {Component, Directive, View} from 'angular2/core';
import {ExampleComponent} from './example-component';
import "./index.css";

@Component({
  selector: 'example-app',
})
@View({
  template: '<example-component></example-component>',
  directives: [ExampleComponent] 
})
export class ExampleApp {}
bootstrap(ExampleApp);
