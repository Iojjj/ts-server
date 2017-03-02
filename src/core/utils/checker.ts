export namespace Check {

    export function isPromise(type: any): boolean {
        return type && type.prototype && type.prototype.then && type.prototype.catch;
    }
}