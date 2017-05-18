import {Constants} from "../../constants";
import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";
import {ModuleMetadata} from "../../metadata/module-metadata.bean";
import {ProvidesMetadata} from "../../metadata/provides-metadata.bean";
import {AnyProvider} from "../any.provider.impl";
import {Injector} from "./abs.injector";
import {ScopeInjector} from "./scope-injector";

export class ModuleInjector extends Injector {

    private readonly scopes: Map<symbol, ScopeInjector>;

    public static newInstance(metadata: ModuleMetadata): ModuleInjector {
        return new ModuleInjector(metadata);
    }

    private constructor(metadata: ModuleMetadata) {
        super();
        this.scopes = new Map();
        metadata.providers.forEach(p => this.registerProvider(p));
    }

    private registerProvider(p: ProvidesMetadata): void {
        if (!p.method) {
            throw new Error(`${p.targetName}.${p.methodName}: method is not defined.`);
        }
        let scope = this.scopes.get(p.scope);
        if (!scope) {
            scope = ScopeInjector.newInstance();
            this.scopes.set(p.scope, scope);
        }
        const provider = AnyProvider.from(p.method, p.scope !== Constants.LOCAL_SCOPE);
        if (!!p.qualifier) {
            scope.registerProviderByQualifier(p, provider);
        } else {
            scope.registerProviderByType(p, provider);
        }
    }

    public canInject(metadata: InjectPropertyMetadata): boolean {
        const scope = this.findScope(metadata);
        return !!scope;
    }

    public inject(metadata: InjectPropertyMetadata): any {
        const scope = this.findScope(metadata);
        if (!scope) {
            return ModuleInjector.onNoProviderFound(metadata);
        }
        return scope.inject(metadata);
    }

    private getScopes(scope: symbol): ScopeInjector[] {
        let scopes: ScopeInjector[] = [];
        scopes.push(this.scopes.get(scope) as ScopeInjector);
        scopes.push(this.scopes.get(Constants.SINGLETON_SCOPE) as ScopeInjector);
        scopes.push(this.scopes.get(Constants.LOCAL_SCOPE) as ScopeInjector);
        return scopes.filter(p => !!p);
    }

    private findScope(metadata: InjectPropertyMetadata): ScopeInjector | undefined {
        const scopes = this.getScopes(metadata.scope);
        return scopes.find(s => s.canInject(metadata));
    }
}