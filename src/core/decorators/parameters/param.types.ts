/**
 * Injectable parameter type.
 */
export type ParamType = "req" | "res" | "custom";

export class Parameter {

    public static readonly REQUEST = new Parameter("req", "req");
    public static readonly RESPONSE = new Parameter("res", "res");

    private _container: string;
    private _type: ParamType;

    public static create(container: string) {
        return new Parameter("custom", container);
    }

    private constructor(type: ParamType, container: string) {
        this._type = type;
        this._container = container;
    }

    public get type(): ParamType {
        return this._type;
    }

    public get container(): string {
        return this._container;
    }
}