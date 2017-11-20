
import {IAugmentedJQuery, IComponentOptions, IController} from 'angular';
import {inject, ngAnnotate} from '../lib/injector-plus';
import {IRenderTargetCtor, RenderTargetWebGL} from '../render-target.factory';
import {IWebGLStage} from './webgl-stage';
import {Logger} from '../lib/logger';
import {MDT} from '../mallet.depedency-tree';
import {Scheduler} from '../scheduler.service';
import {RenderTargetCtrl} from '../render-target.component';

class WebGLStageCtrl implements IController {
    private type: IRenderTargetCtor = RenderTargetWebGL;
    private gl: WebGLRenderingContext;
    private renderTarget: RenderTargetWebGL;

    constructor(
        @inject(MDT.webgl.WebGLStage) private stage: IWebGLStage,
        @inject(MDT.Scheduler) private scheduler: Scheduler,
        @inject(MDT.ng.$element) private $element: IAugmentedJQuery,
        @inject(MDT.Logger) private logger: Logger) {
        this.logger.info('Build WebGL Stage');
    }

    public $postLink(): void {
        this.loadContext();
        this.stage.set(this.renderTarget);

        this.scheduler.schedule((dt: number) => {
            this.scheduler.draw(this.stage.present, 1);
        }, 1);
    }

    private loadContext(): void {
        const RTCtrl: RenderTargetCtrl = RenderTargetCtrl.getController(this.$element);
        this.gl =  RTCtrl.getContext() as WebGLRenderingContext;
        this.renderTarget = RTCtrl.getRenderTarget() as RenderTargetWebGL;
    }
}

export const webGLStageOptions: IComponentOptions = {
    controller: ngAnnotate(WebGLStageCtrl) as any,
    template: '<mallet-render-target type="$ctrl.type"></mallet-render-target>',
};
