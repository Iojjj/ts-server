import {ClassDecoratorService, ControllerDecoratorService, ClassDecoratorServiceImpl} from "./decorator.class";
import {ControllerMetadata} from "./controller.metadata";
import {
    ParameterDecoratorService,
    InjectableParameterDecoratorService,
    RequiredParameterDecoratorService
} from "./decorator.parameter";
import {ParamMetadata} from "./param.metadata";
import {
    HttpMethodDecoratorService,
    MethodDecoratorService,
    ResponseTypeDecoratorService,
    AuthRequiredDecoratorService
} from "./decorator.method";
import {HttpMethodMetadata} from "./http-method.metadata";
import {ResponseType} from "../server.types";
import {
    KEY_SERVER,
    KEY_CONTROLLER,
    KEY_PARAM_FORMAT,
    KEY_PARAM_REQUIRED_FORMAT,
    KEY_HTTP_METHOD_FORMAT,
    KEY_HTTP_RESPONSE,
    KEY_HTTP_AUTHORIZATION_REQUIRED
} from "./decorator.constants";
import {ServerDecoratorOptions} from "./server.decorator";

/**
 * Factory that constructs instances of decorator services for classes, methods and parameters.
 */
export class DecoratorFactory {

    // noinspection JSUnusedLocalSymbols
    private constructor() {

    }

    /**
     * Create a new instance of decorator service for <code>@Service</code> decorator.
     * @return {ClassDecoratorService<Object, ServerDecoratorOptions>} instance of decorator service
     */
    public static newServerDecoratorService(): ClassDecoratorService<Object, ServerDecoratorOptions> {
        return new ClassDecoratorServiceImpl<Object, ServerDecoratorOptions>(KEY_SERVER);
    }

    /**
     * Create a new instance of decorator service for <code>@Controller</code> decorator.
     * @return {ClassDecoratorService<Function, ControllerMetadata>} instance of decorator service
     */
    public static newControllerDecoratorService(): ClassDecoratorService<Function, ControllerMetadata> {
        return new ControllerDecoratorService(KEY_CONTROLLER);
    }

    /**
     * Create a new instance of decorator service for <code>@Req, @Res, @Body, etc</code> decorators.
     * @return {ParameterDecoratorService<Object, ParamMetadata>} instance of decorator service
     */
    public static newParameterDecoratorService(): ParameterDecoratorService<Object, ParamMetadata> {
        return new InjectableParameterDecoratorService(KEY_PARAM_FORMAT);
    }

    /**
     * Create a new instance of decorator service for <code>@Required</code> decorator.
     * @return {ParameterDecoratorService<Object, string>} instance of decorator service
     */
    public static newRequiredParameterDecoratorService(): ParameterDecoratorService<Object, string> {
        return new RequiredParameterDecoratorService(KEY_PARAM_REQUIRED_FORMAT);
    }

    /**
     * Create a new instance of decorator service for <code>@HttpGet, @HttpPost, etc</code> decorators.
     * @return {MethodDecoratorService<PropertyDescriptor, Object, HttpMethodMetadata>} instance of decorator service
     */
    public static newHttpMethodDecoratorService(): MethodDecoratorService<PropertyDescriptor, Object, HttpMethodMetadata> {
        return new HttpMethodDecoratorService(KEY_HTTP_METHOD_FORMAT);
    }

    /**
     * Create a new instance of decorator service for <code>@JsonResponse, @RawResponse and @JsonPResponse</code> decorators.
     * @return {MethodDecoratorService<void, Object, ResponseType>} instance of decorator service
     */
    public static newResponseTypeDecoratorService(): MethodDecoratorService<void, Object, ResponseType> {
        return new ResponseTypeDecoratorService(KEY_HTTP_RESPONSE);
    }

    /**
     * Create a new instance of decorator service for <code>@AuthorizationRequired</code> decorator.
     * @return {MethodDecoratorService<void, Object, string>} instance of decorator service
     */
    public static newAuthRequiredDecoratorService(): MethodDecoratorService<void, Object, string> {
        return new AuthRequiredDecoratorService(KEY_HTTP_AUTHORIZATION_REQUIRED);
    }
}