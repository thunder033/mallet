import {IRenderTarget} from '../core/render-target.factory';
import {IWebGLResourceFactory} from './webgl-resource-factory';
import {Logger} from '../lib/logger';

export interface IWebGLResourceContext {
    gl: WebGLRenderingContext;
    logger: Logger;
    transformBuffer: ArrayBuffer;
    renderTarget: IRenderTarget;
    factory: IWebGLResourceFactory;
}
