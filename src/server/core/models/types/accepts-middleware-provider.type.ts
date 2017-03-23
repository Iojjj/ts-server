import {AcceptsMiddleware} from "../base/abs.accepts.middleware";

export type AcceptsMiddlewareProvider = (values: string[]) => AcceptsMiddleware;