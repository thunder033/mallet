	/**
	 * Created by Greg on 3/24/2017.
	 */
	/**
	 * @enumerable decorator that sets the enumerable property of a class field to false.
	 * @param value true|false
	 */
	export function enumerable(value: boolean): (target: any, propertyKey: string) => void;

	export function state(target: Object, key: string): void;
	export abstract class StateMachine {
	    private state;
	    private stateListeners;
	    static all(machine: {
	        new (): StateMachine;
	    }): number;
	    constructor();
	    /**
	     * Indicates if a given state is active
	     * @param state
	     * @returns {boolean}
	     */
	    is(state: any): boolean;
	    getState(): any;
	    /**
	     * Creates an event listener for the given state
	     * @param state
	     * @param callback
	     */
	    onState(state: any, callback: any): void;
	    /**
	     * Clear all state listeners
	     */
	    removeStateListeners(): void;
	    setState(state: any): void;
	    addState(state: any): void;
	    reset(): void;
	    removeState(state: any): void;
	    private invokeStateListeners(state, prevState);
	}

	export class Level extends StateMachine {
	    static None: any;
	    static Error: any;
	    static Warn: any;
	    static Info: any;
	    static Debug: any;
	    static Verbose: any;
	}
	/**
	 * Browser-friendly logging utility with multiple loggers and level switches
	 * @author Greg Rozmarynowycz<greg@thunderlab.net>
	 */
	export class Logger {
	    private loggers;
	    private state;
	    /**
	     * @param {string} stack
	     * @param {number} [calls=0]
	     */
	    private static getTrace(stack, calls?);
	    constructor();
	    addLogger(logger: any, loggerLevel: any): void;
	    config(params: {
	        level: Level;
	    }): void;
	    error(message: string): any;
	    error(...args: any[]): any;
	    warn(message: string): any;
	    warn(...args: any[]): any;
	    info(message: string): any;
	    info(...args: any[]): any;
	    /**
	     * Output debug level logging message
	     * @param {string} message
	     */
	    debug(message: string): any;
	    debug(...args: any[]): any;
	    verbose(message: string): any;
	    verbose(...args: any[]): any;
	    private logOut(args, msgLevel, func);
	}

	/// <reference types="angular" />
	import 'reflect-metadata';
	import {IServiceProvider} from 'angular';
	export interface InjectableMethodCtor {
	    new (): InjectableMethod;
	}
	export interface InjectableMethod {
	    exec(...args: any[]): any;
	}
	/**
	 * Define the injection annotation for a given angular provider
	 * @param {string} identifier
	 * @returns {ParameterDecorator}
	 */
	export function inject(identifier: string): ParameterDecorator;
	export namespace inject {
	    const provider: (identifier: string) => ParameterDecorator;
	}
	export function ngAnnotateProvider(constructor: {
	    new (...args): IServiceProvider;
	}): void;
	/**
	 * Construct an angular annotation array from dependency metadata
	 * @param {Function} provider
	 * @param {Function} baseClass
	 * @returns {Array<string | Function>}
	 */
	export function ngAnnotate(provider: Function | InjectableMethodCtor, baseClass?: Function): Array<string | Function>;
	export interface DepTree {
	    [key: string]: string | DepTree;
	}
	export function buildTree(tree: DepTree, module: string): void;

