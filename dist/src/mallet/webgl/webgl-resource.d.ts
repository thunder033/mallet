import { Logger } from '../lib/logger';
export interface IWebGLStageContext {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    logger: Logger;
}
export interface IWebGLResourceCtor<Resource extends IWebGLResource, Options> {
    new (context: IWebGLStageContext, options: Options): Resource;
}
export interface IWebGLResource {
    release(): void;
}
export declare abstract class WebGLResource implements IWebGLResource {
    protected context: IWebGLStageContext;
    constructor(context: IWebGLStageContext);
    abstract release(): void;
}
