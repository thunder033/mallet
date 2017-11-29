
import {IShader, IShaderOptions, Shader} from './shader';
import bind from 'bind-decorator';
import {IWebGLResource, IWebGLStageContext, WebGLResource} from './webgl-resource';
import {BufferFormat, IBufferFormat} from './buffer-format';

export interface IProgramOptions {
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
        const {gl, program, logger} = this.context;

        const vertexShader: IShader = this.createShader(config.shaders.vertex);
        gl.attachShader(program, vertexShader.getShader());
        vertexShader.release();

        const fragmentShader = this.createShader(config.shaders.fragment);
        gl.attachShader(program, fragmentShader.getShader());
        fragmentShader.release();

        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);

        if (!success) {
            gl.deleteProgram(program);
            throw new Error(`Failed to link program: ${gl.getProgramInfoLog(program)}`);
        }

        gl.useProgram(program); // retrieve and store program variable information
        this.bufferFormat = new BufferFormat(this.context, {shaderSpec: config.shaders.vertex.spec});
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
