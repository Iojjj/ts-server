export class ResponseType {

    public static readonly ANY = new ResponseType("*");
    public static readonly RAW = new ResponseType("raw");
    public static readonly JSON = new ResponseType("json");

    private readonly _type: string;

    private constructor(type: string) {
        this._type = type;
    }

    public get type(): string {
        return this._type;
    }

    public static custom(type: string): ResponseType {
        return new ResponseType(type);
    }
}