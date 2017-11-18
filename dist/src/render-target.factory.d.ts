/**
 * Created by gjrwcs on 9/15/2016.
 */
import { InjectableMethod } from './lib/injector-plus';
import { Logger } from './logger.factory';
export declare type Image = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap;
export interface IRenderTarget {
    getContext(): CanvasRenderingContext2D | WebGLRenderingContext;
    getCanvas(): HTMLCanvasElement;
    resize(scale: number): any;
    clear(): any;
}
export interface IRenderTargetOptions {
    width: number;
    height: number;
}
export declare abstract class RenderTarget implements IRenderTarget {
    protected logger: Logger;
    protected ctx: CanvasRenderingContext2D | WebGLRenderingContext;
    protected canvas: HTMLCanvasElement;
    constructor(parameters: IRenderTargetOptions, logger: Logger);
    abstract clear(): any;
    protected abstract getNewContext(): CanvasRenderingContext2D | WebGLRenderingContext;
    getContext(): CanvasRenderingContext2D | WebGLRenderingContext;
    getCanvas(): HTMLCanvasElement;
    resize(scale?: number): void;
}
export declare class RenderTarget2D extends RenderTarget {
    protected ctx: CanvasRenderingContext2D;
    clear(): void;
    getContext(): CanvasRenderingContext2D;
    protected getNewContext(): CanvasRenderingContext2D;
}
export declare class RenderTargetWebGL extends RenderTarget {
    protected ctx: WebGLRenderingContext;
    clear(): void;
    getContext(): WebGLRenderingContext;
    protected getNewContext(): WebGLRenderingContext;
}
export declare type RenderTargetFactory = <T extends RenderTarget>(ctor: {
    new (...args): T;
}, options: IRenderTargetOptions) => T;
export declare class renderTargetFactory implements InjectableMethod {
    exec(logger: Logger): <T extends RenderTarget>(ctor: new (...args: any[]) => T, options: IRenderTargetOptions) => T;
}
