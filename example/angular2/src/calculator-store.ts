export type CalculatorState = {
   total: number;
   operand: number;
}

export class CalculatorStore {
	constructor() {
		this.clear();
	}

	private state: CalculatorState;

   public get(): CalculatorState {
      return this.state;
   }
   
	public async input(digit): Promise<CalculatorState> {
      this.state = {
         total: this.state.total,
         operand: (this.state.operand * 10) + digit
      }
		return await Promise.resolve(this.state);
	}

	public async sum(): Promise<CalculatorState> {
		this.state = {
         total: this.state.total + this.state.operand,
		   operand: 0.0
      };
      return await Promise.resolve(this.state);
	}

	public async clear(): Promise<CalculatorState> {
		this.state = {
         total: 0.0,
		   operand: 0.0
      };
      return await Promise.resolve(this.state);
	}
}
