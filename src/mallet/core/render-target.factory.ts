/**
 * Created by gjrwcs on 9/15/2016.
 */
import {inject, InjectableMethod} from '../lib/injector-plus';
import {Logger} from './logger.service';
import {MDT} from '../mallet.dependency-tree';

export type Image = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap;
export type RenderingContext = CanvasRenderingContext2D | WebGLRenderingContext;

enum CanvasContext {
    basic = '2d',
    webgl = 'webgl',
    webglExperimental = 'webgl-experimental',
}

export interface IRenderTarget {
    getContext(): CanvasRenderingContext2D | WebGLRenderingContext;
    getCanvas(): HTMLCanvasElement;
    resize(scale?: number);
    clear();
    getAspectRatio(): number;
}

export interface IRenderTargetOptions {
    width: number;
    height: number;
}

export abstract class RenderTarget implements IRenderTarget {
    protected ctx: RenderingContext;
    protected canvas: HTMLCanvasElement;

    constructor(parameters: IRenderTargetOptions, protected logger: Logger) {
        const {width, height} = parameters;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.getNewContext();
    }
    
    public getAspectRatio(): number {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    public abstract clear();

    protected abstract getNewContext(): RenderingContext;

    public getContext(): RenderingContext {
        return this.ctx;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public resize(scale: number = 1) {
        this.logger.debug(`resize ${this.canvas.id || this.canvas.className} to ${scale}`);
        // finally query the various pixel ratios
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

export class RenderTargetWebGL extends RenderTarget {
    protected ctx: WebGLRenderingContext;

    public clear() {
        this.logger.verbose(`clear render target ${this.canvas.id || this.canvas.className}`);
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

    private isWebGLSupported(): boolean {
        try {
            const canvas = document.createElement('canvas');
            return !! ((window as any).WebGLRendingContext && this.getNewContext());
        } catch (e) {
            return false;
        }
    }
}

export interface IRenderTargetCtor {new (...args): IRenderTarget; }
export type RenderTargetFactory = <T extends IRenderTarget>(ctor: {new(...args): T}, options: IRenderTargetOptions) => T;

// tslint:disable-next-line:class-name
export class renderTargetFactory implements InjectableMethod {
    public exec(@inject(MDT.Logger) logger: Logger) {
        return <T extends RenderTarget>(ctor: {new(...args): T}, options: IRenderTargetOptions): T => {
            return new ctor(options, logger) as T;
        };
    }
}
