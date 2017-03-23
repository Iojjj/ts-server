import {Provider} from "../models/abs.provider";

/**
 * Implementation of {@link Provider} that returns any object using provided factory method.
 * @internal
 */
export class AnyProvider extends Provider<any> {

    private method: Function;

    public static from(method: Function): AnyProvider {
        return new AnyProvider(method);
    }

    private constructor(method: Function) {
        super();
        this.method = method;
    }

    public get(): any {
        return this.method();
    }
}