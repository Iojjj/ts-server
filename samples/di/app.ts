import {CoffeeMaker2} from "./cofee-maker2";

const maker1 = new CoffeeMaker2();
console.log(maker1);
maker1.brew3.call(maker1);
