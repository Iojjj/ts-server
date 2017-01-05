import * as util from "util";

export const KEY_FORMAT = "__metadata_%s__";
export const KEY_PARAM = "__metadata_param_";
export const KEY_PARAM_REQUIRED_FORMAT = "__metadata_required_%s_%d__";
export const KEY_HTTP_METHOD = "__metadata_http_method_";
export const KEY_HTTP_RESPONSE = "__metadata_http_response__";
export const KEY_HTTP_AUTHORIZATION_REQUIRED = "__metadata_http_auth_required__";
export const KEY_SERVER = util.format(KEY_FORMAT, "server");
export const KEY_CONTROLLER = util.format(KEY_FORMAT, "controller");
export const KEY_HTTP_METHOD_FORMAT = util.format(KEY_FORMAT, "http_method_%s_%s");
export const KEY_PARAM_FORMAT = util.format(KEY_FORMAT, "param_%s_%d");