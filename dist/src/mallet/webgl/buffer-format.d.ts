import { IWebGLStageContext, WebGLResource } from './webgl-resource';
import { IShaderSpec } from './shader';
export interface IBufferFormatOptions {
    shaderSpec: IShaderSpec;
}
export interface IBufferFormat {
    apply(): void;
}
export declare class BufferFormat extends WebGLResource implements IBufferFormat {
    protected context: IWebGLStageContext;
    apply: () => void;
    constructor(context: IWebGLStageContext, options: IBufferFormatOptions);
    release(): void;
    /**
     * Generates a layout method for the buffer with bound data to optimize for performance
     * @param {IAttribDescription[]} attribs
     * @returns {Function}
     */
    private createLayoutDescription(attribs);
}
