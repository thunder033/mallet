import {IAugmentedJQuery, IController, IQService} from 'angular';
import {ICamera} from '../geometry/camera';
import {IRenderer} from './renderer';
import {inject} from '../lib/injector-plus';
import {MDT} from '../mallet.dependency-tree';
import {ILibraryService} from '../core/library.provider';
import {IWebGLStage} from './webgl-stage';
import {Logger} from '../lib/logger';
import bind from 'bind-decorator';
import {Entity, IEntity} from '../geometry/entity';
import {IWebGLResourceContext} from './webgl-resource-context';

export interface IWebGLApp {
    preUpdate?(dt: number, tt: number);
    postUpdate?(dt: number, tt: number);
    init(context: IWebGLResourceContext): any;
    config(): void;
}

export type UpdateMethod = (dt: number, tt: number) => void;

export abstract class WebGLApp implements IController, IWebGLApp {
    public preUpdate: UpdateMethod = null;

    protected camera: ICamera;
    protected renderer: IRenderer;
    protected context: IWebGLResourceContext;

    protected entities: IEntity[];
    protected entityUpdates: UpdateMethod[];

    private readonly timestep: number;

    /** @description Current Frames Per Second */
    private fps: number = 0;

    /** @description timestamp of last FPS doUpdate */
    private lastFPSUpdate: number = 0;

    /** @description frames executed in last second */
    private framesThisSecond: number = 0;

    /** @description suspend main loop if the window loses focus */
    private suspendOnBlur: boolean = false;

    private animationFrame = null;

    /** @description timestamp when first frame executed */
    private startTime: number = 0;

    /** @description milliseconds since doUpdate loop was run */
    private deltaTime: number = 0;

    /** @description  milliseconds since last frame */
    private elapsedTime: number = 0;

    /** @description timestamp of the last frame */
    private lastFrameTime: number = 0;

    constructor(
        @inject(MDT.const.MaxFrameRate) private maxFrameRate: number,
        @inject(MDT.ng.$q) protected $q: IQService,
        @inject(MDT.Library) protected library: ILibraryService,
        @inject(MDT.webgl.WebGLStage) protected stage: IWebGLStage,
        @inject(MDT.ng.$element) protected $element: IAugmentedJQuery,
        @inject(MDT.Logger) protected logger: Logger) {
        // get references to constructed entities and their update methods
        this.entities = Entity.getIndex();
        this.entityUpdates = Entity.getUpdateIndex();

        // If the preUpdate method is implemented, schedule it to be executed
        if (this.preUpdate instanceof Function) {
            this.entityUpdates.push(this.preUpdate.bind(this));
        }

        this.timestep = (1000 / this.maxFrameRate);
        this.fps = this.maxFrameRate;

        this.config();
    }

    /**
     * Implement the $postLink method triggered when all configured providers are available
     */
    public $postLink(): void {
        this.context = this.stage.getContext();
        this.$q.when(this.init(this.context))
            .then(this.startMainLoop)
            .catch((err) => {
                this.logger.error(`Failed to initialize WebGL app`, err);
            });
    }

    /**
     * The config method is executed during construction, and before the component is linked
     * to the render target element - during Angular's config phase.
     */
    public abstract config(): void;

    /**
     * The init method is executed during the $postLink phase, providing full access to the
     * render target
     * @param {IWebGLResourceContext} context
     * @returns {any}
     */
    public abstract init(context: IWebGLResourceContext): void | Promise<any>;

    /**
     * The postUpdate method can perform any operations between entity updates and rendering
     * @param {number} dt
     * @param {number} tt
     */
    public postUpdate(dt: number, tt: number) {
        // no-op
    }

    /**
     * Update the FPS value
     * @param totalElapsedTime
     */
    private updateFPS(totalElapsedTime: number) {
        this.framesThisSecond++;
        if (totalElapsedTime > this.lastFPSUpdate + 1000) {
            const weightFactor = 0.25;
            this.fps = (weightFactor * this.framesThisSecond) + ((1 - weightFactor) * this.fps);
            this.lastFPSUpdate = totalElapsedTime;
            this.framesThisSecond = 0;
        }
    }

    /**
     * Derived From
     * Isaac Sukin
     * http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
     */
    @bind private mainLoop() {
        const frameTime = performance.now();
        this.deltaTime += frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;
        this.elapsedTime = frameTime - this.startTime;

        let elapsedMs = this.elapsedTime | 0;
        this.updateFPS(elapsedMs);

        let updateSteps = 0;
        // const frameDeltaTime = this.deltaTime;
        const dtMs = this.timestep | 0;
        const ops = this.entityUpdates;
        const len = ops.length;

        while (this.deltaTime > this.timestep) {
            for (let i = 0; i < len; i++) {
                ops[i](dtMs, elapsedMs);
            }

            this.postUpdate(dtMs, elapsedMs);

            this.deltaTime -= this.timestep;
            elapsedMs += dtMs;

            const maxConsecSteps = 240;
            if (++updateSteps > maxConsecSteps) {
                this.logger.warn(`Update Loop Exceeded ${maxConsecSteps} Calls`);
                this.deltaTime = 0; // don't do a silly # of updates
                break;
            }
        }

        this.renderer.renderScene();
        this.animationFrame = requestAnimationFrame(this.mainLoop);
    }

    /**
     * Initialize the main app loop
     */
    @bind private startMainLoop() {
        this.logger.debug('Starting main GL application loop');
        this.lastFrameTime = this.startTime = performance.now();
        this.animationFrame = requestAnimationFrame(this.mainLoop);
        // this.appState.setState(AppState.Running);
    }
}
