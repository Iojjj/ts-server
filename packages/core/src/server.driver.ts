import {ServerDecoratorOptions} from "./decorators/server.decorator";
import {ControllerMetadata} from "./decorators/controller.metadata";
import {ParamType} from "./decorators/param.type";
export interface Driver<A, Rq> {

    readonly application: A;

    configureApp(options: ServerDecoratorOptions, controllers: ControllerMetadata[]): void;

    getArgument(req: Rq, paramType: ParamType, paramName: string): any;

    start(port?: number, hostname?: string, callback?: (port: number, hostname: string) => void): void;
}