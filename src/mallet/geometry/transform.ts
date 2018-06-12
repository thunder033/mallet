import {Vector3} from 'pulsar-lib';
import glMatrix = require('gl-matrix');

const {vec3, mat4, quat} = glMatrix;

/**
 * Provides a structure for the spacial parameters of an object in 3 dimensions, with
 * methods to modify, access, and utilize this data.
 *
 * Methods prefixed with a "v" accept a glMatrix vector (an array), while those without
 * accept individual component values
 * @interface
 */
export interface ITransform {
    /**
     * Get the parent transform
     * @returns {ITransform} the parent transform instance
     */
    getParent(): ITransform;

    /**
     * Translate the transform using the velocity scaled by deltaTime
     * @param velocity
     * @param deltaTime
     * @returns {ITransform} the transform instance
     */
    vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform;

    /**
     * Set the position of the transform
     * @param {number} x - new X position value
     * @param {number} y - new Y position value
     * @param {number} z - new Z position value
     * @returns {ITransform} the transform instance
     */
    setPosition(x: number, y: number, z: number): ITransform;

    /**
     * Get the position of the transform represented as a vector
     * @returns {Readonly<glMatrix.vec3>}
     */
    getPosition(): Readonly<glMatrix.vec3>;
    /**
     * Move the transform by the given amount
     * @param {number} x - delta on X-axis
     * @param {number} y - delta on Y-axis
     * @param {number} z - delta on Z-axis
     * @returns {ITransform} the transform instance
     */
    translate(x: number, y: number, z: number): ITransform;
    /**
     * Translate by vector component values on respective axes
     * @param {glMatrix.vec3} delta [X, Y, Z]
     * @returns {ITransform} the transform instance
     */
    vTranslate(delta: glMatrix.vec3): ITransform;

    /**
     * Set the scale of the transform on each axis
     * @param {number} x - new scale value on X-axis
     * @param {number} y - new scale value on Y-axis
     * @param {number} z - new scale value on Z-axis
     * @returns {ITransform}
     */
    setScale(x: number, y: number, z: number): ITransform;

    /**
     * Get the scale of the transform represented as a vector
     * @returns {Readonly<glMatrix.vec3>}
     */
    getScale(): Readonly<glMatrix.vec3>;

    /**
     * Scale the transform by the given amount on each axis
     * @param {number} x - scalar applied to X-axis
     * @param {number} y - scalar applied to Y-axis
     * @param {number} z - scalar applied to Z-axis
     * @returns {ITransform} the transform instance
     */
    scaleBy(x: number, y: number, z: number): ITransform;

    /**
     * Scale by vector component values on respective axes
     * @param {glMatrix.vec3} scale value on respective axes [X, Y, Z]
     * @returns {ITransform} the transform instance
     */
    vScaleBy(scale: glMatrix.vec3): ITransform;

    /**
     * Sets the orientation of the transform derived from the Euler angles (radians) or directly from a quaternion
     * @param {glMatrix.vec3 | glMatrix.quat} orientation - the new orientation
     * @returns {ITransform} the transform instance
     */
    vSetRotation(orientation: glMatrix.quat | glMatrix.vec3): ITransform;

    /**
     * Create a new orientation from the Euler values in radians
     * @param {number} yaw - new orientation on X-axis
     * @param {number} pitch - new orientation on Y-axis
     * @param {number} roll - new orientation on Z-axis
     * @returns {ITransform} the transform instance
     */
    setRotation(yaw: number, pitch: number, roll: number): ITransform;

    /**
     * Get the orientation of the transform represented as a quaternion
     * @returns {Readonly<glMatrix.quat>}
     */
    getRotation(): Readonly<glMatrix.quat>;

    /**
     * Rotate the transform by the given amount on each Euler axis, units in radians
     * @param {number} x - orientation delta on X-axis
     * @param {number} y - orientation delta on Y-axis
     * @param {number} z - orientation delta on Z-axis
     * @returns {ITransform} the transform instance
     */
    rotateBy(x: number, y: number, z: number): ITransform;
    /**
     * Rotate the transform by Euler components in the vector
     * @param {module:gl-matrix.vec3} delta components in radians [X, Y, Z]
     * @returns {ITransform} the transform instance
     */
    vRotateBy(delta: glMatrix.vec3): ITransform;

    /**
     * Get the transform matrix, re-calculating values if transform is dirty
     * @returns {glMatrix.mat4}
     */
    getMatrix(): glMatrix.mat4;
}

