import {ITransform} from './transform';
import glMatrix = require('gl-matrix');

const {quat, mat4} = glMatrix;

export interface IFastTransform {
    /**
     * Returns the offest of this transform in a shared array buffer (as determined during construction)
     * @returns {number}
     */
    getOffset(): number;

    /**
     * This method doe NOT return a 3D Transform matrix, contains in sequence transform
     * components: position, scale, quaternion rotation, origin
     * @returns {glMatrix.mat4}
     */
    getBuffer(): Float32Array;
}

/**
 * Fast transform is a class designed to either front-load heavy lifting or offload it
 * to the graphics card. This is achieved by creating views of individual transform components
 * on a buffer that can be directly copied to graphics card memory, where the actual transform
 * matrix can be calculated. The CPU only has to handle the simple calculations of updating
 * the transform vector components.
 * @implements ITransform, IFastTransform
 */
export class FastTransform implements ITransform, IFastTransform {
    public static readonly BUFFER_LENGTH = 16;
    public static readonly FAST_TRANSFORM_FLAG = -1;
    private readonly buffer: Float32Array; // 13 components

    // views of the buffer the hold each component
    private readonly scale: glMatrix.vec3; // 3, 0
    private readonly position: glMatrix.vec3; // 3, 3
    private readonly rotation: glMatrix.quat; // 4, 6
    private readonly origin: glMatrix.vec3; // 3, 10

    private parent: number; // position in the global buffer of the parent transform

    /**
     * Accepts an array buffer and position within that buffer to store data
     * @param {ArrayBuffer} buffer
     * @param {number} [offset] bytes fast transform is offset from the start of the buffer
     */
    constructor(buffer: ArrayBuffer, private offset: number = 0) {
        /*
        The buffer is arranged with each set of components adjacent in the following order:

            Scale     Position  Rotation     Origin    Parent Flag
            [S][S][S] [P][P][P] [R][R][R][R] [O][O][O] [P] [] [F]
            0         3         6            10        13  14 15

        Each element is one byte holding a 32-bit float, with a up 16 elements allocated for
        each transform, totalling a maximum 128 bytes. The current implementation utilizes
        13 elements, with index 13 planned for parenting, index 14 unused, and index 15 as a
        special flag to indicate the buffer holds a fast transform data set (instead of 4x4
        matrix)
        */
        const byteSize = FastTransform.BUFFER_LENGTH * Float32Array.BYTES_PER_ELEMENT;
        // still use 16 so the memory is cross-compatible with normal transform matrix
        const arrayBuffer = buffer || new ArrayBuffer(byteSize);
        this.buffer = new Float32Array(arrayBuffer, offset, FastTransform.BUFFER_LENGTH);
        this.buffer[15] = FastTransform.FAST_TRANSFORM_FLAG; // flag the last component to identify as fast transform

        const scalePos = offset;
        const positionPos = scalePos + 3 * Float32Array.BYTES_PER_ELEMENT;
        const rotationPos = positionPos + 3 * Float32Array.BYTES_PER_ELEMENT;
        const originPos = rotationPos + 4 * Float32Array.BYTES_PER_ELEMENT;

        this.scale = new Float32Array(arrayBuffer, scalePos, 3) as glMatrix.vec3;
        this.scale.set([1, 1, 1]);
        this.position = new Float32Array(arrayBuffer, positionPos, 3) as glMatrix.vec3;
        this.position.set([0, 0, 0]);
        this.rotation = new Float32Array(arrayBuffer, rotationPos, 4) as glMatrix.quat;
        quat.identity(this.rotation);
        this.origin = new Float32Array(arrayBuffer, originPos, 3) as glMatrix.vec3;
        this.origin.set([0, 0, 0]);

        // This will be a pointer to the position of the parent transform in the buffer
        this.parent = -1; // TODO: implement parenting
    }

    public getOffset(): number {
        return this.offset;
    }

    public getParent(): ITransform {
        return null;
    }

    public translate(x: number, y: number, z: number): ITransform {
        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;
        return this;
    }

    public vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform {
        this.position[0] += velocity[0] * deltaTime;
        this.position[1] += velocity[1] * deltaTime;
        this.position[2] += velocity[2] * deltaTime;
        return this;
    }

    public setPosition(x: number, y: number, z: number): ITransform {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;
        return this;
    }

    public getPosition(): Readonly<glMatrix.vec3> {
        return Object.freeze(this.position);
    }

    public vTranslate(delta: glMatrix.vec3): ITransform {
        this.position[0] += delta[0];
        this.position[1] += delta[1];
        this.position[2] += delta[2];
        return this;
    }

    public setScale(x: number, y: number, z: number): ITransform {
        this.scale[0] = x;
        this.scale[1] = y;
        this.scale[2] = z;
        return this;
    }

    public getScale(): Readonly<glMatrix.vec3> {
        return this.scale;
    }

    public scaleBy(x: number, y: number, z: number): ITransform {
        this.scale[0] *= x;
        this.scale[1] *= y;
        this.scale[2] *= z;
        return this;
    }

    public vScaleBy(delta: glMatrix.vec3): ITransform {
        this.scale[0] *= delta[0];
        this.scale[1] *= delta[1];
        this.scale[2] *= delta[2];
        return this;
    }

    public vSetRotation(orientation: glMatrix.quat | glMatrix.vec3): ITransform {
        // convert to quaternion if provided vec3 euler angles. This method prevents
        // any type changing of variables
        if (orientation.length === 3) {
            quat.fromEuler(this.rotation, orientation[0], orientation[1], orientation[2]);
        } else {
            quat.set(this.rotation, orientation[0], orientation[1], orientation[2], orientation[3]);
        }

        return this;
    }

    public getRotation(): Readonly<glMatrix.quat> {
        return Object.freeze(this.rotation);
    }

    public setRotation(yaw: number, pitch: number, roll: number): ITransform {
        quat.fromEuler(this.rotation, yaw, pitch, roll);
        return this;
    }

    public rotateBy(x: number, y: number, z: number): ITransform {
        quat.rotateX(this.rotation, this.rotation, x);
        quat.rotateY(this.rotation, this.rotation, y);
        quat.rotateZ(this.rotation, this.rotation, z);
        return this;
    }

    public vRotateBy(delta: glMatrix.vec3): ITransform {
        quat.rotateX(this.rotation, this.rotation, delta[0]);
        quat.rotateY(this.rotation, this.rotation, delta[1]);
        quat.rotateZ(this.rotation, this.rotation, delta[2]);
        return this;
    }

    public getBuffer() {
        return this.buffer;
    }

    /**
     * Returns 3D transform matrix. Warning: in this implementation, this is a very slow, creating a new mat4 each time
     * @returns {glMatrix.mat4}
     */
    public getMatrix(): glMatrix.mat4 {
        return mat4.fromRotationTranslationScaleOrigin(mat4.create(), this.rotation, this.position, this.scale, this.origin);
    }
}
