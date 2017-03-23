export class MethodType {

    public static readonly DELETE = new MethodType("DELETE");
    public static readonly GET = new MethodType("GET");
    public static readonly HEAD = new MethodType("HEAD");
    public static readonly OPTIONS = new MethodType("OPTIONS");
    public static readonly PATCH = new MethodType("PATCH");
    public static readonly POST = new MethodType("POST");
    public static readonly PUT = new MethodType("PUT");

    private readonly name: string;

    public static of(name: string): MethodType {
        return new MethodType(name);
    }

    private constructor(name: string) {
        this.name = name;
    }

    public toString(): string {
        return this.name;
    }
}