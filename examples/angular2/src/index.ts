import "../shims.js";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component} from '@angular/core';
import {CalculatorComponent} from './calculator-component';
// import "./index.css";

@Component({
   selector: 'calculator-app',
   template: '<calculator-component></calculator-component>',
   directives: [CalculatorComponent]
})
class CalculatorApp { }
bootstrap(CalculatorApp);
