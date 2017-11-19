
import {IWebGLResource, IWebGLResourceCtor} from './webgl-resource';

export class WebGLResourceFactory {
    constructor(private gl: WebGLRenderingContext) {
    }

    public create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O): R {
        return new ctor(this.gl, options);
    }
}
