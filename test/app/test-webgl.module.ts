import * as angular from 'angular';
import {IAugmentedJQuery, IController} from 'angular';
import {
    inject,
    IWebGLStage,
    Level,
    Logger,
    malletWebGL,
    MDT,
    ngAnnotate,
    Scheduler,
} from 'mallet';

const testApp = angular.module('mallet-test', [malletWebGL.name]);

/**
 * Test Harness to demonstrate basic functionality of the Mallet engine
 */
class TestCtrl implements IController {

    constructor(
        @inject(MDT.webgl.WebGLStage) private stage: IWebGLStage,
        @inject(MDT.Scheduler) private scheduler: Scheduler,
        @inject(MDT.ng.$element) private $element: IAugmentedJQuery,
        @inject(MDT.Logger) private logger: Logger) {
        logger.info('Running Test Controller');
        this.logger.config({level: Level.Debug});
    }

    public $postLink(): void {
        this.scheduler.startMainLoop();
    }
}

testApp.component('testHarness', {
    controller: ngAnnotate(TestCtrl) as any,
    template: '<mallet-webgl-stage></mallet-webgl-stage>',
});
