import {IWebGLResource, IWebGLStageContext, WebGLResource} from './webgl-resource';

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

export enum ShaderType {
    VERTEX_SHADER = 'VERTEX_SHADER',
    FRAGMENT_SHADER = 'FRAGMENT_SHADER',
}

export class Shader extends WebGLResource implements IShader {
    protected id: string;
    protected shader: WebGLShader;

    constructor(context: IWebGLStageContext, protected options: IShaderOptions) {
        super(context);
        const {gl} = context;
        this.id = options.id;
        const shaderSource = options.src || document.getElementById(options.id).textContent;

        if (!shaderSource || typeof shaderSource !== 'string') {
            throw new Error(`Failed to get valid shader source for ${options.id}`);
        }

        this.shader = gl.createShader(gl[options.type]);
        gl.shaderSource(this.shader, shaderSource);
        gl.compileShader(this.shader);

        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            throw new Error(`Failed to compile ${this.id}: ${gl.getShaderInfoLog(this.shader)}`);
        }
    }

    public getShader(): WebGLShader {
        return this.shader;
    }

    public getId(): string {
        return this.id;
    }

    public prepare({gl}: IWebGLStageContext): void {
        // no-op
    }
}
