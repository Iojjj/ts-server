import {Provider} from "../../models/abs.provider";

/**
 * Implementation of {@link Provider} that returns any object using provided factory method.
 * @internal
 */
export class AnyProvider extends Provider<any> {

    private method: Function;
    private isScopeVariable: boolean;
    private variable: any;

    public static from(method: Function, scopeVariable = false): AnyProvider {
        return new AnyProvider(method, scopeVariable);
    }

    private constructor(method: Function, scopeVariable: boolean) {
        super();
        this.method = method;
        this.isScopeVariable = scopeVariable;
    }

    public get(): any {
        if (this.isScopeVariable) {
            if (this.variable !== undefined) {
                return this.variable;
            }
            return this.variable = this.method();
        }
        return this.method();
    }
}