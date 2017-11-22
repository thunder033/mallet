
import {IWebGLResource, IWebGLResourceCtor, IWebGLStageContext} from './webgl-resource';

export class WebGLResourceFactory {
    constructor(private context: IWebGLStageContext) {
    }

    public create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O): R {
        return new ctor(this.context, options);
    }
}
