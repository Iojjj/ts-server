import {Bean} from "./bean";

/**
 * Builder class that allows to create a new immutable instance of Bean class.
 */
export abstract class BeanBuilder<B extends BeanBuilder<B, M>, M extends Bean<B>> {

    constructor(model?: M) {

    }

    /**
     * Get "this" of builder instance. This method allows to create a builder chain with successors.
     */
    protected abstract getThis(): B;

    /**
     * Create a new immutable instance of Bean class.
     */
    public abstract build(): M;
}