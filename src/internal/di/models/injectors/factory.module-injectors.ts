import {DecoratorUtils} from "../../../../public/di/utils/decorator.utils";
import {ModuleInjector} from "./module-injector";

export class ModuleInjectorsFactory {

    private static INSTANCE: ModuleInjectorsFactory;

    private readonly moduleInjectors: Map<Function, ModuleInjector>;

    public static get(): ModuleInjectorsFactory {
        if (!ModuleInjectorsFactory.INSTANCE) {
            ModuleInjectorsFactory.INSTANCE = new ModuleInjectorsFactory();
        }
        return ModuleInjectorsFactory.INSTANCE;
    }

    private constructor() {
        this.moduleInjectors = new Map();
    }

    public getInjectorForModule(targetName: string, module: Function): ModuleInjector {
        let injector = this.moduleInjectors.get(module);
        if (!injector) {
            const metadata = DecoratorUtils.getModuleMetadataOrThrow(targetName, module);
            injector = ModuleInjector.newInstance(metadata);
            this.moduleInjectors.set(module, injector);
        }
        return injector;
    }
}