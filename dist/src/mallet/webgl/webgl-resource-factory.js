"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebGLResourceFactory {
    constructor(gl) {
        this.gl = gl;
    }
    create(ctor, options) {
        return new ctor(this.gl, options);
    }
}
exports.WebGLResourceFactory = WebGLResourceFactory;
//# sourceMappingURL=webgl-resource-factory.js.map