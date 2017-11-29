
import {GLUniformType, IShader, IShaderOptions, IUniformDescription, Shader} from './shader';
import bind from 'bind-decorator';
import {IWebGLResource, IWebGLStageContext, WebGLResource} from './webgl-resource';
import {BufferFormat, IBufferFormat} from './buffer-format';

export interface IProgramOptions {
    shaders: {vertex: IShaderOptions, fragment: IShaderOptions};
}

export interface IShaderProgram extends IWebGLResource {
    getGLProgram(): WebGLProgram;
    use(): void;
    getUniformSetter(name: string): (data: any) => void;
}

interface IUniform {
    name: string;
    location: WebGLUniformLocation;
    type: GLUniformType;
}

export class ShaderProgram extends WebGLResource implements IShaderProgram {
    private bufferFormat: IBufferFormat;
    private uniforms: {[name: string]: IUniform};

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
        this.uniforms = {};
        this.cacheUniforms([
            config.shaders.vertex.spec.uniforms || {},
            config.shaders.fragment.spec.uniforms || {}]);
    }

    public getUniformSetter(name: string): (data: any) => void {
        const {gl} = this.context;
        const uniform = this.uniforms[name];
        return gl[uniform.type].bind(gl, uniform.location);
    }

    public use() {
        const {gl, program} = this.context;
        gl.useProgram(program);
        this.bufferFormat.apply();
    }

    public getGLProgram(): WebGLProgram {
        return this.context.program;
    }

    public release(): void {
        const {gl, program} = this.context;
        gl.deleteProgram(program);
    }

    @bind
    protected createShader(config: IShaderOptions): IShader {
        return new Shader(this.context, config);
    }

    private cacheUniforms(spec: IUniformDescription[]) {
        const {program, gl} = this.context;
        spec.forEach((uniforms) => {
            Object.keys(uniforms).forEach((name) => {
                const location = gl.getUniformLocation(program, name);
                this.context.logger.debug(`Caching uniform ${name} (${uniforms[name]}) at location ${location}`);
                this.uniforms[name] = {
                    name,
                    location,
                    type: uniforms[name],
                };
            });
        });
    }
}
