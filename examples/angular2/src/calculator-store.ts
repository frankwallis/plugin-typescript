export type CalculatorState = {
   total: number;
   operand: number;
}

export class CalculatorStore {
   constructor() {

   }

   public input(digit, state: CalculatorState): Promise<CalculatorState> {
      return Promise.resolve({
         total: state.total,
         operand: (state.operand * 10) + digit
      });
   }

   public sum(state: CalculatorState): Promise<CalculatorState> {
      return Promise.resolve({
         total: state.total + state.operand,
         operand: 0.0
      });
   }

   public clear(state: CalculatorState): Promise<CalculatorState> {
      return Promise.resolve({
         total: 0.0,
         operand: 0.0
      });
   }
}
