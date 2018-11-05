import {WebGLResource} from './webgl-resource';
import {vec3, vec4} from 'gl-matrix';
// import {IShaderProgram} from './shader-program';
import {MalletImage} from '..';

export type ColorDef = vec4 | vec3 | [number, number, number] | [number, number, number, number] | string;

export interface IMaterial {
    // setProgram(program: IShaderProgram);
    apply();
}

export interface IMaterialOptions {
    texture?: WebGLTexture | MalletImage;
    diffuse?: ColorDef; // diffuse

    // ambient - implement in shader??
    // specular
    // shininess

    // anisotropy - ??
    // shader = lambert | blinn | blinn-phong | anisotropic
}

export class Material extends WebGLResource implements IMaterial {
    // This should always be an
    private static defaultColor: ColorDef = [255, 255, 255, 255];

    private readonly color: vec4;

    // private program: IShaderProgram;
    private readonly texture: WebGLTexture;

    // normal map
    // specular map

    private static parseColorDef(colorDef: ColorDef): vec4 {
        if (Array.isArray(colorDef)) {
            return vec4.fromValues.apply(void 0, colorDef);
        } else if (typeof colorDef === 'string') {
            if (colorDef.indexOf('#') === 0) {
                return vec4.fromValues.apply(void 0, colorDef
                    .replace('#', '')
                    .split(/(.{2})/)
                    .filter((a) => a)
                    .map((val) => parseInt(val, 16)));
            } else if (colorDef.indexOf('rgb') === 0) {
                return vec4.fromValues.apply(void 0, colorDef
                    .split('(').pop()
                    .split(',').filter((a) => a)
                    .map((val) => parseInt(val, 10)));
            }
        }

        throw new TypeError(`Could not parse invalid Color ${colorDef}`);
    }

    constructor(options: IMaterialOptions) {
        super();

        // set texture diffuse
        this.color = Material.parseColorDef(options.diffuse || Material.defaultColor);
        this.texture = this.parseInputTexture(options.texture || this.createDefaultTexture(this.color));
    }

    // eventually materials may have their own shading algorithms
    // public setProgram(program: IShaderProgram) {
    //     this.program = program;
    // }

    public apply() {
        // this.program.use();

        const {gl} = this.context;
        gl.bindTexture(gl.TEXTURE_2D, this.texture || null);
    }

    public release() {
        // no-op
    }

    private parseInputTexture(inputData: WebGLTexture | MalletImage): WebGLTexture {
        const {gl} = this.context;
        if (gl.isTexture(inputData)) {
            return inputData;
        } else {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            let width: number = (inputData as MalletImage).width;
            let height: number = (inputData as MalletImage).height;
            let imageData: ArrayBufferView;

            if (inputData instanceof HTMLCanvasElement) {
                const ctx = inputData.getContext('2d');
                imageData = ctx.getImageData(0, 0, inputData.width, inputData.height).data;
                width = inputData.width;
                height = inputData.height;
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    imageData);
                // TODO: handle array buffer data & image src values
            // } else if (inputData.hasOwnProperty('buffer')) {
            //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            //         inputData as ArrayBufferView);
            } else {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inputData as MalletImage);
            }

            function isPowerOf2(value) {
                return value && (value & (value - 1)) === 0;
            }

            // From Mozilla:
            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (isPowerOf2(width) && isPowerOf2(height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn of mips and set
                // wrapping to clamp to edge
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }

            gl.bindTexture(gl.TEXTURE_2D, null); // unbind for safety
            return texture;
        }
    }

    private createDefaultTexture(color: ArrayLike<number>) {
        const {gl} = this.context;
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(color));

        return texture;
    }
}
