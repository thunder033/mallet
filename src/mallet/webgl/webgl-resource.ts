
export interface IWebGLResourceCtor<Resource extends IWebGLResource, Options> {
    new(context: WebGLRenderingContext, options: Options): Resource;
}

export interface IWebGLResource {
    release?(): void;
}

export abstract class WebGLResource implements IWebGLResource {
    public release(): void {
        // no-op
    }
}
