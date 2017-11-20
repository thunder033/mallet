export interface IWebGLResourceCtor<Resource extends IWebGLResource, Options> {
    new (context: WebGLRenderingContext, options: Options): Resource;
}
export interface IWebGLResource {
    release?(): void;
}
export declare abstract class WebGLResource implements IWebGLResource {
    release(): void;
}
