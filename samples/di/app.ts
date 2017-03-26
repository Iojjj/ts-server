import {AmericanoCoffeeMaker} from "./models/coffee-makers/americano.coffee-maker";
import {SingletonCoffeeMaker} from "./models/coffee-makers/singleton.coffee-maker";
import {CappuccinoCoffeeMaker} from "./models/coffee-makers/cappuccino.coffee-maker";
import {CoffeeMaker} from "./models/coffee-makers/abs.coffee-maker";

const makers = [
    new AmericanoCoffeeMaker(),
    new CappuccinoCoffeeMaker(),
    new SingletonCoffeeMaker(),
];

makeCoffee(makers);

async function makeCoffee(makers: CoffeeMaker[]) {
    let maker: CoffeeMaker|undefined;
    while (!!(maker = makers.shift())) {
        const cupOfCoffee = await maker.brew();
        console.log(cupOfCoffee.toString());
    }
}