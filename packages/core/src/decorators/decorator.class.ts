import {AbstractDecoratorService} from "./decorator.service";
import {ControllerMetadataImpl, ControllerMetadata} from "./controller.metadata";
import {HttpMethodMetadataImpl} from "./http-method.metadata";
import {KEY_HTTP_METHOD} from "./decorator.constants";
import {DecoratorFactory} from "./decorator.factory";

/**
 * Service that helps to decorate classes.
 */
export interface ClassDecoratorService<T, O> {

    /**
     * Define metadata for class.
     * @param target target class
     * @param object metadata object
     */
    define(target: T, object: O): void;

    /**
     * Get metadata from class.
     * @param target target class
     * @return {O|undefined} metadata object
     */
    get(target: T): O | undefined;
}

/**
 * Implementation of class decorator service.
 */
export class ClassDecoratorServiceImpl<T, O> extends AbstractDecoratorService implements ClassDecoratorService<T, O> {

    public define(target: T, object: O): void {
        Reflect.defineMetadata(this.metadataKey, object, target)
    }

    public get(target: T): O {
        return Reflect.getMetadata(this.metadataKey, target);
    }
}

/**
 * Implementation of controller decorator service.
 */
export class ControllerDecoratorService extends ClassDecoratorServiceImpl<Function, ControllerMetadata> {

    public define(target: Function, object: ControllerMetadataImpl): void {
        this.findDefinedHttpMethods(target, object);
        super.define(target, object);
    }

    /**
     * Find all registered controller's actions.
     * @param target target class
     * @param controllerMetadata controller's metadata object
     */
    private findDefinedHttpMethods(target: Function, controllerMetadata: ControllerMetadata) {
        Object
            .getOwnPropertyNames(target.prototype)
            .map(key => [key, Reflect.getMetadataKeys(target.prototype, key)])
            .map((map: [string, string[]]) => {
                const [key, metadataKeys] = map;
                return metadataKeys
                    .filter(metadataKey => metadataKey.startsWith(KEY_HTTP_METHOD))
                    .map(metadataKey => [key, metadataKey]);
            })
            .reduce((all, single) => all.concat(single), [])
            .map((map: [string, string]) => ControllerDecoratorService.findDefinedHttpMethod(map, target))
            .forEach(metadata => controllerMetadata.httpMethods.push(metadata));
    }

    /**
     * Find single registered controller's action.
     * @param map tuple that holds method name and metadata key
     * @param target target class
     * @return {HttpMethodMetadata} metadata of controller's action
     */
    private static findDefinedHttpMethod(map: [string, string], target: Function) {
        const authReqService = DecoratorFactory.newAuthRequiredDecoratorService();
        const responseService = DecoratorFactory.newResponseTypeDecoratorService();
        const [methodName, metadataKey] = map;
        const proto = target.prototype;
        const httpMetadata = Reflect.getMetadata(metadataKey, proto, methodName) as HttpMethodMetadataImpl;
        const auth = authReqService.get(proto, methodName);
        const responseType = responseService.get(proto, methodName);
        httpMetadata.authorizationRequired = auth === "required";
        httpMetadata.responseType = responseType || "raw";
        return httpMetadata;
    }
}