import {Water} from "../components/water";
export abstract class Heater {

    public abstract on(water: Water): Promise<Water>;
    public abstract off(): Promise<void>;
}