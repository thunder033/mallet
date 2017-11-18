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
/**
 * Created by gjrwcs on 9/15/2016.
 */
const injector_plus_1 = require("lib/injector-plus");
const logger_factory_1 = require("./logger.factory");
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
var CanvasContext;
(function (CanvasContext) {
    CanvasContext["basic"] = "2d";
    CanvasContext["webgl"] = "webgl";
    CanvasContext["webglExperimental"] = "webgl-experimental";
})(CanvasContext || (CanvasContext = {}));
class RenderTarget {
    constructor(parameters, logger) {
        this.logger = logger;
        const { width, height } = parameters;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.getNewContext();
    }
    getContext() {
        return this.ctx;
    }
    getCanvas() {
        return this.canvas;
    }
    resize(scale = 1) {
        this.logger.debug(`resize ${this.canvas.id || this.canvas.className} to ${scale}`);
        // finally query the various pixel ratios
        const devicePixelRatio = window.devicePixelRatio || 1;
        const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
            this.ctx.mozBackingStorePixelRatio ||
            this.ctx.msBackingStorePixelRatio ||
            this.ctx.oBackingStorePixelRatio ||
            this.ctx.backingStorePixelRatio || 1;
        const ratio = devicePixelRatio / backingStoreRatio;
        this.canvas.width = this.canvas.clientWidth * scale;
        this.canvas.height = this.canvas.clientHeight * scale;
        if (devicePixelRatio !== backingStoreRatio || scale !== 1) {
            this.canvas.width *= ratio;
            this.canvas.height *= ratio;
            this.ctx = this.getNewContext();
        }
    }
}
exports.RenderTarget = RenderTarget;
class RenderTarget2D extends RenderTarget {
    clear() {
        this.logger.verbose(`clear render target ${this.canvas.id || this.canvas.className}`);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getContext() {
        return super.getContext();
    }
    getNewContext() {
        return this.canvas.getContext(CanvasContext.basic);
    }
}
exports.RenderTarget2D = RenderTarget2D;
class RenderTargetWebGL extends RenderTarget {
    clear() {
        this.logger.verbose(`clear render target ${this.canvas.id || this.canvas.className}`);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
    }
    getContext() {
        return super.getContext();
    }
    getNewContext() {
        return (this.canvas.getContext(CanvasContext.webgl) ||
            this.canvas.getContext(CanvasContext.webglExperimental));
    }
}
exports.RenderTargetWebGL = RenderTargetWebGL;
// tslint:disable-next-line:class-name
class renderTargetFactory {
    exec(logger) {
        return (ctor, options) => {
            return new ctor(options, logger);
        };
    }
}
__decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logger_factory_1.Logger]),
    __metadata("design:returntype", void 0)
], renderTargetFactory.prototype, "exec", null);
exports.renderTargetFactory = renderTargetFactory;
//# sourceMappingURL=render-target.factory.js.map