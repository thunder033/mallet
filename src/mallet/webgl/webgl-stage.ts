
import {RenderTargetWebGL} from '../render-target.factory';
import {WebGLResourceFactory} from './webgl-resource-factory';
import {inject} from '../lib/injector-plus';
import {MDT} from '../mallet.depedency-tree';
import {Logger} from '../lib/logger';
import bind from 'bind-decorator';
import {IQService} from 'angular';
import {IWebGLStageContext} from './webgl-resource';
import {IProgramOptions, IShaderProgram, ShaderProgram} from './shader-program';
import {IWebGLMesh, WebGLMesh} from './webgl-mesh';
import {ICamera} from '../geometry/camera';
import {GLMatrixSetter} from './shader';
import {mat4} from 'gl-matrix';

export interface IWebGLStage {
    set(renderTarget: RenderTargetWebGL, programOptions: IProgramOptions): void;
    clear(dt: number): void;
    getFactory(): WebGLResourceFactory;

    render(mesh: IWebGLMesh): void;
    setActiveCamera(camera: ICamera): void;
}

export class WebGLStage implements IWebGLStage {
    private renderTarget: RenderTargetWebGL;
    private gl: WebGLRenderingContext;
    private glFactory: WebGLResourceFactory;
    private program: IShaderProgram;
    private context: IWebGLStageContext;

    private setViewMatrix: GLMatrixSetter;
    private setWorldMatrix: GLMatrixSetter;
    private setProjectionMatrix: GLMatrixSetter;
    private identity = mat4.create();
    private activeCamera: ICamera;

    private cubeZ: number;
    private cubeDelta: number;
    private cubeRot: number;

    constructor(
        @inject(MDT.ng.$q) private $q: IQService,
        @inject(MDT.Logger) private logger: Logger) {
        this.cubeZ = -1;
        this.cubeDelta = 1 / 500;
        this.cubeRot = 0;
    }

    @bind
    public set(renderTarget: RenderTargetWebGL, programConfig: IProgramOptions): boolean {
        this.logger.debug(`Setting WebGL Stage`);
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();
        this.context = {gl: this.gl, program: null, logger: this.logger};

        try {
            this.program = new ShaderProgram(this.context, programConfig);
            this.context.program = this.program.getGLProgram();

            const {gl} = this.context;
            gl.enable(gl.DEPTH_TEST); // could replace this with blending: http://learningwebgl.com/blog/?p=859

            this.setViewMatrix = this.program.getUniformSetter('view');
            this.setWorldMatrix = this.program.getUniformSetter('world');
            this.setProjectionMatrix = this.program.getUniformSetter('projection');

            // TODO: create materials

            this.glFactory = new WebGLResourceFactory(this.context);
            this.logger.debug(`WebGL Stage set`);
            return true;
        } catch (e) {
            this.logger.error(e.message || e);
            return false;
        }
    }

    public getFactory(): WebGLResourceFactory {
        return this.glFactory;
    }

    public setActiveCamera(camera: ICamera): void {
        this.activeCamera = camera;

        // this will have to move to do zooming or similar
        this.setProjectionMatrix(false, camera.getProjectionMatrix());
    }

    public render(mesh: WebGLMesh) { // TODO: maybe more this to renderer
        if (!this.gl || !this.context.program) {
            this.logger.debug(`WebGL context or program not present. Skipping frame render`);
            return;
        }

        const {gl} = this.context;
        // https://stackoverflow.com/questions/6077002/using-webgl-index-buffers-for-drawing-meshes
        // get the vertex buffer from the mesh & send the vertex buffer to the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getVertexBuffer());

        // use program & enable attributes
        this.program.use();

        // send index buffer to the GPU
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndexBuffer());

        const cubeTransform = mat4.create();
        mat4.translate(cubeTransform, this.identity, [.25, -.15, this.cubeZ]);
        mat4.rotateX(cubeTransform, cubeTransform, this.cubeRot);
        mat4.rotateY(cubeTransform, cubeTransform, this.cubeRot);
        mat4.rotateZ(cubeTransform, cubeTransform, this.cubeRot);
        this.setWorldMatrix(false, cubeTransform);

        // perform the draw call
        gl.drawElements(gl.TRIANGLES, mesh.getVertexCount(), gl.UNSIGNED_SHORT, 0);
    }

    @bind
    public clear(dt: number) {
        if (!this.gl || !this.context.program) {
            this.logger.debug(`WebGL context or program not present. Skipping frame render`);
            return;
        }

        const {gl} = this.context;
        gl.clearColor(0.33, 0.33, 0.33, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // kind of out of scope, but clear is first draw operation, so works for now
        this.setViewMatrix(false, this.activeCamera.getViewMatrix());

        this.cubeZ += dt * this.cubeDelta;
        this.cubeRot += dt * this.cubeDelta;

        const min = -10;
        const max = -0.1 - 0.5;
        if (this.cubeZ < min || this.cubeZ > max) {
            this.cubeZ = Math.min(min, Math.max(this.cubeZ, max));
            this.cubeDelta *= -1;
        }
    }
}
