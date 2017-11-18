import { Logger } from './logger.factory';
import { AppState } from './app-state.service';
export declare class Scheduler {
    private maxFrameRate;
    private appState;
    private logger;
    private updateOperations;
    private drawCommands;
    private postDrawCommands;
    private readonly timestep;
    /** @description Current Frames Per Second */
    private fps;
    /** @description timestamp of last FPS doUpdate */
    private lastFPSUpdate;
    /** @description frames executed in last second */
    private framesThisSecond;
    /** @description suspend main loop if the window loses focus */
    private suspendOnBlur;
    private animationFrame;
    /** @description timestamp when first frame executed */
    private startTime;
    /** @description milliseconds since doUpdate loop was run */
    private deltaTime;
    /** @description  milliseconds since last frame */
    private elapsedTime;
    /** @description timestamp of the last frame */
    private lastFrameTime;
    private static scheduleCommand(command, priority, queue);
    /**
     * average Frames executed per second over the last
     * @returns {number}
     * @constructor
     */
    readonly FPS: number;
    constructor(maxFrameRate: number, appState: AppState, logger: Logger);
    suspend(e: any): void;
    resume(): void;
    /**
     * Initialize the main app loop
     */
    startMainLoop(): void;
    /**
     * Schedule an doUpdate command to be executed each frame
     * @param operation
     * @param order
     */
    schedule(operation: any, order: number): void;
    /**
     * Queue a draw opeartion to be executed once and discarded
     * @param operation
     * @param zIndex
     */
    draw(operation: any, zIndex: number): void;
    /**
     * Queue a post process operation to be executed one and discarded
     * @param operation
     * @param zIndex
     */
    postProcess(operation: any, zIndex: number): void;
    /**
     * Clears the set of registered doUpdate operations
     */
    reset(): void;
    /**
     * Toggles suspension of the main loop when the window is blurred
     * @param flag
     */
    setSuspendOnBlur(flag: any): void;
    /**
     * Execute all doUpdate opeartions while preserving the doUpdate queue
     * @param stepDeltaTime
     * @param totalElapsedTime
     */
    private doUpdate(stepDeltaTime, totalElapsedTime);
    /**
     * Execute all draw and post-draw commands, emptying each queue
     * @param stepDeltaTime
     * @param totalElapsedTime
     */
    private doDraw(stepDeltaTime, totalElapsedTime);
    /**
     * Update the FPS value
     * @param totalElapsedTime
     */
    private updateFPS(totalElapsedTime);
    /**
     * Derived From
     * Isaac Sukin
     * http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
     */
    private mainLoop();
}
