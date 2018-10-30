
import {inject, Logger, ngAnnotate} from '..';
import {MDT} from '../mallet.dependency-tree';
import {
    IRenderTarget, IRenderTargetCtor, RenderingContext, RenderTarget2D,
    RenderTargetFactory,
} from './render-target.factory';
import {Scheduler} from './scheduler.service';
import {element, IAugmentedJQuery, IComponentOptions, IController} from 'angular';
import bind from 'bind-decorator';

/**
 * Creates, configures and provides DI access to a managed canvas instance for usage as a render target
 * @implements IController
 */
export class RenderTargetCtrl implements IController {

    protected scale: number = 1;
    protected renderTarget: IRenderTarget;
    protected ctx: RenderingContext;

    private type: IRenderTargetCtor;  // sub-class of the render target, currently RenderTarget2D or RenderTargetWebGL

    private readonly NO_SUPPORT_MESSAGE = 'Your browser does not support canvas. Please consider upgrading.';

    private resizeObserver: ResizeObserver;

    /**
     * This method can only be called in {@link angular.IController.$postLink} hook or later in the Angular lifecycle.
     * Retrieves the {@link RenderTargetCtrl} for the render target element, allowing access to the {@link RenderTarget}
     * instance. A {@link ReferenceError} will be thrown if controller retrieval fails.
     *
     * @param {angular.IAugmentedJQuery} $element - linked render target element
     * @returns {RenderTargetCtrl} - associated controller
     */
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
        this.$element.find('div').append(canvas);

        this.scheduler.schedule(this.update, 0);
        if (window.ResizeObserver) {
            this.resizeObserver = new window.ResizeObserver(() => this.onResize()).observe(this.renderTarget.getCanvas());
        } else {
            window.addEventListener('resize', this.onResize);
        }
    }

    public $postLink(): void {
        // embedded styles may not have been applied when the render target was first created
        this.renderTarget.resize();
    }

    public $onDestroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        } else {
            window.removeEventListener('resize', this.onResize);
        }
    }

    public getContext(): RenderingContext {
        return this.ctx;
    }

    public getRenderTarget(): IRenderTarget {
        return this.renderTarget;
    }

    // TODO: re-enable this behavior (that depends on deprecated scheduler)
    @bind protected update(): void {
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

    @bind private onResize() {
        // ensure the canvas is scaled appropriately to it's container
        this.renderTarget.resize(this.scale);
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
    template: '<div class="render-target viewport-container"></div>',
    bindings: {
        type: '<',
    },
};
