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
const injector_plus_1 = require("./lib/injector-plus");
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const render_target_factory_1 = require("./render-target.factory");
const scheduler_service_1 = require("./scheduler.service");
const bind_decorator_1 = require("bind-decorator");
let RenderTargetCtrl = class RenderTargetCtrl {
    constructor($element, mState, scheduler, renderTargetFactory) {
        this.$element = $element;
        this.mState = mState;
        this.scheduler = scheduler;
        this.renderTargetFactory = renderTargetFactory;
        this.scale = 1;
        this.QUARTER_RENDER_NAME = 'quarterRender';
        this.NO_SUPPORT_MESSAGE = 'Your browser does not support canvas. Please consider upgrading.';
        // Create the render target
        const width = this.$element[0].clientWidth;
        const height = this.$element[0].clientHeight;
        this.renderTarget = this.renderTargetFactory(render_target_factory_1.RenderTarget2D, { width, height });
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
    $onDestroy() {
        window.removeEventListener('resize', this.onResize);
    }
    onResize() {
        this.renderTarget.resize();
    }
    update() {
        const lowResScale = 0.75;
        // Reduce canvas resolution is performance is bad
        if (this.scheduler.FPS < 30 && this.scale === 1) {
            this.scale = lowResScale;
            this.renderTarget.resize(this.scale);
        }
        else if (this.scheduler.FPS > 40 && this.scale === lowResScale) {
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
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RenderTargetCtrl.prototype, "onResize", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RenderTargetCtrl.prototype, "update", null);
RenderTargetCtrl = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$element)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.AppState)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Scheduler)),
    __param(3, injector_plus_1.inject(mallet_depedency_tree_1.MDT.RenderTarget)),
    __metadata("design:paramtypes", [Object, Object, scheduler_service_1.Scheduler, Function])
], RenderTargetCtrl);
exports.RenderTargetCtrl = RenderTargetCtrl;
const options = {
    controller: RenderTargetCtrl,
    template: '<div class="render-target"></div>',
};
module.exports = options;
//# sourceMappingURL=render-target.component.js.map