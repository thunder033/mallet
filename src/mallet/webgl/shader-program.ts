
import {IShader, IShaderOptions, Shader} from './shader';
import bind from 'bind-decorator';
import {IWebGLResource, IWebGLStageContext, WebGLResource} from './webgl-resource';
import {BufferFormat, IBufferFormat} from './buffer-format';

interface IProgramOptions {
    shaders: {vertex: IShaderOptions, fragment: IShaderOptions};
}

export interface IShaderProgram extends IWebGLResource {
    getGLProgram(): WebGLProgram;
    use(): void;
}

export class ShaderProgram extends WebGLResource implements IShaderProgram {
    private bufferFormat: IBufferFormat;

    constructor(protected context: IWebGLStageContext, config: IProgramOptions) {
        super(context);
        this.context.program = context.gl.createProgram();
        const {gl, program} = this.context;

        const vertexShader = this.createShader(config.shaders.vertex);
        gl.attachShader(program, vertexShader);
        vertexShader.release();

        this.bufferFormat = new BufferFormat(this.context, {shaderSpec: config.shaders.vertex.spec});

        const fragmentShader = this.createShader(config.shaders.fragment);
        gl.attachShader(program, fragmentShader);
        fragmentShader.release();

    }

    public use() {
        const {gl, program} = this.context;
        gl.useProgram(program);
        this.bufferFormat.apply();
    }

    public getGLProgram() {
        return this.context.program;
    }

    @bind
    protected createShader(config: IShaderOptions): IShader {
        return new Shader(this.context, config);
    }

    public release(): void {
        const {gl, program} = this.context;
        gl.deleteProgram(program);
    }
}
