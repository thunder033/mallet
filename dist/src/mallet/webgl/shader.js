"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_resource_1 = require("./webgl-resource");
var ShaderType;
(function (ShaderType) {
    ShaderType["VERTEX_SHADER"] = "VERTEX_SHADER";
    ShaderType["FRAGMENT_SHADER"] = "FRAGMENT_SHADER";
})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
class Shader extends webgl_resource_1.WebGLResource {
    constructor(gl, options) {
        super();
        this.id = options.id;
        const shaderSource = options.src || document.getElementById(options.id).textContent;
        if (!shaderSource || typeof shaderSource !== 'string') {
            throw new Error(`Failed to get valid shader source for ${options.id}`);
        }
        this.shader = gl.createShader(gl[options.type]);
        gl.shaderSource(this.shader, shaderSource);
        gl.compileShader(this.shader);
        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
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
}
exports.Shader = Shader;
//# sourceMappingURL=shader.js.map