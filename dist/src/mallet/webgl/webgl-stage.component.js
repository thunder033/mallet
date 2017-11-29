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
const shader_1 = require("./shader");
const mesh_1 = require("../geometry/mesh");
const webgl_mesh_1 = require("./webgl-mesh");
const camera_1 = require("../geometry/camera");
let WebGLStageCtrl = class WebGLStageCtrl {
    constructor(library, stage, scheduler, $element, logger) {
        this.library = library;
        this.stage = stage;
        this.scheduler = scheduler;
        this.$element = $element;
        this.logger = logger;
        this.type = render_target_factory_1.RenderTargetWebGL;
        this.logger.info('Build WebGL Stage');
    }
    $postLink() {
        this.loadContext();
        Promise.all([
            this.library.get(shader_1.ShaderDTO, '3d-vertex-shader'),
            this.library.get(shader_1.ShaderDTO, 'fragment-shader'),
            this.library.get(mesh_1.Mesh, 'cube'),
        ]).then(([vertex, fragment, cube]) => {
            const result = this.stage.set(this.renderTarget, { shaders: { vertex, fragment } });
            this.camera = new camera_1.Camera(this.getAspectRatio());
            this.stage.setActiveCamera(this.camera);
            const glCube = this.stage.getFactory().create(webgl_mesh_1.WebGLMesh, { mesh: cube });
            if (!result) {
                this.logger.warn(`Failed to WebGL stage, exiting setup method`);
                return;
            }
            this.scheduler.schedule((dt, tt) => {
                this.camera.update(dt, tt);
                this.scheduler.draw(this.stage.clear, 1);
                this.scheduler.draw(() => { this.stage.render(glCube); }, 2);
            }, 1);
        });
    }
    loadContext() {
        const RTCtrl = render_target_component_1.RenderTargetCtrl.getController(this.$element);
        this.gl = RTCtrl.getContext();
        this.renderTarget = RTCtrl.getRenderTarget();
    }
    getAspectRatio() {
        const elem = this.$element[0];
        return elem.clientWidth / elem.clientHeight;
    }
};
WebGLStageCtrl = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Library)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.webgl.WebGLStage)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Scheduler)),
    __param(3, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$element)),
    __param(4, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Object, Object, scheduler_service_1.Scheduler, Object, logger_1.Logger])
], WebGLStageCtrl);
exports.webGLStageOptions = {
    controller: injector_plus_1.ngAnnotate(WebGLStageCtrl),
    template: '<mallet-render-target type="$ctrl.type"></mallet-render-target>',
};
//# sourceMappingURL=webgl-stage.component.js.map