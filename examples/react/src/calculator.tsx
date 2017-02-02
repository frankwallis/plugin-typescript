import React from 'react';
import {CalculatorStore} from './calculator-store';

export class Calculator extends React.Component<any, any> {
   constructor(props) {
      super(props);
      this.calculatorStore = new CalculatorStore();
   }

   private calculatorStore: CalculatorStore;

   input(digit) {
      this.calculatorStore.input(digit);
      this.forceUpdate();
   }

   clear() {
      this.calculatorStore.clear();
      this.forceUpdate();
   }

   add() {
      this.calculatorStore.add();
      this.forceUpdate();
   }

   inputButton(digit: number) {
      return <button className="adder-button adder-button-digit"
                     key={digit}
                     onClick={() => this.input(digit)}>{digit}</button>;
   }

   render() {
      // build the rows of digits
      let buttons = [
         [1, 2, 3].map((digit) => this.inputButton(digit)),
         [4, 5, 6].map((digit) => this.inputButton(digit)),
         [7, 8, 9].map((digit) => this.inputButton(digit))
      ];

      // add the bottom row
      buttons.push([
         <button className="adder-button adder-button-add"
                 key="add"
                 onClick={() => this.add()}>+</button>,
         this.inputButton(0),
         <button className="adder-button adder-button-clear"
                 key="clear"
                 onClick={() => this.clear()}>c</button>
      ]);

      // wrap with row divs
      let buttonrows = buttons.map((row, idx) => {
         return (
            <div key={"row" + idx} className="adder-row">
               {row}
            </div>
         );
      });

      return (
         <div className="adder-container">
            <div className="adder-row">
               <span className="adder-operand adder-display">{this.calculatorStore.operand}</span>
            </div>

            <div className="adder-row">
               <span className="adder-total adder-display">{this.calculatorStore.total}</span>
            </div>

            {buttonrows}
         </div>
      );
   }
}
