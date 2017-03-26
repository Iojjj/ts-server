import {InjectPropertyMetadata} from "../../metadata/inject-property-metadata.bean";
import {Provider} from "../../../models/abs.provider";
import {ProvidersInjector} from "./abs.providers-injector";

export class ScopeInjector extends ProvidersInjector<Provider<any>> {

    public static newInstance(): ScopeInjector {
        return new ScopeInjector();
    }

    private constructor() {
        super();
    }

    public inject(metadata: InjectPropertyMetadata): any {
        const provider = this.getProvider(metadata);
        if (!provider) {
            console.log(metadata);
            console.log(this);
            return ScopeInjector.onNoProviderFound(metadata);
        }
        if (metadata.type === Provider) {
            return provider;
        }
        return provider.get();
    }
}