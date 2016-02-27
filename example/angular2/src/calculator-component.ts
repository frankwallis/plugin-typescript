import {Component, View, ChangeDetectionStrategy} from 'angular2/core';
import {CalculatorStore, CalculatorState} from "./calculator-store";
import calculatorTemplate from "./calculator-view.html";

@Component({
  selector: 'calculator-component',
  viewBindings: [CalculatorStore]
})
@View({
  template: calculatorTemplate,
  directives: [] 
})
export class CalculatorComponent {

	constructor(private calculatorStore: CalculatorStore) {
		console.log('constructing CalculatorComponent');
      this.state = this.calculatorStore.get();
	}

   private state: CalculatorState;

   public get operand() {
      return this.state.operand;
   }
   
   public get total() {
      return this.state.total;
   }

   public async input(digit: number) {
      this.state = await this.calculatorStore.input(digit);
   }
   
   public async clear() {
      this.state = await this.calculatorStore.clear();
   }
   
   public async sum() {
      this.state = await this.calculatorStore.sum();
   }
}
