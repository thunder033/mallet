"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_resource_1 = require("./webgl-resource");
const shader_1 = require("./shader");
const byteSizes = {
    [shader_1.GLDataType.BYTE]: 1,
    [shader_1.GLDataType.UNSIGNED_SHORT]: 2,
    [shader_1.GLDataType.FLOAT]: 4,
    [shader_1.GLDataType.SHORT]: 2,
    [shader_1.GLDataType.UNSIGNED_BYTE]: 1,
    [shader_1.GLDataType.HALF_FLOAT]: 2,
};
class BufferFormat extends webgl_resource_1.WebGLResource {
    constructor(context, options) {
        super(context);
        this.context = context;
        this.apply = this.createLayoutDescription(options.shaderSpec.attributes);
    }
    // public updateBuffer(data: ArrayBuffer | ArrayBufferView, offset: number = 0) {
    //     const {gl} = this.context;
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    //     gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
    // }
    release() {
        // no-op
    }
    /**
     * Generates a layout method for the buffer with bound data to optimize for performance
     * @param {IAttribDescription[]} attribs
     * @returns {Function}
     */
    createLayoutDescription(attribs) {
        const { gl, program } = this.context;
        const vertexSize = attribs.reduce((total, attrib) => {
            return total + byteSizes[attrib.type] * attrib.size | 0;
        }, 0);
        // collection of functions with bound data
        const layoutOps = [];
        let offset = 0;
        attribs.forEach((attrib) => {
            // get the position of the attribute in the vertex shader, we can either retrieve from the shader
            // or force the shader to use a given position with bindAttribLocation
            const index = gl.getAttribLocation(program, attrib.name);
            if (index < 0) {
                this.context.logger.debug(`Skipping layout of ${attrib.name}, unused in shader program`);
                // increase the offset for the next attrib
                offset += byteSizes[attrib.type] * attrib.size;
                return;
            }
            // describe the attribute in the buffer
            layoutOps.push(gl.vertexAttribPointer.bind(gl, index, attrib.size || 0, gl[attrib.type], attrib.normalize || false, vertexSize, offset));
            // turn on the attribute at this index
            layoutOps.push(gl.enableVertexAttribArray.bind(gl, index));
            // switching to bind attrib location may improve performance if 0 index is unused
            // gl.bindAttribLocation(program, index, attrib.name); // connect attribute to vertex shader
            // increase the offset for the next attrib
            offset += byteSizes[attrib.type] * attrib.size;
        });
        this.context.logger.debug(`Created buffer layout function`, layoutOps);
        return (() => layoutOps.forEach((f) => f()));
    }
}
exports.BufferFormat = BufferFormat;
//# sourceMappingURL=buffer-format.js.map