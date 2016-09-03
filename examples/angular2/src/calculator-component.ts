import {Component} from '@angular/core';
import {CalculatorStore, CalculatorState} from "./calculator-store";
import calculatorTemplate from "./calculator-view.html";

@Component({
   selector: 'calculator-component',
   template: calculatorTemplate
})
export class CalculatorComponent {

   constructor(private calculatorStore: CalculatorStore) {
      console.log('constructing CalculatorComponent');
      this.state = {
         total: 0.0,
         operand: 0.0
      };
      var [x, y] = [1, 2];
   }

   private state: CalculatorState;

   public get operand() {
      return this.state.operand;
   }

   public get total() {
      return this.state.total;
   }

   public async input(digit: number) {
      this.state = await this.calculatorStore.input(digit, this.state);
   }

   public async clear() {
      this.state = await this.calculatorStore.clear(this.state);
   }

   public async sum() {
      this.state = await this.calculatorStore.sum(this.state);
   }
}
