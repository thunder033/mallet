interface Window {
    ResizeObserver: ResizeObserver; }

/**
 * The ResizeObserver interface is used to observe changes to Element's content
 * rect.
 *
 * It is modeled after MutationObserver and IntersectionObserver.
 */
interface ResizeObserver {
    /**
     * Adds target to the list of observed elements.
     */
    observe: (target: Element) => void;

    /**
     * Removes target from the list of observed elements.
     */
    unobserve: (target: Element) => void;

    /**
     * Clears both the observationTargets and activeTargets lists.
     */
    disconnect: () => void;

    new (callback: ResizeObserverCallback); }

/**
 * This callback delivers ResizeObserver's notifications. It is invoked by a
 * broadcast active observations algorithm.
 */
type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ResizeObserverEntry {
    /**
     * The Element whose size has changed.
     */
    readonly target: Element;

    /**
     * Element's content rect when ResizeObserverCallback is invoked.
     */
    readonly contentRect: DOMRectReadOnly;
    
    /**
     * @param target The Element whose size has changed.
     */
    new (target: Element); }
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
	 * Created by Greg on 3/24/2017.
	 */
	/**
	 * @enumerable decorator that sets the enumerable property of a class field to false.
	 * @param value true|false
	 */
	export function enumerable(value: boolean): (target: any, propertyKey: string) => void;

	/**
	 * Property decorator to define a state-machine state. Defines both forward and revers lookup properties
	 * @param {StateMachine} target
	 * @param {string} key
	 */
	export function state(target: Object, key: string): void;
	/**
	 * State machine implementation that with compound-state functionality
	 */
	export abstract class StateMachine {
	    private state;
	    private stateListeners;
	    /**
	     * Get value that represents all possible states for the machine
	     * @param {{new(): StateMachine}} machine
	     * @returns {number}
	     */
	    static all(machine: new () => StateMachine): number;
	    constructor();
	    /**
	     * Indicates if a given state is active
	     * @param state
	     * @returns {boolean}
	     */
	    is(state: any): boolean;
	    /**
	     * Get the current state value
	     * @returns {number}
	     */
	    getState(): number;
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
	    /**
	     * Set the state to the new value (does not add compound state)
	     * @param state
	     */
	    setState(state: number): void;
	    /**
	     * Add a state value to the current compound state
	     * @param {number} state
	     */
	    addState(state: any): void;
	    /**
	     * Remove all values from the compound state
	     */
	    reset(): void;
	    /**
	     * Remove a state from the current compound state
	     * @param {number} state
	     */
	    removeState(state: number): void;
	    /**
	     * Override the to string method to output the current state value (with full state name)
	     * @returns {string}
	     */
	    toString(): string;
	    /**
	     * Invoke listeners listening for the given state
	     * @param {number} state
	     * @param {number} prevState
	     */
	    private invokeStateListeners;
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
	    private tag;
	    /**
	     * @param {string} stack
	     * @param {number} [calls=0]
	     */
	    private static getTrace;
	    constructor(params?: {
	        level?: Level;
	        tag?: string;
	    });
	    addLogger(logger: any, loggerLevel: any): void;
	    config(params: {
	        level?: Level;
	        tag?: string;
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
	    private logOut;
	}

	import 'reflect-metadata';
	import {IController, IModule, IServiceProvider} from 'angular';
	export type InjectableMethodCtor = new () => InjectableMethod;
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
	    /**
	     * Inject a provider variation during configuration
	     * @param {string} identifier
	     * @returns {ParameterDecorator}
	     */
	    const provider: (identifier: string) => ParameterDecorator;
	    /**
	     * Inject a list of annotations for a method
	     * @param {string[]} identifiers
	     * @returns {MethodDecorator}
	     */
	    const list: (identifiers: string[]) => MethodDecorator;
	    /**
	     * Flag this method as using rest parameters (or arguments) to override function length check at
	     * when annotations are processed
	     * @returns {MethodDecorator}
	     */
	    const isRest: () => MethodDecorator;
	}
	/**
	 * Annotate an Angular provider definition (ex. with module.provider instead of service, controller, etc.)
	 * @param {{new(): angular.IServiceProvider}} constructor
	 */
	export function ngAnnotateProvider(constructor: new (...args: any[]) => IServiceProvider): void;
	export type AnnotatedProvider = Array<string | Function>;
	export type AnnotatedController = Array<string | (new (...args: any[]) => IController) | ((...args: any[]) => void | IController)>;
	/**
	 * Construct an angular annotation array from dependency metadata
	 * @param {Function} provider: A class (or subclass) with @inject decorators defining dependencies
	 * @param {Function} baseClass: For a subclass with no injections, a class in the prototype chain that has dependencies
	 * @returns {Array<string | Function>}
	 */
	export function ngAnnotate(provider: IController, baseClass?: Function): AnnotatedController;
	/**
	 * Execute the {@link InjectableMethod} as a configuration method for the module
	 * @param {angular.IModule} module
	 * @returns {ClassDecorator}
	 * @constructor
	 */
	export function Config(module: IModule): ClassDecorator;
	/**
	 * Execute the {@link InjectableMethod} as a run method for the module
	 * @param {angular.IModule} module
	 * @returns {ClassDecorator}
	 * @constructor
	 */
	export function Run(module: IModule): ClassDecorator;
	/**
	 * The Dependency Tree pattern builds a system to minimize stringly-typing of dependency references
	 */
	export interface DepTree {
	    [key: string]: string | DepTree;
	}
	/**
	 * Traverse through a dependency tree and build descriptive, unique keys to each item in the tree
	 * @param {DepTree} tree
	 * @param {string} module
	 */
	export function buildTree(tree: DepTree, module: string): void;

	 declare const MDT: {
	    component: {
	        debugger: string;
	        renderTarget: string;
	        webGLApp: string;
	        webGLStage: string;
	    };
	    config: {
	        EmbeddedStyles: string;
	        Path: string;
	        mallet: string;
	    };
	    const: {
	        BuildVersion: string;
	        Keys: string;
	        LoggingLevel: string;
	        MaxFrameRate: string;
	        SampleCount: string;
	        ScaleFactor: string;
	    };
	    ng: {
	        $document: string;
	        $element: string;
	        $http: string;
	        $location: string;
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
	        $window: string;
	    };
	    AppState: string;
	    AsyncRequest: string;
	    Camera: string;
	    Color: string;
	    DynamicStylesheet: string;
	    Geometry: string;
	    Keyboard: string;
	    Library: string;
	    Logger: string;
	    Math: string;
	    MouseUtils: string;
	    ParticleEmitter: string;
	    ParticleEmitter2D: string;
	    RenderTarget: string;
	    Scheduler: string;
	    StateMachine: string;
	    Thread: string;
	    webgl: {
	        ShaderSource: string;
	        WebGLStage: string;
	    };
	};
	export { MDT };

	/**
	 * Logger instance configured and exposed through Mallet DI to
	 * other modules
	 * @extends Logger
	 */
	export class MalletLogger extends Logger {
	    constructor(level: Level);
	}

	/**
	 * Created by gjrwcs on 9/15/2016.
	 */
	export type MalletImage = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap;
	export type RenderingContext = CanvasRenderingContext2D | WebGLRenderingContext;
	export interface IRenderTarget {
	    /**
	     * Get the canvas rendering context
	     * @returns {CanvasRenderingContext2D | WebGLRenderingContext}
	     */
	    getContext(): CanvasRenderingContext2D | WebGLRenderingContext;
	    /**
	     * Get the raw canvas element
	     * @returns {HTMLCanvasElement}
	     */
	    getCanvas(): HTMLCanvasElement;
	    /**
	     * Adjust the pixel-density of the canvas; does change the size of the canvas element
	     * @param {number} scale
	     */
	    resize(scale?: number): any;
	    /**
	     * Clear all image data drawn on the canvas
	     */
	    clear(): any;
	    /**
	     * Get the width-to-height aspect ratio of the canvas as drawn
	     * @returns {number}
	     */
	    getAspectRatio(): number;
	}
	export interface IRenderTargetOptions {
	    width: number;
	    height: number;
	}
	/**
	 * Manages the life cycle of a canvas; is agnostic to the render method
	 * utilized for the canvas.
	 * @implements IRenderTarget
	 */
	export abstract class RenderTarget implements IRenderTarget {
	    protected logger: Logger;
	    protected ctx: RenderingContext;
	    protected canvas: HTMLCanvasElement;
	    constructor(parameters: IRenderTargetOptions, logger: Logger);
	    getAspectRatio(): number;
	    abstract clear(): any;
	    /**
	     * Create and configure a new drawing context of the appropriate type
	     * @returns {RenderingContext}
	     */
	    protected abstract getNewContext(): RenderingContext;
	    getContext(): RenderingContext;
	    getCanvas(): HTMLCanvasElement;
	    resize(scale?: number): void;
	}
	/**
	 * RenderTarget configured for usage with 2d canvas drawing context
	 * @extends RenderTarget
	 * @implements IRenderTarget
	 */
	export class RenderTarget2D extends RenderTarget {
	    protected ctx: CanvasRenderingContext2D;
	    clear(): void;
	    getContext(): CanvasRenderingContext2D;
	    protected getNewContext(): CanvasRenderingContext2D;
	}
	/**
	 * RenderTarget configured for usage with WebGL canvas drawing context
	 * @extends RenderTarget
	 * @implements IRenderTarget
	 */
	export class RenderTargetWebGL extends RenderTarget {
	    protected ctx: WebGLRenderingContext;
	    clear(): void;
	    getContext(): WebGLRenderingContext;
	    protected getNewContext(): WebGLRenderingContext;
	    resize(scale?: number): void;
	    /**
	     * Determines if WebGL is supported in the current browser
	     * @returns {boolean}
	     */
	    private isWebGLSupported;
	}
	export type IRenderTargetCtor = new (...args: any[]) => IRenderTarget;
	/**
	 * @function RenderTargetFactory
	 * Creates a new {@link IRenderTarget} instance of the given constructor
	 * @param {IRenderTargetCtor} ctor - the type of render target to create
	 * @param {IRenderTargetOptions} options - parameters to pass to the render target
	 * @return {IRenderTarget} the created render target
	 *
	 * @example
	 * const width = 100;
	 * const height = 100;
	 * const renderTarget = renderTargetFactory(RenderTargetWebGL, {width, height});
	 */
	export type RenderTargetFactory = <T extends IRenderTarget>(ctor: new (...args: any[]) => T, options: IRenderTargetOptions) => T;
	export class renderTargetFactory implements InjectableMethod {
	    exec(logger: Logger): <T extends RenderTarget>(ctor: new (...args: any[]) => T, options: IRenderTargetOptions) => T;
	}

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

	export type ICommand = (deltaTime: number, totalTime: number) => void;
	/**
	 * Executes and monitors the engine loop
	 * @deprecated This is now replaced with the new App-classes, ex. {@link WebGLApp}
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
	    private static scheduleCommand;
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
	     * Queue a post process operation to be executed one and discarded
	     * @param operation
	     * @param zIndex
	     */
	    postProcess(operation: ICommand, zIndex: number): void;
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
	     * @param stepDeltaTime
	     * @param totalElapsedTime
	     */
	    private doUpdate;
	    /**
	     * Execute all draw and post-draw commands, emptying each queue
	     * @param stepDeltaTime
	     * @param totalElapsedTime
	     */
	    private doDraw;
	    /**
	     * Update the FPS value
	     * @param totalElapsedTime
	     */
	    private updateFPS;
	    /**
	     * Derived From
	     * Isaac Sukin
	     * http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
	     */
	    private mainLoop;
	}

	import {IAugmentedJQuery, IComponentOptions} from 'angular';
	/**
	 * Creates, configures and provides DI access to a managed canvas instance for usage as a render target
	 * @implements IController
	 */
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
	    private resizeObserver;
	    /**
	     * This method can only be called in {@link angular.IController.$postLink} hook or later in the Angular lifecycle.
	     * Retrieves the {@link RenderTargetCtrl} for the render target element, allowing access to the {@link RenderTarget}
	     * instance. A {@link ReferenceError} will be thrown if controller retrieval fails.
	     *
	     * @param {angular.IAugmentedJQuery} $element - linked render target element
	     * @returns {RenderTargetCtrl} - associated controller
	     */
	    static getController($element: IAugmentedJQuery): RenderTargetCtrl;
	    constructor(logger: Logger, $element: IAugmentedJQuery, mState: any, scheduler: Scheduler, renderTargetFactory: RenderTargetFactory);
	    $onInit(): void;
	    $postLink(): void;
	    $onDestroy(): void;
	    getContext(): RenderingContext;
	    getRenderTarget(): IRenderTarget;
	    protected update(): void;
	    private onResize;
	}
	export const options: IComponentOptions;

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
	    /**
	     * A class or object, or injector identifier (e.g. $http)
	     */
	    source: any | string;
	    /**
	     * Retrieval method on the source
	     */
	    method: string;
	    /**
	     * A method to execute on successful retrieval, before outputTransform
	     */
	    successMethod?: string;
	    /**
	     * If an injector identifier is provided, a list of angular modules to load
	     */
	    modules?: string[];
	    /**
	     * Control the fallback order of when the source is called
	     */
	    order?: number;
	    /**
	     * Execute the source getter with a callback pattern instead of promise pattern
	     */
	    callback?: boolean;
	    /**
	     * Data transform to apply to input parameters to the source
	     * @param {string | number} id
	     * @returns {string | number}
	     */
	    inputTransform?: (id: string | number) => string | number;
	    /**
	     * Data transform to apply to the response
	     * @param result
	     * @returns {string}
	     */
	    outputTransform?: (result: any) => string | T;
	}
	/**
	 * The DTO class provides a type-safe wrapper for raw data structures. In the context of
	 * the Library module, it enables importing sources
	 */
	export class DTO<T> {
	    constructor(params: {
	        [K in keyof T]: any;
	    });
	}
	/**
	 * A library source that has pre-defined (i.e. hard-coded) entries. This should be used for data
	 * collections that have mixed sources (some dynamic entries) or that may be converted to dynamic
	 * sources in the future
	 */
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
	 * The source adapter allows any third-party data source to be ingested into the library
	 */
	export class SourceAdapter<T> implements ISource<T> {
	    private source;
	    private readonly method;
	    private readonly order;
	    private readonly callback;
	    private readonly successMethod;
	    private modules;
	    private readonly inputTransform;
	    private readonly outputTransform;
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
	export class ImageAdapter extends SourceAdapter<HTMLImageElement> {
	    constructor(path?: string);
	}
	export type IEntityCtor<T, P> = new (params: P) => T;
	export interface ILibraryService {
	    get<T, P>(type: IEntityCtor<T, P> | (new (...args: any[]) => T), id: string | number): Promise<T>;
	    getAll<T, P>(type: IEntityCtor<T, P> | (new (...args: any[]) => T)): Promise<T[]>;
	    addSources<T, P>(ctor: new (...args: any[]) => T, sources: Array<ISource<P>>): void;
	}
	export class LibraryProvider implements IServiceProvider {
	    private libraries;
	    constructor();
	    /**
	     * Add source entries for the given type
	     * @param {IEntityCtor<T, P>} ctor
	     * @param {Array<ISource<T>>} sources
	     */
	    addSources<T, P>(ctor: IEntityCtor<T, P>, sources: Array<ISource<P>>): void;
	    /**
	     * Add a library with sources configured after application setup
	     * @param {*} ctor
	     * @param {Array<ISource<*>>} sources
	     */
	    addPreparedSources<T>(ctor: new (...args: any[]) => T, sources: Array<ISource<any>>): void;
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

	export interface IStylesheetOptions {
	    id: string;
	    src: string;
	}
	export enum EmbeddedStyle {
	    MalletBase = "mallet-base",
	    Debugger = "debugger"
	}
	export class StylesheetDTO extends DTO<StylesheetDTO> implements IStylesheetOptions {
	    id: string;
	    src: string;
	}
	export class MalletLibraryConfig {
	    constructor(libraryProvider: LibraryProvider);
	}

	import {} from 'angular';
	export interface IEmbeddedStylesConfig {
	    getStyles(): string[];
	}
	export class EmbeddedStylesConfigProvider implements IServiceProvider {
	    private readonly configuredStyles;
	    constructor();
	    useStyle(id: EmbeddedStyle): void;
	    $get(): IEmbeddedStylesConfig;
	    private getConfiguredStyles;
	}

	import {} from 'angular';
	export interface IMalletConfig {
	}
	export class MalletConfigProvider implements IServiceProvider {
	    private embeddedStylesConfig;
	    constructor(embeddedStylesConfig: EmbeddedStylesConfigProvider);
	    useStyle(id: EmbeddedStyle): void;
	    $get(): IMalletConfig;
	}

	import glMatrix = require('gl-matrix');
	/**
	 * Provides a structure for the spacial parameters of an object in 3 dimensions, with
	 * methods to modify, access, and utilize this data.
	 *
	 * Methods prefixed with a "v" accept a glMatrix vector (an array), while those without
	 * accept individual component values
	 * @interface
	 */
	export interface ITransform {
	    /**
	     * Get the parent transform
	     * @returns {ITransform} the parent transform instance
	     */
	    getParent(): ITransform;
	    /**
	     * Translate the transform using the velocity scaled by deltaTime
	     * @param velocity
	     * @param deltaTime
	     * @returns {ITransform} the transform instance
	     */
	    vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform;
	    /**
	     * Set the position of the transform
	     * @param {number} x - new X position value
	     * @param {number} y - new Y position value
	     * @param {number} z - new Z position value
	     * @returns {ITransform} the transform instance
	     */
	    setPosition(x: number, y: number, z: number): ITransform;
	    /**
	     * Get the position of the transform represented as a vector
	     * @returns {Readonly<glMatrix.vec3>}
	     */
	    getPosition(): Readonly<glMatrix.vec3>;
	    /**
	     * Move the transform by the given amount
	     * @param {number} x - delta on X-axis
	     * @param {number} y - delta on Y-axis
	     * @param {number} z - delta on Z-axis
	     * @returns {ITransform} the transform instance
	     */
	    translate(x: number, y: number, z: number): ITransform;
	    /**
	     * Translate by vector component values on respective axes
	     * @param {glMatrix.vec3} delta [X, Y, Z]
	     * @returns {ITransform} the transform instance
	     */
	    vTranslate(delta: glMatrix.vec3): ITransform;
	    /**
	     * Set the scale of the transform on each axis
	     * @param {number} x - new scale value on X-axis
	     * @param {number} y - new scale value on Y-axis
	     * @param {number} z - new scale value on Z-axis
	     * @returns {ITransform}
	     */
	    setScale(x: number, y: number, z: number): ITransform;
	    /**
	     * Get the scale of the transform represented as a vector
	     * @returns {Readonly<glMatrix.vec3>}
	     */
	    getScale(): Readonly<glMatrix.vec3>;
	    /**
	     * Scale the transform by the given amount on each axis
	     * @param {number} x - scalar applied to X-axis
	     * @param {number} y - scalar applied to Y-axis
	     * @param {number} z - scalar applied to Z-axis
	     * @returns {ITransform} the transform instance
	     */
	    scaleBy(x: number, y: number, z: number): ITransform;
	    /**
	     * Scale by vector component values on respective axes
	     * @param {glMatrix.vec3} scale value on respective axes [X, Y, Z]
	     * @returns {ITransform} the transform instance
	     */
	    vScaleBy(scale: glMatrix.vec3): ITransform;
	    /**
	     * Sets the orientation of the transform derived from the Euler angles (radians) or directly from a quaternion
	     * @param {glMatrix.vec3 | glMatrix.quat} orientation - the new orientation
	     * @returns {ITransform} the transform instance
	     */
	    vSetRotation(orientation: glMatrix.quat | glMatrix.vec3): ITransform;
	    /**
	     * Create a new orientation from the Euler values in radians
	     * @param {number} yaw - new orientation on X-axis
	     * @param {number} pitch - new orientation on Y-axis
	     * @param {number} roll - new orientation on Z-axis
	     * @returns {ITransform} the transform instance
	     */
	    setRotation(yaw: number, pitch: number, roll: number): ITransform;
	    /**
	     * Get the orientation of the transform represented as a quaternion
	     * @returns {Readonly<glMatrix.quat>}
	     */
	    getRotation(): Readonly<glMatrix.quat>;
	    /**
	     * Rotate the transform by the given amount on each Euler axis, units in radians
	     * @param {number} x - orientation delta on X-axis
	     * @param {number} y - orientation delta on Y-axis
	     * @param {number} z - orientation delta on Z-axis
	     * @returns {ITransform} the transform instance
	     */
	    rotateBy(x: number, y: number, z: number): ITransform;
	    /**
	     * Rotate the transform by Euler components in the vector
	     * @param {module:gl-matrix.vec3} delta components in radians [X, Y, Z]
	     * @returns {ITransform} the transform instance
	     */
	    vRotateBy(delta: glMatrix.vec3): ITransform;
	    /**
	     * Get the transform matrix, re-calculating values if transform is dirty
	     * @returns {glMatrix.mat4}
	     */
	    getMatrix(): glMatrix.mat4;
	}
	/**
	 * Basic implementation of transform class that stores each set of values
	 * in a separate object, marking the resulting matrix as dirty until it is
	 * requested
	 * @implements ITransform
	 */
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
	     * @param {ITransform} [parent=null]
	     *
	     * @property {Vector3} position
	     * @property {Vector3} scale
	     * @property {Vector3} rotation
	     *
	     * @constructor
	     */
	    constructor(parent?: ITransform);
	    getParent(): ITransform;
	    vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform;
	    getPosition(): glMatrix.vec3;
	    setPosition(x: number, y: number, z: number): ITransform;
	    translate(x: number, y: number, z: number): ITransform;
	    vTranslate(delta: glMatrix.vec3): ITransform;
	    getScale(): glMatrix.vec3;
	    setScale(x: number, y: number, z: number): ITransform;
	    scaleBy(x: any, y: any, z: any): ITransform;
	    vScaleBy(scale: glMatrix.vec3): ITransform;
	    getRotation(): glMatrix.quat;
	    setRotation(yaw: number, pitch: number, roll: number): ITransform;
	    vSetRotation(orientation: glMatrix.vec3 | glMatrix.quat): ITransform;
	    rotateBy(x: number, y: number, z: number): ITransform;
	    vRotateBy(delta: glMatrix.vec3): ITransform;
	    getMatrix(): glMatrix.mat4;
	    toString(): string;
	}

	import {mat4, vec3} from 'gl-matrix';
	export interface ICamera {
	    /**
	     * Get normalized heading for the direction the camera is facing
	     * @returns {glMatrix.vec3}
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
	     * @param {number} distance - how far to move; positive numbers move "forward", negative "backwards"
	     */
	    advance(distance: number): void;
	    /**
	     * Move to the side, along the local X axis
	     * @param {number} distance - how far to move; positive numbers move "right", negative "left"
	     */
	    strafe(distance: number): void;
	    /**
	     * Move up/down, along the world Y axis
	     * @param {number} distance - how far to move; positive numbers move "up", negative "down"
	     */
	    ascend(distance: number): void;
	    /**
	     * Rotate from local Euler angles, specified in radians
	     * @param {number} x - X-axis rotation in radians
	     * @param {number} y - Y-axis rotation in radians
	     */
	    rotate(x: number, y: number): void;
	    /**
	     * Get the camera transform
	     * @returns {ITransform}
	     */
	    getTransform(): ITransform;
	    /**
	     * Get the current view matrix
	     * @returns {glMatrix.mat4}
	     */
	    getViewMatrix(): mat4;
	    /**
	     * Get the current projection matrix
	     * @returns {glMatrix.mat4}
	     */
	    getProjectionMatrix(): mat4;
	}
	/**
	 * Basic camera implementation
	 * @implements ICamera
	 */
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


	import {vec2} from 'gl-matrix';
	export interface IMeshOptions {
	    positions: glMatrix.vec3[];
	    faces: number[][];
	    normals?: glMatrix.vec3[];
	    uvs?: glMatrix.vec2[];
	    colors?: glMatrix.vec3[];
	}
	export interface IVertex {
	    position: vec3;
	    normal: vec3;
	    uv: vec2;
	    index: number;
	}
	/**
	 * Constructs an optimized mesh from input data, with buffers ready to be utilized for
	 * rendering pipeline
	 */
	export class Mesh {
	    /** @description number of array elements vertex requires */
	    static VERT_SIZE: number;
	    private positions;
	    private uvs;
	    private indices;
	    private vertices;
	    private vertexList;
	    private indexBuffer;
	    private vertexBuffer;
	    private size;
	    private vertexCount;
	    private indexCount;
	    /**
	     * Generate a unique primitive identifier for vertex attribute indices - allows us to only
	     * create the vertices need to an avoid unnecessary duplication
	     * @param {number[]} vertIndices
	     */
	    private static getVertHash;
	    /**
	     * Get the dimensions of the mesh buffer
	     * @param verts
	     */
	    private static getSize;
	    /**
	     * Creates the normals for each face
	     * @param {glMatrix.vec3[]} verts
	     * @param {number[]} indices
	     * @returns {glMatrix.vec3[]}
	     */
	    private static calculateFaceNormals;
	    /**
	     * Defines a set of points in space and how they form a 3D object
	     * @param {IMeshOptions} params
	     */
	    constructor(params: IMeshOptions);
	    /**
	     * Release all the data we don't need after processing the input data
	     */
	    protected cleanUp(): void;
	    protected collectVertexList(): void;
	    /**
	     * Construct a vertex buffer from list of vertices and set it on instance
	     */
	    protected buildVertexBuffer(): void;
	    /**
	     * Calculate vertex normals by averaging the face normals for each vertex
	     * @param {vec3[]} faceNormals
	     * @returns {vec3[]}
	     */
	    protected calculateVertexNormals(faceNormals: glMatrix.vec3[]): void;
	    protected readFace(face: number[]): void;
	    protected createVertex(positionIndex: number, uvIndex: number): IVertex;
	    getVertexCount(): number;
	    getIndexCount(): number;
	    getVertexBuffer(): Readonly<ArrayBuffer>;
	    getIndexBuffer(): Readonly<ArrayBuffer>;
	}

	import {vec4} from 'gl-matrix';
	export type ColorDef = vec4 | vec3 | [number, number, number] | [number, number, number, number] | string;
	export interface IMaterial {
	    apply(): any;
	}
	export interface IMaterialOptions {
	    texture?: WebGLTexture | MalletImage;
	    diffuse?: ColorDef;
	}
	export class Material extends WebGLResource implements IMaterial {
	    private static defaultColor;
	    private readonly color;
	    private readonly texture;
	    private static parseColorDef;
	    constructor(options: IMaterialOptions);
	    apply(): void;
	    release(): void;
	    private parseInputTexture;
	    private createDefaultTexture;
	}

	export interface IWebGLResourceFactory {
	    create<R extends IWebGLResource>(ctor: IWebGLSimpleResourceCtor<R>): R;
	    create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O): R;
	}
	/**
	 * Provides interface to create new {@link IWebGLResource} instances with access to the existing
	 * (white-listed) cache of resources, including meshes
	 */
	export class WebGLResourceFactory implements IWebGLResourceFactory {
	    private library;
	    private resourceCache;
	    constructor(library: ILibraryService);
	    /**
	     * Cache pre-defined resources for instant access
	     * @param {string[]} meshNames
	     * @returns {Promise<*>}
	     */
	    init(meshNames: string[], materialNames: any): Promise<any>;
	    /**
	     * Create a new resource instance with no parameters (class must have default constructor)
	     * @param {IWebGLSimpleResourceCtor<R extends IWebGLResource>} ctor
	     * @returns {@link IWebGLResource} created resource instance
	     */
	    create<R extends IWebGLResource>(ctor: IWebGLSimpleResourceCtor<R>): R;
	    /**
	     * Create a parameterized resource instance
	     * @param {IWebGLResourceCtor<R extends IWebGLResource, O>} ctor
	     * @param {O} options
	     * @returns {@link IWebGLResource} create resource instance
	     */
	    create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O): R;
	    /**
	     * Retrieve a mesh from the library and cache it for synchronous access
	     * @param {string} name
	     * @returns {Promise<WebGLMesh>}
	     */
	    private registerMesh;
	    private registerMaterial;
	}

	export interface IWebGLResourceContext {
	    gl: WebGLRenderingContext;
	    logger: Logger;
	    transformBuffer: ArrayBuffer;
	    renderTarget: IRenderTarget;
	    factory: IWebGLResourceFactory;
	}

	export type IWebGLResourceCtor<Resource extends IWebGLResource, Options> = new (options: Options) => Resource;
	export type IWebGLSimpleResourceCtor<Resource extends IWebGLResource> = new () => Resource;
	export interface IWebGLResource {
	    release(): void;
	    init(resourceCache: {
	        [name: string]: IWebGLResource;
	    }): void;
	}
	/**
	 * Allows application components to inherit the ability to arbitrarily access
	 * to/of WebGL resources without manually passing context
	 */
	export abstract class WebGLResource implements IWebGLResource {
	    private static currentGuid;
	    private static contexts;
	    protected context: Readonly<IWebGLResourceContext>;
	    private guid;
	    /**
	     * Retrieve an indexed WebGL resource context, if it is found
	     * @param {string} name
	     * @returns {IWebGLResourceContext}
	     */
	    static getContext(name?: string): IWebGLResourceContext;
	    /**
	     * Create and index a new WebGL resource context
	     * @param {IWebGLResourceContext} properties
	     * @param {string} name - unique identifier for the new context
	     * @returns {IWebGLResourceContext} - the new created context
	     */
	    static buildContext(properties: IWebGLResourceContext, name?: string): IWebGLResourceContext;
	    constructor(contextName?: string);
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
	/**
	 * Reference to mesh (vertex & index buffer) loaded into vram
	 */
	export class WebGLMesh extends WebGLResource implements IWebGLMesh {
	    private glVertexBuffer;
	    private glIndexBuffer;
	    private vertexCount;
	    private vertexSize;
	    constructor(options: IWebGLMeshOptions);
	    getIndexBuffer(): WebGLBuffer;
	    getVertexBuffer(): WebGLBuffer;
	    getVertexCount(): number;
	    getVertexSize(): number;
	    release(): void;
	}


	export interface IFastTransform {
	    /**
	     * Returns the offest of this transform in a shared array buffer (as determined during construction)
	     * @returns {number}
	     */
	    getOffset(): number;
	    /**
	     * This method doe NOT return a 3D Transform matrix, contains in sequence transform
	     * components: position, scale, quaternion rotation, origin
	     * @returns {glMatrix.mat4}
	     */
	    getBuffer(): Float32Array;
	}
	/**
	 * Fast transform is a class designed to either front-load heavy lifting or offload it
	 * to the graphics card. This is achieved by creating views of individual transform components
	 * on a buffer that can be directly copied to graphics card memory, where the actual transform
	 * matrix can be calculated. The CPU only has to handle the simple calculations of updating
	 * the transform vector components.
	 * @implements ITransform, IFastTransform
	 */
	export class FastTransform implements ITransform, IFastTransform {
	    private offset;
	    static readonly BUFFER_LENGTH = 16;
	    static readonly FAST_TRANSFORM_FLAG = -1;
	    private readonly buffer;
	    private readonly scale;
	    private readonly position;
	    private readonly rotation;
	    private readonly origin;
	    private parent;
	    /**
	     * Accepts an array buffer and position within that buffer to store data
	     * @param {ArrayBuffer} buffer
	     * @param {number} [offset] bytes fast transform is offset from the start of the buffer
	     */
	    constructor(buffer: ArrayBuffer, offset?: number);
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
	    rotateBy(x: number, y: number, z: number): ITransform;
	    vRotateBy(delta: glMatrix.vec3): ITransform;
	    getBuffer(): Float32Array;
	    /**
	     * Returns 3D transform matrix. Warning: in this implementation, this is a very slow, creating a new mat4 each time
	     * @returns {glMatrix.mat4}
	     */
	    getMatrix(): glMatrix.mat4;
	}

	import {quat} from 'gl-matrix';
	export interface IEntity {
	    getTransform(): ITransform;
	    /**
	     * Operations to perform on each game loop iteration. Base current method is current no-op
	     * @param {number} dt - time elapsed in ms since last update
	     * @param {number} tt - total time elapsed since loop was invoked
	     */
	    update?(dt: number, tt: number): void;
	    getMesh(): IWebGLMesh;
	    getMaterial(): IMaterial;
	    getPosition(): vec3;
	    getRotation(): quat;
	    rotate(rotation: vec3): void;
	    translate(translation: vec3): void;
	    /**
	     * Scale the entity proportionally on all axes by scalar value
	     * @param {number} scalar
	     */
	    scale(scalar: number): void;
	    rotateTo(orientation: vec3 | quat): void;
	    destroy(): void;
	}
	export interface IEntityOptions {
	    meshName: string;
	    materialName: string;
	}
	export type EntityCollection<T> = T[];
	/**
	 * @implements IEntity, IWebGlResources
	 * @extends WebGLResource
	 */
	export abstract class Entity extends WebGLResource implements IEntity, IWebGLResource {
	    private options;
	    private static curId;
	    private static index;
	    private static updateMethods;
	    getPosition: () => vec3;
	    getRotation: () => quat;
	    rotate: (rotation: vec3) => void;
	    translate: (translation: vec3) => void;
	    rotateTo: (orientation: vec3 | quat) => void;
	    protected transform: ITransform;
	    private readonly id;
	    private mesh;
	    private material;
	    static getIndex(): EntityCollection<IEntity>;
	    static getUpdateIndex(): EntityCollection<(dt: number, tt: number) => void>;
	    protected constructor(options: IEntityOptions);
	    init(resources: {
	        [name: string]: IWebGLResource;
	    }): void;
	    scale(scalar: number): void;
	    update(dt: number, tt: number): void;
	    getTransform(): ITransform;
	    getMesh(): WebGLMesh;
	    getMaterial(): IMaterial;
	    /**
	     * @deprecated Not yet implemented
	     */
	    destroy(): void;
	    release(): void;
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
	    HALF_FLOAT = "HALF_FLOAT"
	}
	export interface IAttribDescription {
	    name: string;
	    size: number;
	    normalize?: boolean;
	    stride?: number;
	    offset?: number;
	    type: GLDataType;
	}
	/**
	 * Enumeration of supported possible uniform types that may be set on uniform buffers,
	 * corresponding to {@link WebGLRenderingContext} functions
	 * Docs from: https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html#uniforms
	 *
	 * @enum {string}
	 * @property uniform1f - float value: v
	 * @property uniform1fv - float or float array: v or [v]
	 * @property uniform2f - vec2: v0, v1
	 * @property uniform2fv - vec2 or vec2 array: [v0, v1]
	 * @property uniform3f - vec3: v0, v1, v2
	 * @property uniform3fv - vec3 or vec3 array: [v0, v1, v2]
	 * @property uniform4f - vec4: v0, v1, v2, v3
	 * @property uniform4fv - vec4 or vec4 array: [v0, v1, v2, v3]
	 *
	 * @property uniformMatrix2fv - mat2 or mat2 array: [ 4x element array]
	 * @property uniformMatrix3fv - mat3 or mat3 array: [ 9x element array]
	 * @property uniformMatrix4fv - mat4 or mat4 array: [ 16x element array]
	 *
	 * @property uniform1i - for int: v
	 * @property uniform1iv - for int or int array: [v]
	 * @property uniform2i - for ivec2: v0, v1
	 * @property uniform2iv - for ivec2 or ivec2 array: [v0, v1]
	 * @property uniform3i - for ivec3: v0, v1, v2
	 * @property uniform3iv - for ivec3 or ivec3 array: [v0, v1, v2]
	 * @property uniform4i - for ivec4: v0, v1, v2, v3
	 * @property uniform4iv - for ivec4 or ivec4 array: [v0, v1, v2, v3]
	 */
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
	    uniform4iv = "uniform4iv"
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
	    FRAGMENT_SHADER = "FRAGMENT_SHADER"
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
	    constructor(options: IShaderOptions);
	    getShader(): WebGLShader;
	    getId(): string;
	    prepare({ gl }: IWebGLResourceContext): void;
	    release(): void;
	}

	export interface IBufferFormatOptions {
	    shaderSpec: IShaderSpec;
	    program: WebGLProgram;
	}
	export interface IBufferFormat {
	    apply(): void;
	}
	export class BufferFormat extends WebGLResource implements IBufferFormat {
	    apply: () => void;
	    private program;
	    constructor(options: IBufferFormatOptions);
	    release(): void;
	    /**
	     * Generates a layout method for the buffer with bound data to optimize for performance
	     * @param {IAttribDescription[]} attribs
	     * @returns {Function}
	     */
	    private createLayoutDescription;
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
	    getUniformSetter(name: string): (...data: any[]) => void;
	}
	export class ProgramOptionsDTO extends DTO<IProgramOptions> implements IProgramOptions {
	    shaders: {
	        vertex: IShaderOptions;
	        fragment: IShaderOptions;
	    };
	    name: string;
	}
	export class ShaderProgram extends WebGLResource implements IShaderProgram {
	    private bufferFormat;
	    private uniforms;
	    private isActive;
	    private program;
	    constructor(config: IProgramOptions);
	    /**
	     * Return a curried function to set data for the uniform in the buffer
	     * @param {string} name - name a uniform defined in shader space
	     * @returns {(data: any) => void}
	     */
	    getUniformSetter(name: string): (data: any) => void;
	    /**
	     * Use this program on the context GL instance and apply buffer format
	     */
	    use(): void;
	    getGLProgram(): WebGLProgram;
	    release(): void;
	    protected createShader(config: IShaderOptions): IShader;
	    /**
	     * Parse uniform spec to retrieve and cache uniform locations, generating flat keys for structs
	     * @param {IUniformDescription[]} spec
	     */
	    private cacheUniforms;
	    private flattenUniformStructs;
	    private getUniformType;
	}

	export interface IValueReader {
	    key: string;
	    type: Function;
	    tag: string;
	    identifier: string;
	    description?: string;
	    getValue(): any;
	}
	export interface WatcherReadout {
	    [type: string]: string[];
	}
	export class Debugger {
	    private static propertyWatchers;
	    private static logger;
	    /**
	     * Generate a collection with read outs from all watchers that have been created
	     * @returns {WatcherReadout}
	     */
	    static getWatchedValues(): WatcherReadout;
	    /**
	     * Create a property observer that transparently allows access to simple object properties (getter/setters not
	     * supported)
	     * @param {string} [tag] - tag to group all value reads under
	     * @param {string} [identifierKey] - property on target that can be used to identify the instance
	     * @returns {PropertyDecorator}
	     */
	    static watch(tag?: string, identifierKey?: string): PropertyDecorator;
	    /**
	     * Create a description to identify a value in the read out
	     * @param {IValueReader} reader
	     * @returns {string}
	     */
	    private static getDescription;
	    private static isIdentifier;
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
	    protected setViewMatrix: GLMatrixSetter;
	    protected setWorldMatrix: GLMatrixSetter;
	    protected setProjectionMatrix: GLMatrixSetter;
	    protected activeCamera: ICamera;
	    protected activeProgram: IShaderProgram;
	    protected entities: IEntity[];
	    private frameEntityCount;
	    private frameVertexCount;
	    constructor(options: IRendererOptions);
	    renderScene(): void;
	    /**
	     * Draws a single entity to the scene, to be invoked on each frame
	     * @param entity
	     */
	    renderEntity(entity: IEntity): void;
	    /**
	     * Set the camera that will be used to set the projection matrix while rendering
	     * @param {ICamera} camera
	     */
	    setActiveCamera(camera: ICamera): void;
	    /**
	     * Set the shader program that will the renderer will send data and make draw calls to.
	     * It is assumed to have "view", "world", and "projection" mat4 uniforms.
	     * @param {IShaderProgram} program
	     */
	    setActiveProgram(program: IShaderProgram): void;
	    /**
	     * Clear the current buffer, using color (default black)
	     * @param {number[]} color
	     */
	    clear(color?: number[]): void;
	    release(): void;
	}

	import {IQService} from 'angular';
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
	    private library;
	    private $q;
	    private logger;
	    private renderTarget;
	    private gl;
	    private glFactory;
	    private context;
	    private readonly programs;
	    constructor(library: ILibraryService, $q: IQService, logger: Logger);
	    /**
	     * Set up the stage with a render context and create factory for {@link IWebGLResource} instances
	     * @param {RenderTargetWebGL} renderTarget
	     * @returns {boolean} If the operation completed successfully
	     */
	    set(renderTarget: RenderTargetWebGL): Promise<IWebGLResourceFactory>;
	    /**
	     * Retrieve the resource context for the stage
	     * @returns {IWebGLResourceContext}
	     */
	    getContext(): IWebGLResourceContext;
	    /**
	     * Create a new shader program and add it to available stage programs. If there are no existing programs for
	     * this stage, the program will be made active.
	     * @param {IProgramOptions} programConfig
	     * @param {boolean} [setActive]
	     * @returns {IShaderProgram}
	     */
	    addProgram(programConfig: IProgramOptions, setActive?: boolean): IShaderProgram;
	    /**
	     * Set the active program
	     * @param {string} name
	     */
	    setActiveProgram(name: string): void;
	    /**
	     * Get factory to create resources with this stage's context
	     * @returns {WebGLResourceFactory}
	     */
	    getFactory(): WebGLResourceFactory;
	}


	import {IScope} from 'angular';
	export interface IWebGLApp {
	    /**
	     * Invoked on each frame before the update call of each entity is called
	     * @param {number} dt
	     * @param {number} tt
	     */
	    preUpdate?(dt: number, tt: number): any;
	    /**
	     * The postUpdate method can perform any operations between entity updates and rendering
	     * @param {number} dt
	     * @param {number} tt
	     */
	    postUpdate?(dt: number, tt: number): any;
	    /**
	     * Triggered when an unhandled exception occurs within the app life cycle
	     * @param {Error} err
	     */
	    onError(err: Error): any;
	    /**
	     * The init method is executed during the $postLink phase, providing full access to the
	     * render target
	     * @param {IWebGLResourceContext} context
	     * @returns {*}
	     */
	    init(context: IWebGLResourceContext): any;
	    /**
	     * The config method is executed during construction, and before the component is linked
	     * to the render target element - during Angular's config phase.
	     */
	    config(): void;
	    postRender?(dt: number, tt: number): any;
	}
	export type UpdateMethod = (dt: number, tt: number) => void;
	/**
	 * @implements IWebGLApp
	 */
	export abstract class WebGLApp implements IController, IWebGLApp {
	    private appState;
	    private maxFrameRate;
	    protected $q: IQService;
	    protected library: ILibraryService;
	    protected stage: IWebGLStage;
	    protected $element: IAugmentedJQuery;
	    protected $rootScope: IScope;
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
	    protected constructor(appState: AppState, maxFrameRate: number, $q: IQService, library: ILibraryService, stage: IWebGLStage, $element: IAugmentedJQuery, $rootScope: IScope, logger: Logger);
	    /**
	     * Implement the $postLink method triggered when all configured providers are available
	     */
	    $postLink(): void;
	    abstract onError(err: Error): void;
	    abstract config(): void;
	    abstract init(context: IWebGLResourceContext): void | Promise<any>;
	    postUpdate(dt: number, tt: number): void;
	    postRender(dt: number, tt: number): void;
	    /**
	     * Update the FPS value
	     * @param totalElapsedTime
	     */
	    private updateFPS;
	    /**
	     * Derived From
	     * Isaac Sukin
	     * http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
	     */
	    private mainLoop;
	    /**
	     * Initialize the main app loop
	     */
	    private startMainLoop;
	}

	import {} from 'angular';
	export const debuggerOptions: IComponentOptions;

	import angular = require('angular');
	export const malletDebugger: angular.IModule;

	export const mallet: any;

	import {} from 'angular';
	export const webGLStageOptions: IComponentOptions;


	export const malletGeometry: angular.IModule;

	export class WebGLLibraryConfig {
	    constructor(libraryProvider: LibraryProvider);
	}


	export const malletWebGL: angular.IModule;


	export {};

