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
const shader_1 = require("./shader");
const webgl_resource_factory_1 = require("./webgl-resource-factory");
const injector_plus_1 = require("../lib/injector-plus");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const logger_1 = require("../lib/logger");
const bind_decorator_1 = require("bind-decorator");
const vertex_shader_1 = require("./vertex-shader");
let WebGLStage = class WebGLStage {
    constructor($q, shaderSource, logger) {
        this.$q = $q;
        this.shaderSource = shaderSource;
        this.logger = logger;
        this.verts1 = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]);
        this.verts2 = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5]);
        this.shaderConfig = [
            { id: '2d-vertex-shader', type: shader_1.ShaderType.VERTEX_SHADER },
            { id: 'fragment-shader', type: shader_1.ShaderType.FRAGMENT_SHADER }
        ];
        this.shaders = [];
    }
    set(renderTarget) {
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();
        this.program = renderTarget.getProgram();
        this.context = { gl: this.gl, program: this.program };
        this.logger.info(this.shaderSource);
        this.glFactory = new webgl_resource_factory_1.WebGLResourceFactory(this.gl);
        const gl = this.gl;
        const program = this.program;
        return this.loadShaders(this.shaderConfig).then((shaders) => {
            this.shaders = shaders;
            this.shaders.forEach((shader) => {
                gl.attachShader(program, shader.getShader());
            });
            gl.linkProgram(program);
            const success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
                gl.useProgram(program);
                this.shaders.forEach((s) => s.prepare(this.context));
            }
            else {
                this.logger.error(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
            }
            return success;
        });
    }
    loadShaders(configs) {
        return this.resolveShaderSources(configs).then((fullConfigs) => {
            return fullConfigs.map(this.createShader);
        });
    }
    resolveShaderSources(configs) {
        const mixedOps = configs.map((config) => {
            if (!config.src) {
                return this.shaderSource.load(config.id).then((source) => {
                    config.src = source;
                    return config;
                });
            }
            return config;
        });
        return this.$q.all(mixedOps);
    }
    createShader(config) {
        const type = config.type === shader_1.ShaderType.VERTEX_SHADER ? vertex_shader_1.VertexShader2D : shader_1.Shader;
        return this.glFactory.create(type, config);
    }
    present(dt) {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bufferData(gl.ARRAY_BUFFER, this.verts2, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, this.verts2.length / 2);
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [render_target_factory_1.RenderTargetWebGL]),
    __metadata("design:returntype", Object)
], WebGLStage.prototype, "set", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Object)
], WebGLStage.prototype, "loadShaders", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Object)
], WebGLStage.prototype, "resolveShaderSources", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], WebGLStage.prototype, "createShader", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WebGLStage.prototype, "present", null);
WebGLStage = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$q)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.webgl.ShaderSource)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Function, Object, logger_1.Logger])
], WebGLStage);
exports.WebGLStage = WebGLStage;
//# sourceMappingURL=webgl-stage.js.map