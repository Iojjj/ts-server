import {StaticType} from "./static.type";
import {Type} from "./type";

/**
 * Representation of types that could be created.
 */
export type CreatableType = Type<any> | StaticType<any>;