import {Coffee} from "./components/coffee";

export class Cup {

    private readonly coffee: Coffee;

    constructor(coffee: Coffee) {
        this.coffee = coffee;
    }

    public toString(): string {
        return `Cup of ${this.coffee.name}!`;
    }
}