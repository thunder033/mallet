
import {inject} from 'lib/injector-plus';
import {MDT} from './mallet.depedency-tree';
import {RenderTarget2D, RenderTargetFactory} from './render-target.factory';
import {Scheduler} from './scheduler.service';
import {IAugmentedJQuery, IComponentOptions, IController} from 'angular';
import bind from 'bind-decorator';

export class RenderTargetCtrl implements IController {

    private scale: number = 1;
    private renderTarget: RenderTarget2D;
    private ctx: CanvasRenderingContext2D;

    private readonly QUARTER_RENDER_NAME = 'quarterRender';
    private readonly NO_SUPPORT_MESSAGE = 'Your browser does not support canvas. Please consider upgrading.';

    constructor(
        @inject(MDT.ng.$element) private $element: IAugmentedJQuery,
        @inject(MDT.AppState) private mState,
        @inject(MDT.Scheduler) private scheduler: Scheduler,
        @inject(MDT.RenderTarget) private renderTargetFactory: RenderTargetFactory) {

        // Create the render target
        const width = this.$element[0].clientWidth;
        const height = this.$element[0].clientHeight;
        this.renderTarget = this.renderTargetFactory(RenderTarget2D, {width, height});
        this.ctx = this.renderTarget.getContext();

        // Setup and attach canvas
        const canvas = this.renderTarget.getCanvas();
        canvas.innerHTML = this.NO_SUPPORT_MESSAGE;
        $element.append(canvas);

        // figure out how to re-impl
        // this.easel.createNewCanvas(this.QUARTER_RENDER_NAME, this.canvas.width / 2, this.canvas.height / 2);
        // this.canvas.style.background = '#000';

        window.addEventListener('resize', this.onResize);
    }

    public $onDestroy(): void {
        window.removeEventListener('resize', this.onResize);
    }

    @bind
    private onResize() {
        this.renderTarget.resize();
    }

    @bind
    private update() {
        const lowResScale = 0.75;
        // Reduce canvas resolution is performance is bad
        if (this.scheduler.FPS < 30 && this.scale === 1) {
            this.scale = lowResScale;
            this.renderTarget.resize(this.scale);
        } else if (this.scheduler.FPS > 40 && this.scale === lowResScale) {
            this.scale = 1;
            this.renderTarget.resize(this.scale);
        }

        this.scheduler.draw(() => this.renderTarget.clear(), -1);
        // this.scheduler.draw(() => this.easel.clearCanvas(this.easel.getContext(this.QUARTER_RENDER_NAME)), -1);

        if (this.mState.is(this.mState.Debug)) {
            this.scheduler.draw(() => {
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText(`FPS: ${~~this.scheduler.FPS}`, 25, 25);
            }, 1);
        }
    }
}

const options: IComponentOptions = {
    controller: RenderTargetCtrl,
    template: '<div class="render-target"></div>',
};

module.exports = options;
