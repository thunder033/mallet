/// <reference types="angular" />
import { RenderTargetFactory } from './render-target.factory';
import { Scheduler } from './scheduler.service';
import { IAugmentedJQuery, IController } from 'angular';
export declare class RenderTargetCtrl implements IController {
    private $element;
    private mState;
    private scheduler;
    private renderTargetFactory;
    private scale;
    private renderTarget;
    private ctx;
    private readonly QUARTER_RENDER_NAME;
    private readonly NO_SUPPORT_MESSAGE;
    constructor($element: IAugmentedJQuery, mState: any, scheduler: Scheduler, renderTargetFactory: RenderTargetFactory);
    $onDestroy(): void;
    private onResize();
    private update();
}
