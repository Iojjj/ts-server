import {HttpMethodMetadata} from "./http-method.metadata";
import {RouteType} from "./http-method.decorators";
export interface ControllerMetadata {
    readonly route: RouteType;
    readonly actions: HttpMethodMetadata[];
    readonly prefix: string;
    readonly version: string;
}

export class ControllerMetadataBuilder {

    private _route: string | RegExp|undefined;
    private _version: string;
    private _prefix: string;
    private _actions: HttpMethodMetadata[];

    constructor() {
        this._actions = [];
    }

    public get route(): string|RegExp|undefined {
        return this._route;
    }

    public get actions(): HttpMethodMetadata[] {
        return this._actions;
    }

    public get version(): string {
        return this._version;
    }

    public get prefix(): string {
        return this._prefix;
    }

    public setRoute(route: string | RegExp|undefined): ControllerMetadataBuilder {
        this._route = route;
        return this;
    }

    public setVersion(version: string): ControllerMetadataBuilder {
        this._version = version;
        return this;
    }

    public setPrefix(prefix: string): ControllerMetadataBuilder {
        this._prefix = prefix;
        return this;
    }

    public addAction(action: HttpMethodMetadata): ControllerMetadataBuilder {
        this._actions.push(action);
        return this;
    }

    public build(): ControllerMetadata {
        if (this._route) {
            const str = this._route.toString();
            if (!str.startsWith("/")) {
                if (this._route instanceof RegExp) {
                    this._route = new RegExp(`/${this._route}`);
                } else {
                    this._route = `/${this._route}`;
                }
            }
        }
        return new ControllerMetadataImpl(this);
    }
}

class ControllerMetadataImpl implements ControllerMetadata {

    readonly route: RouteType;
    readonly actions: HttpMethodMetadata[] = [];
    readonly prefix: string;
    readonly version: string;

    constructor(builder: ControllerMetadataBuilder) {
        this.route = builder.route || "";
        this.actions = builder.actions;
        this.prefix = builder.prefix;
        this.version = builder.version;
    }
}