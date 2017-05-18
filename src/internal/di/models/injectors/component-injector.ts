import {Injector} from "./abs.injector";
import {ModuleInjectorsFactory} from "./factory.module-injectors";
import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";

export class ComponentInjector extends Injector {

    private readonly injectors: Injector[];

    public static newInstance(targetName: string, modules: Function[]): Injector {
        return new ComponentInjector(targetName, modules);
    }

    private constructor(targetName: string, modules: Function[]) {
        super();
        this.injectors = modules.map(m => ModuleInjectorsFactory.get().getInjectorForModule(targetName, m));
    }

    public canInject(metadata: InjectPropertyMetadata): boolean {
        return !!this.getInjector(metadata);
    }

    public inject(metadata: InjectPropertyMetadata): any {
        const injector = this.getInjector(metadata);
        if (!injector) {
            return ComponentInjector.onNoProviderFound(metadata);
        }
        return injector.inject(metadata);
    }

    private getInjector(metadata: InjectPropertyMetadata): Injector | undefined {
        return this.injectors.find(inj => inj.canInject(metadata));
    }
}