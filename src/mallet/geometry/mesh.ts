
import glMatrix = require('gl-matrix');
import {vec2, vec3} from 'gl-matrix';

export interface IMeshOptions {
    positions: glMatrix.vec3[];
    faces: number[][];
    normals?: glMatrix.vec3[];
    uvs?: glMatrix.vec2[];
    colors?: glMatrix.vec3[];
}

export interface IVertex {
    position: vec3;
    normal: vec3;
    uv: vec2;
    index: number;
}

/**
 * Constructs an optimized mesh from input data, with buffers ready to be utilized for
 * rendering pipeline
 */
export class Mesh {
    /** @description number of array elements vertex requires */
    public static VERT_SIZE = 8;

    // Working Data to calculate buffers (will not exist after construction)
    private positions: glMatrix.vec3[];
    private uvs: vec2[];
    private indices: number[];
    private vertices: {[hash: string]: IVertex};
    private vertexList: IVertex[];

    // output buffers
    private indexBuffer: Readonly<ArrayBuffer>;
    private vertexBuffer: Readonly<ArrayBuffer>;

    // output metadata and stats
    private size: glMatrix.vec3;
    private vertexCount: number;
    private indexCount: number;

    /**
     * Generate a unique primitive identifier for vertex attribute indices - allows us to only
     * create the vertices need to an avoid unnecessary duplication
     * @param {number[]} vertIndices
     */
    private static getVertHash(vertIndices: number[]): string {
        // const slotSize = 8;
        // return vertIndices.reduce((hash, value, slot) => hash | (value << (slot * slotSize)), 0);
        return vertIndices.join('|');
    }

    /**
     * Get the dimensions of the mesh buffer
     * @param verts
     */
    private static getSize(verts: vec3[]): vec3 {
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
    private static calculateFaceNormals(verts: IVertex[], indices: number[]): glMatrix.vec3[] {
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

            vec3.subtract(ab, b.position, a.position);
            vec3.subtract(ac, c.position, a.position);

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
     * Defines a set of points in space and how they form a 3D object
     * @param {IMeshOptions} params
     */
    constructor(params: IMeshOptions) {
        // intake vertex data
        this.positions = params.positions;
        this.uvs = params.uvs;

        this.size = Mesh.getSize(params.positions);

        this.vertices = {};
        this.indices = [];
        // parse the face index arrays into vertex and index buffers
        params.faces.forEach((face) => this.readFace(face));
        // create and set a list of vertices ordered by index
        this.collectVertexList();

        // Use existing normal calculation algorithm to generate normals
        const faceNormals = Mesh.calculateFaceNormals(this.vertexList, this.indices) || [];
        this.calculateVertexNormals(faceNormals);

        // build buffers
        this.buildVertexBuffer();
        this.indexBuffer = Object.freeze((new Uint16Array(this.indices)).buffer);

        // store stats & necessary metadata
        this.indexCount = this.indices.length;
        this.vertexCount = this.vertexList.length;

        // free up all the unnecessary data and prevent any modifications
        this.cleanUp();
        Object.seal(this);
    }

    /**
     * Release all the data we don't need after processing the input data
     */
    protected cleanUp() {
        delete this.vertices;
        delete this.vertexList;
        delete this.positions;
        delete this.uvs;
        delete this.indices;
    }

    protected collectVertexList() {
        this.vertexList = Object.values(this.vertices).sort((a, b) => a.index - b.index);
    }

    /**
     * Construct a vertex buffer from list of vertices and set it on instance
     */
    protected buildVertexBuffer() {
        const buffer = new Float32Array(this.vertexList.length * Mesh.VERT_SIZE);

        this.vertexList.forEach((vert, i) => {
            const vertIndex = i * Mesh.VERT_SIZE;
            buffer[vertIndex] = vert.position[0];
            buffer[vertIndex + 1] = vert.position[1];
            buffer[vertIndex + 2] = vert.position[2];

            buffer[vertIndex + 3] = vert.normal[0];
            buffer[vertIndex + 4] = vert.normal[1];
            buffer[vertIndex + 5] = vert.normal[2];

            buffer[vertIndex + 6] = vert.uv[0];
            buffer[vertIndex + 7] = vert.uv[1];
        });

        console.log(buffer);
        this.vertexBuffer = Object.freeze(buffer.buffer);
    }

    /**
     * Calculate vertex normals by averaging the face normals for each vertex
     * @param {vec3[]} faceNormals
     * @returns {vec3[]}
     */
    protected calculateVertexNormals(faceNormals: glMatrix.vec3[]) {
        const faceSize = 3;

        let f; // index of the current face
        // add all the face normals that utilize the vertex
        for (let i = 0; i < this.indices.length; i++) {
            f = (i / faceSize) | 0;
            const vn =  vec3.create();
            vec3.add(vn, vn, faceNormals[f]);
            this.vertexList[this.indices[i]].normal = vn;
        }

        // normalize after all components are added so they have equal weight
        this.vertexList.forEach((vert) => vec3.normalize(vert.normal, vert.normal));
    }

    protected readFace(face: number[]) {
        const vertSize = 2;
        for (let i = 0; i < face.length; i += vertSize) {
            const vertHash = Mesh.getVertHash([face[i], face[i + 1]]);
            if (this.vertices[vertHash]) {
                this.indices.push(this.vertices[vertHash].index);
            } else {
                this.indices.push(this.createVertex(face[i], face[i + 1]).index);
            }
        }
    }

    protected createVertex(positionIndex: number, uvIndex: number): IVertex {
        if (!this.positions[positionIndex]) {
            throw new ReferenceError(`Invalid vertex position index ${positionIndex}`);
        }

        if (!this.uvs[uvIndex]) {
            throw new ReferenceError(`Invalid vertex UV index ${positionIndex}`);
        }

        const vertex = {
            position: this.positions[positionIndex],
            uv: this.uvs[uvIndex],
            index: Object.keys(this.vertices).length,
            normal: null,
        };

        const vertHash = Mesh.getVertHash([positionIndex, uvIndex]);
        this.vertices[vertHash] = vertex;
        return vertex;
    }

    public getVertexCount(): number {
        return this.vertexCount;
    }

    public getIndexCount(): number {
        return this.indexCount;
    }

    public getVertexBuffer(): Readonly<ArrayBuffer> {
        return this.vertexBuffer;
    }

    public getIndexBuffer(): Readonly<ArrayBuffer> {
        return this.indexBuffer;
    }

}
