
import {inject, ngAnnotate} from './lib/injector-plus';
import {MDT} from './mallet.depedency-tree';
import {
    IRenderTarget, IRenderTargetCtor, RenderingContext, RenderTarget2D,
    RenderTargetFactory,
} from './render-target.factory';
import {Scheduler} from './scheduler.service';
import {element, IAugmentedJQuery, IComponentOptions, IController} from 'angular';
import bind from 'bind-decorator';
import {Logger} from './lib/logger';

export class RenderTargetCtrl implements IController {

    protected scale: number = 1;
    protected renderTarget: IRenderTarget;
    protected ctx: RenderingContext;

    private type: IRenderTargetCtor;

    private readonly NO_SUPPORT_MESSAGE = 'Your browser does not support canvas. Please consider upgrading.';

    public static getController($element: IAugmentedJQuery): RenderTargetCtrl {
        // https://stackoverflow.com/questions/21995108/angular-get-controller-from-element
        const targetTag = 'mallet-render-target';
        const renderTarget = $element[0].getElementsByTagName(targetTag);

        if (!renderTarget || !renderTarget.length) {
            throw new ReferenceError(`Failed to find render target ${targetTag} in component ${$element[0]}`);
        }

        const ctrl = element(renderTarget).controller(MDT.component.renderTarget);

        if (!ctrl) {
            const err = `Failed to get controller from render target. Ensure this function is being called in $postLink or later.`;
            throw new ReferenceError(err);
        }

        return ctrl;
    }

    constructor(
        @inject(MDT.Logger) protected logger: Logger,
        @inject(MDT.ng.$element) protected $element: IAugmentedJQuery,
        @inject(MDT.AppState) protected mState,
        @inject(MDT.Scheduler) protected scheduler: Scheduler,
        @inject(MDT.RenderTarget) protected renderTargetFactory: RenderTargetFactory) {
    }

    public $onInit() {
        // Create the render target
        const width = this.$element[0].clientWidth;
        const height = this.$element[0].clientHeight;
        this.logger.debug(`Create render target with type ${this.type.name}`);
        this.renderTarget = this.renderTargetFactory(this.type, {width, height});
        this.ctx = this.renderTarget.getContext();

        // Setup and attach canvas
        const canvas = this.renderTarget.getCanvas();
        canvas.innerHTML = this.NO_SUPPORT_MESSAGE;
        this.$element.append(canvas);

        this.scheduler.schedule(this.update, 0);
        window.addEventListener('resize', this.onResize);
    }

    public $onDestroy(): void {
        window.removeEventListener('resize', this.onResize);
    }

    public getContext(): RenderingContext {
        return this.ctx;
    }

    public getRenderTarget(): IRenderTarget {
        return this.renderTarget;
    }

    @bind
    protected update(): void {
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
    }

    @bind
    private onResize() {
        this.renderTarget.resize();
    }
}

class RenderTarget2DCtrl extends RenderTargetCtrl {
    protected renderTarget: RenderTarget2D;
    protected ctx: CanvasRenderingContext2D;

    protected update(): void {
        super.update();

        if (this.mState.is(this.mState.Debug)) {
            this.scheduler.draw(() => {
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText(`FPS: ${~~this.scheduler.FPS}`, 25, 25);
            }, 1);
        }
    }
}

export const options: IComponentOptions = {
    controller: ngAnnotate(RenderTargetCtrl) as any,
    template: '<div class="render-target"></div>',
    bindings: {
        type: '<',
    },
};
