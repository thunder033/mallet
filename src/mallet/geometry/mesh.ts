
import glMatrix = require('gl-matrix');

const {vec3} = glMatrix;

export class Mesh {
    public static VERT_SIZE = 6;

    private size: glMatrix.vec3;

    private indexBuffer: Readonly<ArrayBuffer>;
    private vertexBuffer: Readonly<ArrayBuffer>;

    /**
     * Get the dimensions of the mesh buffer
     * @param verts
     */
    private static getSize(verts: glMatrix.vec3[]): glMatrix.vec3 {
        if (verts.length === 0) {
            return vec3.create();
        }

        const min = vec3.clone(verts[0]);
        const max = vec3.clone(verts[0]);

        verts.forEach((v) => {
            if (v[0] < min[0]) {
                min[0] = v[0];
            } else if (v[0] > max[0]) {
                max[0] = v[0];
            }

            if (v[1] < min[1]) {
                min[1] = v[1];
            } else if (v[1] > max[1]) {
                max[1] = v[1];
            }

            if (v[2] < min[2]) {
                min[2] = v[2];
            } else if (v[2] > max[2]) {
                max[2] = v[2];
            }
        });

        const size = vec3.create();
        vec3.subtract(size, min, max);
        return size;
    }

    /**
     * Creates the normals for each face
     * @param {glMatrix.vec3[]} verts
     * @param {number[]} indices
     * @returns {glMatrix.vec3[]}
     */
    private static calculateFaceNormals(verts: glMatrix.vec3[], indices: number[]): glMatrix.vec3[] {
        const faceSize = 3;
        if (indices.length % faceSize !== 0) {
            return null;
        }

        const ab = vec3.create();
        const ac = vec3.create();
        const faceNormals: glMatrix.vec3[] = new Array(Math.floor(indices.length / faceSize));
        for (let i = 0; i < indices.length; i += faceSize) {
            const a = verts[indices[i]];
            const b = verts[indices[i + 1]];
            const c = verts[indices[i + 2]];

            vec3.subtract(ab, b, a);
            vec3.subtract(ac, c, a);

            const normal = vec3.create();
            vec3.cross(normal, ab, ac);
            vec3.normalize(normal, normal);

            const faceIndex = i / faceSize;
            faceNormals[faceIndex] = normal;
            // console.log(`Face ${faceIndex}: ${angle} ${normal} ${unitNormal}`);
        }

        return faceNormals;
    }

    /**
     * Calculate vertex normals by averaging the face normals for each vertex
     * @param {glMatrix.vec3[]} verts
     * @param {number[]} indices
     * @param {glMatrix.vec3[]} faceNormals
     * @returns {glMatrix.vec3[]}
     */
    private static calculateVertexNormals(verts: glMatrix.vec3[], indices: number[], faceNormals: glMatrix.vec3[]): glMatrix.vec3[] {
        const vertexNormals = verts.map(() => vec3.create());
        const faceSize = 3;

        let f; // index of the current face;
        for (let i = 0; i < indices.length; i++) {
            f = (i / faceSize) | 0;
            const vn = vertexNormals[indices[i]];
            vec3.add(vn, vn, faceNormals[f]);
        }

        vertexNormals.forEach((normal) => vec3.normalize(normal, normal));

        return vertexNormals;
    }

    /**
     * Construct a vertex buffer from the positions and normals arrays
     * @param {glMatrix.vec3[]} positions
     * @param {glMatrix.vec3[]} normals
     * @returns {ArrayBuffer}
     */
    private static buildVertexBuffer(positions: glMatrix.vec3[], normals: glMatrix.vec3[]): ArrayBuffer {
        const buffer = new Float32Array(positions.length * Mesh.VERT_SIZE);
        positions.forEach((vert, i) => {
            const vertIndex = i * Mesh.VERT_SIZE;
            buffer[vertIndex] = vert[0];
            buffer[vertIndex + 1] = vert[1];
            buffer[vertIndex + 2] = vert[2];

            const normal = normals[i];
            buffer[vertIndex + 3] = normal[0];
            buffer[vertIndex + 4] = normal[1];
            buffer[vertIndex + 5] = normal[2];
        });

        return buffer.buffer;
    }

    /**
     * Defines a set of points in space and how they form a 3D object
     * @param {glMatrix.vec3[]} verts
     * @param {number[]} indices
     * @constructor
     */
    constructor(private verts: glMatrix.vec3[], private indices: number[]) {
        this.size = Mesh.getSize(verts);
        const faceNormals = Mesh.calculateFaceNormals(this.verts, this.indices) || [];
        const vertexNormals = Mesh.calculateVertexNormals(this.verts, this.indices, faceNormals);
        this.vertexBuffer = Object.freeze(Mesh.buildVertexBuffer(this.verts, vertexNormals));
        this.indexBuffer = Object.freeze((new Float32Array(this.indices)).buffer);
        Object.seal(this);
    }

    public getVertexBuffer(): Readonly<ArrayBuffer> {
        return this.vertexBuffer;
    }

    public getIndexBuffer(): Readonly<ArrayBuffer> {
        return this.indexBuffer;
    }

}