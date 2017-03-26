import {WaterType} from "./water-type";

export class Water {

    private type: WaterType;
    private litters: number;

    constructor(type: WaterType, litters: number) {
        this.type = type;
        this.litters = litters;
    }

    public heatRequired(): boolean {
        return this.type !== WaterType.HOT;
    }

    public makeHot(): void {
        this.type = WaterType.HOT;
    }

    public makeCold(): void {
        this.type = WaterType.COLD;
    }

    public consume(litters: number): void {
        if (litters <= 0) {
            throw new Error(`Invalid number of litters: ${litters}.`);
        }
        if (this.litters < litters) {
            throw new Error(`Not enough water: requested ${litters} l but only ${this.litters} l available.`);
        }
        this.litters -= litters;
    }
}