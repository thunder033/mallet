"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shader_1 = require("./shader");
class VertexShader2D extends shader_1.Shader {
    constructor(gl, options) {
        super(gl, options);
    }
    prepare({ gl, program }) {
        const attrName = 'a_position';
        const size = 2;
        const glPositionLoc = gl.getAttribLocation(program, attrName);
        gl.enableVertexAttribArray(glPositionLoc);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(glPositionLoc, size, gl.FLOAT, false, 0, 0);
    }
}
exports.VertexShader2D = VertexShader2D;
//# sourceMappingURL=vertex-shader.js.map