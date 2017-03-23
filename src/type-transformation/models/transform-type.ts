import {CreatableType} from "../../decorator-utils/types/creatable.type";

export class TransformType<T> {

    public static readonly NUMBER = new TransformType(Number, 0);
    public static readonly STRING = new TransformType(String, "");
    public static readonly DATE = new TransformType(Date, new Date(0));
    public static readonly BOOLEAN = new TransformType(Boolean, false);
    public static readonly SYMBOL = new TransformType(Symbol, Symbol());
    public static readonly BUFFER = new TransformType(Buffer, new Buffer(0));

    private _baseType: CreatableType;
    private _defaultValue: T;
    private _parameters: TransformType<any>[];

    private constructor(baseType: CreatableType,
                        defaultValue: T,
                        parameters: TransformType<any>[] = []) {
        this._baseType = baseType;
        this._parameters = parameters;
        this._defaultValue = defaultValue;
    }

    public get baseType(): CreatableType {
        return this._baseType;
    }

    public get parameters(): TransformType<any>[] {
        return this._parameters;
    }

    public get defaultValue(): T {
        return this._defaultValue;
    }

    public static of<T>(type: CreatableType, defaultValue: T): TransformType<T>;
    public static of<T>(type: CreatableType, defaultValue: T,
                        ...parameters: TransformType<any>[]): TransformType<T>;
    public static of<T>(type: CreatableType, defaultValue: T,
                        ...parameters: TransformType<any>[]): TransformType<T> {
        return new TransformType(type, defaultValue, parameters);
    }

    public static getType(type: CreatableType): TransformType<any> {
        switch (type) {
            case Number:
                return TransformType.NUMBER;
            case String:
                return TransformType.STRING;
            case Date:
                return TransformType.DATE;
            case Boolean:
                return TransformType.BOOLEAN;
            case Symbol:
                return TransformType.SYMBOL;
            case Buffer:
                return TransformType.BUFFER;
            default:
                return TransformType.of(type, undefined);
        }
    }

    public static array(type: CreatableType): TransformType<any> {
        return TransformType.of(Array, [], TransformType.getType(type));
    }

    public static set(type: CreatableType): TransformType<any> {
        return TransformType.of(Set, new Set, TransformType.getType(type));
    }

    public static map(keyType: CreatableType, valueType: CreatableType): TransformType<any>;
    public static map(keyType: TransformType<any>, valueType: TransformType<any>): TransformType<any>;
    public static map(keyType: CreatableType | TransformType<any>,
                      valueType: CreatableType | TransformType<any>): TransformType<any> {
        if (keyType instanceof TransformType && valueType instanceof TransformType) {
            TransformType.of(Map, new Map, keyType, valueType);
        }
        return TransformType.of(Map, new Map,
            TransformType.getType(keyType as CreatableType),
            TransformType.getType(valueType as CreatableType));
    }
}