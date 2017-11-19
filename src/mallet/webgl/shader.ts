import {WebGLResource} from './webgl-resource';

interface IShader {
    getId(): string;
}

interface IShaderOptions {
    id: string;
}

class Shader extends WebGLResource implements IShader {
    private id: string;
    private shader: WebGLShader;

    constructor(gl: WebGLRenderingContext, options: IShaderOptions) {
        super();
        const shaderSource = document.getElementById(options.id).textContent;

    }

    public getId(): string {
        return this.id;
    }
}