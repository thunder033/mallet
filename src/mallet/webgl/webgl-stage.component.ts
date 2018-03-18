
import {IAugmentedJQuery, IComponentOptions, IController} from 'angular';
import {inject, ngAnnotate} from '../lib/injector-plus';
import {IRenderTargetCtor, RenderTargetWebGL} from '../render-target.factory';
import {IWebGLStage} from './webgl-stage';
import {Logger} from '../lib/logger';
import {MDT} from '../mallet.depedency-tree';
import {Scheduler} from '../scheduler.service';
import {RenderTargetCtrl} from '../render-target.component';
import {ILibraryService} from '../library.provider';
import {IShaderOptions, ShaderDTO} from './shader';
import {Mesh} from '../geometry/mesh';
import {Camera, ICamera} from '../geometry/camera';
import {mat4} from 'gl-matrix';
import {IRenderer, Renderer} from './renderer';

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
        this.loadRenderingContext();
        this.stage.set(this.renderTarget).catch((e) => {
            this.logger.error(e.message || e);
            this.logger.warn(`Failed to WebGL stage, exiting setup method`);
        });
    }

    private loadRenderingContext(): void {
        const RTCtrl: RenderTargetCtrl = RenderTargetCtrl.getController(this.$element);
        this.gl =  RTCtrl.getContext() as WebGLRenderingContext;
        this.renderTarget = RTCtrl.getRenderTarget() as RenderTargetWebGL;
    }
}

export const webGLStageOptions: IComponentOptions = {
    controller: ngAnnotate(WebGLStageCtrl) as any,
    template: '<mallet-render-target type="$ctrl.type"></mallet-render-target>',
};
