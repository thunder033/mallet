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
Object.defineProperty(exports, "__esModule", { value: true });
const shader_1 = require("./shader");
const bind_decorator_1 = require("bind-decorator");
const webgl_resource_1 = require("./webgl-resource");
const buffer_format_1 = require("./buffer-format");
class ShaderProgram extends webgl_resource_1.WebGLResource {
    constructor(context, config) {
        super(context);
        this.context = context;
        this.context.program = context.gl.createProgram();
        const { gl, program, logger } = this.context;
        const vertexShader = this.createShader(config.shaders.vertex);
        gl.attachShader(program, vertexShader.getShader());
        vertexShader.release();
        const fragmentShader = this.createShader(config.shaders.fragment);
        gl.attachShader(program, fragmentShader.getShader());
        fragmentShader.release();
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            gl.deleteProgram(program);
            throw new Error(`Failed to link program: ${gl.getProgramInfoLog(program)}`);
        }
        gl.useProgram(program); // retrieve and store program variable information
        this.bufferFormat = new buffer_format_1.BufferFormat(this.context, { shaderSpec: config.shaders.vertex.spec });
        this.uniforms = {};
        this.cacheUniforms([
            config.shaders.vertex.spec.uniforms || {},
            config.shaders.fragment.spec.uniforms || {}
        ]);
    }
    getUniformSetter(name) {
        const { gl } = this.context;
        const uniform = this.uniforms[name];
        return gl[uniform.type].bind(gl, uniform.location);
    }
    use() {
        const { gl, program } = this.context;
        gl.useProgram(program);
        this.bufferFormat.apply();
    }
    getGLProgram() {
        return this.context.program;
    }
    release() {
        const { gl, program } = this.context;
        gl.deleteProgram(program);
    }
    createShader(config) {
        return new shader_1.Shader(this.context, config);
    }
    cacheUniforms(spec) {
        const { program, gl } = this.context;
        spec.forEach((uniforms) => {
            Object.keys(uniforms).forEach((name) => {
                const location = gl.getUniformLocation(program, name);
                this.context.logger.debug(`Caching uniform ${name} (${uniforms[name]}) at location ${location}`);
                this.uniforms[name] = {
                    name,
                    location,
                    type: uniforms[name],
                };
            });
        });
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ShaderProgram.prototype, "createShader", null);
exports.ShaderProgram = ShaderProgram;
//# sourceMappingURL=shader-program.js.map