
import {IAugmentedJQuery, IComponentOptions, IController, IQService} from 'angular';
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
import {WebGLMesh} from './webgl-mesh';
import {Camera, ICamera} from '../geometry/camera';

class WebGLStageCtrl implements IController {
    private type: IRenderTargetCtor = RenderTargetWebGL;
    private gl: WebGLRenderingContext;
    private renderTarget: RenderTargetWebGL;
    private camera: ICamera;

    constructor(
        @inject(MDT.Library) private library: ILibraryService,
        @inject(MDT.webgl.WebGLStage) private stage: IWebGLStage,
        @inject(MDT.Scheduler) private scheduler: Scheduler,
        @inject(MDT.ng.$element) private $element: IAugmentedJQuery,
        @inject(MDT.Logger) private logger: Logger) {
        this.logger.info('Build WebGL Stage');
    }

    public $postLink(): void {
        this.loadContext();

        Promise.all([ // load resources
            this.library.get(ShaderDTO, '3d-vertex-shader'),
            this.library.get(ShaderDTO, 'fragment-shader'),
            this.library.get(Mesh, 'cube'),
        ]).then(([vertex, fragment, cube]: [IShaderOptions, IShaderOptions, Mesh]) => {
            const result = this.stage.set(this.renderTarget, {shaders: {vertex, fragment}});

            this.camera = new Camera(this.getAspectRatio());
            this.stage.setActiveCamera(this.camera);

            const glCube = this.stage.getFactory().create(WebGLMesh, {mesh: cube});

            if (!result) {
                this.logger.warn(`Failed to WebGL stage, exiting setup method`);
                return;
            }

            this.scheduler.schedule((dt: number, tt: number) => {
                this.camera.update(dt, tt);
                this.scheduler.draw(this.stage.clear, 1);
                this.scheduler.draw(() => { this.stage.render(glCube); }, 2);
            }, 1);
        });
    }

    private loadContext(): void {
        const RTCtrl: RenderTargetCtrl = RenderTargetCtrl.getController(this.$element);
        this.gl =  RTCtrl.getContext() as WebGLRenderingContext;
        this.renderTarget = RTCtrl.getRenderTarget() as RenderTargetWebGL;
    }
    
    private getAspectRatio(): number {
        const elem = this.$element[0];
        return elem.clientWidth / elem.clientHeight;
    }
}

export const webGLStageOptions: IComponentOptions = {
    controller: ngAnnotate(WebGLStageCtrl) as any,
    template: '<mallet-render-target type="$ctrl.type"></mallet-render-target>',
};
