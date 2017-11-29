import { IShader, IShaderOptions } from './shader';
import { IWebGLResource, IWebGLStageContext, WebGLResource } from './webgl-resource';
export interface IProgramOptions {
    shaders: {
        vertex: IShaderOptions;
        fragment: IShaderOptions;
    };
}
export interface IShaderProgram extends IWebGLResource {
    getGLProgram(): WebGLProgram;
    use(): void;
    getUniformSetter(name: string): (data: any) => void;
}
export declare class ShaderProgram extends WebGLResource implements IShaderProgram {
    protected context: IWebGLStageContext;
    private bufferFormat;
    private uniforms;
    constructor(context: IWebGLStageContext, config: IProgramOptions);
    getUniformSetter(name: string): (data: any) => void;
    use(): void;
    getGLProgram(): WebGLProgram;
    release(): void;
    protected createShader(config: IShaderOptions): IShader;
    private cacheUniforms(spec);
}
