import {C4} from "./inheritence";
import {C5} from "./inheritance.c4";
import {CoffeeMaker} from "./coffee-maker";

const coffeeMaker = new CoffeeMaker();
coffeeMaker.brew();

const c4 = new C4();
console.log(c4.s1);
console.log(c4.s2);
console.log(c4.s3);
console.log(c4.s4);

const c5 = new C5();
console.log(c5.c2Provider);
for (let i = 0; i < 10; i++) {
    console.log(c5.c2Provider.get().counter);
}