// this needs to stay one line for the mangler
	export const malletCore: any;


	export type InjectContext<C> = {
	    [D in keyof C]: any;
	};
	export interface FactoryFields {
	    klass: any;
	    params: any;
	    base: any;
	}
	/**
	 * Generate an injected context wrapper for a factory method, to create class instances
	 * with both injected and instance parameters
	 * @param {{[string]: string}} annotations: map of injected dependency variable names to their keys
	 * @param {(context: {[p: string]: any}>, params: P) => O} factory
	 * @returns {InjectableMethod & FactoryFields} an {@link InjectableMethod} wrapping {@link factory} that is annotated with the dependencies
	 *
	 * @example
	 * export WidgetFactory extends CreateFactory({
	 *      gearService: 'module.gearService'
	 * }, ({gearService}, widgetParams) => {
	 *      return new Widget(gearService, widgetParams);
	 * }) {}
	 *
	 * @constructor
	 */
	export function CreateFactory<A extends {
	    [a: string]: string;
	}, P, O>(annotations: A, factory: (context: InjectContext<A>, params: P) => O): {
	    new (): {
	        klass: O;
	        params: P;
	        base: (context: InjectContext<A>, params: P) => O;
	        /**
	         * this is the meat of the factory, where we curry the factory base to be executed
	         * with instance parameters and injected dependencies
	         * @param {[]} dependencies
	         * @returns {(params: P) => O}
	         */
	        exec(...dependencies: any[]): (params: P) => O;
	    };
	};
	export type Runnable<F extends FactoryFields> = (params: F['params']) => F['klass'];

	import {IDocumentService} from 'angular';
	export interface IDynamicStylesheet {
	    attach(): void;
	}
	/**
	 * Attaches stylesheet created from dynamically loaded sources to the document
	 */
	export class DynamicStylesheet implements IDynamicStylesheet {
	    private src;
	    private $document;
	    private logger;
	    constructor(src: string, $document: IDocumentService, logger: Logger);
	    /**
	     * Attach the stylesheet to the document head
	     */
	    attach(): void;
	} declare const StylesheetFactory_base: {
	    new (): {
	        klass: DynamicStylesheet;
	        params: {
	            src: string;
	        };
	        base: (context: InjectContext<{
	            $document: string;
	            logger: string;
	        }>, params: {
	            src: string;
	        }) => DynamicStylesheet;
	        exec(...dependencies: any[]): (params: {
	            src: string;
	        }) => DynamicStylesheet;
	    };
	};
	/**
	 * Some basic utility style classes need to be built in to streamline
	 * bootstrapping a multi-media app, but we don't want make clients include an extra
	 * link or add more build steps, so we'll just inject them into the document
	 */
	export class StylesheetFactory extends StylesheetFactory_base {
	}
	export {};


	/**
	 * Embed basic utility styles in the app so client apps can just use them
	 * @type {angular.IModule}
	 */
	export const embeddedStyles: angular.IModule;


	export interface IFastRendererOptions extends IRendererOptions {
	    entityCount: number;
	}
