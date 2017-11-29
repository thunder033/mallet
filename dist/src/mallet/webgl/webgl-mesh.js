"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_1 = require("../geometry/mesh");
const webgl_resource_1 = require("./webgl-resource");
class WebGLMesh extends webgl_resource_1.WebGLResource {
    constructor(context, options) {
        super(context);
        const { gl } = context;
        this.vertexCount = options.mesh.getIndexCount();
        this.vertexSize = mesh_1.Mesh.VERT_SIZE;
        this.glVertexBuffer = gl.createBuffer();
        // gl.ARRAY_BUFFER indicates per vertex data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, options.mesh.getVertexBuffer(), gl.STATIC_DRAW);
        this.glIndexBuffer = gl.createBuffer();
        // gl.ELEMENT_ARRAY_BUFFER indicates and index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, options.mesh.getIndexBuffer(), gl.STATIC_DRAW);
        // prevent accidental modifications to this mesh
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    getIndexBuffer() {
        return this.glIndexBuffer;
    }
    getVertexBuffer() {
        return this.glVertexBuffer;
    }
    getVertexCount() {
        return this.vertexCount;
    }
    getVertexSize() {
        return this.vertexSize;
    }
    release() {
        const { gl } = this.context;
        gl.deleteBuffer(this.glVertexBuffer);
        gl.deleteBuffer(this.glIndexBuffer);
    }
}
exports.WebGLMesh = WebGLMesh;
//# sourceMappingURL=webgl-mesh.js.map