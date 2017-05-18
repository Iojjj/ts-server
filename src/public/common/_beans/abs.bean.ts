import BeanBuilder from "./abs.bean.builder";

/**
 * Base bean model. Successors must treat themselves as immutable classes.
 * Any modifications to class instance must be done through the {@link BeanBuilder} that should return a new instance
 * of the class.
 */
abstract class Bean<B extends BeanBuilder<B, Bean<B>>> {

    //noinspection JSUnusedLocalSymbols
    constructor(builder: B) {
    }

    /**
     * Create a new builder that is filled with values from bean instance.
     */
    public abstract newBuilder(): B;
}

export default Bean;