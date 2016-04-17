import "../shims.js";
import {bootstrap} from 'angular2/platform/browser';
import {Component} from 'angular2/core';
import {CalculatorComponent} from './calculator-component';
import "./index.css";

@Component({
   selector: 'calculator-app',
   template: '<calculator-component></calculator-component>',
   directives: [CalculatorComponent]   
})
class CalculatorApp { }
bootstrap(CalculatorApp);
