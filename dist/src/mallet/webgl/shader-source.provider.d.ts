/// <reference types="angular" />
import { IPromise, IQService, IServiceProvider } from 'angular';
import { Logger } from '../lib/logger';
export interface IShaderSource {
    load(name: string): IPromise<string>;
}
export declare class ShaderSource implements IShaderSource {
    private logger;
    private $q;
    private sourceAugmenter;
    constructor(logger: Logger, $q: IQService, sourceAugmenter?: IShaderSource);
    load(name: string): IPromise<string>;
    private embeddedGet(name, fallback?);
}
export declare class ShaderSourceProvider implements IServiceProvider {
    private shaderSourceService;
    augmentShaderSource(service: IShaderSource): void;
    $get(logger: Logger, $q: IQService): ShaderSource;
}
