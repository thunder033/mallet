import {mat4, quat, vec3} from 'gl-matrix';
import {ITransform, Transform} from './transform';

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
    setAspectRatio(aspectRatio: number);

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

export class Camera implements ICamera {
    private aspectRatio: number;
    private transform: ITransform;

    private projectionMatrix: mat4;
    private viewMatrix: mat4;
    private forward: vec3;

    private stale: boolean;
    private up: vec3;
    private disp: vec3;

    constructor(aspectRatio: number) {
        this.transform = new Transform();

        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.forward = vec3.fromValues(0, 0, -1);

        this.stale = false;
        this.disp = vec3.create();
        this.up = vec3.fromValues(0, 1, 0);

        this.setAspectRatio(aspectRatio);
    }

    public getForward(): vec3 {
        if (this.stale === true) {
            vec3.transformQuat(this.forward, this.forward, this.transform.getRotation());
            this.stale = false;
        }

        return this.forward;
    }

    public update(dt: number, tt: number): void {
        this.updateViewMatrix();
    }

    public updateViewMatrix(): void {
        const position: vec3 = vec3.create();
        vec3.add(position, this.transform.getPosition(), this.getForward());
        mat4.lookAt(this.viewMatrix, this.transform.getPosition(), position, this.up);
    }

    public setAspectRatio(aspectRatio: number) {
        this.aspectRatio = aspectRatio;

        // create/update the projection matrix
        mat4.perspective(this.projectionMatrix,
            Math.PI / 2, // vertical field of view (radians)
            this.aspectRatio, // aspect ratio, fraction
            0.1, // near clipping distance
            100); // far clipping distance
    }

    public advance(distance: number): void {
        this.stale = true;
        const position = vec3.clone(this.transform.getPosition());
        vec3.scale(this.disp, this.getForward(), distance);
        vec3.add(position, position, this.disp);
        this.transform.setPosition.apply(this.transform, position);
    }

    public strafe(distance: number): void {
        this.stale = true;
        const position = vec3.clone(this.transform.getPosition());
        vec3.cross(this.disp, this.getForward(), [0, 1, 0]);
        vec3.scale(this.disp, this.disp, distance);
        vec3.add(position, position, this.disp);
        this.transform.setPosition.apply(this.transform, position);
    }

    public ascend(distance: number): void {
        this.stale = true;
        const position = vec3.clone(this.transform.getPosition());
        vec3.scale(this.disp, this.up, distance);
        vec3.add(position, position, this.disp);
        this.transform.setPosition.apply(this.transform, position);
    }

    public rotate(x: number, y: number): void {
        this.transform.rotateBy(x, y, 0);
    }

    public getTransform(): ITransform {
        return this.transform;
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public getProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }
}
