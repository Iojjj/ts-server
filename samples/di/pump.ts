export interface Pump {
    pump(): void;
}

export class Siphon implements Pump {

    public pump(): void {
        console.log("=> => pumping (siphon) => =>");
    }

}

export class Thermosiphon implements Pump {

    public a: number;

    constructor() {
        console.log("new thermosiphon");
    }

    public pump(): void {
        console.log("=> => pumping (thermosiphon) => =>");
    }

}