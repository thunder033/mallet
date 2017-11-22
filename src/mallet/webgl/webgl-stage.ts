
import {RenderTargetWebGL} from '../render-target.factory';
import {IShader, IShaderOptions, Shader, ShaderType} from './shader';
import {WebGLResourceFactory} from './webgl-resource-factory';
import {inject} from '../lib/injector-plus';
import {MDT} from '../mallet.depedency-tree';
import {Logger} from '../lib/logger';
import bind from 'bind-decorator';
import {VertexShader2D} from './vertex-shader';
import {IPromise, IQService} from 'angular';
import {IShaderSource} from './shader-source.provider';
import {IWebGLStageContext} from './webgl-resource';

export interface IWebGLStage {
    set(renderTarget: RenderTargetWebGL): void;
    present(dt: number): void;
}

export class WebGLStage implements IWebGLStage {
    private renderTarget: RenderTargetWebGL;
    private gl: WebGLRenderingContext;
    private glFactory: WebGLResourceFactory;
    private program: WebGLProgram;
    private context: IWebGLStageContext;

    private verts1 = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]);
    private verts2 = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5]);

    private readonly shaderConfig: IShaderOptions[] = [
        {id: '2d-vertex-shader', type: ShaderType.VERTEX_SHADER},
        {id: 'fragment-shader', type: ShaderType.FRAGMENT_SHADER}];

    private shaders: IShader[];

    constructor(
        @inject(MDT.ng.$q) private $q: IQService,
        @inject(MDT.webgl.ShaderSource) private shaderSource: IShaderSource,
        @inject(MDT.Logger) private logger: Logger) {
        this.shaders = [];
    }

    @bind
    public set(renderTarget: RenderTargetWebGL): IPromise<boolean> {
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();
        this.program = renderTarget.getProgram();
        this.context = {gl: this.gl, program: null, logger: this.logger};

        this.logger.info(this.shaderSource);

        this.glFactory = new WebGLResourceFactory(this.context);

        const gl = this.gl;
        const program = this.program;

        return this.loadShaders(this.shaderConfig).then((shaders) => {
            this.shaders = shaders;
            this.shaders.forEach((shader: IShader) => {
                gl.attachShader(program, shader.getShader());
            });

            gl.linkProgram(program);

            const success = gl.getProgramParameter(program, gl.LINK_STATUS);

            if (success) {
                gl.useProgram(program);

                this.shaders.forEach((s) => s.prepare(this.context));
            } else {
                this.logger.error(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
            }

            return success;
        });
    }

    @bind
    protected loadShaders(configs: IShaderOptions[]): IPromise<IShader[]> {
        return this.resolveShaderSources(configs).then((fullConfigs) => {
            return fullConfigs.map(this.createShader);
        });
    }

    @bind
    protected resolveShaderSources(configs: IShaderOptions[]): IPromise<IShaderOptions[]> {
        const mixedOps = configs.map((config) => {
            if (!config.src) {
                return this.shaderSource.load(config.id).then((source) => {
                    config.src = source;
                    return config;
                });
            }

            return config;
        });

        return this.$q.all(mixedOps) as IPromise<IShaderOptions[]>;
    }

    @bind
    protected createShader(config: IShaderOptions): IShader {
        const type = config.type === ShaderType.VERTEX_SHADER ? VertexShader2D : Shader;
        return this.glFactory.create(type, config);
    }

    @bind
    public present(dt: number) {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bufferData(gl.ARRAY_BUFFER, this.verts2, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, this.verts2.length / 2);
    }
}
