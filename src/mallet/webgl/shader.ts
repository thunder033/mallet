import {IWebGLResource, WebGLResource} from './webgl-resource';
import {DTO} from '../library.provider';
import {IWebGLResourceContext} from './webgl-resource-context';

export interface IShader extends IWebGLResource {
    prepare(context: IWebGLResourceContext): void;
    getId(): string;
    getShader(): WebGLShader;
}

export enum GLDataType {
    BYTE = 'BYTE',
    FLOAT = 'FLOAT',
    SHORT = 'SHORT',
    UNSIGNED_SHORT = 'UNSIGNED_SHORT',
    UNSIGNED_BYTE = 'UNSIGNED_BYTE',
    HALF_FLOAT = 'HALF_FLOAT', // future proof for webgl 2
}

export interface IAttribDescription {
    name: string;
    size: number;
    normalize?: boolean;
    stride?: number;
    offset?: number;
    type: GLDataType;
}

export enum GLUniformType {
    uniform1f = 'uniform1f',
    uniform1fv = 'uniform1fv',
    uniform2f = 'uniform2f',
    uniform2fv = 'uniform2fv',
    uniform3f = 'uniform3f',
    uniform3fv = 'uniform3fv',
    uniform4f = 'uniform4f',
    uniform4fv = 'uniform4fv',

    uniformMatrix2fv = 'uniformMatrix2fv',
    uniformMatrix3fv = 'uniformMatrix3fv',
    uniformMatrix4fv = 'uniformMatrix4fv',

    uniform1i = 'uniform1i',
    uniform1iv = 'uniform1iv',
    uniform2i = 'uniform2i',
    uniform2iv = 'uniform2iv',
    uniform3i = 'uniform3i',
    uniform3iv = 'uniform3iv',
    uniform4i = 'uniform4i',
    uniform4iv = 'uniform4iv',
}

// webGL does not support matrix transpose, but keeps argument for consistent API
export type GLMatrixSetter = (transpose: false, matrix: Float32Array | number[]) => void;
export type GLVec4Setter = (x: number, y: number, z: number, w: number) => void;
export type GLVec3Setter = (x: number, y: number, z: number) => void;
export type GLVec2Setter = (x: number, y: number) => void;

export interface IUniformDescription {
    [name: string]: GLUniformType | IUniformDescription;
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

export enum ShaderType {
    VERTEX_SHADER = 'VERTEX_SHADER',
    FRAGMENT_SHADER = 'FRAGMENT_SHADER',
}

export class ShaderDTO extends DTO<ShaderDTO> implements IShaderOptions {
    public id: string;
    public type: ShaderType;
    public src: string;
    public spec: IShaderSpec;
}

export class Shader extends WebGLResource implements IShader {
    protected id: string;
    protected shader: WebGLShader;

    constructor(protected options: IShaderOptions) {
        super();
        const {gl} = this.context;
        this.id = options.id;
        const shaderSource = options.src || document.getElementById(options.id).textContent;

        if (!shaderSource || typeof shaderSource !== 'string') {
            throw new Error(`Failed to get valid shader source for ${options.id}`);
        }

        this.shader = gl.createShader(gl[options.type]);
        gl.shaderSource(this.shader, shaderSource); // send the source to the shader object
        gl.compileShader(this.shader); // compile the shader program

        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(this.shader);
            gl.deleteShader(this.shader);
            throw new Error(`Failed to compile ${this.id}: ${info}`);
        }
    }

    public getShader(): WebGLShader {
        return this.shader;
    }

    public getId(): string {
        return this.id;
    }

    public prepare({gl}: IWebGLResourceContext): void {
        // no-op
    }

    public release(): void {
        this.context.gl.deleteShader(this.shader);
    }
}
