import {IRendererOptions, Renderer} from './renderer';
import {FastTransform} from '../geometry/fast-transform';
import {IEntity} from '../geometry/entity';
import {IWebGLResourceContext} from './webgl-resource-context';

export interface IFastRendererOptions extends IRendererOptions {
    entityCount: number;
}

/**
 * Modified implementation of the Renderer that generates a fixed sized fast-transform buffer,
 * designed to work with specially implemented vertex shader
 */
class FastRenderer extends Renderer {
    constructor(options: IFastRendererOptions) {
        super(options);
        // context.transformBuffer = new ArrayBuffer(options.entityCount * FastTransform.BUFFER_LENGTH);
    }

    public renderScene(): void {
        this.clear();
        this.setViewMatrix(false, this.activeCamera.getViewMatrix());

        const {gl, transformBuffer} = this.context;
        const transformBufferLoc = 0;
        gl.bufferData(transformBufferLoc, transformBuffer, gl.STATIC_DRAW);
    }

    public renderEntity(entity: IEntity): void {
        super.renderEntity(entity);
    }
}
