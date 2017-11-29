import { Mesh } from '../geometry/mesh';
import { IWebGLResource, IWebGLStageContext, WebGLResource } from './webgl-resource';
export interface IWebGLMesh extends IWebGLResource {
    getIndexBuffer(): WebGLBuffer;
    getVertexBuffer(): WebGLBuffer;
    getVertexCount(): number;
    getVertexSize(): number;
}
export interface IMeshOptions {
    mesh: Mesh;
}
export declare class WebGLMesh extends WebGLResource implements IWebGLMesh {
    private glVertexBuffer;
    private glIndexBuffer;
    private vertexCount;
    private vertexSize;
    constructor(context: IWebGLStageContext, options: IMeshOptions);
    getIndexBuffer(): WebGLBuffer;
    getVertexBuffer(): WebGLBuffer;
    getVertexCount(): number;
    getVertexSize(): number;
    release(): void;
}
