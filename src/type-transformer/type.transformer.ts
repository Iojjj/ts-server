import util = require("util");
import "reflect-metadata";
import {TransformMetadata} from "./transform.metadata";

export class TypeTransformer {

    /**
     * Transform object to proper type.
     * @param plainObject any plain object
     * @param type type to transform
     * @param nullValue value that would be returned if plainObject is null
     * @param undefinedValue value that would be returned if plainObject is undefined
     * @return {T} transformed object
     */
    public transform<T>(plainObject: any, type: Function,
                        nullValue?: T|null|undefined,
                        undefinedValue?: T|null|undefined): T {
        if (util.isArray(plainObject)) {
            throw new Error("Array passed. Use TypeTransformer.transformArray instead.");
        }
        if (type === String) {
            return (this.toString(plainObject, nullValue, undefinedValue) as any) as T;
        }
        if (type === Number) {
            return (this.toNumber(plainObject, nullValue, undefinedValue) as any) as T;
        }
        if (type === Boolean) {
            return (this.toBoolean(plainObject, nullValue, undefinedValue) as any) as T;
        }
        if (type === Date) {
            return (this.toDate(plainObject, nullValue, undefinedValue) as any) as T;
        }
        return this.toAnyType(plainObject, type, nullValue, undefinedValue);
    }

    public transformArray<T>(array: any[],
                             type: Function,
                             nullValue?: T|null|undefined,
                             undefinedValue?: T|null|undefined): T[] {
        if (util.isNull(array) || util.isUndefined(array)) {
            return array;
        }
        return array.map(item => this.transform(item, type, nullValue, undefinedValue));
    }

    public transformMap<K, V>(map: Map<any, any>,
                             keyType: Function,
                             valueType: Function,
                             nullValue?: V|null|undefined,
                             undefinedValue?: V|null|undefined): Map<K, V> {
        if (util.isNull(map) || util.isUndefined(map)) {
            return map;
        }
        const newMap: Map<K, V> = new Map();
        map.forEach((val, key) => {
            const newKey = this.transform<K>(key, keyType);
            const newVal = this.transform<V>(val, valueType, nullValue, undefinedValue);
            newMap.set(newKey, newVal);
        });
        return newMap;
    }

    /**
     * Transform object to number.
     * @param plainObject some object
     * @param nullValue value that would be returned if plainObject is null
     * @param undefinedValue value that would be returned if plainObject is undefined
     * @return {Number | null | undefined} some number
     */
    private toNumber(plainObject: any, nullValue?: any, undefinedValue?: any): Number | null | undefined {
        if (util.isNull(plainObject)) {
            return nullValue !== undefined ? this.toNumber(nullValue) : null;
        }
        if (util.isUndefined(plainObject)) {
            return undefinedValue !== undefined ? this.toNumber(undefinedValue) : undefined;
        }
        if (util.isNumber(plainObject) && isNaN(plainObject)) {
            return NaN;
        }
        if (!util.isBuffer(plainObject)) {
            const num = Number(plainObject);
            if (!(isNaN(num) && plainObject !== "NaN")) {
                return num;
            }
        }
        return TypeTransformer.throwError(plainObject, Number.name);
    }

    /**
     * Transform object to string.
     * @param plainObject some object
     * @param nullValue value that would be returned if plainObject is null
     * @param undefinedValue value that would be returned if plainObject is undefined
     * @return {String | null | undefined} some string
     */
    private toString(plainObject: any, nullValue?: any, undefinedValue?: any): String | null | undefined {
        if (util.isNull(plainObject)) {
            return nullValue !== undefined ? this.toString(nullValue) : null;
        }
        if (util.isUndefined(plainObject)) {
            return undefinedValue !== undefined ? this.toString(undefinedValue) : undefined;
        }
        if (util.isBuffer(plainObject)) {
            return String(plainObject);
        }
        if (!(util.isObject(plainObject) || util.isFunction(plainObject) || util.isSymbol(plainObject))) {
            return String(plainObject);
        }
        return TypeTransformer.throwError(plainObject, String.name);
    }

    /**
     * Transform object to boolean. Numbers 1 and 0 treated like true and false respectively.
     * @param plainObject some object
     * @param nullValue value that would be returned if plainObject is null
     * @param undefinedValue value that would be returned if plainObject is undefined
     * @return {Boolean | null | undefined} true or false
     */
    private toBoolean(plainObject: any, nullValue?: any, undefinedValue?: any): Boolean | null | undefined {
        if (util.isNull(plainObject)) {
            return nullValue !== undefined ? this.toBoolean(nullValue) : null;
        }
        if (util.isUndefined(plainObject)) {
            return undefinedValue !== undefined ? this.toBoolean(undefinedValue) : undefined;
        }
        const str = String(plainObject);
        if (util.isBoolean(plainObject)) {
            return Boolean(plainObject);
        }
        if (str === "true" || str === "false") {
            return str === "true";
        }
        if (str === "1" || str === "0") {
            return str === "1";
        }
        return TypeTransformer.throwError(plainObject, Boolean.name);
    }

