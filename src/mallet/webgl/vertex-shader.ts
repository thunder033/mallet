
import {IShaderOptions, Shader} from './shader';
import {IWebGLStageContext} from './webgl-stage';

export class VertexShader2D extends Shader {
    constructor(gl: WebGLRenderingContext, options: IShaderOptions) {
        super(gl, options);
    }

    public prepare({gl, program}: IWebGLStageContext): void {
        const attrName = 'a_position';
        const size = 2;
        const glPositionLoc = gl.getAttribLocation(program, attrName);
        gl.enableVertexAttribArray(glPositionLoc);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(glPositionLoc, size, gl.FLOAT, false, 0, 0);
    }
}
