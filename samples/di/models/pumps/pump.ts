import {Coffee} from "../components/coffee";
import {Cup} from "../cup";

export abstract class Pump {

    public abstract pumpCoffee(coffee: Coffee): Promise<Cup>;
}