/**
 * Basic implementation of transform class that stores each set of values
 * in a separate object, marking the resulting matrix as dirty until it is
 * requested
 * @implements ITransform
 */
export class Transform implements ITransform {

    private matrix: glMatrix.mat4;
    private parent: ITransform;

    private position: glMatrix.vec3;
    private scale: glMatrix.vec3;
    private rotation: glMatrix.quat;
    private origin: glMatrix.vec3;

    private isDirty: boolean;

    /**
     * Stores and manipulates _position, scale, and rotation data for an object
     * @param {ITransform} [parent=null]
     *
     * @property {Vector3} position
     * @property {Vector3} scale
     * @property {Vector3} rotation
     *
     * @constructor
     */
    constructor(parent?: ITransform) {
        this.position = vec3.fromValues(0, 0, 0);
        this.scale = vec3.fromValues(1, 1, 1);
        this.rotation = quat.create();
        this.origin = vec3.create();
        this.parent = parent || null;

        this.matrix = mat4.create();
        mat4.identity(this.matrix);
        this.isDirty = false;

        Object.seal(this);
    }

    public getParent(): ITransform {
        return this.parent;
    }

    public vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform {
        const Px = this.position[0] + velocity[0] * deltaTime;
        const Py = this.position[1] + velocity[1] * deltaTime;
        const Pz = this.position[2] + velocity[2] * deltaTime;

        vec3.set(this.position, Px, Py, Pz);
        this.isDirty = true;
        return this;
    }

    public getPosition(): glMatrix.vec3 {
        return this.position;
    }

    public setPosition(x: number, y: number, z: number): ITransform {
        vec3.set(this.position, x, y, z);
        this.isDirty = true;
        return this;
    }

    public translate(x: number, y: number, z: number): ITransform {
        const Px = this.position[0] + x;
        const Py = this.position[1] + y;
        const Pz = this.position[2] + z;

        vec3.set(this.position, Px, Py, Pz);
        this.isDirty = true;
        return this;
    }

    public vTranslate(delta: glMatrix.vec3): ITransform {
        vec3.add(this.position, this.position, delta);
        this.isDirty = true;
        return this;
    }

    public getScale(): glMatrix.vec3 {
        return this.scale;
    }

    public setScale(x: number, y: number, z: number): ITransform {
        vec3.set(this.scale, x, y, z);
        this.isDirty = true;
        return this;
    }

    public scaleBy(x, y, z): ITransform {
        const Sx = this.scale[0] * x;
        const Sy = this.scale[1] * y;
        const Sz = this.scale[2] * z;

        vec3.set(this.scale, Sx, Sy, Sz);
        this.isDirty = true;
        return this;
    }

    public vScaleBy(scale: glMatrix.vec3): ITransform  {
        vec3.multiply(this.scale, this.scale, scale);
        this.isDirty = true;
        return this;
    }

    public getRotation(): glMatrix.quat {
        return this.rotation;
    }

    public setRotation(yaw: number, pitch: number, roll: number): ITransform {
        quat.fromEuler(this.rotation, yaw, pitch, roll);
        this.isDirty = true;
        return this;
    }

    public vSetRotation(orientation: glMatrix.vec3 | glMatrix.quat): ITransform {
        if (orientation.length === 3) {
            quat.fromEuler(this.rotation, orientation[0], orientation[1], orientation[2]);
        } else {
            quat.set(this.rotation, orientation[0], orientation[1], orientation[2], orientation[3]);
        }

        this.isDirty = true;
        return this;
    }

    public rotateBy(x: number, y: number, z: number): ITransform {
        quat.rotateX(this.rotation, this.rotation, x);
        quat.rotateY(this.rotation, this.rotation, y);
        quat.rotateZ(this.rotation, this.rotation, z);

        this.isDirty = true;
        return this;
    }

    public vRotateBy(delta: glMatrix.vec3): ITransform {
        quat.rotateX(this.rotation, this.rotation, delta[0]);
        quat.rotateY(this.rotation, this.rotation, delta[1]);
        quat.rotateZ(this.rotation, this.rotation, delta[2]);

        this.isDirty = true;
        return this;
    }

    public getMatrix(): glMatrix.mat4 {
        if (this.isDirty === true) {
            this.isDirty = false;
            mat4.fromRotationTranslationScaleOrigin(this.matrix, this.rotation, this.position, this.scale, this.origin);
        }

        return this.matrix;
    }
}
