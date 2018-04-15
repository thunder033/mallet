import {Entity, IEntity} from '../geometry/entity';
import {ICamera} from '../geometry/camera';
import {WebGLResource} from './webgl-resource';
import {GLMatrixSetter} from './shader';
import {mat4} from 'gl-matrix';
import {IShaderProgram} from './shader-program';
import bind from 'bind-decorator';

export interface IRenderer {
    renderEntity(entity: IEntity): void;
    renderScene(): void;
    setActiveCamera(camera: ICamera): void;
    setActiveProgram(program: IShaderProgram): void;
    clear(): void;
}

export interface IRendererOptions {
    camera: ICamera;
    program: IShaderProgram;
}

export class Renderer extends WebGLResource implements IRenderer {
    // Rendering Geometry Uniforms
    protected setViewMatrix: GLMatrixSetter;
    protected setWorldMatrix: GLMatrixSetter;
    protected setProjectionMatrix: GLMatrixSetter;

    protected activeCamera: ICamera;
    protected activeProgram: IShaderProgram;
    protected entities: IEntity[];

    constructor(options: IRendererOptions) {
        super();

        this.activeProgram = null;
        this.activeCamera = null;

        this.setActiveProgram(options.program);
        this.setActiveCamera(options.camera);

        this.entities = Entity.getIndex();
    }

    @bind public renderScene(): void {
        this.clear();
        this.setViewMatrix(false, this.activeCamera.getViewMatrix());

        const entities = this.entities;
        const len = entities.length;
        const render = this.renderEntity;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < len; i++) {
            render(entities[i]);
        }
    }

    @bind public renderEntity(entity: IEntity): void {
        const {gl} = this.context;
        const mesh = entity.getMesh();
        // https://stackoverflow.com/questions/6077002/using-webgl-index-buffers-for-drawing-meshes
        // get the vertex buffer from the mesh & send the vertex buffer to the GPU
        // TODO: investigate cache bindBuffer & drawElements calls with bound parameters
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getVertexBuffer());

        // use program & enable attributes
        this.activeProgram.use();

        // send index buffer to the GPU
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndexBuffer());
        const matrix = entity.getTransform().getMatrix();
        // console.log(matrix);
        this.setWorldMatrix(false, matrix);

        // perform the draw call
        gl.drawElements(gl.TRIANGLES, mesh.getVertexCount(), gl.UNSIGNED_SHORT, 0);
    }

    /**
     * Set the camera that will be used to set the projection matrix while rendering
     * @param {ICamera} camera
     */
    public setActiveCamera(camera: ICamera): void {
        if (this.activeProgram === null) {
            throw new Error('Cannot set active camera without active program set. Call setActiveProgram.');
        }

        this.activeCamera = camera;

        // this will have to move to do zooming or similar
        this.setProjectionMatrix(false, camera.getProjectionMatrix());
    }

    /**
     * Set the shader program that will the renderer will send data and make draw calls to.
     * It is assumed to have "view", "world", and "projection" mat4 uniforms.
     * @param {IShaderProgram} program
     */
    public setActiveProgram(program: IShaderProgram): void {
        if (!program) {
            throw new ReferenceError('Active program cannot be null or undefined');
        }

        this.activeProgram = program;

        this.setViewMatrix = this.activeProgram.getUniformSetter('view');
        this.setWorldMatrix = this.activeProgram.getUniformSetter('world');
        this.setProjectionMatrix = this.activeProgram.getUniformSetter('projection');

        if (this.activeCamera !== null) {
            this.setProjectionMatrix(false, this.activeCamera.getProjectionMatrix());
        }
    }

    /**
     * Clear the current buffer, using color (default black)
     * @param {number[]} color
     */
    @bind public clear(color: number[] = [0, 0, 0, 1]): void {
        const {gl} = this.context;
        gl.clearColor(0.33, 0.33, 0.33, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    public release(): void {
        // noop
    }
}
