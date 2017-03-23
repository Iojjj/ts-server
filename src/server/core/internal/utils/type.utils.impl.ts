import {TypeUtils} from "./type.utils";

/**
 * @internal
 */
export class TypeUtilsImpl implements TypeUtils {

    public isPromiseLike(val: any): val is Promise<any> {
        return !!val && val.hasOwnProperty("then") && val.hasOwnProperty("catch");
    }

    public asPromise(val: any): Promise<any> {
        let promise: Promise<any>;
        if (this.isPromiseLike(val)) {
            promise = val;
        } else {
            promise = Promise.resolve(val);
        }
        return promise;
    }
}