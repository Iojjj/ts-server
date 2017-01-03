export interface Options {

    readonly controllers?: { [version: string]: string[] }[];
    readonly middlewares?: { [version: string]: string[] }[];
}