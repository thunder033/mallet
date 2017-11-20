"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("./lib/injector-plus");
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const logger_service_1 = require("./logger.service");
const pulsar_lib_1 = require("pulsar-lib");
const bind_decorator_1 = require("bind-decorator");
const app_state_service_1 = require("./app-state.service");
/**
 * Executes and monitors the engine loop
 */
let Scheduler = class Scheduler {
    constructor(maxFrameRate, appState, logger) {
        this.maxFrameRate = maxFrameRate;
        this.appState = appState;
        this.logger = logger;
        /** @description Current Frames Per Second */
        this.fps = 0;
        /** @description timestamp of last FPS doUpdate */
        this.lastFPSUpdate = 0;
        /** @description frames executed in last second */
        this.framesThisSecond = 0;
        /** @description suspend main loop if the window loses focus */
        this.suspendOnBlur = false;
        this.animationFrame = null;
        /** @description timestamp when first frame executed */
        this.startTime = 0;
        /** @description milliseconds since doUpdate loop was run */
        this.deltaTime = 0;
        /** @description  milliseconds since last frame */
        this.elapsedTime = 0;
        /** @description timestamp of the last frame */
        this.lastFrameTime = 0;
        this.updateOperations = new pulsar_lib_1.PriorityQueue();
        this.drawCommands = new pulsar_lib_1.PriorityQueue();
        this.postDrawCommands = new pulsar_lib_1.PriorityQueue();
        this.timestep = 1000 / this.maxFrameRate;
        this.fps = this.maxFrameRate;
        window.addEventListener('blur', this.suspend);
    }
    static scheduleCommand(command, priority, queue) {
        if (command instanceof Function) {
            priority = priority || 0;
            queue.enqueue(priority, command);
        }
        else {
            throw new TypeError('Operation must be a function');
        }
    }
    /**
     * average Frames executed per second over the last
     * @returns {number}
     * @constructor
     */
    get FPS() { return this.fps; }
    suspend(e) {
        if (!(e && e.type === 'blur' && this.suspendOnBlur === false)) {
            this.appState.setState(app_state_service_1.AppState.Suspended);
            cancelAnimationFrame(this.animationFrame);
            // $rootScope.$evalAsync();
        }
    }
    resume() {
        if (this.appState.is(app_state_service_1.AppState.Suspended)) {
            this.startMainLoop();
        }
    }
    /**
     * Initialize the main app loop
     */
    startMainLoop() {
        this.startTime = (new Date()).getTime();
        this.lastFrameTime = (new Date()).getTime();
        this.animationFrame = requestAnimationFrame(this.mainLoop);
        this.appState.setState(app_state_service_1.AppState.Running);
    }
    /**
     * Schedule an doUpdate command to be executed each frame
     * @param operation
     * @param order
     */
    schedule(operation, order) {
        Scheduler.scheduleCommand(operation, order, this.updateOperations);
    }
    /**
     * Queue a draw opeartion to be executed once and discarded
     * @param operation
     * @param zIndex
     */
    draw(operation, zIndex) {
        Scheduler.scheduleCommand(operation, zIndex, this.drawCommands);
    }
    /**
     * Queue a post process operation to be executed one and discarded
     * @param operation
     * @param zIndex
     */
    postProcess(operation, zIndex) {
        Scheduler.scheduleCommand(operation, zIndex, this.postDrawCommands);
    }
    /**
     * Clears the set of registered doUpdate operations
     */
    reset() {
        this.updateOperations.clear();
    }
    /**
     * Toggles suspension of the main loop when the window is blurred
     * @param flag
     */
    setSuspendOnBlur(flag) {
        this.suspendOnBlur = typeof flag !== 'undefined' ? flag : true;
    }
    /**
     * Execute all doUpdate opeartions while preserving the doUpdate queue
     * @param stepDeltaTime
     * @param totalElapsedTime
     */
    doUpdate(stepDeltaTime, totalElapsedTime) {
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
    doDraw(stepDeltaTime, totalElapsedTime) {
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
    updateFPS(totalElapsedTime) {
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
    mainLoop() {
        const frameTime = (new Date()).getTime();
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
        this.doDraw(this.deltaTime, this.elapsedTime);
        this.animationFrame = requestAnimationFrame(this.mainLoop);
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], Scheduler.prototype, "suspend", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Scheduler.prototype, "resume", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Scheduler.prototype, "mainLoop", null);
Scheduler = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.const.MaxFrameRate)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.AppState)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Number, app_state_service_1.AppState,
        logger_service_1.Logger])
], Scheduler);
exports.Scheduler = Scheduler;
//# sourceMappingURL=scheduler.service.js.map