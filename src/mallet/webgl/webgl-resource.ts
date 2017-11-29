
import {Logger} from '../lib/logger';

export interface IWebGLStageContext {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    logger: Logger;
}

export interface IWebGLResourceCtor<Resource extends IWebGLResource, Options> {
    new(context: IWebGLStageContext, options: Options): Resource;
}

type ClassMethod<T, R> =  {[M in keyof T]: (context: IWebGLStageContext) => R};

export interface IWebGLResource {
    release(): void;
}

export abstract class WebGLResource implements IWebGLResource {
    constructor(protected context: IWebGLStageContext) {
    }
    public abstract release(): void;

    // protected contextExecute<T extends WebGLResource>(method: keyof T): any {
    //     return this[method as string](this.context);
    // }
}
