/// <reference types="angular" />
import { RenderTargetWebGL } from '../render-target.factory';
import { WebGLResourceFactory } from './webgl-resource-factory';
import { Logger } from '../lib/logger';
import { IQService } from 'angular';
import { IProgramOptions } from './shader-program';
import { IWebGLMesh, WebGLMesh } from './webgl-mesh';
import { ICamera } from '../geometry/camera';
export interface IWebGLStage {
    set(renderTarget: RenderTargetWebGL, programOptions: IProgramOptions): void;
    clear(dt: number): void;
    getFactory(): WebGLResourceFactory;
    render(mesh: IWebGLMesh): void;
    setActiveCamera(camera: ICamera): void;
}
export declare class WebGLStage implements IWebGLStage {
    private $q;
    private logger;
    private renderTarget;
    private gl;
    private glFactory;
    private program;
    private context;
    private setViewMatrix;
    private setWorldMatrix;
    private setProjectionMatrix;
    private identity;
    private activeCamera;
    private cubeZ;
    private cubeDelta;
    private cubeRot;
    constructor($q: IQService, logger: Logger);
    set(renderTarget: RenderTargetWebGL, programConfig: IProgramOptions): boolean;
    getFactory(): WebGLResourceFactory;
    setActiveCamera(camera: ICamera): void;
    render(mesh: WebGLMesh): void;
    clear(dt: number): void;
}