declare const MDT: {
	    component: {
	        webGLStage: string;
	        renderTarget: string;
	    };
	    config: {
	        Path: string;
	    };
	    ['const']: {
	        Keys: string;
	        MaxFrameRate: string;
	        SampleCount: string;
	        ScaleFactor: string;
	    };
	    ng: {
	        $element: string;
	        $location: string;
	        $window: string;
	        $http: string;
	        $locationProvider: string;
	        $q: string;
	        $rootScope: string;
	        $scope: string;
	        $socket: string;
	        $state: string;
	        $stateParams: string;
	        $stateProvider: string;
	        $timeout: string;
	        $urlService: string;
	    };
	    AsyncRequest: string;
	    Camera: string;
	    Color: string;
	    Geometry: string;
	    Keyboard: string;
	    Logger: string;
	    Math: string;
	    MouseUtils: string;
	    ParticleEmitter: string;
	    ParticleEmitter2D: string;
	    Scheduler: string;
	    AppState: string;
	    StateMachine: string;
	    Thread: string;
	    RenderTarget: string;
	    Library: string;
	    webgl: {
	        ShaderSource: string;
	        WebGLStage: string;
	    };
	};
	export { MDT };


	/// <reference types="angular" />
	import {ILocationService} from 'angular';
	export class AppState extends StateMachine {
	    private $location;
	    private logger;
	    static Running: any;
	    static Loading: any;
	    static Debug: any;
	    static Suspended: any;
	    constructor($location: ILocationService, logger: Logger);
	    /**
	     * Adds exclusivity rules for app states to basic state-machine functionality
	     * @param {number} newState
	     */
	    addState(newState: number): void;
	    clearState(): any;
	}

	import {Vector3} from 'pulsar-lib';
	/**
	 * Provides utility functions for working with CSS colors
	 * @author Greg Rozmarynowycz <greg@thunderlab.net>
	 */
	export class Color {
	    /**
	     * Generate and RGBA color string from the provided values
	     * @param red {number}: 0-255
	     * @param green {number}: 0-255
	     * @param blue {number}: 0-255
	     * @param alpha {number}: 0-1
	     * @returns {string}
	     */
	    static rgba(red: number, green: number, blue: number, alpha: number): string;
	    /**
	     * Generate an HSLA color string from the provided values
	     * @param hue {number}: 0 - 255
	     * @param saturation {number}: 0 - 100
	     * @param lightness {number}: 0 - 100
	     * @param alpha {number}: 0 - 1
	     * @returns {string}
	     */
	    static hsla(hue: any, saturation: any, lightness: any, alpha: any): string;
	    /**
	     * Converts a series of hsl values or a vector to an rgba color set
	     * @param color {Vector3}: Vector with x, y, z components mapped to hue, saturation, lights values
	     */
	    static hslToRgb(color: Vector3): Vector3;
	    /**
	     * Converts a series of hsl values or a vector to an rgba color set
	     * @param hue {Vector3|number}: 0 - 255
	     * @param saturation {number}: 0 - 100
	     * @param lightness {number}: 0 - 100
	     */
	    static hslToRgb(hue: number, saturation: number, lightness: number): Vector3;
	    /**
	     * Creates an rgba color string from a vector
	     * @param vec
	     * @param a
	     * @return {string}
	     */
	    static rgbaFromVector(vec: any, a: any): string;
	}

	/**
	 * Created by gjrwcs on 9/15/2016.
	 */
	export type Image = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap;
	export type RenderingContext = CanvasRenderingContext2D | WebGLRenderingContext;
	export interface IRenderTarget {
	    getContext(): CanvasRenderingContext2D | WebGLRenderingContext;
	    getCanvas(): HTMLCanvasElement;
	    resize(scale?: number): any;
	    clear(): any;
	    getAspectRatio(): number;
	}
	export interface IRenderTargetOptions {
	    width: number;
	    height: number;
	}
	export abstract class RenderTarget implements IRenderTarget {
	    protected logger: Logger;
	    protected ctx: RenderingContext;
	    protected canvas: HTMLCanvasElement;
	    constructor(parameters: IRenderTargetOptions, logger: Logger);
	    getAspectRatio(): number;
	    abstract clear(): any;
	    protected abstract getNewContext(): RenderingContext;
	    getContext(): RenderingContext;
	    getCanvas(): HTMLCanvasElement;
	    resize(scale?: number): void;
	}
	export class RenderTarget2D extends RenderTarget {
	    protected ctx: CanvasRenderingContext2D;
	    clear(): void;
	    getContext(): CanvasRenderingContext2D;
	    protected getNewContext(): CanvasRenderingContext2D;
	}
	export class RenderTargetWebGL extends RenderTarget {
	    protected ctx: WebGLRenderingContext;
	    clear(): void;
	    getContext(): WebGLRenderingContext;
	    protected getNewContext(): WebGLRenderingContext;
	    private isWebGLSupported();
	}
	export interface IRenderTargetCtor {
	    new (...args: any[]): IRenderTarget;
	}
	export type RenderTargetFactory = <T extends IRenderTarget>(ctor: {
	    new (...args): T;
	}, options: IRenderTargetOptions) => T;
	export class renderTargetFactory implements InjectableMethod {
	    exec(logger: Logger): <T extends RenderTarget>(ctor: new (...args: any[]) => T, options: IRenderTargetOptions) => T;
	}

	export type ICommand = (deltaTime: number, totalTime: number) => void;
	export interface IUpdateable {
	    update: ICommand;
	}
	/**
	 * Executes and monitors the engine loop
	 */
	export class Scheduler {
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
	    suspend(e: Event): void;
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
	    schedule(operation: ICommand, order: number): void;
	    /**
	     * Queue a draw opeartion to be executed once and discarded
	     * @param operation
	     * @param zIndex
	     */
	    draw(operation: ICommand, zIndex: number): void;
	    /**
	     * Clears the set of registered doUpdate operations
	     */
	    reset(): void;
	    /**
	     * Toggles suspension of the main loop when the window is blurred
	     * @param flag
	     */
	    setSuspendOnBlur(flag: boolean): void;
	    /**
	     * Execute all doUpdate opeartions while preserving the doUpdate queue
	     * @param stepDeltaTime (in milliseconds)
	     * @param totalElapsedTime (in milliseconds)
	     */
	    protected doUpdate(stepDeltaTime: number, totalElapsedTime: number): void;
	    /**
	     * Execute all draw and post-draw commands, emptying each queue
	     * @param stepDeltaTime
	     * @param totalElapsedTime
	     */
	    protected doDraw(stepDeltaTime: number, totalElapsedTime: number): void;
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

	/// <reference types="angular" />
	import {IAugmentedJQuery, IComponentOptions, IController} from 'angular';
	export class RenderTargetCtrl implements IController {
	    protected logger: Logger;
	    protected $element: IAugmentedJQuery;
	    protected mState: any;
	    protected scheduler: Scheduler;
	    protected renderTargetFactory: RenderTargetFactory;
	    protected scale: number;
	    protected renderTarget: IRenderTarget;
	    protected ctx: RenderingContext;
	    private type;
	    private readonly NO_SUPPORT_MESSAGE;
	    static getController($element: IAugmentedJQuery): RenderTargetCtrl;
	    constructor(logger: Logger, $element: IAugmentedJQuery, mState: any, scheduler: Scheduler, renderTargetFactory: RenderTargetFactory);
	    $onInit(): void;
	    $onDestroy(): void;
	    getContext(): RenderingContext;
	    getRenderTarget(): IRenderTarget;
	    protected update(): void;
	    private onResize();
	}
	export const options: IComponentOptions;

	/// <reference types="gl-matrix" />
	import glMatrix = require('gl-matrix');
	export interface ITransform {
	    getParent(): ITransform;
	    vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform;
	    setPosition(x: number, y: number, z: number): ITransform;
	    getPosition(): Readonly<glMatrix.vec3>;
	    translate(x: number, y: number, z: number): ITransform;
	    vTranslate(delta: glMatrix.vec3): ITransform;
	    setScale(x: number, y: number, z: number): ITransform;
	    getScale(): Readonly<glMatrix.vec3>;
	    scaleBy(x: number, y: number, z: number): ITransform;
	    vScaleBy(delta: glMatrix.vec3): ITransform;
	    vSetRotation(orientation: glMatrix.quat | glMatrix.vec3): ITransform;
	    setRotation(yaw: number, pitch: number, roll: number): ITransform;
	    getRotation(): Readonly<glMatrix.quat>;
	    rotateBy(x: number, y: number, z: number): ITransform;
	    vRotateBy(delta: glMatrix.vec3): ITransform;
	    getMatrix(): glMatrix.mat4;
	}
	export class Transform implements ITransform {
	    private matrix;
	    private parent;
	    private position;
	    private scale;
	    private rotation;
	    private origin;
	    private isDirty;
	    /**
	     * Stores and manipulates _position, scale, and rotation data for an object
	     * @param {Transform} [parent=null]
	     *
	     * @property {Vector3} position
	     * @property {Vector3} scale
	     * @property {Vector3} rotation
	     *
	     * @constructor
	     */
	    constructor(parent?: ITransform);
	    /**
	     * Get the parent transform
	     * @returns {ITransform}
	     */
	    getParent(): ITransform;
	    /**
	     * Translate the transform using the velocity scaled by deltaTime
	     * @param velocity
	     * @param deltaTime
	     * @returns {Transform}
	     */
	    vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform;
	    getPosition(): glMatrix.vec3;
	    setPosition(x: number, y: number, z: number): ITransform;
	    /**
	     * move the transform by the given amount
	     * @param {number} x
	     * @param {number} [y]
	     * @param {number} [z]
	     * @returns {Transform}
	     */
	    translate(x: number, y: number, z: number): ITransform;
	    /**
	     * Translate by a vector
	     * @param {glMatrix.vec3} delta
	     */
	    vTranslate(delta: glMatrix.vec3): ITransform;
	    getScale(): glMatrix.vec3;
	    setScale(x: number, y: number, z: number): ITransform;
	    /**
	     * scale the transform by the given amount
	     * @param {number|Vector3} x
	     * @param {number} [y]
	     * @param {number} [z]
	     * @returns {Transform}
	     */
	    scaleBy(x: any, y: any, z: any): ITransform;
	    /**
	     * Scale by vector
	     * @param {glMatrix.vec3} scale
	     * @returns {Transform}
	     */
	    vScaleBy(scale: glMatrix.vec3): ITransform;
	    getRotation(): glMatrix.quat;
	    setRotation(yaw: number, pitch: number, roll: number): ITransform;
	    vSetRotation(orientation: glMatrix.vec3 | glMatrix.quat): ITransform;
	    /**
	     * rotate the transform by the given amount
	     * @param {number|Vector3} x
	     * @param {number} [y]
	     * @param {number} [z]
	     * @returns {Transform}
	     */
	    rotateBy(x: number, y: number, z: number): ITransform;
	    vRotateBy(delta: glMatrix.vec3): ITransform;
	    /**
	     * Get the transform matrix, re-calculating values if transform is dirty
	     * @returns {glMatrix.mat4}
	     */
	    getMatrix(): glMatrix.mat4;
	}

	/// <reference types="gl-matrix" />

	export interface IMeshOptions {
	    positions: glMatrix.vec3[];
	    indices: number[];
	    colors?: glMatrix.vec3[];
	}
	export class Mesh {
	    static VERT_SIZE: number;
	    private size;
	    private indexBuffer;
	    private vertexBuffer;
	    private positions;
	    private indices;
	    private vertexCount;
	    private indexCount;
	    /**
	     * Get the dimensions of the mesh buffer
	     * @param verts
	     */
	    private static getSize(verts);
	    /**
	     * Creates the normals for each face
	     * @param {glMatrix.vec3[]} verts
	     * @param {number[]} indices
	     * @returns {glMatrix.vec3[]}
	     */
	    private static calculateFaceNormals(verts, indices);
	    /**
	     * Calculate vertex normals by averaging the face normals for each vertex
	     * @param {glMatrix.vec3[]} verts
	     * @param {number[]} indices
	     * @param {glMatrix.vec3[]} faceNormals
	     * @returns {glMatrix.vec3[]}
	     */
	    private static calculateVertexNormals(verts, indices, faceNormals);
	    /**
	     * Construct a vertex buffer from the positions and normals arrays
	     * @param {glMatrix.vec3[]} positions
	     * @param {glMatrix.vec3[]} normals
	     * @param {glMatrix.vec3[]} colors
	     * @returns {ArrayBuffer}
	     */
	    private static buildVertexBuffer(positions, normals, colors);
	    /**
	     * Defines a set of points in space and how they form a 3D object
	     * @param {IMeshOptions} params
	     */
	    constructor(params: IMeshOptions);
	    getVertexCount(): number;
	    getIndexCount(): number;
	    getVertexBuffer(): Readonly<ArrayBuffer>;
	    getIndexBuffer(): Readonly<ArrayBuffer>;
	}

	export interface IWebGLResourceContext {
	    gl: WebGLRenderingContext;
	    program: WebGLProgram;
	    logger: Logger;
	    transformBuffer: ArrayBuffer;
	    renderTarget: IRenderTarget;
	}
	export interface IWebGLResourceCtor<Resource extends IWebGLResource, Options> {
	    new (context: IWebGLResourceContext, options: Options): Resource;
	}
	export interface IWebGLResource {
	    release(): void;
	    init(resourceCache: {
	        [name: string]: IWebGLResource;
	    }): void;
	}
	export abstract class WebGLResource implements IWebGLResource {
	    protected context: IWebGLResourceContext;
	    constructor(context: IWebGLResourceContext);
	    abstract release(): void;
	    init(resourceCache: {
	        [name: string]: IWebGLResource;
	    }): void;
	}

	export interface IWebGLMesh extends IWebGLResource {
	    getIndexBuffer(): WebGLBuffer;
	    getVertexBuffer(): WebGLBuffer;
	    getVertexCount(): number;
	    getVertexSize(): number;
	}
	export interface IWebGLMeshOptions {
	    mesh: Mesh;
	}
	export class WebGLMesh extends WebGLResource implements IWebGLMesh {
	    private glVertexBuffer;
	    private glIndexBuffer;
	    private vertexCount;
	    private vertexSize;
	    constructor(context: IWebGLResourceContext, options: IWebGLMeshOptions);
	    getIndexBuffer(): WebGLBuffer;
	    getVertexBuffer(): WebGLBuffer;
	    getVertexCount(): number;
	    getVertexSize(): number;
	    release(): void;
	}

	/// <reference types="gl-matrix" />

	export interface IFastTransform {
	    getOffset(): number;
	    getBuffer(): Float32Array;
	}
	/**
	 * Fast transform is a class designed to either front-load heavy lifting or offload it
	 * to the graphics card. This is achieved by creating views of individual transform components
	 * on a buffer that can be
	 */
	export class FastTransform implements ITransform, IFastTransform {
	    private offset;
	    static FAST_TRANSFORM_FLAG: number;
	    private buffer;
	    private scale;
	    private position;
	    private rotation;
	    private origin;
	    private parent;
	    /**
	     * Accepts an array buffer and position within that buffer to store data
	     * @param {ArrayBuffer} buffer
	     * @param {number} offset
	     */
	    constructor(buffer: ArrayBuffer, offset?: number);
	    /**
	     * Returns the offest of this transform in a shared array buffer (as determined during construction)
	     * @returns {number}
	     */
	    getOffset(): number;
	    getParent(): ITransform;
	    translate(x: number, y: number, z: number): ITransform;
	    vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform;
	    setPosition(x: number, y: number, z: number): ITransform;
	    getPosition(): Readonly<glMatrix.vec3>;
	    vTranslate(delta: glMatrix.vec3): ITransform;
	    setScale(x: number, y: number, z: number): ITransform;
	    getScale(): Readonly<glMatrix.vec3>;
	    scaleBy(x: number, y: number, z: number): ITransform;
	    vScaleBy(delta: glMatrix.vec3): ITransform;
	    vSetRotation(orientation: glMatrix.quat | glMatrix.vec3): ITransform;
	    getRotation(): Readonly<glMatrix.quat>;
	    setRotation(yaw: number, pitch: number, roll: number): ITransform;
	    /**
	     * rotate the transform by the given amount
	     * @param {number} x
	     * @param {number} [y]
	     * @param {number} [z]
	     * @returns {Transform}
	     */
	    rotateBy(x: number, y: number, z: number): ITransform;
	    vRotateBy(delta: glMatrix.vec3): ITransform;
	    /**
	     * This method doe NOT return a 3D Transform matrix, contains in sequence transform
	     * components: position, scale, quaternion rotation, origin
	     * @returns {glMatrix.mat4}
	     */
	    getBuffer(): Float32Array;
	    /**
	     * Returns 3D transform matrix. Warning: in FastTransform, this is a very slow, creating a new mat4 each time
	     * @returns {glMatrix.mat4}
	     */
	    getMatrix(): glMatrix.mat4;
	}

	/// <reference types="angular" />
	import {} from 'angular';
	export interface ILibrary<T, P> {
	    get(id: string | number): Promise<T>;
	    addSources(sources: Array<ISource<P>>): void;
	    getAllItems(): Promise<T[]>;
	}
	export interface ISource<T> {
	    get(id: string | number): Promise<T | string>;
	    getAll(): Promise<Array<T | string>>;
	    getOrder(): number;
	}
	export interface IAdapterParameters<T> {
	    source: any | string;
	    method: string;
	    successMethod?: string;
	    modules?: string[];
	    order?: number;
	    callback?: boolean;
	    inputTransform?: (id: string | number) => string | number;
	    outputTransform?: (result: any) => string | T;
	}
	export abstract class DTO<T> {
	    constructor(params: {
	        [K in keyof T]: any;
	    });
	}
	export class StaticSource<T> implements ISource<T> {
	    private entries;
	    private order;
	    constructor(entries: {
	        [id: string]: T;
	    }, order?: number);
	    get(id: string | number): Promise<string | T>;
	    getAll(): Promise<Array<string | T>>;
	    getOrder(): number;
	}
	/**
	 *
	 */
	export class SourceAdapter<T> implements ISource<T> {
	    private source;
	    private method;
	    private order;
	    private callback;
	    private successMethod;
	    private modules;
	    private inputTransform;
	    private outputTransform;
	    constructor(params: IAdapterParameters<T>);
	    get(id: string | number): Promise<T | string>;
	    getAll(): Promise<Array<string | T>>;
	    getOrder(): number;
	}
	/**
	 * Basic $http adapter
	 */
	export class HttpAdapter<T> extends SourceAdapter<T> {
	    constructor(path: string);
	}
	export interface IEntityCtor<T, P> {
	    new (params: P): T;
	}
	export interface ILibraryService {
	    get<T, P>(type: IEntityCtor<T, P> | {
	        new (...args): T;
	    }, id: string | number): Promise<T>;
	    getAll<T, P>(type: IEntityCtor<T, P> | {
	        new (...args): T;
	    }): Promise<T[]>;
	    addSources<T, P>(ctor: {
	        new (...args): T;
	    }, sources: Array<ISource<P>>): void;
	}
	export class LibraryProvider implements IServiceProvider {
	    private libaries;
	    constructor();
	    /**
	     * Add source entries for the given type
	     * @param {IEntityCtor<T, P>} ctor
	     * @param {Array<ISource<T>>} sources
	     */
	    addSources<T, P>(ctor: IEntityCtor<T, P>, sources: Array<ISource<P>>): void;
	    /**
	     * Add a library with sources configured after application setup
	     * @param {any} ctor
	     * @param {Array<ISource<any>>} sources
	     */
	    addPreparedSources<T>(ctor: {
	        new (...args): T;
	    }, sources: Array<ISource<any>>): void;
	    /**
	     * Retrieve entity of the given type and id
	     * @param {Function} type
	     * @param {string | number} id
	     * @returns {Promise<T>}
	     */
	    get<T>(type: Function, id: string | number): Promise<T>;
	    getAll<T>(type: Function): Promise<T[]>;
	    $get(): ILibraryService;
	}

	/// <reference types="gl-matrix" />
	import {quat, vec3} from 'gl-matrix';
	export interface IEntity {
	    getTransform(): ITransform;
	    update?(dt: number, tt: number): void;
	    getMesh(): IWebGLMesh;
	    getPosition(): vec3;
	    getRotation(): quat;
	    rotate(rotation: vec3): void;
	    translate(translation: vec3): void;
	    scale(scalar: number): void;
	    rotateTo(orientation: vec3 | quat): void;
	    destroy(): void;
	}
	export type EntityCollection<T> = T[];
	export abstract class Entity extends WebGLResource implements IEntity, IWebGLResource {
	    private meshName;
	    private static curId;
	    private static index;
	    private static updateMethods;
	    getPosition: () => vec3;
	    getRotation: () => quat;
	    rotate: (rotation: vec3) => void;
	    translate: (translation: vec3) => void;
	    rotateTo: (orientation: vec3 | quat) => void;
	    protected transform: ITransform;
	    private id;
	    private mesh;
	    static getIndex(): EntityCollection<IEntity>;
	    static getUpdateIndex(): EntityCollection<(dt: number, tt: number) => void>;
	    constructor(context: IWebGLResourceContext, meshName: string);
	    init(resources: {
	        [name: string]: IWebGLResource;
	    }): void;
	    scale(scalar: number): void;
	    update(dt: number, tt: number): void;
	    getTransform(): ITransform;
	    getMesh(): WebGLMesh;
	    destroy(): void;
	    release(): void;
	}

	/// <reference types="gl-matrix" />
	import {mat4} from 'gl-matrix';
	export interface ICamera {
	    /**
	     * Get normalized heading for the direction the camera is facing
	     * @returns {}
	     */
	    getForward(): vec3;
	    update(dt: number, tt: number): void;
	    /**
	     * Set the horizontal-vertical aspect ratio of the camera viewport
	     * @param {number} aspectRatio
	     */
	    setAspectRatio(aspectRatio: number): any;
	    /**
	     * Update the view matrix, calculated from position and heading, if it's stale
	     */
	    updateViewMatrix(): void;
	    /**
	     * Move forward along the heading vector (local Z axis)
	     * @param {number} distance
	     */
	    advance(distance: number): void;
	    /**
	     * Move to the side, along the local X axis
	     * @param {number} distance
	     */
	    strafe(distance: number): void;
	    /**
	     * Move up/down, along the world Y axis
	     * @param {number} distance
	     */
	    ascend(distance: number): void;
	    /**
	     * Rotate from local Euler angles, specified in radians
	     * @param {number} x
	     * @param {number} y
	     */
	    rotate(x: number, y: number): void;
	    /**
	     * Get the camera transform
	     * @returns {ITransform}
	     */
	    getTransform(): ITransform;
	    /**
	     * Get the current view matrix
	     * @returns {}
	     */
	    getViewMatrix(): mat4;
	    /**
	     * Get the current projection matrix
	     * @returns {}
	     */
	    getProjectionMatrix(): mat4;
	}
	export class Camera implements ICamera {
	    private aspectRatio;
	    private transform;
	    private projectionMatrix;
	    private viewMatrix;
	    private forward;
	    private stale;
	    private up;
	    private disp;
	    constructor(aspectRatio: number);
	    getForward(): vec3;
	    update(dt: number, tt: number): void;
	    updateViewMatrix(): void;
	    setAspectRatio(aspectRatio: number): void;
	    advance(distance: number): void;
	    strafe(distance: number): void;
	    ascend(distance: number): void;
	    rotate(x: number, y: number): void;
	    getTransform(): ITransform;
	    getViewMatrix(): mat4;
	    getProjectionMatrix(): mat4;
	}

	export const mallet: any;

	export class WebGLResourceFactory {
	    private context;
	    private library;
	    private resourceCache;
	    constructor(context: IWebGLResourceContext, library: ILibraryService);
	    init(meshNames: string[]): Promise<any>;
	    create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options?: O): R;
	    private registerMesh(name);
	}

	export interface IShader extends IWebGLResource {
	    prepare(context: IWebGLResourceContext): void;
	    getId(): string;
	    getShader(): WebGLShader;
	}
	export enum GLDataType {
	    BYTE = "BYTE",
	    FLOAT = "FLOAT",
	    SHORT = "SHORT",
	    UNSIGNED_SHORT = "UNSIGNED_SHORT",
	    UNSIGNED_BYTE = "UNSIGNED_BYTE",
	    HALF_FLOAT = "HALF_FLOAT",
	}
	export interface IAttribDescription {
	    name: string;
	    size: number;
	    normalize?: boolean;
	    stride?: number;
	    offset?: number;
	    type: GLDataType;
	}
	export enum GLUniformType {
	    uniform1f = "uniform1f",
	    uniform1fv = "uniform1fv",
	    uniform2f = "uniform2f",
	    uniform2fv = "uniform2fv",
	    uniform3f = "uniform3f",
	    uniform3fv = "uniform3fv",
	    uniform4f = "uniform4f",
	    uniform4fv = "uniform4fv",
	    uniformMatrix2fv = "uniformMatrix2fv",
	    uniformMatrix3fv = "uniformMatrix3fv",
	    uniformMatrix4fv = "uniformMatrix4fv",
	    uniform1i = "uniform1i",
	    uniform1iv = "uniform1iv",
	    uniform2i = "uniform2i",
	    uniform2iv = "uniform2iv",
	    uniform3i = "uniform3i",
	    uniform3iv = "uniform3iv",
	    uniform4i = "uniform4i",
	    uniform4iv = "uniform4iv",
	}
	export type GLMatrixSetter = (transpose: false, matrix: Float32Array | number[]) => void;
	export type GLVec4Setter = (x: number, y: number, z: number, w: number) => void;
	export type GLVec3Setter = (x: number, y: number, z: number) => void;
	export type GLVec2Setter = (x: number, y: number) => void;
	export interface IUniformDescription {
	    [name: string]: GLUniformType | IUniformDescription;
	}
	export interface IShaderOptions {
	    id: string;
	    type: ShaderType;
	    src: string;
	    spec: IShaderSpec;
	}
	export interface IShaderSpec {
	    attributes?: IAttribDescription[];
	    uniforms?: IUniformDescription;
	}
	export enum ShaderType {
	    VERTEX_SHADER = "VERTEX_SHADER",
	    FRAGMENT_SHADER = "FRAGMENT_SHADER",
	}
	export class ShaderDTO extends DTO<ShaderDTO> implements IShaderOptions {
	    id: string;
	    type: ShaderType;
	    src: string;
	    spec: IShaderSpec;
	}
	export class Shader extends WebGLResource implements IShader {
	    protected options: IShaderOptions;
	    protected id: string;
	    protected shader: WebGLShader;
	    constructor(context: IWebGLResourceContext, options: IShaderOptions);
	    getShader(): WebGLShader;
	    getId(): string;
	    prepare({gl}: IWebGLResourceContext): void;
	    release(): void;
	}

	export interface IBufferFormatOptions {
	    shaderSpec: IShaderSpec;
	}
	export interface IBufferFormat {
	    apply(): void;
	}
	export class BufferFormat extends WebGLResource implements IBufferFormat {
	    protected context: IWebGLResourceContext;
	    apply: () => void;
	    constructor(context: IWebGLResourceContext, options: IBufferFormatOptions);
	    release(): void;
	    /**
	     * Generates a layout method for the buffer with bound data to optimize for performance
	     * @param {IAttribDescription[]} attribs
	     * @returns {Function}
	     */
	    private createLayoutDescription(attribs);
	}

	export interface IProgramOptions {
	    shaders: {
	        vertex: IShaderOptions;
	        fragment: IShaderOptions;
	    };
	    name: string;
	}
	export interface IShaderProgram extends IWebGLResource {
	    getGLProgram(): WebGLProgram;
	    use(): void;
	    getUniformSetter(name: string): (...data) => void;
	}
	export class ProgramOptionsDTO extends DTO<IProgramOptions> implements IProgramOptions {
	    shaders: {
	        vertex: IShaderOptions;
	        fragment: IShaderOptions;
	    };
	    name: string;
	}
	export class ShaderProgram extends WebGLResource implements IShaderProgram {
	    protected context: IWebGLResourceContext;
	    private bufferFormat;
	    private uniforms;
	    private isActive;
	    constructor(context: IWebGLResourceContext, config: IProgramOptions);
	    getUniformSetter(name: string): (data: any) => void;
	    use(): void;
	    getGLProgram(): WebGLProgram;
	    release(): void;
	    protected createShader(config: IShaderOptions): IShader;
	    private cacheUniforms(spec);
	    private flattenUniforms(struct, keys?, pieces?);
	    private getUniformType(uniform, name);
	}

	/// <reference types="angular" />
	import {IQService} from 'angular';
	export interface IWebGLStage {
	    set(renderTarget: RenderTargetWebGL): void;
	    getFactory(): WebGLResourceFactory;
	    addProgram(programConfig: IProgramOptions): IShaderProgram;
	    setActiveProgram(name: string): void;
	    getContext(): IWebGLResourceContext;
	}
	export class WebGLStage implements IWebGLStage {
	    private library;
	    private $q;
	    private logger;
	    private renderTarget;
	    private gl;
	    private glFactory;
	    private context;
	    private programs;
	    constructor(library: ILibraryService, $q: IQService, logger: Logger);
	    set(renderTarget: RenderTargetWebGL): boolean;
	    getContext(): IWebGLResourceContext;
	    /**
	     * Create a new shader program and add it to available stage programs
	     * @param {IProgramOptions} programConfig
	     * @param {boolean} setActive
	     * @returns {IShaderProgram}
	     */
	    addProgram(programConfig: IProgramOptions, setActive?: boolean): IShaderProgram;
	    /**
	     * Set the active program
	     * @param {string} name
	     */
	    setActiveProgram(name: string): void;
	    getFactory(): WebGLResourceFactory;
	}

	export interface IRenderer {
	    renderEntity(entity: IEntity): void;
	    renderScene(): void;
	    setActiveCamera(camera: ICamera): void;
	    setActiveProgram(program: IShaderProgram): void;
	    clear(): void;
	}
	export interface IRendererOptions {
	    camera: ICamera;
	    program: IShaderProgram;
	}
	export class Renderer extends WebGLResource implements IRenderer {
	    private setViewMatrix;
	    private setWorldMatrix;
	    private setProjectionMatrix;
	    private activeCamera;
	    private activeProgram;
	    private entities;
	    constructor(context: IWebGLResourceContext, options: IRendererOptions);
	    renderScene(): void;
	    renderEntity(entity: IEntity): void;
	    setActiveCamera(camera: ICamera): void;
	    setActiveProgram(program: IShaderProgram): void;
	    clear(color?: number[]): void;
	    release(): void;
	}

	/// <reference types="angular" />
	import {} from 'angular';
	export const webGLStageOptions: IComponentOptions;

	/// <reference types="angular" />
	import angular = require('angular');
	export const malletGeometry: angular.IModule;

	export class WebGLLibraryConfig {
	    constructor(libraryProvider: LibraryProvider);
	}

	/// <reference types="angular" />

	export const malletWebGL: angular.IModule;

	/// <reference types="angular" />
	import {} from 'angular';
	export interface IWebGLApp {
	    preUpdate?(dt: number, tt: number): any;
	    postUpdate?(dt: number, tt: number): any;
	    init(context: IWebGLResourceContext): any;
	    config(): void;
	}
	export type UpdateMethod = (dt: number, tt: number) => void;
	export abstract class WebGLApp implements IController, IWebGLApp {
	    private maxFrameRate;
	    protected $q: IQService;
	    protected library: ILibraryService;
	    protected stage: IWebGLStage;
	    protected $element: IAugmentedJQuery;
	    protected logger: Logger;
	    preUpdate: UpdateMethod;
	    protected camera: ICamera;
	    protected renderer: IRenderer;
	    protected context: IWebGLResourceContext;
	    protected entities: IEntity[];
	    protected entityUpdates: UpdateMethod[];
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
	    constructor(maxFrameRate: number, $q: IQService, library: ILibraryService, stage: IWebGLStage, $element: IAugmentedJQuery, logger: Logger);
	    $postLink(): void;
	    abstract config(): void;
	    abstract init(context: IWebGLResourceContext): any;
	    postUpdate(dt: number, tt: number): void;
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
	    /**
	     * Initialize the main app loop
	     */
	    private startMainLoop();
	}


	/// <reference types="angular" />
	import {IPromise} from 'angular';
	export interface IThread {
	    /**
	     * Send a message to the worker
	     * @param {*} params
	     * @returns {Promise} resolves when the worker response is received
	     */
	    invoke(params: {
	        _id: number;
	    }): IPromise<any>;
	    /**
	     * Indicates if the worker has any pending invocations
	     * @returns {boolean}
	     */
	    isIdle(): boolean;
	}
	export class threadFactory implements InjectableMethod {
	    exec($q: IQService, logger: Logger): (script: string) => IThread;
	}

	export interface IItem {
	    next: IItem;
	    prev: IItem;
	    data?: any;
	}
	export class Item implements IItem {
	    data: any;
	    prev: IItem;
	    next: IItem;
	    constructor(data: any, prev: IItem, next: IItem);
	    remove(): void;
	}
	export interface ILinkedList<T> {
	    push(data: T): Item;
	    getNext(): T;
	    resetPointer(): void;
	}
	/**
	 * A linked list with self-managed item addition and deletion
	 */
	export class LinkedList<T> implements ILinkedList<T>, IItem {
	    private head;
	    private pointer;
	    private tail;
	    next: IItem;
	    prev: IItem;
	    constructor();
	    push(data: T): Item;
	    /**
	     * Return data from the current item and move to the next. Note: If the current item is removed - the item that would
	     * have its data returned - it will not be skipped if getNext is subsequently called
	     * @returns {T}
	     */
	    getNext(): T;
	    resetPointer(): void;
	}

	/// <reference types="angular" />
	export const portfolio: angular.IModule;
