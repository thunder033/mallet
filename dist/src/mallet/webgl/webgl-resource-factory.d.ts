import { IWebGLResource, IWebGLResourceCtor } from './webgl-resource';
export declare class WebGLResourceFactory {
    private gl;
    constructor(gl: WebGLRenderingContext);
    create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O): R;
}
