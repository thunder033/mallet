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
const scheduler_service_1 = require("./scheduler.service");
const angular_1 = require("angular");
const bind_decorator_1 = require("bind-decorator");
const logger_1 = require("./lib/logger");
let RenderTargetCtrl = class RenderTargetCtrl {
    constructor(logger, $element, mState, scheduler, renderTargetFactory) {
        this.logger = logger;
        this.$element = $element;
        this.mState = mState;
        this.scheduler = scheduler;
        this.renderTargetFactory = renderTargetFactory;
        this.scale = 1;
        this.NO_SUPPORT_MESSAGE = 'Your browser does not support canvas. Please consider upgrading.';
    }
    static getController($element) {
        // https://stackoverflow.com/questions/21995108/angular-get-controller-from-element
        const targetTag = 'mallet-render-target';
        const renderTarget = $element[0].getElementsByTagName(targetTag);
        if (!renderTarget || !renderTarget.length) {
            throw new ReferenceError(`Failed to find render target ${targetTag} in component ${$element[0]}`);
        }
        const ctrl = angular_1.element(renderTarget).controller(mallet_depedency_tree_1.MDT.component.renderTarget);
        if (!ctrl) {
            const err = `Failed to get controller from render target. Ensure this function is being called in $postLink or later.`;
            throw new ReferenceError(err);
        }
        return ctrl;
    }
    $onInit() {
        // Create the render target
        const width = this.$element[0].clientWidth;
        const height = this.$element[0].clientHeight;
        this.logger.debug(`Create render target with type ${this.type.name}`);
        this.renderTarget = this.renderTargetFactory(this.type, { width, height });
        this.ctx = this.renderTarget.getContext();
        // Setup and attach canvas
        const canvas = this.renderTarget.getCanvas();
        canvas.innerHTML = this.NO_SUPPORT_MESSAGE;
        this.$element.append(canvas);
        this.scheduler.schedule(this.update, 0);
        window.addEventListener('resize', this.onResize);
    }
    $onDestroy() {
        window.removeEventListener('resize', this.onResize);
    }
    getContext() {
        return this.ctx;
    }
    getRenderTarget() {
        return this.renderTarget;
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
    }
    onResize() {
        this.renderTarget.resize();
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RenderTargetCtrl.prototype, "update", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RenderTargetCtrl.prototype, "onResize", null);
RenderTargetCtrl = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$element)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.AppState)),
    __param(3, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Scheduler)),
    __param(4, injector_plus_1.inject(mallet_depedency_tree_1.MDT.RenderTarget)),
    __metadata("design:paramtypes", [logger_1.Logger, Object, Object, scheduler_service_1.Scheduler, Function])
], RenderTargetCtrl);
exports.RenderTargetCtrl = RenderTargetCtrl;
class RenderTarget2DCtrl extends RenderTargetCtrl {
    update() {
        super.update();
        if (this.mState.is(this.mState.Debug)) {
            this.scheduler.draw(() => {
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText(`FPS: ${~~this.scheduler.FPS}`, 25, 25);
            }, 1);
        }
    }
}
exports.options = {
    controller: injector_plus_1.ngAnnotate(RenderTargetCtrl),
    template: '<div class="render-target"></div>',
    bindings: {
        type: '<',
    },
};
//# sourceMappingURL=render-target.component.js.map