    /**
     * Transform object to Date.
     * @param plainObject some object
     * @param nullValue value that would be returned if plainObject is null
     * @param undefinedValue value that would be returned if plainObject is undefined
     * @return {Date | null | undefined} some date
     */
    private toDate(plainObject: any, nullValue?: any, undefinedValue?: any): Date | null | undefined {
        if (util.isNull(plainObject)) {
            return nullValue !== undefined ? this.toDate(nullValue) : null;
        }
        if (util.isUndefined(plainObject)) {
            return undefinedValue !== undefined ? this.toDate(undefinedValue) : undefined;
        }
        if (util.isDate(plainObject)) {
            return plainObject;
        }
        if (!(util.isBoolean(plainObject) || util.isBuffer(plainObject))) {
            if (util.isNumber(plainObject)) {
                return new Date(plainObject);
            }
            if (util.isString(plainObject)) {
                const ms = Date.parse(plainObject as string);
                if (!isNaN(ms)) {
                    return new Date(ms);
                }
            }
        }
        return TypeTransformer.throwError(plainObject, Date.name);
    }

    /**
     * Transform object to any other type.
     * @param plainObject some object
     * @param type type to transform
     * @param nullValue value that would be returned if plainObject is null
     * @param undefinedValue value that would be returned if plainObject is undefined
     * @return {any} some object
     */
    private toAnyType(plainObject: any, type: Function, nullValue?: any, undefinedValue?: any): any {
        if (!type.constructor.name) {
            throw new Error(`Possibly transforming "${plainObject}" to anonymous function ${type}?`);
        }
        if (util.isNull(plainObject)) {
            return nullValue !== undefined ? this.toAnyType(nullValue, type) : null;
        }
        if (util.isUndefined(plainObject)) {
            return undefinedValue !== undefined ? this.toAnyType(undefinedValue, type) : undefined;
        }
        if (util.isString(plainObject)) {
            return this.fromJson(plainObject, type);
        }
        if (!(util.isBuffer(plainObject) || util.isBoolean(plainObject) || util.isNumber(plainObject) ||
            util.isSymbol(plainObject) || util.isDate(plainObject))) {
            if (util.isObject(plainObject)) {
                if (plainObject instanceof type) {
                    return plainObject;
                }
                return this.fromObject(plainObject, type);
            }
        }
        if (type === Buffer) {
            const val = String(plainObject);
            return new Buffer(val);
        }
        if (type === Symbol) {
            const val = String(plainObject);
            return Symbol(val);
        }
        return TypeTransformer.throwError(plainObject, type.constructor.name);
    }

    /**
     * Parse from JSON string.
     * @param plainObject some object
     * @param type type to transform
     * @return {any} object
     */
    private fromJson(plainObject: any, type: Function): any {
        try {
            const parsed = JSON.parse(plainObject);
            return this.fromObject(parsed, type);
        } catch (error) {
            throw new Error(`"${plainObject}" is a string, but not a valid JSON.`);
        }
    }

    /**
     * Parse from object.
     * @param plainObject some object
     * @param type type to transform
     * @return {any} object
     */
    private fromObject(plainObject: Object, type: Function): any {
        const keys = TypeTransformer.getKeys(plainObject);
        const obj = new (type as any)();
        keys.forEach(key => {
            const value = TypeTransformer.getValue(plainObject, key);
            const returnType = Reflect.getMetadata("design:type", type.prototype, key);
            const metadata: TransformMetadata = Reflect.getMetadata(`__metadata_transform_${key}__`, type, key);
            if (!returnType || !metadata) {
                obj[key] = value;
            } else {
                if (value instanceof Map || returnType === Map) {
                    const keyType = metadata.type1 || new Function();
                    const valType = metadata.type2 || new Function();
                    obj[key] = this.transformMap(value, keyType, valType, metadata.nullValue, metadata.undefinedValue);
                } else if (util.isArray(value) || returnType === Array) {
                    const valType = metadata.type1 || new Function();
                    obj[key] = this.transformArray(value, valType, metadata.nullValue, metadata.undefinedValue);
                } else  {
                    obj[key] = this.transform(value, returnType, metadata.nullValue, metadata.undefinedValue);
                }
            }
        });
        return obj;
    }

    /**
     * Get keys from object
     * @param plainObject some object
     * @return {string[]} array of keys
     */
    private static getKeys(plainObject: Map<any, any>|Object): string[] {
        if (plainObject instanceof Map) {
            return Array.from(plainObject.keys());
        }
        return Object.keys(plainObject);
    }

    /**
     * Get value from object by it's key.
     * @param plainObject some object
     * @param key some key
     * @return {any} some value
     */
    private static getValue(plainObject: Map<any, any>|Object, key: string): any {
        if (plainObject instanceof Map) {
            return plainObject.get(key);
        }
        return (plainObject as any)[key];
    }

    /**
     * Throw an error.
     * @param plainObject some object
     * @param type type to transform
     */
    private static throwError(plainObject: any, type: string): never {
        throw new Error(`"${plainObject}" is not a valid ${type}.`);
    }
}