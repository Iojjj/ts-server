import {PromiseUtils} from "./promise.utils";

export class PromiseUtilsImpl implements PromiseUtils {

    public wait(timeout: number): Promise<void> {
        if (timeout <= 0) {
            return Promise.resolve();
        }
        return new Promise<void>(resolve => {
            setTimeout(resolve, timeout);
        });
    }
}