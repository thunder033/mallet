
import {RenderTargetWebGL} from '../render-target.factory';
import {WebGLResourceFactory} from './webgl-resource-factory';
import {inject} from '../lib/injector-plus';
import {MDT} from '../mallet.depedency-tree';
import {Logger} from '../lib/logger';
import bind from 'bind-decorator';
import {IQService} from 'angular';
import {IWebGLResourceContext} from './webgl-resource';
import {IProgramOptions, IShaderProgram, ShaderProgram} from './shader-program';
import {IWebGLMesh, WebGLMesh} from './webgl-mesh';
import {ICamera} from '../geometry/camera';
import {GLMatrixSetter} from './shader';
import {mat4} from 'gl-matrix';
import {ILibraryService} from '../library.provider';

export interface IWebGLStage {
    set(renderTarget: RenderTargetWebGL): void;
    getFactory(): WebGLResourceFactory;
    addProgram(programConfig: IProgramOptions): IShaderProgram;
    setActiveProgram(name: string): void;
    getContext(): IWebGLResourceContext;
}

export class WebGLStage implements IWebGLStage {
    private renderTarget: RenderTargetWebGL;
    private gl: WebGLRenderingContext;
    private glFactory: WebGLResourceFactory;
    private context: IWebGLResourceContext;

    private programs: {[name: string]: IShaderProgram};

    constructor(
        @inject(MDT.Library) private library: ILibraryService,
        @inject(MDT.ng.$q) private $q: IQService,
        @inject(MDT.Logger) private logger: Logger) {
        this.context = {
            gl: null,
            program: null,
            logger,
            renderTarget: null,
            transformBuffer: null,
        };
        this.programs = {};
    }

    @bind
    public set(renderTarget: RenderTargetWebGL): boolean {
        this.logger.debug(`Setting WebGL Stage`);
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();
        this.context.renderTarget = renderTarget;
        this.context.gl = this.gl;

        try {
            const {gl} = this.context;
            gl.enable(gl.DEPTH_TEST); // could replace this with blending: http://learningwebgl.com/blog/?p=859

            // TODO: create materials

            this.glFactory = new WebGLResourceFactory(this.context, this.library);
            this.glFactory.init(['cube']);
            this.logger.debug(`WebGL Stage set`);
            return true;
        } catch (e) {
            this.logger.error(e.message || e);
            return false;
        }
    }

    public getContext(): IWebGLResourceContext {
        return this.context;
    }

    /**
     * Create a new shader program and add it to available stage programs
     * @param {IProgramOptions} programConfig
     * @param {boolean} setActive
     * @returns {IShaderProgram}
     */
    @bind public addProgram(programConfig: IProgramOptions, setActive: boolean = false): IShaderProgram {
        const program = new ShaderProgram(this.context, programConfig);
        this.programs[programConfig.name] = program;
        if (this.context.program === null || setActive === true) {
            this.setActiveProgram(programConfig.name);
        }

        return program;
    }

    /**
     * Set the active program
     * @param {string} name
     */
    @bind public setActiveProgram(name: string): void {
        if (!this.programs[name]) {
            throw new ReferenceError(`Program with ${name} does not exist in this stage`);
        }

        this.context.program = this.programs[name];
        this.programs[name].use();
    }

    public getFactory(): WebGLResourceFactory {
        return this.glFactory;
    }
}
