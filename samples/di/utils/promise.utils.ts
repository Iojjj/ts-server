export abstract class PromiseUtils {

    public abstract wait(timeout: number): Promise<void>;
}