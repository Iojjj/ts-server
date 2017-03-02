import {HttpMethodMetadata} from "../http-method/http-method.metadata";
import {DecoratorFactory} from "./decorator.factory";
import {ControllerMetadata} from "../controller/controller.metadata";
import {KEY_HTTP_METHOD} from "../../../../decorators/src/decorator.constants";
import {ClassDecoratorServiceImpl} from "./class.decorator-service";
/**
 * Implementation of controller decorator service.
 */
export class ControllerDecoratorService extends ClassDecoratorServiceImpl<Function, ControllerMetadata> {

    public define(target: Function, object: ControllerMetadata): void {
        const metadata = Reflect.getMetadata(this.metadataKey, target) as ControllerMetadata;
        if (metadata) {
            throw new Error(`${object.targetName}: multiple @Controller decorators are not allowed`);
        }
        object = this.findDefinedHttpMethods(target, object);
        super.define(target, object);
    }

    /**
     * Find all registered controller's actions.
     * @param target target class
     * @param controllerMetadata controller's metadata object
     */
    private findDefinedHttpMethods(target: Function, controllerMetadata: ControllerMetadata) {
        const proto = target.prototype;
        const httpMethods = Object
            .getOwnPropertyNames(proto)
            .map(key => [key, Reflect.getMetadataKeys(proto, key)])
            .map((map: [string, string[]]) => {
                const [key, metadataKeys] = map;
                return metadataKeys
                    .filter(metadataKey => metadataKey.startsWith(KEY_HTTP_METHOD))
                    .map(metadataKey => [key, metadataKey]);
            })
            .reduce((all, single) => all.concat(single), [])
            .map((map: [string, string]) => ControllerDecoratorService
                .findDefinedHttpMethod(map, target, controllerMetadata));
        return controllerMetadata.newBuilder()
            .setHttpMethods(httpMethods)
            .build();
    }

    /**
     * Find single registered controller's action.
     * @param map tuple that holds method name and metadata key
     * @param target target class
     * @param controllerMetadata metadata of controller
     * @return {HttpMethodMetadata} metadata of controller's action
     */
    private static findDefinedHttpMethod(map: [string, string], target: Function,
                                         controllerMetadata: ControllerMetadata): HttpMethodMetadata {
        const authReqService = DecoratorFactory.newAuthRequiredDecoratorService();
        const responseService = DecoratorFactory.newResponseTypeDecoratorService();
        const [methodName, metadataKey] = map;
        const proto = target.prototype;
        const httpMetadata = Reflect.getMetadata(metadataKey, proto, methodName) as HttpMethodMetadata;
        const auth = authReqService.get(proto, methodName);
        const responseType = responseService.get(proto, methodName);
        return httpMetadata.newBuilder()
            .setAuthorizationRequired(!!auth && auth.required)
            .setResponseType(!!responseType ? responseType.responseType : controllerMetadata.defaultResponseType)
            .build();
    }
}