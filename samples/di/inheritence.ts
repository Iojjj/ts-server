import {Component} from "../../src/di/decorators/class.component.decorator";
import {Inject} from "../../src/di/decorators/prop.inject.decorator";
import {Named} from "../../src/di/decorators/prop.named.decorator";
import {M1, M2, M3} from "./inheritance.modules";

@Component(M1)
abstract class C1 {

    @Inject() @Named("s1")
    private _s1: string;

    public get s1(): string {
        return this._s1;
    }
}

@Component(M2)
export class C2 extends C1 {

    @Inject() @Named("s2")
    private _s2: string;

    public counter: number;

    constructor(counter = 0) {
        super();
        this.counter = counter;
    }

    public get s2(): string {
        return this._s2;
    }
}

@Component(M3)
abstract class C3 extends C2 {

    @Inject() @Named("s3")
    private _s3: string;

    public get s3(): string {
        return this._s3;
    }
}

export class C4 extends C3 {

    private _s4 = "s4";

    public get s4(): string {
        return this._s4;
    }
}
