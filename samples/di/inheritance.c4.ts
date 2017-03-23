import {Component} from "../../src/di/decorators/class.component.decorator";
import {Inject} from "../../src/di/decorators/prop.inject.decorator";
import {C4, C2} from "./inheritence";
import {M4} from "./inheritance.m4";
import {Provider} from "../../src/di/models/abs.provider";
import {Named} from "../../src/di/decorators/prop.named.decorator";

@Component(M4)
export class C5 {

    @Inject()
    private _c4: C4;

    @Inject() @Named(C2)
    private _c2Provider: Provider<C2>;

    public get c4(): C4 {
        return this._c4;
    }

    public get c2Provider() {
        return this._c2Provider;
    }
}