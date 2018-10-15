import {RenderTargetWebGL} from '../core/render-target.factory';
import {IWebGLResourceFactory, WebGLResourceFactory} from './webgl-resource-factory';
import {inject} from '../lib/injector-plus';
import {MDT} from '../mallet.dependency-tree';
import {Logger} from '../lib/logger';
import bind from 'bind-decorator';
import {IQService} from 'angular';
import {IProgramOptions, IShaderProgram, ShaderProgram} from './shader-program';
import {ILibraryService} from '../core/library.provider';
import {IWebGLResourceContext} from './webgl-resource-context';
import {WebGLResource} from './webgl-resource';

export interface IWebGLStage {
    set(renderTarget: RenderTargetWebGL): Promise<IWebGLResourceFactory>;
    getFactory(): WebGLResourceFactory;
    addProgram(programConfig: IProgramOptions): IShaderProgram;
    setActiveProgram(name: string): void;
    getContext(): IWebGLResourceContext;
}

/**
 * Abstracts setup and interactions for WebGL programs, their render target, and related resources
 */
export class WebGLStage implements IWebGLStage {
    private renderTarget: RenderTargetWebGL;
    private gl: WebGLRenderingContext;
    private glFactory: WebGLResourceFactory;
    private context: IWebGLResourceContext;

    private readonly programs: {[name: string]: IShaderProgram};

    constructor(
        @inject(MDT.Library) private library: ILibraryService,
        @inject(MDT.ng.$q) private $q: IQService,
        @inject(MDT.Logger) private logger: Logger) {
        this.context = null;
        this.programs = {};
    }

    /**
     * Set up the stage with a render context and create factory for {@link IWebGLResource} instances
     * @param {RenderTargetWebGL} renderTarget
     * @returns {boolean} If the operation completed successfully
     */
    @bind public set(renderTarget: RenderTargetWebGL): Promise<IWebGLResourceFactory> {
        this.logger.debug(`Setting WebGL Stage`);
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();

        // could replace this with blending: http://learningwebgl.com/blog/?p=859
        this.gl.enable(this.gl.DEPTH_TEST);

        // TODO: create materials

        this.glFactory = new WebGLResourceFactory(this.library);
        this.context = WebGLResource.buildContext({
            gl: this.gl,
            factory: this.glFactory,
            logger: this.logger,
            transformBuffer: null,
            renderTarget: this.renderTarget,
        });

        // TODO: make this mesh initialization not hard-coded
        return this.glFactory.init(['cube']).then(() => {
            this.logger.debug(`WebGL Stage set`);
            return this.getFactory();
        });
    }

    /**
     * Retrieve the resource context for the stage
     * @returns {IWebGLResourceContext}
     */
    public getContext(): IWebGLResourceContext {
        return this.context;
    }

    /**
     * Create a new shader program and add it to available stage programs. If there are no existing programs for
     * this stage, the program will be made active.
     * @param {IProgramOptions} programConfig
     * @param {boolean} [setActive]
     * @returns {IShaderProgram}
     */
    @bind public addProgram(programConfig: IProgramOptions, setActive?: boolean): IShaderProgram {
        const program = this.context.factory.create(ShaderProgram, programConfig);
        setActive = typeof setActive === 'boolean' ? setActive : Object.keys(this.programs).length === 0;
        this.programs[programConfig.name] = program;
        if (setActive === true) {
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

        this.programs[name].use();
    }

    /**
     * Get factory to create resources with this stage's context
     * @returns {WebGLResourceFactory}
     */
    public getFactory(): WebGLResourceFactory {
        return this.glFactory;
    }
}
