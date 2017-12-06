
import {Logger} from '../lib/logger';
import {IRenderTarget} from '../render-target.factory';

export interface IWebGLResourceContext {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    logger: Logger;
    transformBuffer: ArrayBuffer;
    renderTarget: IRenderTarget;
}

export interface IWebGLResourceCtor<Resource extends IWebGLResource, Options> {
    new(context: IWebGLResourceContext, options: Options): Resource;
}

type ClassMethod<T, R> =  {[M in keyof T]: (context: IWebGLResourceContext) => R};

export interface IWebGLResource {
    release(): void;
    init(resourceCache: {[name: string]: IWebGLResource}): void;
}

export abstract class WebGLResource implements IWebGLResource {
    constructor(protected context: IWebGLResourceContext) {
    }
    public abstract release(): void;

    public init(resourceCache: {[name: string]: IWebGLResource}): void {
        // no-op
    }

    // protected contextExecute<T extends WebGLResource>(method: keyof T): any {
    //     return this[method as string](this.context);
    // }
}
