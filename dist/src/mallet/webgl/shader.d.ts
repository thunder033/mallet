import { WebGLResource } from './webgl-resource';
import { IWebGLStageContext } from './webgl-stage';
export interface IShader {
    prepare(context: IWebGLStageContext): void;
    getId(): string;
    getShader(): WebGLShader;
}
export interface IShaderOptions {
    id: string;
    type: ShaderType;
    src?: string;
}
export declare enum ShaderType {
    VERTEX_SHADER = "VERTEX_SHADER",
    FRAGMENT_SHADER = "FRAGMENT_SHADER",
}
export declare class Shader extends WebGLResource implements IShader {
    protected id: string;
    protected shader: WebGLShader;
    constructor(gl: WebGLRenderingContext, options: IShaderOptions);
    getShader(): WebGLShader;
    getId(): string;
    prepare({gl}: IWebGLStageContext): void;
}
