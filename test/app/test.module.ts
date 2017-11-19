import {mallet} from 'mallet/mallet.module';
import * as angular from 'angular';
import {IAugmentedJQuery, IController} from 'angular';
import {inject, ngAnnotate} from 'mallet/lib/injector-plus';
import {MDT} from 'mallet/mallet.depedency-tree';
import {Logger} from 'mallet/logger.service';
import {RenderTargetCtrl} from 'mallet/render-target.component';
import {IRenderTargetCtor, RenderTarget2D} from 'mallet/render-target.factory';
import {Scheduler} from 'mallet/scheduler.service';

const testApp = angular.module('mallet-test', [mallet.name]);

/**
 * Test Harness to demonstrate basic functionality of the Mallet engine
 */
class TestCtrl implements IController {
    private type: IRenderTargetCtor = RenderTarget2D;

    constructor(
        @inject(MDT.Scheduler) private scheduler: Scheduler,
        @inject(MDT.ng.$element) private $element: IAugmentedJQuery,
        @inject(MDT.Logger) private logger: Logger) {
        logger.info('Running Test Controller');
    }

    public $postLink(): void {
        const ctx = this.getContext();

        this.scheduler.schedule((deltaTime: number, totalTime: number) => {
            this.scheduler.draw(() => {
                ctx.fillStyle = '#f00';
                ctx.fillText(`Running Test Controller: ${totalTime}`, 20, 20);
            }, 1);
        }, 1);

        this.scheduler.startMainLoop();
    }

    // private getGL(): WebGLRenderingContext {
    //     const RTCtrl: RenderTargetCtrl = angular.element(this.$element).controller('malletRenderTarget');
    //     return RTCtrl.
    // }

    private getContext(): CanvasRenderingContext2D {
        const RTCtrl: RenderTargetCtrl = RenderTargetCtrl.getController(this.$element);
        return RTCtrl.getContext() as CanvasRenderingContext2D;
    }
}

testApp.component('testHarness', {
    controller: ngAnnotate(TestCtrl) as any,
    template: '<mallet-render-target type="$ctrl.type"></mallet-render-target>',
});
