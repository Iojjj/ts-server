import util = require("util");
export class ClassTransformer {

    public transform(plainObject: any, type: Function, nullValue?: any, undefinedValue?: any): any {
        if (util.isArray(plainObject)) {
            throw new Error("");
        }
        if (type === String) {
            return this.toString(plainObject, nullValue, undefinedValue);
        }
        if (type === Number) {
            return this.toNumber(plainObject, nullValue, undefinedValue);
        }
        if (type === Boolean) {
            return this.toBoolean(plainObject, nullValue, undefinedValue);
        }
        throw new Error(`Can't transform "${plainObject}" to unknown type "${type}."`);
    }

    private toNumber(plainObject: any, nullValue?: any, undefinedValue?: any): Number | null | undefined {
        if (util.isNull(plainObject)) {
            if (nullValue !== undefined) {
                return this.toNumber(nullValue);
            }
            throw new Error(`"${plainObject}" is not a valid Number.`);
        }
        if (util.isUndefined(plainObject)) {
            if (undefinedValue !== undefined) {
                return this.toNumber(undefinedValue);
            }
            throw new Error(`"${plainObject}" is not a valid Number.`);
        }
        if (util.isNumber(plainObject) && isNaN(plainObject)) {
            return NaN;
        }
        if (util.isBuffer(plainObject)) {
            throw new Error(`"${plainObject}" is not a valid Number.`);
        }
        const number = Number(plainObject);
        if (isNaN(number) && plainObject !== "NaN") {
            throw new Error(`"${plainObject}" is not a valid Number.`);
        }
        return number;
    }

    private toString(plainObject: any, nullValue?: any, undefinedValue?: any): String | null | undefined {
        if (util.isNull(plainObject)) {
            return nullValue !== undefined ? this.toString(nullValue) : null;
        }
        if (util.isUndefined(plainObject)) {
            return undefinedValue !== undefined ? this.toString(undefinedValue) : undefined;
        }
        if (!util.isBuffer(plainObject)) {
            if (util.isObject(plainObject) || util.isFunction(plainObject) || util.isSymbol(plainObject)) {
                throw new Error(`"${String(plainObject)}" is not a valid String.`);
            }
        }
        return String(plainObject);
    }

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
        if (str === "true" || str === "false" || str === "undefined") {
            return str === "true";
        }
        if (str === "1" || str === "0") {
            return str === "1";
        }
        throw new Error(`"${plainObject}" is not a valid Boolean.`);
    }
}