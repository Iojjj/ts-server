export class Constants {

    private static readonly INJECTOR_NAME = "rose";

    public static readonly METADATA_MODULE = `${Constants.INJECTOR_NAME}:module`;
    public static readonly METADATA_MODULE_PROVIDES = `${Constants.METADATA_MODULE}:provides`;
    public static readonly METADATA_PARAMETER = `${Constants.INJECTOR_NAME}:parameter`;
    public static readonly METADATA_PROPERTY = `${Constants.INJECTOR_NAME}:property:`;
    public static readonly CONSTRUCTOR = "constructor";
    public static readonly PROPERTY_INJECTOR = `__injector__`;

    private constructor() {

    }
}