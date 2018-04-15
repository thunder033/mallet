import {Mesh} from '../geometry/mesh';
import {IWebGLResource, WebGLResource} from './webgl-resource';

export interface IWebGLMesh extends IWebGLResource {
    getIndexBuffer(): WebGLBuffer;
    getVertexBuffer(): WebGLBuffer;
    getVertexCount(): number;
    getVertexSize(): number;
}

export interface IWebGLMeshOptions {
    mesh: Mesh;
}

export class WebGLMesh extends WebGLResource implements IWebGLMesh {
    private glVertexBuffer: WebGLBuffer;
    private glIndexBuffer: WebGLBuffer;

    private vertexCount: number;
    private vertexSize: number;

    constructor(options: IWebGLMeshOptions) {
        super();
        const {gl} = this.context;

        this.vertexCount = options.mesh.getIndexCount();
        this.vertexSize = Mesh.VERT_SIZE;

        this.glVertexBuffer = gl.createBuffer();
        // gl.ARRAY_BUFFER indicates per vertex data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            options.mesh.getVertexBuffer() as ArrayBuffer,
            gl.STATIC_DRAW);

        this.glIndexBuffer = gl.createBuffer();
        // gl.ELEMENT_ARRAY_BUFFER indicates and index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            options.mesh.getIndexBuffer() as ArrayBuffer,
            gl.STATIC_DRAW);

        // prevent accidental modifications to this mesh
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public getIndexBuffer(): WebGLBuffer {
        return this.glIndexBuffer;
    }

    public getVertexBuffer(): WebGLBuffer {
        return this.glVertexBuffer;
    }

    public getVertexCount(): number {
        return this.vertexCount;
    }

    public getVertexSize(): number {
        return this.vertexSize;
    }

    public release() {
        const {gl} = this.context;
        gl.deleteBuffer(this.glVertexBuffer);
        gl.deleteBuffer(this.glIndexBuffer);
    }
}
