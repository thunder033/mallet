
import {GLUniformType, IShader, IShaderOptions, IUniformDescription, Shader} from './shader';
import bind from 'bind-decorator';
import {IWebGLResource, WebGLResource} from './webgl-resource';
import {BufferFormat, IBufferFormat} from './buffer-format';
import {DTO} from '../core/library.provider';

export interface IProgramOptions {
    shaders: {vertex: IShaderOptions, fragment: IShaderOptions};
    name: string;
}

export interface IShaderProgram extends IWebGLResource {
    getGLProgram(): WebGLProgram;
    use(): void;
    getUniformSetter(name: string): (...data) => void;
}

export class ProgramOptionsDTO extends DTO<IProgramOptions> implements IProgramOptions {
    public shaders: {vertex: IShaderOptions, fragment: IShaderOptions};
    public name: string;
}

interface IUniform {
    name: string;
    location: WebGLUniformLocation;
    type: GLUniformType;
}

export class ShaderProgram extends WebGLResource implements IShaderProgram {
    private bufferFormat: IBufferFormat;
    private uniforms: {[name: string]: IUniform};
    private isActive: boolean;
    private program: WebGLProgram;

    constructor(config: IProgramOptions) {
        super();
        this.program = this.context.gl.createProgram();
        const {gl, logger} = this.context;

        const vertexShader: IShader = this.createShader(config.shaders.vertex);
        gl.attachShader(this.program, vertexShader.getShader());
        vertexShader.release();

        const fragmentShader = this.createShader(config.shaders.fragment);
        gl.attachShader(this.program, fragmentShader.getShader());
        fragmentShader.release();

        gl.linkProgram(this.program);

        const success = gl.getProgramParameter(this.program, gl.LINK_STATUS);

        if (!success) {
            gl.deleteProgram(this.program);
            throw new Error(`Failed to link program: ${gl.getProgramInfoLog(this.program)}`);
        }

        gl.useProgram(this.program); // retrieve and store program variable information
        this.bufferFormat = this.context.factory.create(BufferFormat, {
            program: this.program,
            shaderSpec: config.shaders.vertex.spec});

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

    /**
     * Use this program on the context GL instance and apply buffer format
     */
    public use() {
        this.context.gl.useProgram(this.program);
        this.bufferFormat.apply();
    }

    public getGLProgram(): WebGLProgram {
        return this.program;
    }

    public release(): void {
        const {gl} = this.context;
        gl.deleteProgram(this.program);
    }

    @bind
    protected createShader(config: IShaderOptions): IShader {
        return this.context.factory.create(Shader, config);
    }

    private cacheUniforms(spec: IUniformDescription[]) {
        const {gl} = this.context;
        spec.forEach((uniforms) => {
            this.flattenUniforms(uniforms).forEach((namePcs) => {
                const name = namePcs.join('.');
                const location = gl.getUniformLocation(this.program, name);
                const type = this.getUniformType(uniforms, namePcs);
                this.context.logger.debug(`Caching uniform ${name} (${type}) at location ${location}`);
                this.uniforms[name] = {name, location, type};
            });
        });
    }

    private flattenUniforms(struct: IUniformDescription, keys: string[][] = [], pieces: string[] = []): string[][] {
        if (!struct) {
            return;
        }

        if (pieces.length > 5) {
            throw new TypeError('Uniform structs with more than 5 levels are not supported, your struct object may have cycles');
        }

        Object.keys(struct).forEach((prop) => {
            const type = struct[prop];
            // Type -> new key array
            if (GLUniformType[type as GLUniformType]) {
                keys.push([...pieces, prop]);
            } else { // Struct -> flatten ( struct, keys, pieces + prop
                this.flattenUniforms(type as IUniformDescription, keys, [...pieces, prop]);
            }
        });

        return keys;
    }

    private getUniformType(uniform: IUniformDescription, name: string[]): GLUniformType {
        return name.reduce((struct, prop) => {
            return struct[prop];
        }, uniform) as GLUniformType;
    }
}
