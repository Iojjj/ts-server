/**
 * Decorator that tells server to render view with provided template name.
 * @param template template name
 * @return {(target:Object, methodName:string)}
 */
export function Render(template: string): Function {
    if (!template) {
        throw new Error("Template must be defined.");
    }
    return function (target: Object, methodName: string) {
        // TODO: finish
    }
}