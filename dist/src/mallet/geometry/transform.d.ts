/// <reference types="gl-matrix" />
import glMatrix = require('gl-matrix');
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
export declare class Transform implements ITransform {
    private matrix;
    private parent;
    private position;
    private scale;
    private rotation;
    private origin;
    private isDirty;
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
    constructor(parent?: ITransform);
    /**
     * Get the parent transform
     * @returns {ITransform}
     */
    getParent(): ITransform;
    /**
     * Translate the transform using the velocity scaled by deltaTime
     * @param velocity
     * @param deltaTime
     * @returns {Transform}
     */
    vTimeTranslate(velocity: glMatrix.vec3, deltaTime: number): ITransform;
    getPosition(): glMatrix.vec3;
    setPosition(x: number, y: number, z: number): ITransform;
    /**
     * move the transform by the given amount
     * @param {number} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Transform}
     */
    translate(x: number, y: number, z: number): ITransform;
    /**
     * Translate by a vector
     * @param {glMatrix.vec3} delta
     */
    vTranslate(delta: glMatrix.vec3): ITransform;
    getScale(): glMatrix.vec3;
    setScale(x: number, y: number, z: number): ITransform;
    /**
     * scale the transform by the given amount
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Transform}
     */
    scaleBy(x: any, y: any, z: any): ITransform;
    /**
     * Scale by vector
     * @param {glMatrix.vec3} scale
     * @returns {Transform}
     */
    vScaleBy(scale: glMatrix.vec3): ITransform;
    getRotation(): glMatrix.quat;
    setRotation(yaw: number, pitch: number, roll: number): ITransform;
    vSetRotation(rotation: glMatrix.vec3): ITransform;
    /**
     * rotate the transform by the given amount
     * @param {number|Vector3} x
     * @param {number} [y]
     * @param {number} [z]
     * @returns {Transform}
     */
    rotateBy(x: number, y: number, z: number): ITransform;
    vRotateBy(delta: glMatrix.vec3): ITransform;
    /**
     * Get the transform matrix, re-calculating values if transform is dirty
     * @returns {glMatrix.mat4}
     */
    getMatrix(): glMatrix.mat4;
}
