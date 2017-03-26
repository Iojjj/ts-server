export class Sugar {

    private amount: number;

    constructor(amount: number) {
        this.amount = amount;
    }

    public consume(amount: number): void {
        if (amount <= 0) {
            throw new Error(`Invalid amount of sugar: ${amount}.`);
        }
        if (this.amount < amount) {
            throw new Error(`Not enough sugar: requested ${amount} g but only ${this.amount} g available.`);
        }
    }
}