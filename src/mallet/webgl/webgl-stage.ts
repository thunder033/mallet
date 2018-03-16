import {RenderTargetWebGL} from '../render-target.factory';
import {WebGLResourceFactory} from './webgl-resource-factory';
import {inject} from '../lib/injector-plus';
import {MDT} from '../mallet.depedency-tree';
import {Logger} from '../lib/logger';
import bind from 'bind-decorator';
import {IQService} from 'angular';
import {IProgramOptions, IShaderProgram, ShaderProgram} from './shader-program';
import {ILibraryService} from '../library.provider';
import {IWebGLResourceContext} from './webgl-resource-context';
import {WebGLResource} from './webgl-resource';

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
        this.context = null;
        this.programs = {};
    }

    @bind
    public set(renderTarget: RenderTargetWebGL): boolean {
        this.logger.debug(`Setting WebGL Stage`);
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();

        try {
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

            this.glFactory.init(['cube']); // TODO: make this not hard-coded
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
        const program = this.context.factory.create(ShaderProgram, programConfig);
        setActive = Object.keys(this.programs).length === 0;
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

    public getFactory(): WebGLResourceFactory {
        return this.glFactory;
    }
}
