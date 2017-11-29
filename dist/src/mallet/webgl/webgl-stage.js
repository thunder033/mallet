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
const render_target_factory_1 = require("../render-target.factory");
const webgl_resource_factory_1 = require("./webgl-resource-factory");
const injector_plus_1 = require("../lib/injector-plus");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const logger_1 = require("../lib/logger");
const bind_decorator_1 = require("bind-decorator");
const shader_program_1 = require("./shader-program");
const gl_matrix_1 = require("gl-matrix");
let WebGLStage = class WebGLStage {
    constructor($q, logger) {
        this.$q = $q;
        this.logger = logger;
        this.identity = gl_matrix_1.mat4.create();
        this.cubeZ = -1;
        this.cubeDelta = 1 / 500;
        this.cubeRot = 0;
    }
    set(renderTarget, programConfig) {
        this.logger.debug(`Setting WebGL Stage`);
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();
        this.context = { gl: this.gl, program: null, logger: this.logger };
        try {
            this.program = new shader_program_1.ShaderProgram(this.context, programConfig);
            this.context.program = this.program.getGLProgram();
            const { gl } = this.context;
            gl.enable(gl.DEPTH_TEST); // could replace this with blending: http://learningwebgl.com/blog/?p=859
            this.setViewMatrix = this.program.getUniformSetter('view');
            this.setWorldMatrix = this.program.getUniformSetter('world');
            this.setProjectionMatrix = this.program.getUniformSetter('projection');
            // TODO: create materials
            this.glFactory = new webgl_resource_factory_1.WebGLResourceFactory(this.context);
            this.logger.debug(`WebGL Stage set`);
            return true;
        }
        catch (e) {
            this.logger.error(e.message || e);
            return false;
        }
    }
    getFactory() {
        return this.glFactory;
    }
    setActiveCamera(camera) {
        this.activeCamera = camera;
        // this will have to move to do zooming or similar
        this.setProjectionMatrix(false, camera.getProjectionMatrix());
    }
    render(mesh) {
        if (!this.gl || !this.context.program) {
            this.logger.debug(`WebGL context or program not present. Skipping frame render`);
            return;
        }
        const { gl } = this.context;
        // https://stackoverflow.com/questions/6077002/using-webgl-index-buffers-for-drawing-meshes
        // get the vertex buffer from the mesh & send the vertex buffer to the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getVertexBuffer());
        // use program & enable attributes
        this.program.use();
        // send index buffer to the GPU
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndexBuffer());
        const cubeTransform = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.translate(cubeTransform, this.identity, [.25, -.15, this.cubeZ]);
        gl_matrix_1.mat4.rotateX(cubeTransform, cubeTransform, this.cubeRot);
        gl_matrix_1.mat4.rotateY(cubeTransform, cubeTransform, this.cubeRot);
        gl_matrix_1.mat4.rotateZ(cubeTransform, cubeTransform, this.cubeRot);
        this.setWorldMatrix(false, cubeTransform);
        // perform the draw call
        gl.drawElements(gl.TRIANGLES, mesh.getVertexCount(), gl.UNSIGNED_SHORT, 0);
    }
    clear(dt) {
        if (!this.gl || !this.context.program) {
            this.logger.debug(`WebGL context or program not present. Skipping frame render`);
            return;
        }
        const { gl } = this.context;
        gl.clearColor(0.33, 0.33, 0.33, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // kind of out of scope, but clear is first draw operation, so works for now
        this.setViewMatrix(false, this.activeCamera.getViewMatrix());
        this.cubeZ += dt * this.cubeDelta;
        this.cubeRot += dt * this.cubeDelta;
        const min = -10;
        const max = -0.1 - 0.5;
        if (this.cubeZ < min || this.cubeZ > max) {
            this.cubeZ = Math.min(min, Math.max(this.cubeZ, max));
            this.cubeDelta *= -1;
        }
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [render_target_factory_1.RenderTargetWebGL, Object]),
    __metadata("design:returntype", Boolean)
], WebGLStage.prototype, "set", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WebGLStage.prototype, "clear", null);
WebGLStage = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$q)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Function, logger_1.Logger])
], WebGLStage);
exports.WebGLStage = WebGLStage;
//# sourceMappingURL=webgl-stage.js.map