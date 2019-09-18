/**
 * Created by gjrwcs on 9/15/2016.
 */
import {inject, InjectableMethod} from '../lib/injector-plus';
import {Logger} from './logger.service';
import {MDT} from '../mallet.dependency-tree';

export type MalletImage = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap;
export type RenderingContext = CanvasRenderingContext2D | WebGLRenderingContext;

enum CanvasContext {
    basic = '2d', // this only not "2d" because enum keys can't start with a number
    webgl = 'webgl',
    webglExperimental = 'webgl-experimental',
}

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
    resize(scale?: number);

    /**
     * Clear all image data drawn on the canvas
     */
    clear();

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
    protected ctx: RenderingContext;
    protected canvas: HTMLCanvasElement;

    constructor(parameters: IRenderTargetOptions, protected logger: Logger) {
        const {width, height} = parameters;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'mallet-render-target-canvas';
        // TODO: figure out how to resize this after async styles have been applied (no render bug)
        this.canvas.width = width || 100;
        this.canvas.height = height || 100;
        this.ctx = this.getNewContext();
    }
    
    public getAspectRatio(): number {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    public abstract clear();

    /**
     * Create and configure a new drawing context of the appropriate type
     * @returns {RenderingContext}
     */
    protected abstract getNewContext(): RenderingContext;

    public getContext(): RenderingContext {
        return this.ctx;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public resize(scale: number = 1) {
        // TODO: this needs to support different stretch modes
        this.logger.debug(`resize ${this.canvas.id || this.canvas.className} to ${scale}`);
        // query the possible pixel ratio properties to determine canvas pixel density
        const devicePixelRatio = window.devicePixelRatio || 1;
        const backingStoreRatio = (this.ctx as any).webkitBackingStorePixelRatio ||
            (this.ctx as any).mozBackingStorePixelRatio ||
            (this.ctx as any).msBackingStorePixelRatio ||
            (this.ctx as any).oBackingStorePixelRatio ||
            (this.ctx as any).backingStorePixelRatio || 1;

        const ratio = devicePixelRatio / backingStoreRatio;

        this.canvas.width = this.canvas.clientWidth * scale;
        this.canvas.height = this.canvas.clientHeight * scale;

        if (devicePixelRatio !== backingStoreRatio || scale !== 1) {
            this.canvas.width *= ratio;
            this.canvas.height *= ratio;

            this.ctx = this.getNewContext();
        }
    }
}

/**
 * RenderTarget configured for usage with 2d canvas drawing context
 * @extends RenderTarget
 * @implements IRenderTarget
 */
export class RenderTarget2D extends RenderTarget {
    protected ctx: CanvasRenderingContext2D;

    public clear() {
        this.logger.verbose(`clear render target ${this.canvas.id || this.canvas.className}`);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public getContext(): CanvasRenderingContext2D {
        return super.getContext() as CanvasRenderingContext2D;
    }

    protected getNewContext(): CanvasRenderingContext2D {
        return this.canvas.getContext(CanvasContext.basic) as CanvasRenderingContext2D;
    }
}

/**
 * RenderTarget configured for usage with WebGL canvas drawing context
 * @extends RenderTarget
 * @implements IRenderTarget
 */
export class RenderTargetWebGL extends RenderTarget {
    protected ctx: WebGLRenderingContext;

    public clear() {
        // TODO: figure out some kind of frame rendering solution
        // this.logger.verbose(`clear render target ${this.canvas.id || this.canvas.className}`);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
    }

    public getContext(): WebGLRenderingContext {
        return super.getContext() as WebGLRenderingContext;
    }

    protected getNewContext(): WebGLRenderingContext {
        const gl = (
            this.canvas.getContext(CanvasContext.webgl) ||
            this.canvas.getContext(CanvasContext.webglExperimental)) as WebGLRenderingContext;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        return gl;
    }

    public resize(scale: number = 1) {
        super.resize(scale);
        this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Determines if WebGL is supported in the current browser
     * @returns {boolean}
     */
    private isWebGLSupported(): boolean {
        try {
            const canvas = document.createElement('canvas');
            return !! ((window as any).WebGLRendingContext && this.getNewContext());
        } catch (e) {
            return false;
        }
    }
}

export type IRenderTargetCtor = new (...args) => IRenderTarget;

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
export type RenderTargetFactory = <T extends IRenderTarget>(ctor: new(...args) => T, options: IRenderTargetOptions) => T;

export class renderTargetFactory implements InjectableMethod { // tslint:disable-line:class-name
    public exec(@inject(MDT.Logger) logger: Logger) {
        return <T extends RenderTarget>(ctor: new(...args) => T, options: IRenderTargetOptions): T => {
            return new ctor(options, logger) as T;
        };
    }
}
