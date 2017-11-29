/// <reference types="gl-matrix" />
import { mat4, vec3 } from 'gl-matrix';
import { ITransform } from './transform';
export interface ICamera {
    /**
     * Get normalized heading for the direction the camera is facing
     * @returns {}
     */
    getForward(): vec3;
    update(dt: number, tt: number): void;
    /**
     * Set the horizontal-vertical aspect ratio of the camera viewport
     * @param {number} aspectRatio
     */
    setAspectRatio(aspectRatio: number): any;
    /**
     * Update the view matrix, calculated from position and heading, if it's stale
     */
    updateViewMatrix(): void;
    /**
     * Move forward along the heading vector (local Z axis)
     * @param {number} distance
     */
    advance(distance: number): void;
    /**
     * Move to the side, along the local X axis
     * @param {number} distance
     */
    strafe(distance: number): void;
    /**
     * Move up/down, along the world Y axis
     * @param {number} distance
     */
    ascend(distance: number): void;
    /**
     * Rotate from local Euler angles, specified in radians
     * @param {number} x
     * @param {number} y
     */
    rotate(x: number, y: number): void;
    /**
     * Get the camera transform
     * @returns {ITransform}
     */
    getTransform(): ITransform;
    /**
     * Get the current view matrix
     * @returns {}
     */
    getViewMatrix(): mat4;
    /**
     * Get the current projection matrix
     * @returns {}
     */
    getProjectionMatrix(): mat4;
}
export declare class Camera implements ICamera {
    private aspectRatio;
    private transform;
    private projectionMatrix;
    private viewMatrix;
    private forward;
    private stale;
    private up;
    private disp;
    constructor(aspectRatio: number);
    getForward(): vec3;
    update(dt: number, tt: number): void;
    updateViewMatrix(): void;
    setAspectRatio(aspectRatio: number): void;
    advance(distance: number): void;
    strafe(distance: number): void;
    ascend(distance: number): void;
    rotate(x: number, y: number): void;
    getTransform(): ITransform;
    getViewMatrix(): mat4;
    getProjectionMatrix(): mat4;
}
