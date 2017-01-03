export type ParamType = "body" | "query" | "header" | "headers" | "file" | "files" | "param"
     | "session" | "cookie" | "cookies" | "req" | "res" | "next";

export const REQUIRED_PARAM_NAMES = ["query", "header", "file", "param"];