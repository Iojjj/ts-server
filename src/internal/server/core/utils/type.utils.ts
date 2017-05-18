/**
 * @internal
 */
export abstract class TypeUtils {

    public abstract isPromiseLike(val: any): val is Promise<any>;

    public abstract asPromise(val: any): Promise<any>;
}