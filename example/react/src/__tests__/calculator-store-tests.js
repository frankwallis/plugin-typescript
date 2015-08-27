import {CalculatorStore} from "../calculator-store";

describe('CalculatorStore', () => {

  	it('initially all values are zero', () => {
      let calculatorStore = new CalculatorStore();		
		expect(calculatorStore.total).toEqual(0);
		expect(calculatorStore.operand).toEqual(0);
  	});

  it('handles valid input digits', () => {
      let calculatorStore = new CalculatorStore();
		calculatorStore.input(0);
		expect(calculatorStore.operand).toEqual(0);
		calculatorStore.input(5);
		expect(calculatorStore.operand).toEqual(5);
		calculatorStore.input(1);
		expect(calculatorStore.operand).toEqual(51);
  });

  xit('handles invalid input digits', () => {
      let calculatorStore = new CalculatorStore();
		calculatorStore.input(99);
		expect(calculatorStore.operand).toEqual(0);
		calculatorStore.input('a');
		expect(calculatorStore.operand).toEqual(0);
		calculatorStore.input({});
		expect(calculatorStore.operand).toEqual(0);
  });

  it('adds numbers', () => {
      let calculatorStore = new CalculatorStore();
		calculatorStore.input(5);
		calculatorStore.add();
		expect(calculatorStore.total).toEqual(5);
		expect(calculatorStore.operand).toEqual(0);
		
		calculatorStore.input(66);
		calculatorStore.add();
		expect(calculatorStore.total).toEqual(71);
		expect(calculatorStore.operand).toEqual(0);

		calculatorStore.add();
		expect(calculatorStore.total).toEqual(71);
		expect(calculatorStore.operand).toEqual(0);
  });

});
