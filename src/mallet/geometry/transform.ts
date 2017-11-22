import {Vector3} from 'pulsar-lib';
import glMatrix = require('gl-matrix');

const {vec3, mat4, quat} = glMatrix;

export interface ITransform {
    getParent(): ITransform;

    vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform;

    setPosition(x: number, y: number, z: number): ITransform;
    getPosition(): glMatrix.vec3;
    translate(x: number, y: number, z: number): ITransform;
    vTranslate(delta: glMatrix.vec3): ITransform;

    setScale(x: number, y: number, z: number): ITransform;
    getScale(): glMatrix.vec3;
    scaleBy(x: number, y: number, z: number): ITransform;
    vScaleBy(delta: glMatrix.vec3): ITransform;

    setRotation(x: number, y: number, z: number): ITransform;
    getRotation(): glMatrix.quat;
    rotateBy(x: number, y: number, z: number): ITransform;
    vRotateBy(delta: glMatrix.vec3): ITransform;

    getMatrix(): glMatrix.mat4;
}

class Transform implements ITransform {

    private matrix: glMatrix.mat4;
    private parent: ITransform;

    private position: glMatrix.vec3;
    private scale: glMatrix.vec3;
    private rotation: glMatrix.quat;
    private origin: glMatrix.vec3;

    private isDirty: boolean;

    /**
     * Stores and manipulates _position, scale, and rotation data for an object
     * @param {Transform} [parent=null]
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

    /**
     * Get the parent transform
     * @returns {ITransform}
     */
    public getParent(): ITransform {
        return this.parent;
    }

    /**
     * Translate the transform using the velocity scaled by deltaTime
     * @param velocity
     * @param deltaTime
     * @returns {Transform}
     */
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

    /**
     * move the transform by the given amount
     * @param {number} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Transform}
     */
    public translate(x: number, y: number, z: number): ITransform {
        const Px = this.position[0] + x;
        const Py = this.position[1] + y;
        const Pz = this.position[2] + z;

        vec3.set(this.position, Px, Py, Pz);
        this.isDirty = true;
        return this;
    }

    /**
     * Translate by a vector
     * @param {glMatrix.vec3} delta
     */
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

    /**
     * scale the transform by the given amount
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Transform}
     */
    public scaleBy(x, y, z): ITransform {
        const Sx = this.scale[0] * x;
        const Sy = this.scale[1] * y;
        const Sz = this.scale[2] * z;

        vec3.set(this.scale, Sx, Sy, Sz);
        this.isDirty = true;
        return this;
    }

    /**
     * Scale by vector
     * @param {glMatrix.vec3} scale
     * @returns {Transform}
     */
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

    public vSetRotation(rotation: glMatrix.vec3): ITransform {
        quat.fromEuler(this.rotation, rotation[0], rotation[1], rotation[2]);
        this.isDirty = true;
        return this;
    }

    /**
     * rotate the transform by the given amount
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Transform}
     */
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

    /**
     * Get the transform matrix, re-calculating values if transform is dirty
     * @returns {glMatrix.mat4}
     */
    public getMatrix(): glMatrix.mat4 {
        if (this.isDirty) {
            this.isDirty = false;
            mat4.fromRotationTranslationScaleOrigin(this.matrix, this.rotation, this.position, this.scale, this.origin);
        }

        return this.matrix;
    }
}
