import { IWebGLResource, IWebGLResourceCtor, IWebGLStageContext } from './webgl-resource';
export declare class WebGLResourceFactory {
    private context;
    constructor(context: IWebGLStageContext);
    create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O): R;
}
