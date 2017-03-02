export interface Heater {
    on(): void;
}

export class ElectricHeater implements Heater {

    public on(): void {
        console.log("~ ~ ~ electric heating ~ ~ ~");
    }
}

export class GasHeater implements Heater {

    public on(): void {
        console.log("~ ~ ~ gas heating ~ ~ ~");
    }
}