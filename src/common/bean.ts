import {BeanBuilder} from "./bean.builder";

/**
 * Base bean model. Successors must treat themselves as immutable classes.
 * Any modifications to class instance must be done through the builder that should return a new instance of the class.
 */
export abstract class Bean<B extends BeanBuilder<B, Bean<B>>> {

    constructor(builder: B) {
    }

    /**
     * Create a new builder that is filled with values from bean instance.
     */
    public abstract newBuilder(): B;
}