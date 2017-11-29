import { IWebGLResource, IWebGLStageContext, WebGLResource } from './webgl-resource';
import { DTO } from '../library.provider';
export interface IShader extends IWebGLResource {
    prepare(context: IWebGLStageContext): void;
    getId(): string;
    getShader(): WebGLShader;
}
export declare enum GLDataType {
    BYTE = "BYTE",
    FLOAT = "FLOAT",
    SHORT = "SHORT",
    UNSIGNED_SHORT = "UNSIGNED_SHORT",
    UNSIGNED_BYTE = "UNSIGNED_BYTE",
    HALF_FLOAT = "HALF_FLOAT",
}
export interface IAttribDescription {
    name: string;
    size: number;
    normalize?: boolean;
    stride?: number;
    offset?: number;
    type: GLDataType;
}
export declare enum GLUniformType {
    uniform1f = "uniform1f",
    uniform1fv = "uniform1fv",
    uniform2f = "uniform2f",
    uniform2fv = "uniform2fv",
    uniform3f = "uniform3f",
    uniform3fv = "uniform3fv",
    uniform4f = "uniform4f",
    uniform4fv = "uniform4fv",
    uniformMatrix2fv = "uniformMatrix2fv",
    uniformMatrix3fv = "uniformMatrix3fv",
    uniformMatrix4fv = "uniformMatrix4fv",
    uniform1i = "uniform1i",
    uniform1iv = "uniform1iv",
    uniform2i = "uniform2i",
    uniform2iv = "uniform2iv",
    uniform3i = "uniform3i",
    uniform3iv = "uniform3iv",
    uniform4i = "uniform4i",
    uniform4iv = "uniform4iv",
}
export declare type GLMatrixSetter = (transpose: boolean, matrix: Float32Array | number[]) => void;
export interface IUniformDescription {
    [name: string]: GLUniformType;
}
export interface IShaderOptions {
    id: string;
    type: ShaderType;
    src: string;
    spec: IShaderSpec;
}
export interface IShaderSpec {
    attributes?: IAttribDescription[];
    uniforms?: IUniformDescription;
}
export declare enum ShaderType {
    VERTEX_SHADER = "VERTEX_SHADER",
    FRAGMENT_SHADER = "FRAGMENT_SHADER",
}
export declare class ShaderDTO extends DTO<ShaderDTO> implements IShaderOptions {
    id: string;
    type: ShaderType;
    src: string;
    spec: IShaderSpec;
}
export declare class Shader extends WebGLResource implements IShader {
    protected options: IShaderOptions;
    protected id: string;
    protected shader: WebGLShader;
    constructor(context: IWebGLStageContext, options: IShaderOptions);
    getShader(): WebGLShader;
    getId(): string;
    prepare({gl}: IWebGLStageContext): void;
    release(): void;
}
