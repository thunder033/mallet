"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebGLResourceFactory {
    constructor(context) {
        this.context = context;
    }
    create(ctor, options) {
        return new ctor(this.context, options);
    }
}
exports.WebGLResourceFactory = WebGLResourceFactory;
//# sourceMappingURL=webgl-resource-factory.js.map