"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glMatrix = require("gl-matrix");
const { vec3, mat4, quat } = glMatrix;
class Transform {
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
    constructor(parent) {
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
    getParent() {
        return this.parent;
    }
    /**
     * Translate the transform using the velocity scaled by deltaTime
     * @param velocity
     * @param deltaTime
     * @returns {Transform}
     */
    vTimeTranslate(velocity, deltaTime) {
        const Px = this.position[0] + velocity[0] * deltaTime;
        const Py = this.position[1] + velocity[1] * deltaTime;
        const Pz = this.position[2] + velocity[2] * deltaTime;
        vec3.set(this.position, Px, Py, Pz);
        this.isDirty = true;
        return this;
    }
    getPosition() {
        return this.position;
    }
    setPosition(x, y, z) {
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
    translate(x, y, z) {
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
    vTranslate(delta) {
        vec3.add(this.position, this.position, delta);
        this.isDirty = true;
        return this;
    }
    getScale() {
        return this.scale;
    }
    setScale(x, y, z) {
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
    scaleBy(x, y, z) {
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
    vScaleBy(scale) {
        vec3.multiply(this.scale, this.scale, scale);
        this.isDirty = true;
        return this;
    }
    getRotation() {
        return this.rotation;
    }
    setRotation(yaw, pitch, roll) {
        quat.fromEuler(this.rotation, yaw, pitch, roll);
        this.isDirty = true;
        return this;
    }
    vSetRotation(rotation) {
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
    rotateBy(x, y, z) {
        quat.rotateX(this.rotation, this.rotation, x);
        quat.rotateY(this.rotation, this.rotation, y);
        quat.rotateZ(this.rotation, this.rotation, z);
        this.isDirty = true;
        return this;
    }
    vRotateBy(delta) {
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
    getMatrix() {
        if (this.isDirty) {
            this.isDirty = false;
            mat4.fromRotationTranslationScaleOrigin(this.matrix, this.rotation, this.position, this.scale, this.origin);
        }
        return this.matrix;
    }
}
exports.Transform = Transform;
//# sourceMappingURL=transform.js.map