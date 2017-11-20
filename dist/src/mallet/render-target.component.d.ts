/// <reference types="angular" />
import { IRenderTarget, RenderingContext, RenderTargetFactory } from './render-target.factory';
import { Scheduler } from './scheduler.service';
import { IAugmentedJQuery, IComponentOptions, IController } from 'angular';
import { Logger } from './lib/logger';
export declare class RenderTargetCtrl implements IController {
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
export declare const options: IComponentOptions;
