"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const transform_1 = require("./transform");
class Camera {
    constructor(aspectRatio) {
        this.transform = new transform_1.Transform();
        this.projectionMatrix = gl_matrix_1.mat4.create();
        this.viewMatrix = gl_matrix_1.mat4.create();
        this.forward = gl_matrix_1.vec3.fromValues(0, 0, -1);
        this.stale = false;
        this.disp = gl_matrix_1.vec3.create();
        this.up = gl_matrix_1.vec3.fromValues(0, 1, 0);
        this.setAspectRatio(aspectRatio);
    }
    getForward() {
        if (this.stale === true) {
            gl_matrix_1.vec3.transformQuat(this.forward, this.forward, this.transform.getRotation());
            this.stale = false;
        }
        return this.forward;
    }
    update(dt, tt) {
        this.updateViewMatrix();
    }
    updateViewMatrix() {
        const position = gl_matrix_1.vec3.create();
        gl_matrix_1.vec3.add(position, this.transform.getPosition(), this.getForward());
        gl_matrix_1.mat4.lookAt(this.viewMatrix, this.transform.getPosition(), position, this.up);
    }
    setAspectRatio(aspectRatio) {
        this.aspectRatio = aspectRatio;
        // create/update the projection matrix
        gl_matrix_1.mat4.perspective(this.projectionMatrix, Math.PI / 2, // vertical field of view (radians)
        this.aspectRatio, // aspect ratio, fraction
        0.1, // near clipping distance
        100); // far clipping distance
    }
    advance(distance) {
        this.stale = true;
        const position = gl_matrix_1.vec3.clone(this.transform.getPosition());
        gl_matrix_1.vec3.scale(this.disp, this.getForward(), distance);
        gl_matrix_1.vec3.add(position, position, this.disp);
        this.transform.setPosition.apply(this.transform, position);
    }
    strafe(distance) {
        this.stale = true;
        const position = gl_matrix_1.vec3.clone(this.transform.getPosition());
        gl_matrix_1.vec3.cross(this.disp, this.getForward(), [0, 1, 0]);
        gl_matrix_1.vec3.scale(this.disp, this.disp, distance);
        gl_matrix_1.vec3.add(position, position, this.disp);
        this.transform.setPosition.apply(this.transform, position);
    }
    ascend(distance) {
        this.stale = true;
        const position = gl_matrix_1.vec3.clone(this.transform.getPosition());
        gl_matrix_1.vec3.scale(this.disp, this.up, distance);
        gl_matrix_1.vec3.add(position, position, this.disp);
        this.transform.setPosition.apply(this.transform, position);
    }
    rotate(x, y) {
        this.transform.rotateBy(x, y, 0);
    }
    getTransform() {
        return this.transform;
    }
    getViewMatrix() {
        return this.viewMatrix;
    }
    getProjectionMatrix() {
        return this.projectionMatrix;
    }
}
exports.Camera = Camera;
//# sourceMappingURL=camera.js.map