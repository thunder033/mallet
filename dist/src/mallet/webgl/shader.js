"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_resource_1 = require("./webgl-resource");
const library_provider_1 = require("../library.provider");
var GLDataType;
(function (GLDataType) {
    GLDataType["BYTE"] = "BYTE";
    GLDataType["FLOAT"] = "FLOAT";
    GLDataType["SHORT"] = "SHORT";
    GLDataType["UNSIGNED_SHORT"] = "UNSIGNED_SHORT";
    GLDataType["UNSIGNED_BYTE"] = "UNSIGNED_BYTE";
    GLDataType["HALF_FLOAT"] = "HALF_FLOAT";
})(GLDataType = exports.GLDataType || (exports.GLDataType = {}));
var GLUniformType;
(function (GLUniformType) {
    GLUniformType["uniform1f"] = "uniform1f";
    GLUniformType["uniform1fv"] = "uniform1fv";
    GLUniformType["uniform2f"] = "uniform2f";
    GLUniformType["uniform2fv"] = "uniform2fv";
    GLUniformType["uniform3f"] = "uniform3f";
    GLUniformType["uniform3fv"] = "uniform3fv";
    GLUniformType["uniform4f"] = "uniform4f";
    GLUniformType["uniform4fv"] = "uniform4fv";
    GLUniformType["uniformMatrix2fv"] = "uniformMatrix2fv";
    GLUniformType["uniformMatrix3fv"] = "uniformMatrix3fv";
    GLUniformType["uniformMatrix4fv"] = "uniformMatrix4fv";
    GLUniformType["uniform1i"] = "uniform1i";
    GLUniformType["uniform1iv"] = "uniform1iv";
    GLUniformType["uniform2i"] = "uniform2i";
    GLUniformType["uniform2iv"] = "uniform2iv";
    GLUniformType["uniform3i"] = "uniform3i";
    GLUniformType["uniform3iv"] = "uniform3iv";
    GLUniformType["uniform4i"] = "uniform4i";
    GLUniformType["uniform4iv"] = "uniform4iv";
})(GLUniformType = exports.GLUniformType || (exports.GLUniformType = {}));
var ShaderType;
(function (ShaderType) {
    ShaderType["VERTEX_SHADER"] = "VERTEX_SHADER";
    ShaderType["FRAGMENT_SHADER"] = "FRAGMENT_SHADER";
})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
class ShaderDTO extends library_provider_1.DTO {
}
exports.ShaderDTO = ShaderDTO;
class Shader extends webgl_resource_1.WebGLResource {
    constructor(context, options) {
        super(context);
        this.options = options;
        const { gl } = context;
        this.id = options.id;
        const shaderSource = options.src || document.getElementById(options.id).textContent;
        if (!shaderSource || typeof shaderSource !== 'string') {
            throw new Error(`Failed to get valid shader source for ${options.id}`);
        }
        this.shader = gl.createShader(gl[options.type]);
        gl.shaderSource(this.shader, shaderSource); // send the source to the shader object
        gl.compileShader(this.shader); // compile the shader program
        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(this.shader);
            throw new Error(`Failed to compile ${this.id}: ${gl.getShaderInfoLog(this.shader)}`);
        }
    }
    getShader() {
        return this.shader;
    }
    getId() {
        return this.id;
    }
    prepare({ gl }) {
        // no-op
    }
    release() {
        this.context.gl.deleteShader(this.shader);
    }
}
exports.Shader = Shader;
//# sourceMappingURL=shader.js.map