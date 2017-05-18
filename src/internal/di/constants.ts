export class Constants {

    public static SINGLETON_SCOPE = Symbol.for("__singleton__");
    public static LOCAL_SCOPE = Symbol.for("__local__");

    //noinspection JSUnusedLocalSymbols
    private constructor() {

    }
}