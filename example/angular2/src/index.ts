import "../shims";
import {bootstrap} from 'angular2/bootstrap';
import {Component, Directive, View} from 'angular2/core';
import {CalculatorComponent} from './calculator-component';
import "./index.css";

@Component({
  selector: 'calculator-app',
})
@View({
  template: '<calculator-component></calculator-component>',
  directives: [CalculatorComponent] 
})
export class CalculatorApp {}
bootstrap(CalculatorApp);
