import {ParameterMetadata} from "../../../../public/decorator-utils/metadata/abs.parameter-metadata.bean";
import {ResultSaver} from "../../../../public/server/core/models/types/result-saver";
import {InjectableMiddleware} from "./injectable.middleware";

/**
 * @internal
 */
export class InjectableMethodMiddleware extends InjectableMiddleware {

    private readonly _resultSaver: ResultSaver;

    public constructor(metadata: ParameterMetadata<any, any>,
                       object: any,
                       resultSaver: ResultSaver) {
        super(metadata, object);
        this._resultSaver = resultSaver;
    }

    protected run(...args: any[]): Promise<any> {
        return super.run(...args)
            .then((result: any) => {
                this._resultSaver(result, ...args);
            });
    }
}