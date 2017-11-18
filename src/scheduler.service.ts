
import {inject} from 'lib/injector-plus';
import {MDT} from './mallet.depedency-tree';
import {Logger} from './logger.factory';
import {PriorityQueue} from 'pulsar-lib';
import bind from 'bind-decorator';
import {AppState} from './app-state.service';

export class Scheduler {
    private updateOperations: PriorityQueue;
    private drawCommands: PriorityQueue;
    private postDrawCommands: PriorityQueue;

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

    private static scheduleCommand(command, priority, queue) {
        if (command instanceof Function) {
            priority = priority || 0;
            queue.enqueue(priority, command);
        } else {
            throw new TypeError('Operation must be a function');
        }
    }

    /**
     * average Frames executed per second over the last
     * @returns {number}
     * @constructor
     */
    public get FPS() { return this.fps; }

    constructor(
        @inject(MDT.const.MaxFrameRate) private maxFrameRate: number,
        @inject(MDT.AppState) private appState: AppState,
        @inject(MDT.Logger) private logger: Logger) {

        this.updateOperations = new PriorityQueue();
        this.drawCommands = new PriorityQueue();
        this.postDrawCommands = new PriorityQueue();

        this.timestep = 1000 / this.maxFrameRate;

        window.addEventListener('blur', this.suspend);
    }

    @bind
    public suspend(e) {
        if (!(e && e.type === 'blur' && this.suspendOnBlur === false)) {
            this.appState.setState(AppState.Suspended);
            cancelAnimationFrame(this.animationFrame);
            // $rootScope.$evalAsync();
        }
    }

    @bind
    public resume() {
        if (this.appState.is(AppState.Suspended)) {
            this.startMainLoop();
        }
    }

    /**
     * Initialize the main app loop
     */
    public startMainLoop() {
        this.startTime = (new Date()).getTime();
        this.lastFrameTime = (new Date()).getTime();
        this.animationFrame = requestAnimationFrame(this.mainLoop);
        this.appState.setState(AppState.Running);
    }

    /**
     * Schedule an doUpdate command to be executed each frame
     * @param operation
     * @param order
     */
    public schedule(operation, order: number) {
        Scheduler.scheduleCommand(operation, order, this.updateOperations);
    }

    /**
     * Queue a draw opeartion to be executed once and discarded
     * @param operation
     * @param zIndex
     */
    public draw(operation, zIndex: number) {
        Scheduler.scheduleCommand(operation, zIndex, this.drawCommands);
    }

    /**
     * Queue a post process operation to be executed one and discarded
     * @param operation
     * @param zIndex
     */
    public postProcess(operation, zIndex: number) {
        Scheduler.scheduleCommand(operation, zIndex, this.postDrawCommands);
    }

    /**
     * Clears the set of registered doUpdate operations
     */
    public reset() {
        this.updateOperations.clear();
    }

    /**
     * Toggles suspension of the main loop when the window is blurred
     * @param flag
     */
    public setSuspendOnBlur(flag) {
        this.suspendOnBlur = typeof flag !== 'undefined' ? flag : true;
    }

    /**
     * Execute all doUpdate opeartions while preserving the doUpdate queue
     * @param stepDeltaTime
     * @param totalElapsedTime
     */
    private doUpdate(stepDeltaTime: number, totalElapsedTime: number) {
        // reset draw commands to prevent duplicate frames being rendered
        this.drawCommands.clear();
        this.postDrawCommands.clear();

        const opsIterator = this.updateOperations.getIterator();
        while (!opsIterator.isEnd()) {
            opsIterator.next().call(null, stepDeltaTime, totalElapsedTime);
        }

        // There might be a better way to do this, but not really slowing things down right now
        // $rootScope.$apply(); might not be necessary with $ctrl architecture
    }

    /**
     * Execute all draw and post-draw commands, emptying each queue
     * @param stepDeltaTime
     * @param totalElapsedTime
     */
    private doDraw(stepDeltaTime: number, totalElapsedTime: number) {
        while (this.drawCommands.peek() !== null) {
            this.drawCommands.dequeue().call(null, stepDeltaTime, totalElapsedTime);
        }

        while (this.postDrawCommands.peek() !== null) {
            this.postDrawCommands.dequeue().call(null, stepDeltaTime, totalElapsedTime);
        }
    }

    /**
     * Update the FPS value
     * @param totalElapsedTime
     */
    private updateFPS(totalElapsedTime) {
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
    private mainLoop() {
        const frameTime =  (new Date()).getTime();
        this.deltaTime += frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;
        this.elapsedTime = frameTime - this.startTime;

        this.updateFPS(this.elapsedTime);

        let updateSteps = 0;
        while (this.deltaTime > this.timestep) {
            this.doUpdate(this.timestep, this.elapsedTime);
            this.deltaTime -= this.timestep;

            const maxConsecSteps = 240;
            if (++updateSteps > maxConsecSteps) {
                this.logger.warn(`Update Loop Exceeded ${maxConsecSteps} Calls`);
                this.deltaTime = 0; // don't do a silly # of updates
                break;
            }
        }

        this.draw(this.deltaTime, this.elapsedTime);
        this.animationFrame = requestAnimationFrame(this.mainLoop);
    }
}
