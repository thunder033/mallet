import { IShaderOptions, Shader } from './shader';
import { IWebGLStageContext } from './webgl-stage';
export declare class VertexShader2D extends Shader {
    constructor(gl: WebGLRenderingContext, options: IShaderOptions);
    prepare({gl, program}: IWebGLStageContext): void;
}
