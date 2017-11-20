"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("../lib/injector-plus");
const render_target_factory_1 = require("../render-target.factory");
const logger_1 = require("../lib/logger");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const scheduler_service_1 = require("../scheduler.service");
const render_target_component_1 = require("../render-target.component");
let WebGLStageCtrl = class WebGLStageCtrl {
    constructor(stage, scheduler, $element, logger) {
        this.stage = stage;
        this.scheduler = scheduler;
        this.$element = $element;
        this.logger = logger;
        this.type = render_target_factory_1.RenderTargetWebGL;
        this.logger.info('Build WebGL Stage');
    }
    $postLink() {
        this.loadContext();
        this.stage.set(this.renderTarget);
        this.scheduler.schedule((dt) => {
            this.scheduler.draw(this.stage.present, 1);
        }, 1);
    }
    loadContext() {
        const RTCtrl = render_target_component_1.RenderTargetCtrl.getController(this.$element);
        this.gl = RTCtrl.getContext();
        this.renderTarget = RTCtrl.getRenderTarget();
    }
};
WebGLStageCtrl = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.webgl.WebGLStage)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Scheduler)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$element)),
    __param(3, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Object, scheduler_service_1.Scheduler, Object, logger_1.Logger])
], WebGLStageCtrl);
exports.webGLStageOptions = {
    controller: injector_plus_1.ngAnnotate(WebGLStageCtrl),
    template: '<mallet-render-target type="$ctrl.type"></mallet-render-target>',
};
//# sourceMappingURL=webgl-stage.component.js.map