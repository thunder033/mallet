/// <reference types="angular" />
import { RenderTargetWebGL } from '../render-target.factory';
import { IShader, IShaderOptions } from './shader';
import { Logger } from '../lib/logger';
import { IPromise, IQService } from 'angular';
import { IShaderSource } from './shader-source.provider';
export interface IWebGLStage {
    set(renderTarget: RenderTargetWebGL): void;
    present(dt: number): void;
}
export interface IWebGLStageContext {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
}
export declare class WebGLStage implements IWebGLStage {
    private $q;
    private shaderSource;
    private logger;
    private renderTarget;
    private gl;
    private glFactory;
    private program;
    private context;
    private verts1;
    private verts2;
    private readonly shaderConfig;
    private shaders;
    constructor($q: IQService, shaderSource: IShaderSource, logger: Logger);
    set(renderTarget: RenderTargetWebGL): IPromise<boolean>;
    protected loadShaders(configs: IShaderOptions[]): IPromise<IShader[]>;
    protected resolveShaderSources(configs: IShaderOptions[]): IPromise<IShaderOptions[]>;
    protected createShader(config: IShaderOptions): IShader;
    present(dt: number): void;
}
