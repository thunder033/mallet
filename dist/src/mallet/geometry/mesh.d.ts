/// <reference types="gl-matrix" />
import glMatrix = require('gl-matrix');
export interface IMeshOptions {
    positions: glMatrix.vec3[];
    indices: number[];
    colors?: glMatrix.vec3[];
}
export declare class Mesh {
    static VERT_SIZE: number;
    private size;
    private indexBuffer;
    private vertexBuffer;
    private positions;
    private indices;
    private vertexCount;
    private indexCount;
    /**
     * Get the dimensions of the mesh buffer
     * @param verts
     */
    private static getSize(verts);
    /**
     * Creates the normals for each face
     * @param {glMatrix.vec3[]} verts
     * @param {number[]} indices
     * @returns {glMatrix.vec3[]}
     */
    private static calculateFaceNormals(verts, indices);
    /**
     * Calculate vertex normals by averaging the face normals for each vertex
     * @param {glMatrix.vec3[]} verts
     * @param {number[]} indices
     * @param {glMatrix.vec3[]} faceNormals
     * @returns {glMatrix.vec3[]}
     */
    private static calculateVertexNormals(verts, indices, faceNormals);
    /**
     * Construct a vertex buffer from the positions and normals arrays
     * @param {glMatrix.vec3[]} positions
     * @param {glMatrix.vec3[]} normals
     * @param {glMatrix.vec3[]} colors
     * @returns {ArrayBuffer}
     */
    private static buildVertexBuffer(positions, normals, colors);
    /**
     * Defines a set of points in space and how they form a 3D object
     * @param {IMeshOptions} params
     */
    constructor(params: IMeshOptions);
    getVertexCount(): number;
    getIndexCount(): number;
    getVertexBuffer(): Readonly<ArrayBuffer>;
    getIndexBuffer(): Readonly<ArrayBuffer>;
}
