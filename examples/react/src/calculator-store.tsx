export class CalculatorStore {
	constructor() {
		this.clear();
	}

	public operand: number;
	public total: number;

	public input(digit) {
		this.operand = (this.operand * 10) + digit;
	}

	public add() {
		this.total = this.total + this.operand;
		this.operand = 0.0;
	}

	public clear() {
		this.total = 0.0;
		this.operand = 0.0;
	}
}
