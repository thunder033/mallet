/// <reference types="angular" />
import { IRenderTarget, RenderingContext, RenderTargetFactory } from './render-target.factory';
import { Scheduler } from './scheduler.service';
import { IAugmentedJQuery, IComponentOptions, IController } from 'angular';
import { Logger } from './lib/logger';
export declare class RenderTargetCtrl implements IController {
    private logger;
    private $element;
    private mState;
    private scheduler;
    private renderTargetFactory;
    protected scale: number;
    protected renderTarget: IRenderTarget;
    protected ctx: RenderingContext;
    private type;
    private readonly QUARTER_RENDER_NAME;
    private readonly NO_SUPPORT_MESSAGE;
    constructor(logger: Logger, $element: IAugmentedJQuery, mState: any, scheduler: Scheduler, renderTargetFactory: RenderTargetFactory);
    $onInit(): void;
    $onDestroy(): void;
    getContext(): WebGLRenderingContext | CanvasRenderingContext2D;
    private onResize();
    private update();
}
export declare const options: IComponentOptions;
