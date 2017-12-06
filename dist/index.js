(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mallet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("./lib/injector-plus");
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const logger_service_1 = require("./logger.service");
const state_machine_1 = require("./lib/state-machine");
let AppState = class AppState extends state_machine_1.StateMachine {
    constructor($location, logger) {
        super();
        this.$location = $location;
        this.logger = logger;
        this.clearState();
    }
    /**
     * Adds exclusivity rules for app states to basic state-machine functionality
     * @param {number} newState
     */
    addState(newState) {
        switch (newState) {
            case AppState.Suspended:
                this.removeState(AppState.Running | AppState.Loading);
                break;
            case AppState.Running:
                this.removeState(AppState.Suspended | AppState.Loading);
                break;
            default:
                break;
        }
        super.addState(newState);
    }
    clearState() {
        const debug = this.$location.search().debug === '1' ? AppState.Debug : 0;
        this.setState(AppState.Loading | debug);
        this.removeStateListeners();
    }
};
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], AppState, "Running", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], AppState, "Loading", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], AppState, "Debug", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], AppState, "Suspended", void 0);
AppState = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$location)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Object, logger_service_1.Logger])
], AppState);
exports.AppState = AppState;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\app-state.service.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./lib/injector-plus":9,"./lib/state-machine":11,"./logger.service":13,"./mallet.depedency-tree":15,"buffer":undefined}],2:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const transform_1 = require("./transform");
const bind_decorator_1 = require("bind-decorator");
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
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], Camera.prototype, "update", null);
exports.Camera = Camera;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\geometry\\camera.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\geometry")

},{"./transform":6,"bind-decorator":undefined,"buffer":undefined,"gl-matrix":undefined}],3:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transform_1 = require("./transform");
const webgl_resource_1 = require("../webgl/webgl-resource");
class Entity extends webgl_resource_1.WebGLResource {
    constructor(context, meshName) {
        super(context);
        this.meshName = meshName;
        // register entity in the index
        this.id = Entity.curId++;
        Entity.index[this.id] = this;
        if (this.update !== Entity.prototype.update) {
            context.logger.debug(`Add entity update method for entity with mesh ${meshName}`);
            Entity.updateMethods.push(this.update.bind(this));
        }
        this.mesh = null;
        // this.transform = new FastTransform(this.context.transformBuffer);
        this.transform = new transform_1.Transform();
        this.getPosition = this.transform.getPosition.bind(this.transform);
        this.getRotation = this.transform.getRotation.bind(this.transform);
        this.rotate = this.transform.vRotateBy.bind(this.transform);
        this.translate = this.transform.vTranslate.bind(this.transform);
        this.rotateTo = this.transform.vSetRotation.bind(this.transform);
    }
    static getIndex() {
        return Entity.index;
    }
    static getUpdateIndex() {
        return Entity.updateMethods;
    }
    init(resources) {
        this.mesh = resources[this.meshName];
    }
    scale(scalar) {
        this.transform.scaleBy(scalar, scalar, scalar);
    }
    update(dt, tt) {
        // void
    }
    getTransform() {
        return this.transform;
    }
    getMesh() {
        return this.mesh;
    }
    destroy() {
        throw new Error('destroying entities is not supported in this implementation');
    }
    release() {
        // no-op
    }
}
Entity.curId = 0;
Entity.index = [];
Entity.updateMethods = [];
exports.Entity = Entity;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\geometry\\entity.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\geometry")

},{"../webgl/webgl-resource":27,"./transform":6,"buffer":undefined}],4:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
exports.malletGeometry = angular.module('mallet.geometry', []);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\geometry\\geometry.module.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\geometry")

},{"angular":undefined,"buffer":undefined}],5:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glMatrix = require("gl-matrix");
const { vec3 } = glMatrix;
class Mesh {
    /**
     * Defines a set of points in space and how they form a 3D object
     * @param {IMeshOptions} params
     */
    constructor(params) {
        this.positions = params.positions;
        this.indices = params.indices;
        this.vertexCount = (params.positions.length / 3) | 0;
        this.indexCount = params.indices.length;
        this.size = Mesh.getSize(params.positions);
        const faceNormals = Mesh.calculateFaceNormals(this.positions, this.indices) || [];
        const vertexNormals = Mesh.calculateVertexNormals(this.positions, this.indices, faceNormals);
        this.vertexBuffer = Object.freeze(Mesh.buildVertexBuffer(this.positions, vertexNormals, params.colors));
        this.indexBuffer = Object.freeze((new Uint16Array(this.indices)).buffer);
        Object.seal(this);
    }
    /**
     * Get the dimensions of the mesh buffer
     * @param verts
     */
    static getSize(verts) {
        if (verts.length === 0) {
            return vec3.create();
        }
        const min = vec3.clone(verts[0]);
        const max = vec3.clone(verts[0]);
        verts.forEach((v) => {
            if (v[0] < min[0]) {
                min[0] = v[0];
            }
            else if (v[0] > max[0]) {
                max[0] = v[0];
            }
            if (v[1] < min[1]) {
                min[1] = v[1];
            }
            else if (v[1] > max[1]) {
                max[1] = v[1];
            }
            if (v[2] < min[2]) {
                min[2] = v[2];
            }
            else if (v[2] > max[2]) {
                max[2] = v[2];
            }
        });
        const size = vec3.create();
        vec3.subtract(size, min, max);
        return size;
    }
    /**
     * Creates the normals for each face
     * @param {glMatrix.vec3[]} verts
     * @param {number[]} indices
     * @returns {glMatrix.vec3[]}
     */
    static calculateFaceNormals(verts, indices) {
        const faceSize = 3;
        if (indices.length % faceSize !== 0) {
            return null;
        }
        const ab = vec3.create();
        const ac = vec3.create();
        const faceNormals = new Array(Math.floor(indices.length / faceSize));
        for (let i = 0; i < indices.length; i += faceSize) {
            const a = verts[indices[i]];
            const b = verts[indices[i + 1]];
            const c = verts[indices[i + 2]];
            vec3.subtract(ab, b, a);
            vec3.subtract(ac, c, a);
            const normal = vec3.create();
            vec3.cross(normal, ab, ac);
            vec3.normalize(normal, normal);
            const faceIndex = i / faceSize;
            faceNormals[faceIndex] = normal;
            // console.log(`Face ${faceIndex}: ${angle} ${normal} ${unitNormal}`);
        }
        return faceNormals;
    }
    /**
     * Calculate vertex normals by averaging the face normals for each vertex
     * @param {glMatrix.vec3[]} verts
     * @param {number[]} indices
     * @param {glMatrix.vec3[]} faceNormals
     * @returns {glMatrix.vec3[]}
     */
    static calculateVertexNormals(verts, indices, faceNormals) {
        const vertexNormals = verts.map(() => vec3.create());
        const faceSize = 3;
        let f; // index of the current face;
        for (let i = 0; i < indices.length; i++) {
            f = (i / faceSize) | 0;
            const vn = vertexNormals[indices[i]];
            vec3.add(vn, vn, faceNormals[f]);
        }
        vertexNormals.forEach((normal) => vec3.normalize(normal, normal));
        return vertexNormals;
    }
    /**
     * Construct a vertex buffer from the positions and normals arrays
     * @param {glMatrix.vec3[]} positions
     * @param {glMatrix.vec3[]} normals
     * @param {glMatrix.vec3[]} colors
     * @returns {ArrayBuffer}
     */
    static buildVertexBuffer(positions, normals, colors) {
        const buffer = new Float32Array(positions.length * Mesh.VERT_SIZE);
        positions.forEach((vert, i) => {
            const vertIndex = i * Mesh.VERT_SIZE;
            buffer[vertIndex] = vert[0];
            buffer[vertIndex + 1] = vert[1];
            buffer[vertIndex + 2] = vert[2];
            const normal = normals[i];
            buffer[vertIndex + 3] = normal[0];
            buffer[vertIndex + 4] = normal[1];
            buffer[vertIndex + 5] = normal[2];
            const color = colors[i];
            buffer[vertIndex + 6] = color[0];
            buffer[vertIndex + 7] = color[1];
            buffer[vertIndex + 8] = color[2];
        });
        console.log(buffer);
        return buffer.buffer;
    }
    getVertexCount() {
        return this.vertexCount;
    }
    getIndexCount() {
        return this.indexCount;
    }
    getVertexBuffer() {
        return this.vertexBuffer;
    }
    getIndexBuffer() {
        return this.indexBuffer;
    }
}
Mesh.VERT_SIZE = 9;
exports.Mesh = Mesh;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\geometry\\mesh.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\geometry")

},{"buffer":undefined,"gl-matrix":undefined}],6:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
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
    vSetRotation(orientation) {
        if (orientation.length === 3) {
            quat.fromEuler(this.rotation, orientation[0], orientation[1], orientation[2]);
        }
        else {
            quat.set(this.rotation, orientation[0], orientation[1], orientation[2], orientation[3]);
        }
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\geometry\\transform.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\geometry")

},{"buffer":undefined,"gl-matrix":undefined}],7:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// core mallet
__export(require("./mallet.depedency-tree"));
__export(require("./lib/logger"));
__export(require("./lib/injector-plus"));
__export(require("./render-target.factory"));
__export(require("./render-target.component"));
__export(require("./scheduler.service"));
// geometry
__export(require("./geometry/entity"));
__export(require("./geometry/transform"));
__export(require("./geometry/mesh"));
__export(require("./geometry/camera"));
// canvas 2d
// webgl
__export(require("./webgl/webgl.module"));
__export(require("./webgl/webgl-stage"));
__export(require("./webgl/renderer"));
__export(require("./webgl/webgl-app"));
__export(require("./webgl/webgl-mesh"));
__export(require("./webgl/shader"));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\index.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./geometry/camera":2,"./geometry/entity":3,"./geometry/mesh":5,"./geometry/transform":6,"./lib/injector-plus":9,"./lib/logger":10,"./mallet.depedency-tree":15,"./render-target.component":17,"./render-target.factory":18,"./scheduler.service":19,"./webgl/renderer":21,"./webgl/shader":23,"./webgl/webgl-app":24,"./webgl/webgl-mesh":25,"./webgl/webgl-stage":29,"./webgl/webgl.module":31,"buffer":undefined}],8:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
/**
 * Created by Greg on 3/24/2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
function enumerable(value) {
    return (target, propertyKey) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
        if (descriptor.enumerable !== value) {
            descriptor.enumerable = value;
            descriptor.writable = true;
            Object.defineProperty(target, propertyKey, descriptor);
        }
    };
}
exports.enumerable = enumerable;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\lib\\decorators.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\lib")

},{"buffer":undefined}],9:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const logger_1 = require("./logger");
const logger = new logger_1.Logger();
logger.config({ level: logger_1.Level.Verbose });
const injectableMethodName = 'exec';
const providerGet = '$get';
const annotationKey = Symbol('dependencies');
/**
 * Define the injection annotation for a given angular provider
 * @param {string} identifier
 * @returns {ParameterDecorator}
 */
function inject(identifier) {
    // tslint:disable-next-line:callable-types
    return function annotation(target, key, index) {
        if (key && key !== injectableMethodName && key !== providerGet) {
            throw new TypeError('Dependencies can only be injected on constructor, injectable method executor, or provider');
        }
        else if (key) {
            target = target.constructor;
        }
        const annotations = Reflect.getOwnMetadata(annotationKey, target) || new Array(target.length);
        annotations[index] = identifier;
        logger.verbose(`Add injection ${identifier} to ${target.name}`);
        Reflect.defineMetadata(annotationKey, annotations, target);
    };
}
exports.inject = inject;
// tslint:disable-next-line:no-namespace
(function (inject) {
    inject.provider = (identifier) => inject(`${identifier}Provider`);
})(inject = exports.inject || (exports.inject = {}));
function ngAnnotateProvider(constructor) {
    const provider = constructor.prototype;
    const annotations = Reflect.getOwnMetadata(annotationKey, constructor) || [];
    const method = provider.$get;
    if (annotations.length !== method.length) {
        throw new Error(`Annotations are not defined for all dependencies of ${method.name}: 
            expected ${method.length} annotations and found ${annotations.length}`);
    }
    logger.verbose(`Annotated ${annotations.length} provider dependencies for ${constructor.name}`);
    provider.$get = [...annotations, method];
}
exports.ngAnnotateProvider = ngAnnotateProvider;
/**
 * Construct an angular annotation array from dependency metadata
 * @param {Function} provider
 * @param {Function} baseClass
 * @returns {Array<string | Function>}
 */
function ngAnnotate(provider, baseClass = null) {
    let clazz = baseClass || provider;
    let annotations = Reflect.getMetadata(annotationKey, clazz) || [];
    // if we didn't find any annotations on the class, look in it's prototype chain
    if (annotations.length === 0) {
        do {
            clazz = Object.getPrototypeOf(clazz);
            annotations = Reflect.getMetadata(annotationKey, clazz) || [];
            logger.verbose(`Checking ${clazz.name} for annotations. Found ${annotations.length}`);
        } while (annotations.length === 0 && clazz.name !== '');
        // reset the class reference to the provider if we didn't find any annotations
        if (clazz.name === '') {
            clazz = provider;
        }
    }
    let method = provider;
    let methodName = provider.name;
    if (provider.length === 0 && provider.prototype.hasOwnProperty(injectableMethodName)) {
        method = provider.prototype[injectableMethodName];
        methodName += `.${injectableMethodName}`;
    }
    // the number annotations should match either the method length or the base class ctor length
    if (annotations.length !== method.length && clazz.length !== annotations.length) {
        throw new Error(`Annotations are not defined for all dependencies of ${methodName}: 
            expected ${method.length} annotations and found ${annotations.length}`);
    }
    logger.verbose(`Annotated ${annotations.length} dependencies for ${provider.name}`);
    return [...annotations, method];
}
exports.ngAnnotate = ngAnnotate;
function buildTree(tree, module) {
    try {
        JSON.stringify(tree);
    }
    catch (e) {
        throw new TypeError('Tree object must be serializable to build a valid tree');
    }
    function traverseNode(node, prop, identifier) {
        const value = node[prop];
        if (typeof value === 'string' && !value) {
            node[prop] = [...identifier, prop].join('.');
        }
        else if (typeof value === 'object' && value !== null) {
            Object.keys(value).forEach((key) => {
                traverseNode(value, key, [...identifier, prop]);
            });
        }
    }
    Object.keys(tree).forEach((key) => {
        traverseNode(tree, key, [module]);
    });
}
exports.buildTree = buildTree;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\lib\\injector-plus.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\lib")

},{"./logger":10,"buffer":undefined,"reflect-metadata":undefined}],10:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_machine_1 = require("./state-machine");
// eventual source mapping stuff
// const convert = require('convert-source-map');
// const currentScript = document.currentScript.src;
class Level extends state_machine_1.StateMachine {
}
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "None", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Error", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Warn", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Info", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Debug", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Verbose", void 0);
exports.Level = Level;
/**
 * Browser-friendly logging utility with multiple loggers and level switches
 * @author Greg Rozmarynowycz<greg@thunderlab.net>
 */
class Logger {
    /**
     * @param {string} stack
     * @param {number} [calls=0]
     */
    static getTrace(stack, calls = 0) {
        const call = stack
            .split('\n')[calls + 3]
            .split(' at ').pop();
        // we have to trace back to 2 calls because of calls from the logger
        const file = call.split('/').pop();
        const method = call.split(' (').shift();
        return `(${method}:${file}`;
    }
    constructor() {
        this.state = new Level();
        this.state.setState(Level.Info);
        // add console logger by default
        this.loggers = [{ level: Level.Verbose, api: console }];
    }
    addLogger(logger, loggerLevel) {
        this.loggers.push({ api: logger, level: loggerLevel });
    }
    config(params) {
        this.state.setState(typeof (params.level) !== 'undefined' ? params.level : (this.state.getState() || Level.Error));
    }
    error(...args) {
        if (this.state.getState() < Level.Error) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Error, 'error');
    }
    warn(...args) {
        if (this.state.getState() < Level.Warn) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Warn, 'warn');
    }
    info(...args) {
        if (this.state.getState() < Level.Info) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Info, 'info');
    }
    debug(...args) {
        if (this.state.getState() < Level.Debug) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Debug, 'debug');
    }
    verbose(...args) {
        if (this.state.getState() < Level.Verbose) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Verbose, 'debug');
    }
    logOut(args, msgLevel, func) {
        const stack = Error().stack;
        const trace = Logger.getTrace(stack);
        const level = this.state.getState();
        if (msgLevel > level) {
            return;
        }
        // args[0] = `${trace} ${args[0]}`;
        args.unshift(trace);
        for (let i = 0, l = this.loggers.length; i < l; i++) {
            const loggerLevel = Number.isInteger(this.loggers[i].level) ? this.loggers[i].level : level;
            if (msgLevel <= loggerLevel) {
                this.loggers[i].api[func](...args);
            }
        }
    }
}
exports.Logger = Logger;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\lib\\logger.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\lib")

},{"./state-machine":11,"buffer":undefined}],11:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Greg on 3/24/2017.
 */
const decorators_1 = require("./decorators");
// tslint:disable:no-shadowed-variable
class StateListener {
    constructor(state, callback) {
        this.state = state;
        this.callback = callback;
    }
    getState() {
        return this.state;
    }
    invoke(prevState) {
        this.callback(this.state, prevState);
    }
}
function state(target, key) {
    if (delete target[key]) {
        Object.defineProperty(target, key, {
            enumerable: true,
            value: Math.pow(2, Object.keys(target).length),
        });
    }
}
exports.state = state;
/* tslint:disable:no-shadowed-variable */
class StateMachine {
    constructor() {
        this.state = 0;
        this.stateListeners = [];
    }
    static all(machine) {
        return Object.keys(machine).reduce((all, state) => {
            return all | machine[state];
        }, 0);
    }
    /**
     * Indicates if a given state is active
     * @param state
     * @returns {boolean}
     */
    is(state) {
        return (state | this.state) === this.state;
    }
    getState() {
        return this.state;
    }
    /**
     * Creates an event listener for the given state
     * @param state
     * @param callback
     */
    onState(state, callback) {
        this.stateListeners.push(new StateListener(state, callback));
    }
    /**
     * Clear all state listeners
     */
    removeStateListeners() {
        this.stateListeners.length = 0;
    }
    setState(state) {
        const prevState = this.state;
        this.state = state;
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }
    addState(state) {
        const prevState = this.state;
        this.state |= state;
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }
    reset() {
        this.state = 0;
    }
    removeState(state) {
        const prevState = this.state;
        this.state ^= state;
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }
    invokeStateListeners(state, prevState) {
        this.stateListeners.forEach((listener) => {
            if ((listener.getState() | state) === state) {
                listener.invoke(prevState);
            }
        });
    }
}
__decorate([
    decorators_1.enumerable(false),
    __metadata("design:type", Object)
], StateMachine.prototype, "state", void 0);
__decorate([
    decorators_1.enumerable(false),
    __metadata("design:type", Array)
], StateMachine.prototype, "stateListeners", void 0);
exports.StateMachine = StateMachine;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\lib\\state-machine.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\lib")

},{"./decorators":8,"buffer":undefined}],12:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const bind_decorator_1 = require("bind-decorator");
const angular = require("angular");
class DTO {
    constructor(params) {
        Object.assign(this, params);
    }
}
exports.DTO = DTO;
class StaticSource {
    constructor(entries, order = 0) {
        this.entries = entries;
        this.order = order;
    }
    get(id) {
        return Promise.resolve(this.entries[id]);
    }
    getAll() {
        return Promise.resolve(Object.keys(this.entries).map((key) => this.entries[key]));
    }
    getOrder() {
        return this.order;
    }
}
exports.StaticSource = StaticSource;
/**
 *
 */
class SourceAdapter {
    constructor(params) {
        this.source = params.source;
        this.method = params.method;
        this.successMethod = params.successMethod || 'then';
        this.modules = ['ng', ...params.modules || []];
        this.order = typeof params.order === 'number' ? params.order : 0;
        this.callback = params.callback || false;
        // make logic simpler by defaulting to a no-op; we don't care about overhead here
        const noop = (input) => input;
        this.inputTransform = params.inputTransform || noop;
        this.outputTransform = params.outputTransform || noop;
    }
    get(id) {
        if (typeof this.source === 'string') {
            this.source = angular.injector(this.modules).get(this.source);
        }
        if (this.callback) {
            return new Promise((resolve) => {
                this.source[this.method](this.inputTransform(id), resolve);
            }).then(this.outputTransform);
        }
        return this.source[this.method](this.inputTransform(id))[this.successMethod](this.outputTransform);
    }
    getAll() {
        console.warn('Source Adapter does not support getAll functionality');
        // throw new Error('Source Adapter does not support getAll functionality');
        return Promise.resolve([]);
    }
    getOrder() {
        return this.order;
    }
}
exports.SourceAdapter = SourceAdapter;
/**
 * Basic $http adapter
 */
class HttpAdapter extends SourceAdapter {
    constructor(path) {
        super({
            source: '$http',
            method: 'get',
            inputTransform: (id) => `${path}/${id}`,
            outputTransform: (resp) => resp.data,
        });
    }
}
exports.HttpAdapter = HttpAdapter;
/**
 * Falls back through provided sources to retrieve a DTO, building and returning an entity
 */
class Library {
    constructor(ctor, sources) {
        this.ctor = ctor;
        this.sources = sources;
        this.returnDTO = !this.ctor; // return DTO instead of constructing an entity
    }
    addSources(sources) {
        Array.prototype.push(this.sources, sources);
    }
    get(id) {
        const result = null;
        this.sources.sort((a, b) => a.getOrder() - b.getOrder());
        this.sourceIndex = 0;
        this.id = id;
        return this.fallbackGet(null).then(this.processResult);
    }
    /**
     * Retrieve all items from each source, and aggregate items to a single array
     * @returns {Promise<T[]>}
     */
    getAllItems() {
        return Promise.all(this.sources.map((source) => source.getAll()))
            .then((results) => {
            return Array.prototype.concat.apply([], results);
        });
    }
    /**
     * Recurse through each source, only calling a source if the previous return no result or failed
     * @param result
     * @returns {Promise<string | T>}
     */
    fallbackGet(result) {
        if (!result) {
            if (this.sourceIndex >= this.sources.length) {
                return Promise.resolve(null);
            }
            return this.sources[this.sourceIndex++].get(this.id)
                .then(this.fallbackGet)
                .catch((e) => {
                console.log(`Source get failed for ${this.ctor.name}`, e);
                return this.fallbackGet(null);
            });
        }
        return result;
    }
    /**
     * Transform the DTO or string into an entity
     * @param {Object | string} result
     * @returns {T}
     */
    processResult(result) {
        if (result === null || result === '') {
            return null;
        }
        else if (typeof result === 'string') {
            result = JSON.parse(result);
        }
        return this.returnDTO ? result : new this.ctor(result);
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Library.prototype, "fallbackGet", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], Library.prototype, "processResult", null);
/**
 * Library with dynamically built entries that are prepared during application setup
 */
class PreparedLibrary extends Library {
    constructor(ctor, sources) {
        super(ctor, sources);
    }
    processResult(result) {
        return result;
    }
}
class LibraryProvider {
    constructor() {
        this.libaries = new Map();
    }
    /**
     * Add source entries for the given type
     * @param {IEntityCtor<T, P>} ctor
     * @param {Array<ISource<T>>} sources
     */
    addSources(ctor, sources) {
        if (this.libaries.has(ctor)) {
            this.libaries.get(ctor).addSources(sources);
        }
        else {
            this.libaries.set(ctor, new Library(ctor, sources));
        }
    }
    /**
     * Add a library with sources configured after application setup
     * @param {any} ctor
     * @param {Array<ISource<any>>} sources
     */
    addPreparedSources(ctor, sources) {
        if (this.libaries.has(ctor)) {
            this.libaries.get(ctor).addSources(sources);
        }
        else {
            this.libaries.set(ctor, new PreparedLibrary(ctor, sources));
        }
    }
    /**
     * Retrieve entity of the given type and id
     * @param {Function} type
     * @param {string | number} id
     * @returns {Promise<T>}
     */
    get(type, id) {
        if (!this.libaries.has(type)) {
            throw new ReferenceError(`No sources are configured for ${type.name}`);
        }
        return this.libaries.get(type).get(id);
    }
    getAll(type) {
        if (!this.libaries.has(type)) {
            throw new ReferenceError(`No sources are configured for ${type.name}`);
        }
        return this.libaries.get(type).getAllItems();
    }
    $get() {
        return { get: this.get, getAll: this.getAll, addSources: this.addPreparedSources };
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], LibraryProvider.prototype, "get", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], LibraryProvider.prototype, "getAll", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], LibraryProvider.prototype, "$get", null);
exports.LibraryProvider = LibraryProvider;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\library.provider.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"angular":undefined,"bind-decorator":undefined,"buffer":undefined}],13:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// re-export the logger utility to maintain consistent pathing in the module definition
__export(require("./lib/logger"));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\logger.service.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./lib/logger":10,"buffer":undefined}],14:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const angular = require("angular");
const constants = angular.module('mallet-constants', [])
    .constant(mallet_depedency_tree_1.MDT.const.ScaleFactor, (() => window.devicePixelRatio || 1)())
    .constant(mallet_depedency_tree_1.MDT.const.SampleCount, 1024)
    .constant(mallet_depedency_tree_1.MDT.const.MaxFrameRate, 60)
    .constant(mallet_depedency_tree_1.MDT.const.Keys, Object.freeze({
    Down: 40,
    Up: 38,
    Right: 39,
    Left: 37,
    Space: 32,
    Escape: 27,
}));
module.exports = constants.name;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\mallet.constants.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./mallet.depedency-tree":15,"angular":undefined,"buffer":undefined}],15:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("./lib/injector-plus");
const MDT = {
    component: {
        webGLStage: 'malletWebglStage',
        renderTarget: 'malletRenderTarget',
    },
    config: {
        Path: '',
    },
    ['const']: {
        Keys: '',
        MaxFrameRate: '',
        SampleCount: '',
        ScaleFactor: '',
    },
    ng: {
        $element: '$element',
        $location: '$location',
        $window: '$window',
        $http: '$http',
        $locationProvider: '$locationProvider',
        $q: '$q',
        $rootScope: '$rootScope',
        $scope: '$scope',
        $socket: 'socketFactory',
        $state: '$state',
        $stateParams: '$stateParams',
        $stateProvider: '$stateProvider',
        $timeout: '$timeout',
        $urlService: '$urlService',
    },
    AsyncRequest: '',
    Camera: '',
    Color: '',
    Geometry: '',
    Keyboard: '',
    Logger: '',
    Math: '',
    MouseUtils: '',
    ParticleEmitter: '',
    ParticleEmitter2D: '',
    Scheduler: '',
    AppState: '',
    StateMachine: '',
    Thread: '',
    RenderTarget: '',
    Library: '',
    webgl: {
        ShaderSource: '',
        WebGLStage: '',
    },
};
exports.MDT = MDT;
injector_plus_1.buildTree(MDT, 'mallet');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\mallet.depedency-tree.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./lib/injector-plus":9,"buffer":undefined}],16:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const injector_plus_1 = require("./lib/injector-plus");
const render_target_factory_1 = require("./render-target.factory");
const app_state_service_1 = require("./app-state.service");
const scheduler_service_1 = require("./scheduler.service");
const logger_service_1 = require("./logger.service");
const render_target_component_1 = require("./render-target.component");
const library_provider_1 = require("./library.provider");
// tslint:disable:no-var-requires
exports.mallet = require('angular').module('mallet', [
    require('./mallet.constants'),
]);
exports.mallet.provider(mallet_depedency_tree_1.MDT.Library, injector_plus_1.ngAnnotate(library_provider_1.LibraryProvider));
exports.mallet.service(mallet_depedency_tree_1.MDT.Scheduler, injector_plus_1.ngAnnotate(scheduler_service_1.Scheduler));
exports.mallet.service(mallet_depedency_tree_1.MDT.AppState, injector_plus_1.ngAnnotate(app_state_service_1.AppState));
exports.mallet.service(mallet_depedency_tree_1.MDT.Logger, injector_plus_1.ngAnnotate(logger_service_1.Logger));
exports.mallet.factory(mallet_depedency_tree_1.MDT.RenderTarget, injector_plus_1.ngAnnotate(render_target_factory_1.renderTargetFactory));
exports.mallet.component(mallet_depedency_tree_1.MDT.component.renderTarget, render_target_component_1.options);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\mallet.module.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./app-state.service":1,"./lib/injector-plus":9,"./library.provider":12,"./logger.service":13,"./mallet.constants":14,"./mallet.depedency-tree":15,"./render-target.component":17,"./render-target.factory":18,"./scheduler.service":19,"angular":undefined,"buffer":undefined}],17:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("./lib/injector-plus");
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const scheduler_service_1 = require("./scheduler.service");
const angular_1 = require("angular");
const bind_decorator_1 = require("bind-decorator");
const logger_1 = require("./lib/logger");
let RenderTargetCtrl = class RenderTargetCtrl {
    constructor(logger, $element, mState, scheduler, renderTargetFactory) {
        this.logger = logger;
        this.$element = $element;
        this.mState = mState;
        this.scheduler = scheduler;
        this.renderTargetFactory = renderTargetFactory;
        this.scale = 1;
        this.NO_SUPPORT_MESSAGE = 'Your browser does not support canvas. Please consider upgrading.';
    }
    static getController($element) {
        // https://stackoverflow.com/questions/21995108/angular-get-controller-from-element
        const targetTag = 'mallet-render-target';
        const renderTarget = $element[0].getElementsByTagName(targetTag);
        if (!renderTarget || !renderTarget.length) {
            throw new ReferenceError(`Failed to find render target ${targetTag} in component ${$element[0]}`);
        }
        const ctrl = angular_1.element(renderTarget).controller(mallet_depedency_tree_1.MDT.component.renderTarget);
        if (!ctrl) {
            const err = `Failed to get controller from render target. Ensure this function is being called in $postLink or later.`;
            throw new ReferenceError(err);
        }
        return ctrl;
    }
    $onInit() {
        // Create the render target
        const width = this.$element[0].clientWidth;
        const height = this.$element[0].clientHeight;
        this.logger.debug(`Create render target with type ${this.type.name}`);
        this.renderTarget = this.renderTargetFactory(this.type, { width, height });
        this.ctx = this.renderTarget.getContext();
        // Setup and attach canvas
        const canvas = this.renderTarget.getCanvas();
        canvas.innerHTML = this.NO_SUPPORT_MESSAGE;
        this.$element.append(canvas);
        this.scheduler.schedule(this.update, 0);
        window.addEventListener('resize', this.onResize);
    }
    $onDestroy() {
        window.removeEventListener('resize', this.onResize);
    }
    getContext() {
        return this.ctx;
    }
    getRenderTarget() {
        return this.renderTarget;
    }
    update() {
        const lowResScale = 0.75;
        // Reduce canvas resolution is performance is bad
        if (this.scheduler.FPS < 30 && this.scale === 1) {
            this.scale = lowResScale;
            this.renderTarget.resize(this.scale);
        }
        else if (this.scheduler.FPS > 40 && this.scale === lowResScale) {
            this.scale = 1;
            this.renderTarget.resize(this.scale);
        }
        this.scheduler.draw(() => this.renderTarget.clear(), -1);
    }
    onResize() {
        this.renderTarget.resize(this.scale);
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RenderTargetCtrl.prototype, "update", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RenderTargetCtrl.prototype, "onResize", null);
RenderTargetCtrl = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$element)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.AppState)),
    __param(3, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Scheduler)),
    __param(4, injector_plus_1.inject(mallet_depedency_tree_1.MDT.RenderTarget)),
    __metadata("design:paramtypes", [logger_1.Logger, Object, Object, scheduler_service_1.Scheduler, Function])
], RenderTargetCtrl);
exports.RenderTargetCtrl = RenderTargetCtrl;
class RenderTarget2DCtrl extends RenderTargetCtrl {
    update() {
        super.update();
        if (this.mState.is(this.mState.Debug)) {
            this.scheduler.draw(() => {
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText(`FPS: ${~~this.scheduler.FPS}`, 25, 25);
            }, 1);
        }
    }
}
exports.options = {
    controller: injector_plus_1.ngAnnotate(RenderTargetCtrl),
    template: '<div class="render-target"></div>',
    bindings: {
        type: '<',
    },
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\render-target.component.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./lib/injector-plus":9,"./lib/logger":10,"./mallet.depedency-tree":15,"./scheduler.service":19,"angular":undefined,"bind-decorator":undefined,"buffer":undefined}],18:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by gjrwcs on 9/15/2016.
 */
const injector_plus_1 = require("./lib/injector-plus");
const logger_service_1 = require("./logger.service");
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
var CanvasContext;
(function (CanvasContext) {
    CanvasContext["basic"] = "2d";
    CanvasContext["webgl"] = "webgl";
    CanvasContext["webglExperimental"] = "webgl-experimental";
})(CanvasContext || (CanvasContext = {}));
class RenderTarget {
    constructor(parameters, logger) {
        this.logger = logger;
        const { width, height } = parameters;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.getNewContext();
    }
    getAspectRatio() {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }
    getContext() {
        return this.ctx;
    }
    getCanvas() {
        return this.canvas;
    }
    resize(scale = 1) {
        this.logger.debug(`resize ${this.canvas.id || this.canvas.className} to ${scale}`);
        // finally query the various pixel ratios
        const devicePixelRatio = window.devicePixelRatio || 1;
        const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
            this.ctx.mozBackingStorePixelRatio ||
            this.ctx.msBackingStorePixelRatio ||
            this.ctx.oBackingStorePixelRatio ||
            this.ctx.backingStorePixelRatio || 1;
        const ratio = devicePixelRatio / backingStoreRatio;
        this.canvas.width = this.canvas.clientWidth * scale;
        this.canvas.height = this.canvas.clientHeight * scale;
        if (devicePixelRatio !== backingStoreRatio || scale !== 1) {
            this.canvas.width *= ratio;
            this.canvas.height *= ratio;
            this.ctx = this.getNewContext();
        }
    }
}
exports.RenderTarget = RenderTarget;
class RenderTarget2D extends RenderTarget {
    clear() {
        this.logger.verbose(`clear render target ${this.canvas.id || this.canvas.className}`);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getContext() {
        return super.getContext();
    }
    getNewContext() {
        return this.canvas.getContext(CanvasContext.basic);
    }
}
exports.RenderTarget2D = RenderTarget2D;
class RenderTargetWebGL extends RenderTarget {
    clear() {
        this.logger.verbose(`clear render target ${this.canvas.id || this.canvas.className}`);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
    }
    getContext() {
        return super.getContext();
    }
    getNewContext() {
        const gl = (this.canvas.getContext(CanvasContext.webgl) ||
            this.canvas.getContext(CanvasContext.webglExperimental));
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        return gl;
    }
    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRendingContext && this.getNewContext());
        }
        catch (e) {
            return false;
        }
    }
}
exports.RenderTargetWebGL = RenderTargetWebGL;
// tslint:disable-next-line:class-name
class renderTargetFactory {
    exec(logger) {
        return (ctor, options) => {
            return new ctor(options, logger);
        };
    }
}
__decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logger_service_1.Logger]),
    __metadata("design:returntype", void 0)
], renderTargetFactory.prototype, "exec", null);
exports.renderTargetFactory = renderTargetFactory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\render-target.factory.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./lib/injector-plus":9,"./logger.service":13,"./mallet.depedency-tree":15,"buffer":undefined}],19:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("./lib/injector-plus");
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const logger_service_1 = require("./logger.service");
const pulsar_lib_1 = require("pulsar-lib");
const bind_decorator_1 = require("bind-decorator");
const app_state_service_1 = require("./app-state.service");
/**
 * Executes and monitors the engine loop
 */
let Scheduler = class Scheduler {
    constructor(maxFrameRate, appState, logger) {
        this.maxFrameRate = maxFrameRate;
        this.appState = appState;
        this.logger = logger;
        /** @description Current Frames Per Second */
        this.fps = 0;
        /** @description timestamp of last FPS doUpdate */
        this.lastFPSUpdate = 0;
        /** @description frames executed in last second */
        this.framesThisSecond = 0;
        /** @description suspend main loop if the window loses focus */
        this.suspendOnBlur = false;
        this.animationFrame = null;
        /** @description timestamp when first frame executed */
        this.startTime = 0;
        /** @description milliseconds since doUpdate loop was run */
        this.deltaTime = 0;
        /** @description  milliseconds since last frame */
        this.elapsedTime = 0;
        /** @description timestamp of the last frame */
        this.lastFrameTime = 0;
        this.updateOperations = new pulsar_lib_1.PriorityQueue();
        this.drawCommands = new pulsar_lib_1.PriorityQueue();
        this.postDrawCommands = new pulsar_lib_1.PriorityQueue();
        this.timestep = 1000 / this.maxFrameRate;
        this.fps = this.maxFrameRate;
        window.addEventListener('blur', this.suspend);
    }
    static scheduleCommand(command, priority, queue) {
        if (command instanceof Function) {
            priority = priority || 0;
            queue.enqueue(priority, command);
        }
        else {
            throw new TypeError('Operation must be a function');
        }
    }
    /**
     * average Frames executed per second over the last
     * @returns {number}
     * @constructor
     */
    get FPS() { return this.fps; }
    suspend(e) {
        if (!(e && e.type === 'blur' && this.suspendOnBlur === false)) {
            this.appState.setState(app_state_service_1.AppState.Suspended);
            cancelAnimationFrame(this.animationFrame);
            // $rootScope.$evalAsync();
        }
    }
    resume() {
        if (this.appState.is(app_state_service_1.AppState.Suspended)) {
            this.startMainLoop();
        }
    }
    /**
     * Initialize the main app loop
     */
    startMainLoop() {
        this.startTime = (new Date()).getTime();
        this.lastFrameTime = (new Date()).getTime();
        this.animationFrame = requestAnimationFrame(this.mainLoop);
        this.appState.setState(app_state_service_1.AppState.Running);
    }
    /**
     * Schedule an doUpdate command to be executed each frame
     * @param operation
     * @param order
     */
    schedule(operation, order) {
        Scheduler.scheduleCommand(operation, order, this.updateOperations);
    }
    /**
     * Queue a draw opeartion to be executed once and discarded
     * @param operation
     * @param zIndex
     */
    draw(operation, zIndex) {
        Scheduler.scheduleCommand(operation, zIndex, this.drawCommands);
    }
    /**
     * Clears the set of registered doUpdate operations
     */
    reset() {
        this.updateOperations.clear();
    }
    /**
     * Toggles suspension of the main loop when the window is blurred
     * @param flag
     */
    setSuspendOnBlur(flag) {
        this.suspendOnBlur = typeof flag !== 'undefined' ? flag : true;
    }
    /**
     * Execute all doUpdate opeartions while preserving the doUpdate queue
     * @param stepDeltaTime (in milliseconds)
     * @param totalElapsedTime (in milliseconds)
     */
    doUpdate(stepDeltaTime, totalElapsedTime) {
        // reset draw commands to prevent duplicate frames being rendered
        this.drawCommands.clear();
        this.postDrawCommands.clear();
        const opsIterator = this.updateOperations.getIterator();
        while (!opsIterator.isEnd()) {
            opsIterator.next().call(null, stepDeltaTime, totalElapsedTime);
        }
        // There might be a better way to do this, but not really slowing things down right now
        // $rootScope.$apply(); might not be necessary with $ctrl architecture
    }
    /**
     * Execute all draw and post-draw commands, emptying each queue
     * @param stepDeltaTime
     * @param totalElapsedTime
     */
    doDraw(stepDeltaTime, totalElapsedTime) {
        while (this.drawCommands.peek() !== null) {
            this.drawCommands.dequeue().call(null, stepDeltaTime, totalElapsedTime);
        }
        while (this.postDrawCommands.peek() !== null) {
            this.postDrawCommands.dequeue().call(null, stepDeltaTime, totalElapsedTime);
        }
    }
    /**
     * Update the FPS value
     * @param totalElapsedTime
     */
    updateFPS(totalElapsedTime) {
        this.framesThisSecond++;
        if (totalElapsedTime > this.lastFPSUpdate + 1000) {
            const weightFactor = 0.25;
            this.fps = (weightFactor * this.framesThisSecond) + ((1 - weightFactor) * this.fps);
            this.lastFPSUpdate = totalElapsedTime;
            this.framesThisSecond = 0;
        }
    }
    /**
     * Derived From
     * Isaac Sukin
     * http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
     */
    mainLoop() {
        const frameTime = performance.now(); // this in microseconds, 1s = 1,000,000 microseconds
        this.deltaTime += frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;
        this.elapsedTime = frameTime - this.startTime;
        const elapsedMs = (this.elapsedTime / 1000) | 0;
        this.updateFPS(elapsedMs);
        let updateSteps = 0;
        const frameDeltaTime = this.deltaTime;
        while (this.deltaTime > this.timestep) {
            this.doUpdate((this.timestep / 1000) | 0, elapsedMs);
            this.deltaTime -= this.timestep;
            const maxConsecSteps = 240;
            if (++updateSteps > maxConsecSteps) {
                this.logger.warn(`Update Loop Exceeded ${maxConsecSteps} Calls`);
                this.deltaTime = 0; // don't do a silly # of updates
                break;
            }
        }
        this.doDraw(frameDeltaTime, this.elapsedTime);
        this.animationFrame = requestAnimationFrame(this.mainLoop);
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], Scheduler.prototype, "suspend", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Scheduler.prototype, "resume", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Scheduler.prototype, "mainLoop", null);
Scheduler = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.const.MaxFrameRate)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.AppState)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Number, app_state_service_1.AppState,
        logger_service_1.Logger])
], Scheduler);
exports.Scheduler = Scheduler;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\scheduler.service.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./app-state.service":1,"./lib/injector-plus":9,"./logger.service":13,"./mallet.depedency-tree":15,"bind-decorator":undefined,"buffer":undefined,"pulsar-lib":undefined}],20:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_resource_1 = require("./webgl-resource");
const shader_1 = require("./shader");
const byteSizes = {
    [shader_1.GLDataType.BYTE]: 1,
    [shader_1.GLDataType.UNSIGNED_SHORT]: 2,
    [shader_1.GLDataType.FLOAT]: 4,
    [shader_1.GLDataType.SHORT]: 2,
    [shader_1.GLDataType.UNSIGNED_BYTE]: 1,
    [shader_1.GLDataType.HALF_FLOAT]: 2,
};
class BufferFormat extends webgl_resource_1.WebGLResource {
    constructor(context, options) {
        super(context);
        this.context = context;
        this.apply = this.createLayoutDescription(options.shaderSpec.attributes);
    }
    // public updateBuffer(data: ArrayBuffer | ArrayBufferView, offset: number = 0) {
    //     const {gl} = this.context;
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    //     gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
    // }
    release() {
        // no-op
    }
    /**
     * Generates a layout method for the buffer with bound data to optimize for performance
     * @param {IAttribDescription[]} attribs
     * @returns {Function}
     */
    createLayoutDescription(attribs) {
        const { gl, program } = this.context;
        const vertexSize = attribs.reduce((total, attrib) => {
            return total + byteSizes[attrib.type] * attrib.size | 0;
        }, 0);
        // collection of functions with bound data
        const layoutOps = [];
        let offset = 0;
        attribs.forEach((attrib) => {
            // get the position of the attribute in the vertex shader, we can either retrieve from the shader
            // or force the shader to use a given position with bindAttribLocation
            const index = gl.getAttribLocation(program, attrib.name);
            if (index < 0) {
                this.context.logger.debug(`Skipping layout of ${attrib.name}, unused in shader program`);
                // increase the offset for the next attrib
                offset += byteSizes[attrib.type] * attrib.size;
                return;
            }
            // describe the attribute in the buffer
            layoutOps.push(gl.vertexAttribPointer.bind(gl, index, attrib.size || 0, gl[attrib.type], attrib.normalize || false, vertexSize, offset));
            // turn on the attribute at this index
            layoutOps.push(gl.enableVertexAttribArray.bind(gl, index));
            // switching to bind attrib location may improve performance if 0 index is unused
            // gl.bindAttribLocation(program, index, attrib.name); // connect attribute to vertex shader
            // increase the offset for the next attrib
            offset += byteSizes[attrib.type] * attrib.size;
        });
        this.context.logger.debug(`Created buffer layout function`, layoutOps);
        return (() => layoutOps.forEach((f) => f()));
    }
}
exports.BufferFormat = BufferFormat;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\buffer-format.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"./shader":23,"./webgl-resource":27,"buffer":undefined}],21:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("../geometry/entity");
const webgl_resource_1 = require("./webgl-resource");
const bind_decorator_1 = require("bind-decorator");
class Renderer extends webgl_resource_1.WebGLResource {
    constructor(context, options) {
        super(context);
        this.activeProgram = null;
        this.activeCamera = null;
        this.setActiveProgram(options.program);
        this.setActiveCamera(options.camera);
        this.entities = entity_1.Entity.getIndex();
    }
    renderScene() {
        this.clear();
        this.setViewMatrix(false, this.activeCamera.getViewMatrix());
        const entities = this.entities;
        const len = entities.length;
        const render = this.renderEntity;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < len; i++) {
            render(entities[i]);
        }
    }
    renderEntity(entity) {
        const { gl } = this.context;
        const mesh = entity.getMesh();
        // https://stackoverflow.com/questions/6077002/using-webgl-index-buffers-for-drawing-meshes
        // get the vertex buffer from the mesh & send the vertex buffer to the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getVertexBuffer());
        // use program & enable attributes
        this.activeProgram.use();
        // send index buffer to the GPU
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndexBuffer());
        const matrix = entity.getTransform().getMatrix();
        // console.log(matrix);
        this.setWorldMatrix(false, matrix);
        // perform the draw call
        gl.drawElements(gl.TRIANGLES, mesh.getVertexCount(), gl.UNSIGNED_SHORT, 0);
    }
    setActiveCamera(camera) {
        if (this.activeProgram === null) {
            throw new Error('Cannot set active camera without active program set. Call setActiveProgram.');
        }
        this.activeCamera = camera;
        // this will have to move to do zooming or similar
        this.setProjectionMatrix(false, camera.getProjectionMatrix());
    }
    setActiveProgram(program) {
        if (!program) {
            throw new ReferenceError('Active program cannot be null or undefined');
        }
        this.activeProgram = program;
        this.setViewMatrix = this.activeProgram.getUniformSetter('view');
        this.setWorldMatrix = this.activeProgram.getUniformSetter('world');
        this.setProjectionMatrix = this.activeProgram.getUniformSetter('projection');
        // TODO: something better with this
        // this.activeProgram.getUniformSetter('light.ambientColor')(0.1, 0.1, 0.1, 1.0);
        // this.activeProgram.getUniformSetter('light.diffuseColor')(0.8, 0.8, 0.8, 1.0);
        // this.activeProgram.getUniformSetter('light.direction')(-1, 0, 0);
        if (this.activeCamera !== null) {
            this.setProjectionMatrix(false, this.activeCamera.getProjectionMatrix());
        }
    }
    clear(color = [0, 0, 0, 1]) {
        const { gl } = this.context;
        gl.clearColor(0.33, 0.33, 0.33, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    release() {
        // noop
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Renderer.prototype, "renderScene", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Renderer.prototype, "renderEntity", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], Renderer.prototype, "clear", null);
exports.Renderer = Renderer;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\renderer.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../geometry/entity":3,"./webgl-resource":27,"bind-decorator":undefined,"buffer":undefined}],22:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const shader_1 = require("./shader");
const bind_decorator_1 = require("bind-decorator");
const webgl_resource_1 = require("./webgl-resource");
const buffer_format_1 = require("./buffer-format");
const library_provider_1 = require("../library.provider");
class ProgramOptionsDTO extends library_provider_1.DTO {
}
exports.ProgramOptionsDTO = ProgramOptionsDTO;
class ShaderProgram extends webgl_resource_1.WebGLResource {
    constructor(context, config) {
        super(context);
        this.context = context;
        this.context.program = context.gl.createProgram();
        const { gl, program, logger } = this.context;
        const vertexShader = this.createShader(config.shaders.vertex);
        gl.attachShader(program, vertexShader.getShader());
        vertexShader.release();
        const fragmentShader = this.createShader(config.shaders.fragment);
        gl.attachShader(program, fragmentShader.getShader());
        fragmentShader.release();
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            gl.deleteProgram(program);
            throw new Error(`Failed to link program: ${gl.getProgramInfoLog(program)}`);
        }
        gl.useProgram(program); // retrieve and store program variable information
        this.bufferFormat = new buffer_format_1.BufferFormat(this.context, { shaderSpec: config.shaders.vertex.spec });
        this.uniforms = {};
        this.cacheUniforms([
            config.shaders.vertex.spec.uniforms || {},
            config.shaders.fragment.spec.uniforms || {}
        ]);
    }
    getUniformSetter(name) {
        const { gl } = this.context;
        const uniform = this.uniforms[name];
        return gl[uniform.type].bind(gl, uniform.location);
    }
    use() {
        const { gl, program } = this.context;
        gl.useProgram(program);
        this.bufferFormat.apply();
    }
    getGLProgram() {
        return this.context.program;
    }
    release() {
        const { gl, program } = this.context;
        gl.deleteProgram(program);
    }
    createShader(config) {
        return new shader_1.Shader(this.context, config);
    }
    cacheUniforms(spec) {
        const { program, gl } = this.context;
        spec.forEach((uniforms) => {
            this.flattenUniforms(uniforms).forEach((namePcs) => {
                const name = namePcs.join('.');
                const location = gl.getUniformLocation(program, name);
                const type = this.getUniformType(uniforms, namePcs);
                this.context.logger.debug(`Caching uniform ${name} (${type}) at location ${location}`);
                this.uniforms[name] = { name, location, type };
            });
        });
    }
    flattenUniforms(struct, keys = [], pieces = []) {
        if (!struct) {
            return;
        }
        if (pieces.length > 5) {
            throw new TypeError('Uniform structs with more than 5 levels are not supported, your struct object may have cycles');
        }
        Object.keys(struct).forEach((prop) => {
            const type = struct[prop];
            // Type -> new key array
            if (shader_1.GLUniformType[type]) {
                keys.push([...pieces, prop]);
            }
            else {
                this.flattenUniforms(type, keys, [...pieces, prop]);
            }
        });
        return keys;
    }
    getUniformType(uniform, name) {
        return name.reduce((struct, prop) => {
            return struct[prop];
        }, uniform);
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ShaderProgram.prototype, "createShader", null);
exports.ShaderProgram = ShaderProgram;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\shader-program.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../library.provider":12,"./buffer-format":20,"./shader":23,"./webgl-resource":27,"bind-decorator":undefined,"buffer":undefined}],23:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_resource_1 = require("./webgl-resource");
const library_provider_1 = require("../library.provider");
var GLDataType;
(function (GLDataType) {
    GLDataType["BYTE"] = "BYTE";
    GLDataType["FLOAT"] = "FLOAT";
    GLDataType["SHORT"] = "SHORT";
    GLDataType["UNSIGNED_SHORT"] = "UNSIGNED_SHORT";
    GLDataType["UNSIGNED_BYTE"] = "UNSIGNED_BYTE";
    GLDataType["HALF_FLOAT"] = "HALF_FLOAT";
})(GLDataType = exports.GLDataType || (exports.GLDataType = {}));
var GLUniformType;
(function (GLUniformType) {
    GLUniformType["uniform1f"] = "uniform1f";
    GLUniformType["uniform1fv"] = "uniform1fv";
    GLUniformType["uniform2f"] = "uniform2f";
    GLUniformType["uniform2fv"] = "uniform2fv";
    GLUniformType["uniform3f"] = "uniform3f";
    GLUniformType["uniform3fv"] = "uniform3fv";
    GLUniformType["uniform4f"] = "uniform4f";
    GLUniformType["uniform4fv"] = "uniform4fv";
    GLUniformType["uniformMatrix2fv"] = "uniformMatrix2fv";
    GLUniformType["uniformMatrix3fv"] = "uniformMatrix3fv";
    GLUniformType["uniformMatrix4fv"] = "uniformMatrix4fv";
    GLUniformType["uniform1i"] = "uniform1i";
    GLUniformType["uniform1iv"] = "uniform1iv";
    GLUniformType["uniform2i"] = "uniform2i";
    GLUniformType["uniform2iv"] = "uniform2iv";
    GLUniformType["uniform3i"] = "uniform3i";
    GLUniformType["uniform3iv"] = "uniform3iv";
    GLUniformType["uniform4i"] = "uniform4i";
    GLUniformType["uniform4iv"] = "uniform4iv";
})(GLUniformType = exports.GLUniformType || (exports.GLUniformType = {}));
var ShaderType;
(function (ShaderType) {
    ShaderType["VERTEX_SHADER"] = "VERTEX_SHADER";
    ShaderType["FRAGMENT_SHADER"] = "FRAGMENT_SHADER";
})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
class ShaderDTO extends library_provider_1.DTO {
}
exports.ShaderDTO = ShaderDTO;
class Shader extends webgl_resource_1.WebGLResource {
    constructor(context, options) {
        super(context);
        this.options = options;
        const { gl } = context;
        this.id = options.id;
        const shaderSource = options.src || document.getElementById(options.id).textContent;
        if (!shaderSource || typeof shaderSource !== 'string') {
            throw new Error(`Failed to get valid shader source for ${options.id}`);
        }
        this.shader = gl.createShader(gl[options.type]);
        gl.shaderSource(this.shader, shaderSource); // send the source to the shader object
        gl.compileShader(this.shader); // compile the shader program
        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(this.shader);
            gl.deleteShader(this.shader);
            throw new Error(`Failed to compile ${this.id}: ${info}`);
        }
    }
    getShader() {
        return this.shader;
    }
    getId() {
        return this.id;
    }
    prepare({ gl }) {
        // no-op
    }
    release() {
        this.context.gl.deleteShader(this.shader);
    }
}
exports.Shader = Shader;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\shader.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../library.provider":12,"./webgl-resource":27,"buffer":undefined}],24:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("../lib/injector-plus");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const logger_1 = require("../lib/logger");
const bind_decorator_1 = require("bind-decorator");
const entity_1 = require("../geometry/entity");
let WebGLApp = class WebGLApp {
    constructor(maxFrameRate, $q, library, stage, $element, logger) {
        this.maxFrameRate = maxFrameRate;
        this.$q = $q;
        this.library = library;
        this.stage = stage;
        this.$element = $element;
        this.logger = logger;
        this.preUpdate = null;
        /** @description Current Frames Per Second */
        this.fps = 0;
        /** @description timestamp of last FPS doUpdate */
        this.lastFPSUpdate = 0;
        /** @description frames executed in last second */
        this.framesThisSecond = 0;
        /** @description suspend main loop if the window loses focus */
        this.suspendOnBlur = false;
        this.animationFrame = null;
        /** @description timestamp when first frame executed */
        this.startTime = 0;
        /** @description milliseconds since doUpdate loop was run */
        this.deltaTime = 0;
        /** @description  milliseconds since last frame */
        this.elapsedTime = 0;
        /** @description timestamp of the last frame */
        this.lastFrameTime = 0;
        this.entities = entity_1.Entity.getIndex();
        this.entityUpdates = entity_1.Entity.getUpdateIndex();
        if (this.preUpdate instanceof Function) {
            this.entityUpdates.push(this.preUpdate.bind(this));
        }
        this.timestep = (1000 / this.maxFrameRate);
        this.fps = this.maxFrameRate;
        this.config();
    }
    $postLink() {
        this.context = this.stage.getContext();
        this.$q.when(this.init(this.context))
            .then(this.startMainLoop)
            .catch((err) => {
            this.logger.error(`Failed to initialize WebGL app`, err);
        });
    }
    postUpdate(dt, tt) {
        // no-op
    }
    /**
     * Update the FPS value
     * @param totalElapsedTime
     */
    updateFPS(totalElapsedTime) {
        this.framesThisSecond++;
        if (totalElapsedTime > this.lastFPSUpdate + 1000) {
            const weightFactor = 0.25;
            this.fps = (weightFactor * this.framesThisSecond) + ((1 - weightFactor) * this.fps);
            this.lastFPSUpdate = totalElapsedTime;
            this.framesThisSecond = 0;
        }
    }
    /**
     * Derived From
     * Isaac Sukin
     * http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
     */
    mainLoop() {
        const frameTime = performance.now();
        this.deltaTime += frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;
        this.elapsedTime = frameTime - this.startTime;
        let elapsedMs = this.elapsedTime | 0;
        this.updateFPS(elapsedMs);
        let updateSteps = 0;
        // const frameDeltaTime = this.deltaTime;
        const dtMs = this.timestep | 0;
        const ops = this.entityUpdates;
        const len = ops.length;
        while (this.deltaTime > this.timestep) {
            for (let i = 0; i < len; i++) {
                ops[i](dtMs, elapsedMs);
            }
            this.postUpdate(dtMs, elapsedMs);
            this.deltaTime -= this.timestep;
            elapsedMs += dtMs;
            const maxConsecSteps = 240;
            if (++updateSteps > maxConsecSteps) {
                this.logger.warn(`Update Loop Exceeded ${maxConsecSteps} Calls`);
                this.deltaTime = 0; // don't do a silly # of updates
                break;
            }
        }
        this.renderer.renderScene();
        this.animationFrame = requestAnimationFrame(this.mainLoop);
    }
    /**
     * Initialize the main app loop
     */
    startMainLoop() {
        this.logger.debug('Starting main GL application loop');
        this.lastFrameTime = this.startTime = performance.now();
        this.animationFrame = requestAnimationFrame(this.mainLoop);
        // this.appState.setState(AppState.Running);
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebGLApp.prototype, "mainLoop", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebGLApp.prototype, "startMainLoop", null);
WebGLApp = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.const.MaxFrameRate)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$q)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Library)),
    __param(3, injector_plus_1.inject(mallet_depedency_tree_1.MDT.webgl.WebGLStage)),
    __param(4, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$element)),
    __param(5, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Number, Function, Object, Object, Object, logger_1.Logger])
], WebGLApp);
exports.WebGLApp = WebGLApp;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-app.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../geometry/entity":3,"../lib/injector-plus":9,"../lib/logger":10,"../mallet.depedency-tree":15,"bind-decorator":undefined,"buffer":undefined}],25:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_1 = require("../geometry/mesh");
const webgl_resource_1 = require("./webgl-resource");
class WebGLMesh extends webgl_resource_1.WebGLResource {
    constructor(context, options) {
        super(context);
        const { gl } = context;
        this.vertexCount = options.mesh.getIndexCount();
        this.vertexSize = mesh_1.Mesh.VERT_SIZE;
        this.glVertexBuffer = gl.createBuffer();
        // gl.ARRAY_BUFFER indicates per vertex data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, options.mesh.getVertexBuffer(), gl.STATIC_DRAW);
        this.glIndexBuffer = gl.createBuffer();
        // gl.ELEMENT_ARRAY_BUFFER indicates and index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, options.mesh.getIndexBuffer(), gl.STATIC_DRAW);
        // prevent accidental modifications to this mesh
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    getIndexBuffer() {
        return this.glIndexBuffer;
    }
    getVertexBuffer() {
        return this.glVertexBuffer;
    }
    getVertexCount() {
        return this.vertexCount;
    }
    getVertexSize() {
        return this.vertexSize;
    }
    release() {
        const { gl } = this.context;
        gl.deleteBuffer(this.glVertexBuffer);
        gl.deleteBuffer(this.glIndexBuffer);
    }
}
exports.WebGLMesh = WebGLMesh;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-mesh.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../geometry/mesh":5,"./webgl-resource":27,"buffer":undefined}],26:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_mesh_1 = require("./webgl-mesh");
const mesh_1 = require("../geometry/mesh");
const bind_decorator_1 = require("bind-decorator");
class WebGLResourceFactory {
    constructor(context, library) {
        this.context = context;
        this.library = library;
        this.resourceCache = {};
    }
    init(meshNames) {
        return Promise.all(meshNames.map(this.registerMesh));
        // .then(() => this.library.addSources(WebGLMesh, [new StaticSource(this.resourceCache)]));
    }
    create(ctor, options = null) {
        const res = new ctor(this.context, options);
        res.init(this.resourceCache);
        return res;
    }
    registerMesh(name) {
        return this.library.get(mesh_1.Mesh, name)
            .then((mesh) => this.create(webgl_mesh_1.WebGLMesh, { mesh }))
            .then((glMesh) => this.resourceCache[name] = glMesh);
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebGLResourceFactory.prototype, "registerMesh", null);
exports.WebGLResourceFactory = WebGLResourceFactory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-resource-factory.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../geometry/mesh":5,"./webgl-mesh":25,"bind-decorator":undefined,"buffer":undefined}],27:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebGLResource {
    constructor(context) {
        this.context = context;
    }
    init(resourceCache) {
        // no-op
    }
}
exports.WebGLResource = WebGLResource;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-resource.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"buffer":undefined}],28:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("../lib/injector-plus");
const render_target_factory_1 = require("../render-target.factory");
const logger_1 = require("../lib/logger");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const scheduler_service_1 = require("../scheduler.service");
const render_target_component_1 = require("../render-target.component");
let WebGLStageCtrl = class WebGLStageCtrl {
    constructor(stage, scheduler, $element, logger) {
        this.stage = stage;
        this.scheduler = scheduler;
        this.$element = $element;
        this.logger = logger;
        this.type = render_target_factory_1.RenderTargetWebGL;
        this.logger.info('Build WebGL Stage');
    }
    $postLink() {
        this.loadRenderingContext();
        const result = this.stage.set(this.renderTarget);
        if (!result) {
            this.logger.warn(`Failed to WebGL stage, exiting setup method`);
            return;
        }
    }
    loadRenderingContext() {
        const RTCtrl = render_target_component_1.RenderTargetCtrl.getController(this.$element);
        this.gl = RTCtrl.getContext();
        this.renderTarget = RTCtrl.getRenderTarget();
    }
};
WebGLStageCtrl = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.webgl.WebGLStage)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Scheduler)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$element)),
    __param(3, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Object, scheduler_service_1.Scheduler, Object, logger_1.Logger])
], WebGLStageCtrl);
exports.webGLStageOptions = {
    controller: injector_plus_1.ngAnnotate(WebGLStageCtrl),
    template: '<mallet-render-target type="$ctrl.type"></mallet-render-target>',
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-stage.component.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../lib/injector-plus":9,"../lib/logger":10,"../mallet.depedency-tree":15,"../render-target.component":17,"../render-target.factory":18,"../scheduler.service":19,"buffer":undefined}],29:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const render_target_factory_1 = require("../render-target.factory");
const webgl_resource_factory_1 = require("./webgl-resource-factory");
const injector_plus_1 = require("../lib/injector-plus");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const logger_1 = require("../lib/logger");
const bind_decorator_1 = require("bind-decorator");
const shader_program_1 = require("./shader-program");
let WebGLStage = class WebGLStage {
    constructor(library, $q, logger) {
        this.library = library;
        this.$q = $q;
        this.logger = logger;
        this.context = {
            gl: null,
            program: null,
            logger,
            renderTarget: null,
            transformBuffer: null,
        };
        this.programs = {};
    }
    set(renderTarget) {
        this.logger.debug(`Setting WebGL Stage`);
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();
        this.context.renderTarget = renderTarget;
        this.context.gl = this.gl;
        try {
            const { gl } = this.context;
            gl.enable(gl.DEPTH_TEST); // could replace this with blending: http://learningwebgl.com/blog/?p=859
            // TODO: create materials
            this.glFactory = new webgl_resource_factory_1.WebGLResourceFactory(this.context, this.library);
            this.glFactory.init(['cube']);
            this.logger.debug(`WebGL Stage set`);
            return true;
        }
        catch (e) {
            this.logger.error(e.message || e);
            return false;
        }
    }
    getContext() {
        return this.context;
    }
    /**
     * Create a new shader program and add it to available stage programs
     * @param {IProgramOptions} programConfig
     * @param {boolean} setActive
     * @returns {IShaderProgram}
     */
    addProgram(programConfig, setActive = false) {
        const program = new shader_program_1.ShaderProgram(this.context, programConfig);
        this.programs[programConfig.name] = program;
        if (this.context.program === null || setActive === true) {
            this.setActiveProgram(programConfig.name);
        }
        return program;
    }
    /**
     * Set the active program
     * @param {string} name
     */
    setActiveProgram(name) {
        if (!this.programs[name]) {
            throw new ReferenceError(`Program with ${name} does not exist in this stage`);
        }
        this.context.program = this.programs[name];
        this.programs[name].use();
    }
    getFactory() {
        return this.glFactory;
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [render_target_factory_1.RenderTargetWebGL]),
    __metadata("design:returntype", Boolean)
], WebGLStage.prototype, "set", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Object)
], WebGLStage.prototype, "addProgram", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebGLStage.prototype, "setActiveProgram", null);
WebGLStage = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Library)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$q)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Object, Function, logger_1.Logger])
], WebGLStage);
exports.WebGLStage = WebGLStage;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-stage.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../lib/injector-plus":9,"../lib/logger":10,"../mallet.depedency-tree":15,"../render-target.factory":18,"./shader-program":22,"./webgl-resource-factory":26,"bind-decorator":undefined,"buffer":undefined}],30:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_provider_1 = require("../library.provider");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const injector_plus_1 = require("../lib/injector-plus");
const shader_1 = require("./shader");
const mesh_1 = require("../geometry/mesh");
const glMatrix = require("gl-matrix");
const { vec3 } = glMatrix;
// this kinda sucks but it's the only way to some reasonably have access to this data...
const embeddedShaders = {
    // language=GLSL
    vertexShader3d: `#version 100
//an attribute will receive data from a buffer
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;

uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;

varying highp vec4 vColor;
varying highp vec3 vNormal;
//starting point
void main() {
    // The vertex's position (input.position) must be converted to world space,
	// then camera space (relative to our 3D camera), then to proper homogenous 
	// screen-space coordinates.  This is taken care of by our world, view and
	// projection matrices.  
	//
	// First we multiply them together to get a single matrix which represents
	// all of those transformations (world to view to projection space)
    // calculate the worldViewProjection mat4 (does this need to be for every vertex??? just for object?
    mat4 projectionViewWorld = projection * world * view;
   
    gl_Position = projectionViewWorld * vec4(a_position, 1);
    
    vColor = vec4(a_color, 1.0);
    vNormal = vec3(world * view * vec4(a_normal, 1));
}`,
    // language=GLSL
    fragmentShader: `#version 100
// fragment shaders don't hvae default precision, so define
// as mediump, "medium precision"
precision mediump float;

varying highp vec4 vColor;
varying highp vec3 vNormal;

struct Light {
    vec4 ambientColor;
    vec4 diffuseColor;
    vec3 direction;
};

// uniform int numLights;
uniform Light light;

vec4 getLightColor(Light light, vec3 normal) {
    vec3 lightDir = normalize(-light.direction);
    float lightAmt = clamp(dot(lightDir, normal), 0.0, 1.0);
    
    return light.diffuseColor * lightAmt;   
}

void main() {
    // gl_FragColor is the outpout of the fragment
    gl_FragColor = light.ambientColor * vColor + getLightColor(light, vNormal) * vColor;
}`
};
const shaderConfig = {
    '3d-vertex-shader': {
        id: '3d-vertex-shader',
        src: embeddedShaders.vertexShader3d,
        type: shader_1.ShaderType.VERTEX_SHADER,
        spec: {
            attributes: [
                { name: 'a_position', size: 3, type: shader_1.GLDataType.FLOAT },
                { name: 'a_normal', size: 3, type: shader_1.GLDataType.FLOAT, normalize: true },
                { name: 'a_color', size: 3, type: shader_1.GLDataType.FLOAT }
            ],
            uniforms: {
                view: shader_1.GLUniformType.uniformMatrix4fv,
                projection: shader_1.GLUniformType.uniformMatrix4fv,
                world: shader_1.GLUniformType.uniformMatrix4fv,
            },
        },
    },
    'fragment-shader': {
        id: 'fragment-shader',
        src: embeddedShaders.fragmentShader,
        type: shader_1.ShaderType.FRAGMENT_SHADER,
        spec: {
            uniforms: {
                light: {
                    ambientColor: shader_1.GLUniformType.uniform4f,
                    diffuseColor: shader_1.GLUniformType.uniform4f,
                    direction: shader_1.GLUniformType.uniform3f,
                },
            },
        },
    },
};
const meshes = { cube: {
        colors: [
            vec3.fromValues(1.0, 0.0, 0.0),
            vec3.fromValues(0.0, 1.0, 0.0),
            vec3.fromValues(0.0, 0.0, 1.0),
            vec3.fromValues(1.0, 1.0, 0.0),
            vec3.fromValues(0.0, 1.0, 1.0),
            vec3.fromValues(1.0, 0.0, 1.0),
            vec3.fromValues(0.0, 0.0, 0.0),
            vec3.fromValues(1.0, 1.0, 1.0),
        ],
        indices: [
            0, 2, 1, 0, 3, 2,
            2, 3, 6, 3, 7, 6,
            1, 6, 5, 1, 2, 6,
            4, 5, 6, 4, 6, 7,
            0, 1, 5, 0, 5, 4,
            0, 7, 3, 0, 4, 7,
        ],
        positions: [
            /*   5  +---+ 6
             *    /   / |
             * 1 +---+2 + 7
             *   |   | /
             * 0 +---+ 3
             */
            vec3.fromValues(-0.5, -0.5, +0.5),
            vec3.fromValues(-0.5, +0.5, +0.5),
            vec3.fromValues(+0.5, +0.5, +0.5),
            vec3.fromValues(+0.5, -0.5, +0.5),
            vec3.fromValues(-0.5, -0.5, -0.5),
            vec3.fromValues(-0.5, +0.5, -0.5),
            vec3.fromValues(+0.5, +0.5, -0.5),
            vec3.fromValues(+0.5, -0.5, -0.5)
        ],
    } };
let WebGLLibraryConfig = class WebGLLibraryConfig {
    constructor(libraryProvider) {
        libraryProvider.addSources(shader_1.ShaderDTO, [new library_provider_1.StaticSource(shaderConfig)]);
        libraryProvider.addSources(mesh_1.Mesh, [new library_provider_1.StaticSource(meshes)]);
    }
};
WebGLLibraryConfig = __decorate([
    __param(0, injector_plus_1.inject.provider(mallet_depedency_tree_1.MDT.Library)),
    __metadata("design:paramtypes", [library_provider_1.LibraryProvider])
], WebGLLibraryConfig);
exports.WebGLLibraryConfig = WebGLLibraryConfig;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl.library.config.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../geometry/mesh":5,"../lib/injector-plus":9,"../library.provider":12,"../mallet.depedency-tree":15,"./shader":23,"buffer":undefined,"gl-matrix":undefined}],31:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mallet_module_1 = require("../mallet.module");
const angular = require("angular");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const webgl_stage_component_1 = require("./webgl-stage.component");
const webgl_stage_1 = require("./webgl-stage");
const injector_plus_1 = require("../lib/injector-plus");
const geometry_module_1 = require("../geometry/geometry.module");
const webgl_library_config_1 = require("./webgl.library.config");
exports.malletWebGL = angular.module('mallet.webgl', [
    mallet_module_1.mallet.name,
    geometry_module_1.malletGeometry.name
]).config(injector_plus_1.ngAnnotate(webgl_library_config_1.WebGLLibraryConfig));
exports.malletWebGL.service(mallet_depedency_tree_1.MDT.webgl.WebGLStage, injector_plus_1.ngAnnotate(webgl_stage_1.WebGLStage));
exports.malletWebGL.component(mallet_depedency_tree_1.MDT.component.webGLStage, webgl_stage_component_1.webGLStageOptions);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl.module.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../geometry/geometry.module":4,"../lib/injector-plus":9,"../mallet.depedency-tree":15,"../mallet.module":16,"./webgl-stage":29,"./webgl-stage.component":28,"./webgl.library.config":30,"angular":undefined,"buffer":undefined}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL0dyZWcvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL21hbGxldC9hcHAtc3RhdGUuc2VydmljZS5qcyIsInNyYy9tYWxsZXQvZ2VvbWV0cnkvY2FtZXJhLmpzIiwic3JjL21hbGxldC9nZW9tZXRyeS9lbnRpdHkuanMiLCJzcmMvbWFsbGV0L2dlb21ldHJ5L2dlb21ldHJ5Lm1vZHVsZS5qcyIsInNyYy9tYWxsZXQvZ2VvbWV0cnkvbWVzaC5qcyIsInNyYy9tYWxsZXQvZ2VvbWV0cnkvdHJhbnNmb3JtLmpzIiwic3JjL21hbGxldC9pbmRleC5qcyIsInNyYy9tYWxsZXQvbGliL2RlY29yYXRvcnMuanMiLCJzcmMvbWFsbGV0L2xpYi9pbmplY3Rvci1wbHVzLmpzIiwic3JjL21hbGxldC9saWIvbG9nZ2VyLmpzIiwic3JjL21hbGxldC9saWIvc3RhdGUtbWFjaGluZS5qcyIsInNyYy9tYWxsZXQvbGlicmFyeS5wcm92aWRlci5qcyIsInNyYy9tYWxsZXQvbG9nZ2VyLnNlcnZpY2UuanMiLCJzcmMvbWFsbGV0L21hbGxldC5jb25zdGFudHMuanMiLCJzcmMvbWFsbGV0L21hbGxldC5kZXBlZGVuY3ktdHJlZS5qcyIsInNyYy9tYWxsZXQvbWFsbGV0Lm1vZHVsZS5qcyIsInNyYy9tYWxsZXQvcmVuZGVyLXRhcmdldC5jb21wb25lbnQuanMiLCJzcmMvbWFsbGV0L3JlbmRlci10YXJnZXQuZmFjdG9yeS5qcyIsInNyYy9tYWxsZXQvc2NoZWR1bGVyLnNlcnZpY2UuanMiLCJzcmMvbWFsbGV0L3dlYmdsL2J1ZmZlci1mb3JtYXQuanMiLCJzcmMvbWFsbGV0L3dlYmdsL3JlbmRlcmVyLmpzIiwic3JjL21hbGxldC93ZWJnbC9zaGFkZXItcHJvZ3JhbS5qcyIsInNyYy9tYWxsZXQvd2ViZ2wvc2hhZGVyLmpzIiwic3JjL21hbGxldC93ZWJnbC93ZWJnbC1hcHAuanMiLCJzcmMvbWFsbGV0L3dlYmdsL3dlYmdsLW1lc2guanMiLCJzcmMvbWFsbGV0L3dlYmdsL3dlYmdsLXJlc291cmNlLWZhY3RvcnkuanMiLCJzcmMvbWFsbGV0L3dlYmdsL3dlYmdsLXJlc291cmNlLmpzIiwic3JjL21hbGxldC93ZWJnbC93ZWJnbC1zdGFnZS5jb21wb25lbnQuanMiLCJzcmMvbWFsbGV0L3dlYmdsL3dlYmdsLXN0YWdlLmpzIiwic3JjL21hbGxldC93ZWJnbC93ZWJnbC5saWJyYXJ5LmNvbmZpZy5qcyIsInNyYy9tYWxsZXQvd2ViZ2wvd2ViZ2wubW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcclxufTtcclxudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGluamVjdG9yX3BsdXNfMSA9IHJlcXVpcmUoXCIuL2xpYi9pbmplY3Rvci1wbHVzXCIpO1xyXG5jb25zdCBtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMSA9IHJlcXVpcmUoXCIuL21hbGxldC5kZXBlZGVuY3ktdHJlZVwiKTtcclxuY29uc3QgbG9nZ2VyX3NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL2xvZ2dlci5zZXJ2aWNlXCIpO1xyXG5jb25zdCBzdGF0ZV9tYWNoaW5lXzEgPSByZXF1aXJlKFwiLi9saWIvc3RhdGUtbWFjaGluZVwiKTtcclxubGV0IEFwcFN0YXRlID0gY2xhc3MgQXBwU3RhdGUgZXh0ZW5kcyBzdGF0ZV9tYWNoaW5lXzEuU3RhdGVNYWNoaW5lIHtcclxuICAgIGNvbnN0cnVjdG9yKCRsb2NhdGlvbiwgbG9nZ2VyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLiRsb2NhdGlvbiA9ICRsb2NhdGlvbjtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcclxuICAgICAgICB0aGlzLmNsZWFyU3RhdGUoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBleGNsdXNpdml0eSBydWxlcyBmb3IgYXBwIHN0YXRlcyB0byBiYXNpYyBzdGF0ZS1tYWNoaW5lIGZ1bmN0aW9uYWxpdHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdTdGF0ZVxyXG4gICAgICovXHJcbiAgICBhZGRTdGF0ZShuZXdTdGF0ZSkge1xyXG4gICAgICAgIHN3aXRjaCAobmV3U3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBBcHBTdGF0ZS5TdXNwZW5kZWQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN0YXRlKEFwcFN0YXRlLlJ1bm5pbmcgfCBBcHBTdGF0ZS5Mb2FkaW5nKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEFwcFN0YXRlLlJ1bm5pbmc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN0YXRlKEFwcFN0YXRlLlN1c3BlbmRlZCB8IEFwcFN0YXRlLkxvYWRpbmcpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIuYWRkU3RhdGUobmV3U3RhdGUpO1xyXG4gICAgfVxyXG4gICAgY2xlYXJTdGF0ZSgpIHtcclxuICAgICAgICBjb25zdCBkZWJ1ZyA9IHRoaXMuJGxvY2F0aW9uLnNlYXJjaCgpLmRlYnVnID09PSAnMScgPyBBcHBTdGF0ZS5EZWJ1ZyA6IDA7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShBcHBTdGF0ZS5Mb2FkaW5nIHwgZGVidWcpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlU3RhdGVMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxufTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBzdGF0ZV9tYWNoaW5lXzEuc3RhdGUsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxyXG5dLCBBcHBTdGF0ZSwgXCJSdW5uaW5nXCIsIHZvaWQgMCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgQXBwU3RhdGUsIFwiTG9hZGluZ1wiLCB2b2lkIDApO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHN0YXRlX21hY2hpbmVfMS5zdGF0ZSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXHJcbl0sIEFwcFN0YXRlLCBcIkRlYnVnXCIsIHZvaWQgMCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgQXBwU3RhdGUsIFwiU3VzcGVuZGVkXCIsIHZvaWQgMCk7XHJcbkFwcFN0YXRlID0gX19kZWNvcmF0ZShbXHJcbiAgICBfX3BhcmFtKDAsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULm5nLiRsb2NhdGlvbikpLFxyXG4gICAgX19wYXJhbSgxLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5Mb2dnZXIpKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0LCBsb2dnZXJfc2VydmljZV8xLkxvZ2dlcl0pXHJcbl0sIEFwcFN0YXRlKTtcclxuZXhwb3J0cy5BcHBTdGF0ZSA9IEFwcFN0YXRlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtc3RhdGUuc2VydmljZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZ2xfbWF0cml4XzEgPSByZXF1aXJlKFwiZ2wtbWF0cml4XCIpO1xyXG5jb25zdCB0cmFuc2Zvcm1fMSA9IHJlcXVpcmUoXCIuL3RyYW5zZm9ybVwiKTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY2xhc3MgQ2FtZXJhIHtcclxuICAgIGNvbnN0cnVjdG9yKGFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBuZXcgdHJhbnNmb3JtXzEuVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uTWF0cml4ID0gZ2xfbWF0cml4XzEubWF0NC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLnZpZXdNYXRyaXggPSBnbF9tYXRyaXhfMS5tYXQ0LmNyZWF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZm9yd2FyZCA9IGdsX21hdHJpeF8xLnZlYzMuZnJvbVZhbHVlcygwLCAwLCAtMSk7XHJcbiAgICAgICAgdGhpcy5zdGFsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGlzcCA9IGdsX21hdHJpeF8xLnZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgdGhpcy51cCA9IGdsX21hdHJpeF8xLnZlYzMuZnJvbVZhbHVlcygwLCAxLCAwKTtcclxuICAgICAgICB0aGlzLnNldEFzcGVjdFJhdGlvKGFzcGVjdFJhdGlvKTtcclxuICAgIH1cclxuICAgIGdldEZvcndhcmQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhbGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgZ2xfbWF0cml4XzEudmVjMy50cmFuc2Zvcm1RdWF0KHRoaXMuZm9yd2FyZCwgdGhpcy5mb3J3YXJkLCB0aGlzLnRyYW5zZm9ybS5nZXRSb3RhdGlvbigpKTtcclxuICAgICAgICAgICAgdGhpcy5zdGFsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5mb3J3YXJkO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGR0LCB0dCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld01hdHJpeCgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmlld01hdHJpeCgpIHtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGdsX21hdHJpeF8xLnZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEudmVjMy5hZGQocG9zaXRpb24sIHRoaXMudHJhbnNmb3JtLmdldFBvc2l0aW9uKCksIHRoaXMuZ2V0Rm9yd2FyZCgpKTtcclxuICAgICAgICBnbF9tYXRyaXhfMS5tYXQ0Lmxvb2tBdCh0aGlzLnZpZXdNYXRyaXgsIHRoaXMudHJhbnNmb3JtLmdldFBvc2l0aW9uKCksIHBvc2l0aW9uLCB0aGlzLnVwKTtcclxuICAgIH1cclxuICAgIHNldEFzcGVjdFJhdGlvKGFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgdGhpcy5hc3BlY3RSYXRpbyA9IGFzcGVjdFJhdGlvO1xyXG4gICAgICAgIC8vIGNyZWF0ZS91cGRhdGUgdGhlIHByb2plY3Rpb24gbWF0cml4XHJcbiAgICAgICAgZ2xfbWF0cml4XzEubWF0NC5wZXJzcGVjdGl2ZSh0aGlzLnByb2plY3Rpb25NYXRyaXgsIE1hdGguUEkgLyAyLCAvLyB2ZXJ0aWNhbCBmaWVsZCBvZiB2aWV3IChyYWRpYW5zKVxyXG4gICAgICAgIHRoaXMuYXNwZWN0UmF0aW8sIC8vIGFzcGVjdCByYXRpbywgZnJhY3Rpb25cclxuICAgICAgICAwLjEsIC8vIG5lYXIgY2xpcHBpbmcgZGlzdGFuY2VcclxuICAgICAgICAxMDApOyAvLyBmYXIgY2xpcHBpbmcgZGlzdGFuY2VcclxuICAgIH1cclxuICAgIGFkdmFuY2UoZGlzdGFuY2UpIHtcclxuICAgICAgICB0aGlzLnN0YWxlID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGdsX21hdHJpeF8xLnZlYzMuY2xvbmUodGhpcy50cmFuc2Zvcm0uZ2V0UG9zaXRpb24oKSk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEudmVjMy5zY2FsZSh0aGlzLmRpc3AsIHRoaXMuZ2V0Rm9yd2FyZCgpLCBkaXN0YW5jZSk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEudmVjMy5hZGQocG9zaXRpb24sIHBvc2l0aW9uLCB0aGlzLmRpc3ApO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtLnNldFBvc2l0aW9uLmFwcGx5KHRoaXMudHJhbnNmb3JtLCBwb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgICBzdHJhZmUoZGlzdGFuY2UpIHtcclxuICAgICAgICB0aGlzLnN0YWxlID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGdsX21hdHJpeF8xLnZlYzMuY2xvbmUodGhpcy50cmFuc2Zvcm0uZ2V0UG9zaXRpb24oKSk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEudmVjMy5jcm9zcyh0aGlzLmRpc3AsIHRoaXMuZ2V0Rm9yd2FyZCgpLCBbMCwgMSwgMF0pO1xyXG4gICAgICAgIGdsX21hdHJpeF8xLnZlYzMuc2NhbGUodGhpcy5kaXNwLCB0aGlzLmRpc3AsIGRpc3RhbmNlKTtcclxuICAgICAgICBnbF9tYXRyaXhfMS52ZWMzLmFkZChwb3NpdGlvbiwgcG9zaXRpb24sIHRoaXMuZGlzcCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0uc2V0UG9zaXRpb24uYXBwbHkodGhpcy50cmFuc2Zvcm0sIHBvc2l0aW9uKTtcclxuICAgIH1cclxuICAgIGFzY2VuZChkaXN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMuc3RhbGUgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2xfbWF0cml4XzEudmVjMy5jbG9uZSh0aGlzLnRyYW5zZm9ybS5nZXRQb3NpdGlvbigpKTtcclxuICAgICAgICBnbF9tYXRyaXhfMS52ZWMzLnNjYWxlKHRoaXMuZGlzcCwgdGhpcy51cCwgZGlzdGFuY2UpO1xyXG4gICAgICAgIGdsX21hdHJpeF8xLnZlYzMuYWRkKHBvc2l0aW9uLCBwb3NpdGlvbiwgdGhpcy5kaXNwKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS5zZXRQb3NpdGlvbi5hcHBseSh0aGlzLnRyYW5zZm9ybSwgcG9zaXRpb24pO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS5yb3RhdGVCeSh4LCB5LCAwKTtcclxuICAgIH1cclxuICAgIGdldFRyYW5zZm9ybSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm07XHJcbiAgICB9XHJcbiAgICBnZXRWaWV3TWF0cml4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdNYXRyaXg7XHJcbiAgICB9XHJcbiAgICBnZXRQcm9qZWN0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Rpb25NYXRyaXg7XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtOdW1iZXIsIE51bWJlcl0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgQ2FtZXJhLnByb3RvdHlwZSwgXCJ1cGRhdGVcIiwgbnVsbCk7XHJcbmV4cG9ydHMuQ2FtZXJhID0gQ2FtZXJhO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jYW1lcmEuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgdHJhbnNmb3JtXzEgPSByZXF1aXJlKFwiLi90cmFuc2Zvcm1cIik7XHJcbmNvbnN0IHdlYmdsX3Jlc291cmNlXzEgPSByZXF1aXJlKFwiLi4vd2ViZ2wvd2ViZ2wtcmVzb3VyY2VcIik7XHJcbmNsYXNzIEVudGl0eSBleHRlbmRzIHdlYmdsX3Jlc291cmNlXzEuV2ViR0xSZXNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBtZXNoTmFtZSkge1xyXG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMubWVzaE5hbWUgPSBtZXNoTmFtZTtcclxuICAgICAgICAvLyByZWdpc3RlciBlbnRpdHkgaW4gdGhlIGluZGV4XHJcbiAgICAgICAgdGhpcy5pZCA9IEVudGl0eS5jdXJJZCsrO1xyXG4gICAgICAgIEVudGl0eS5pbmRleFt0aGlzLmlkXSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMudXBkYXRlICE9PSBFbnRpdHkucHJvdG90eXBlLnVwZGF0ZSkge1xyXG4gICAgICAgICAgICBjb250ZXh0LmxvZ2dlci5kZWJ1ZyhgQWRkIGVudGl0eSB1cGRhdGUgbWV0aG9kIGZvciBlbnRpdHkgd2l0aCBtZXNoICR7bWVzaE5hbWV9YCk7XHJcbiAgICAgICAgICAgIEVudGl0eS51cGRhdGVNZXRob2RzLnB1c2godGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWVzaCA9IG51bGw7XHJcbiAgICAgICAgLy8gdGhpcy50cmFuc2Zvcm0gPSBuZXcgRmFzdFRyYW5zZm9ybSh0aGlzLmNvbnRleHQudHJhbnNmb3JtQnVmZmVyKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IG5ldyB0cmFuc2Zvcm1fMS5UcmFuc2Zvcm0oKTtcclxuICAgICAgICB0aGlzLmdldFBvc2l0aW9uID0gdGhpcy50cmFuc2Zvcm0uZ2V0UG9zaXRpb24uYmluZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5nZXRSb3RhdGlvbiA9IHRoaXMudHJhbnNmb3JtLmdldFJvdGF0aW9uLmJpbmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMucm90YXRlID0gdGhpcy50cmFuc2Zvcm0udlJvdGF0ZUJ5LmJpbmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlID0gdGhpcy50cmFuc2Zvcm0udlRyYW5zbGF0ZS5iaW5kKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLnJvdGF0ZVRvID0gdGhpcy50cmFuc2Zvcm0udlNldFJvdGF0aW9uLmJpbmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldEluZGV4KCkge1xyXG4gICAgICAgIHJldHVybiBFbnRpdHkuaW5kZXg7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0VXBkYXRlSW5kZXgoKSB7XHJcbiAgICAgICAgcmV0dXJuIEVudGl0eS51cGRhdGVNZXRob2RzO1xyXG4gICAgfVxyXG4gICAgaW5pdChyZXNvdXJjZXMpIHtcclxuICAgICAgICB0aGlzLm1lc2ggPSByZXNvdXJjZXNbdGhpcy5tZXNoTmFtZV07XHJcbiAgICB9XHJcbiAgICBzY2FsZShzY2FsYXIpIHtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS5zY2FsZUJ5KHNjYWxhciwgc2NhbGFyLCBzY2FsYXIpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGR0LCB0dCkge1xyXG4gICAgICAgIC8vIHZvaWRcclxuICAgIH1cclxuICAgIGdldFRyYW5zZm9ybSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm07XHJcbiAgICB9XHJcbiAgICBnZXRNZXNoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1lc2g7XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZGVzdHJveWluZyBlbnRpdGllcyBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgaW1wbGVtZW50YXRpb24nKTtcclxuICAgIH1cclxuICAgIHJlbGVhc2UoKSB7XHJcbiAgICAgICAgLy8gbm8tb3BcclxuICAgIH1cclxufVxyXG5FbnRpdHkuY3VySWQgPSAwO1xyXG5FbnRpdHkuaW5kZXggPSBbXTtcclxuRW50aXR5LnVwZGF0ZU1ldGhvZHMgPSBbXTtcclxuZXhwb3J0cy5FbnRpdHkgPSBFbnRpdHk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudGl0eS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBhbmd1bGFyID0gcmVxdWlyZShcImFuZ3VsYXJcIik7XHJcbmV4cG9ydHMubWFsbGV0R2VvbWV0cnkgPSBhbmd1bGFyLm1vZHVsZSgnbWFsbGV0Lmdlb21ldHJ5JywgW10pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZW9tZXRyeS5tb2R1bGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZ2xNYXRyaXggPSByZXF1aXJlKFwiZ2wtbWF0cml4XCIpO1xyXG5jb25zdCB7IHZlYzMgfSA9IGdsTWF0cml4O1xyXG5jbGFzcyBNZXNoIHtcclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lcyBhIHNldCBvZiBwb2ludHMgaW4gc3BhY2UgYW5kIGhvdyB0aGV5IGZvcm0gYSAzRCBvYmplY3RcclxuICAgICAqIEBwYXJhbSB7SU1lc2hPcHRpb25zfSBwYXJhbXNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBwYXJhbXMucG9zaXRpb25zO1xyXG4gICAgICAgIHRoaXMuaW5kaWNlcyA9IHBhcmFtcy5pbmRpY2VzO1xyXG4gICAgICAgIHRoaXMudmVydGV4Q291bnQgPSAocGFyYW1zLnBvc2l0aW9ucy5sZW5ndGggLyAzKSB8IDA7XHJcbiAgICAgICAgdGhpcy5pbmRleENvdW50ID0gcGFyYW1zLmluZGljZXMubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IE1lc2guZ2V0U2l6ZShwYXJhbXMucG9zaXRpb25zKTtcclxuICAgICAgICBjb25zdCBmYWNlTm9ybWFscyA9IE1lc2guY2FsY3VsYXRlRmFjZU5vcm1hbHModGhpcy5wb3NpdGlvbnMsIHRoaXMuaW5kaWNlcykgfHwgW107XHJcbiAgICAgICAgY29uc3QgdmVydGV4Tm9ybWFscyA9IE1lc2guY2FsY3VsYXRlVmVydGV4Tm9ybWFscyh0aGlzLnBvc2l0aW9ucywgdGhpcy5pbmRpY2VzLCBmYWNlTm9ybWFscyk7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXIgPSBPYmplY3QuZnJlZXplKE1lc2guYnVpbGRWZXJ0ZXhCdWZmZXIodGhpcy5wb3NpdGlvbnMsIHZlcnRleE5vcm1hbHMsIHBhcmFtcy5jb2xvcnMpKTtcclxuICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gT2JqZWN0LmZyZWV6ZSgobmV3IFVpbnQxNkFycmF5KHRoaXMuaW5kaWNlcykpLmJ1ZmZlcik7XHJcbiAgICAgICAgT2JqZWN0LnNlYWwodGhpcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgbWVzaCBidWZmZXJcclxuICAgICAqIEBwYXJhbSB2ZXJ0c1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0U2l6ZSh2ZXJ0cykge1xyXG4gICAgICAgIGlmICh2ZXJ0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1pbiA9IHZlYzMuY2xvbmUodmVydHNbMF0pO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IHZlYzMuY2xvbmUodmVydHNbMF0pO1xyXG4gICAgICAgIHZlcnRzLmZvckVhY2goKHYpID0+IHtcclxuICAgICAgICAgICAgaWYgKHZbMF0gPCBtaW5bMF0pIHtcclxuICAgICAgICAgICAgICAgIG1pblswXSA9IHZbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodlswXSA+IG1heFswXSkge1xyXG4gICAgICAgICAgICAgICAgbWF4WzBdID0gdlswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodlsxXSA8IG1pblsxXSkge1xyXG4gICAgICAgICAgICAgICAgbWluWzFdID0gdlsxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh2WzFdID4gbWF4WzFdKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhbMV0gPSB2WzFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2WzJdIDwgbWluWzJdKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5bMl0gPSB2WzJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHZbMl0gPiBtYXhbMl0pIHtcclxuICAgICAgICAgICAgICAgIG1heFsyXSA9IHZbMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBzaXplID0gdmVjMy5jcmVhdGUoKTtcclxuICAgICAgICB2ZWMzLnN1YnRyYWN0KHNpemUsIG1pbiwgbWF4KTtcclxuICAgICAgICByZXR1cm4gc2l6ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgbm9ybWFscyBmb3IgZWFjaCBmYWNlXHJcbiAgICAgKiBAcGFyYW0ge2dsTWF0cml4LnZlYzNbXX0gdmVydHNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IGluZGljZXNcclxuICAgICAqIEByZXR1cm5zIHtnbE1hdHJpeC52ZWMzW119XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjYWxjdWxhdGVGYWNlTm9ybWFscyh2ZXJ0cywgaW5kaWNlcykge1xyXG4gICAgICAgIGNvbnN0IGZhY2VTaXplID0gMztcclxuICAgICAgICBpZiAoaW5kaWNlcy5sZW5ndGggJSBmYWNlU2l6ZSAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYWIgPSB2ZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGFjID0gdmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBjb25zdCBmYWNlTm9ybWFscyA9IG5ldyBBcnJheShNYXRoLmZsb29yKGluZGljZXMubGVuZ3RoIC8gZmFjZVNpemUpKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXMubGVuZ3RoOyBpICs9IGZhY2VTaXplKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSB2ZXJ0c1tpbmRpY2VzW2ldXTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IHZlcnRzW2luZGljZXNbaSArIDFdXTtcclxuICAgICAgICAgICAgY29uc3QgYyA9IHZlcnRzW2luZGljZXNbaSArIDJdXTtcclxuICAgICAgICAgICAgdmVjMy5zdWJ0cmFjdChhYiwgYiwgYSk7XHJcbiAgICAgICAgICAgIHZlYzMuc3VidHJhY3QoYWMsIGMsIGEpO1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWwgPSB2ZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2ZWMzLmNyb3NzKG5vcm1hbCwgYWIsIGFjKTtcclxuICAgICAgICAgICAgdmVjMy5ub3JtYWxpemUobm9ybWFsLCBub3JtYWwpO1xyXG4gICAgICAgICAgICBjb25zdCBmYWNlSW5kZXggPSBpIC8gZmFjZVNpemU7XHJcbiAgICAgICAgICAgIGZhY2VOb3JtYWxzW2ZhY2VJbmRleF0gPSBub3JtYWw7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBGYWNlICR7ZmFjZUluZGV4fTogJHthbmdsZX0gJHtub3JtYWx9ICR7dW5pdE5vcm1hbH1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhY2VOb3JtYWxzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdmVydGV4IG5vcm1hbHMgYnkgYXZlcmFnaW5nIHRoZSBmYWNlIG5vcm1hbHMgZm9yIGVhY2ggdmVydGV4XHJcbiAgICAgKiBAcGFyYW0ge2dsTWF0cml4LnZlYzNbXX0gdmVydHNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IGluZGljZXNcclxuICAgICAqIEBwYXJhbSB7Z2xNYXRyaXgudmVjM1tdfSBmYWNlTm9ybWFsc1xyXG4gICAgICogQHJldHVybnMge2dsTWF0cml4LnZlYzNbXX1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNhbGN1bGF0ZVZlcnRleE5vcm1hbHModmVydHMsIGluZGljZXMsIGZhY2VOb3JtYWxzKSB7XHJcbiAgICAgICAgY29uc3QgdmVydGV4Tm9ybWFscyA9IHZlcnRzLm1hcCgoKSA9PiB2ZWMzLmNyZWF0ZSgpKTtcclxuICAgICAgICBjb25zdCBmYWNlU2l6ZSA9IDM7XHJcbiAgICAgICAgbGV0IGY7IC8vIGluZGV4IG9mIHRoZSBjdXJyZW50IGZhY2U7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGYgPSAoaSAvIGZhY2VTaXplKSB8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHZuID0gdmVydGV4Tm9ybWFsc1tpbmRpY2VzW2ldXTtcclxuICAgICAgICAgICAgdmVjMy5hZGQodm4sIHZuLCBmYWNlTm9ybWFsc1tmXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZlcnRleE5vcm1hbHMuZm9yRWFjaCgobm9ybWFsKSA9PiB2ZWMzLm5vcm1hbGl6ZShub3JtYWwsIG5vcm1hbCkpO1xyXG4gICAgICAgIHJldHVybiB2ZXJ0ZXhOb3JtYWxzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSB2ZXJ0ZXggYnVmZmVyIGZyb20gdGhlIHBvc2l0aW9ucyBhbmQgbm9ybWFscyBhcnJheXNcclxuICAgICAqIEBwYXJhbSB7Z2xNYXRyaXgudmVjM1tdfSBwb3NpdGlvbnNcclxuICAgICAqIEBwYXJhbSB7Z2xNYXRyaXgudmVjM1tdfSBub3JtYWxzXHJcbiAgICAgKiBAcGFyYW0ge2dsTWF0cml4LnZlYzNbXX0gY29sb3JzXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBidWlsZFZlcnRleEJ1ZmZlcihwb3NpdGlvbnMsIG5vcm1hbHMsIGNvbG9ycykge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zLmxlbmd0aCAqIE1lc2guVkVSVF9TSVpFKTtcclxuICAgICAgICBwb3NpdGlvbnMuZm9yRWFjaCgodmVydCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0SW5kZXggPSBpICogTWVzaC5WRVJUX1NJWkU7XHJcbiAgICAgICAgICAgIGJ1ZmZlclt2ZXJ0SW5kZXhdID0gdmVydFswXTtcclxuICAgICAgICAgICAgYnVmZmVyW3ZlcnRJbmRleCArIDFdID0gdmVydFsxXTtcclxuICAgICAgICAgICAgYnVmZmVyW3ZlcnRJbmRleCArIDJdID0gdmVydFsyXTtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gbm9ybWFsc1tpXTtcclxuICAgICAgICAgICAgYnVmZmVyW3ZlcnRJbmRleCArIDNdID0gbm9ybWFsWzBdO1xyXG4gICAgICAgICAgICBidWZmZXJbdmVydEluZGV4ICsgNF0gPSBub3JtYWxbMV07XHJcbiAgICAgICAgICAgIGJ1ZmZlclt2ZXJ0SW5kZXggKyA1XSA9IG5vcm1hbFsyXTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBjb2xvcnNbaV07XHJcbiAgICAgICAgICAgIGJ1ZmZlclt2ZXJ0SW5kZXggKyA2XSA9IGNvbG9yWzBdO1xyXG4gICAgICAgICAgICBidWZmZXJbdmVydEluZGV4ICsgN10gPSBjb2xvclsxXTtcclxuICAgICAgICAgICAgYnVmZmVyW3ZlcnRJbmRleCArIDhdID0gY29sb3JbMl07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYnVmZmVyKTtcclxuICAgICAgICByZXR1cm4gYnVmZmVyLmJ1ZmZlcjtcclxuICAgIH1cclxuICAgIGdldFZlcnRleENvdW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZlcnRleENvdW50O1xyXG4gICAgfVxyXG4gICAgZ2V0SW5kZXhDb3VudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleENvdW50O1xyXG4gICAgfVxyXG4gICAgZ2V0VmVydGV4QnVmZmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZlcnRleEJ1ZmZlcjtcclxuICAgIH1cclxuICAgIGdldEluZGV4QnVmZmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4QnVmZmVyO1xyXG4gICAgfVxyXG59XHJcbk1lc2guVkVSVF9TSVpFID0gOTtcclxuZXhwb3J0cy5NZXNoID0gTWVzaDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVzaC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBnbE1hdHJpeCA9IHJlcXVpcmUoXCJnbC1tYXRyaXhcIik7XHJcbmNvbnN0IHsgdmVjMywgbWF0NCwgcXVhdCB9ID0gZ2xNYXRyaXg7XHJcbmNsYXNzIFRyYW5zZm9ybSB7XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhbmQgbWFuaXB1bGF0ZXMgX3Bvc2l0aW9uLCBzY2FsZSwgYW5kIHJvdGF0aW9uIGRhdGEgZm9yIGFuIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHtUcmFuc2Zvcm19IFtwYXJlbnQ9bnVsbF1cclxuICAgICAqXHJcbiAgICAgKiBAcHJvcGVydHkge1ZlY3RvcjN9IHBvc2l0aW9uXHJcbiAgICAgKiBAcHJvcGVydHkge1ZlY3RvcjN9IHNjYWxlXHJcbiAgICAgKiBAcHJvcGVydHkge1ZlY3RvcjN9IHJvdGF0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB2ZWMzLmZyb21WYWx1ZXMoMCwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IHZlYzMuZnJvbVZhbHVlcygxLCAxLCAxKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gcXVhdC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdDQuY3JlYXRlKCk7XHJcbiAgICAgICAgbWF0NC5pZGVudGl0eSh0aGlzLm1hdHJpeCk7XHJcbiAgICAgICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgT2JqZWN0LnNlYWwodGhpcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcGFyZW50IHRyYW5zZm9ybVxyXG4gICAgICogQHJldHVybnMge0lUcmFuc2Zvcm19XHJcbiAgICAgKi9cclxuICAgIGdldFBhcmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbGF0ZSB0aGUgdHJhbnNmb3JtIHVzaW5nIHRoZSB2ZWxvY2l0eSBzY2FsZWQgYnkgZGVsdGFUaW1lXHJcbiAgICAgKiBAcGFyYW0gdmVsb2NpdHlcclxuICAgICAqIEBwYXJhbSBkZWx0YVRpbWVcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XHJcbiAgICAgKi9cclxuICAgIHZUaW1lVHJhbnNsYXRlKHZlbG9jaXR5LCBkZWx0YVRpbWUpIHtcclxuICAgICAgICBjb25zdCBQeCA9IHRoaXMucG9zaXRpb25bMF0gKyB2ZWxvY2l0eVswXSAqIGRlbHRhVGltZTtcclxuICAgICAgICBjb25zdCBQeSA9IHRoaXMucG9zaXRpb25bMV0gKyB2ZWxvY2l0eVsxXSAqIGRlbHRhVGltZTtcclxuICAgICAgICBjb25zdCBQeiA9IHRoaXMucG9zaXRpb25bMl0gKyB2ZWxvY2l0eVsyXSAqIGRlbHRhVGltZTtcclxuICAgICAgICB2ZWMzLnNldCh0aGlzLnBvc2l0aW9uLCBQeCwgUHksIFB6KTtcclxuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0UG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XHJcbiAgICB9XHJcbiAgICBzZXRQb3NpdGlvbih4LCB5LCB6KSB7XHJcbiAgICAgICAgdmVjMy5zZXQodGhpcy5wb3NpdGlvbiwgeCwgeSwgeik7XHJcbiAgICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogbW92ZSB0aGUgdHJhbnNmb3JtIGJ5IHRoZSBnaXZlbiBhbW91bnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ldXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3pdXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfVxyXG4gICAgICovXHJcbiAgICB0cmFuc2xhdGUoeCwgeSwgeikge1xyXG4gICAgICAgIGNvbnN0IFB4ID0gdGhpcy5wb3NpdGlvblswXSArIHg7XHJcbiAgICAgICAgY29uc3QgUHkgPSB0aGlzLnBvc2l0aW9uWzFdICsgeTtcclxuICAgICAgICBjb25zdCBQeiA9IHRoaXMucG9zaXRpb25bMl0gKyB6O1xyXG4gICAgICAgIHZlYzMuc2V0KHRoaXMucG9zaXRpb24sIFB4LCBQeSwgUHopO1xyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbGF0ZSBieSBhIHZlY3RvclxyXG4gICAgICogQHBhcmFtIHtnbE1hdHJpeC52ZWMzfSBkZWx0YVxyXG4gICAgICovXHJcbiAgICB2VHJhbnNsYXRlKGRlbHRhKSB7XHJcbiAgICAgICAgdmVjMy5hZGQodGhpcy5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvbiwgZGVsdGEpO1xyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBnZXRTY2FsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZTtcclxuICAgIH1cclxuICAgIHNldFNjYWxlKHgsIHksIHopIHtcclxuICAgICAgICB2ZWMzLnNldCh0aGlzLnNjYWxlLCB4LCB5LCB6KTtcclxuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBzY2FsZSB0aGUgdHJhbnNmb3JtIGJ5IHRoZSBnaXZlbiBhbW91bnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfFZlY3RvcjN9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeV1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbel1cclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XHJcbiAgICAgKi9cclxuICAgIHNjYWxlQnkoeCwgeSwgeikge1xyXG4gICAgICAgIGNvbnN0IFN4ID0gdGhpcy5zY2FsZVswXSAqIHg7XHJcbiAgICAgICAgY29uc3QgU3kgPSB0aGlzLnNjYWxlWzFdICogeTtcclxuICAgICAgICBjb25zdCBTeiA9IHRoaXMuc2NhbGVbMl0gKiB6O1xyXG4gICAgICAgIHZlYzMuc2V0KHRoaXMuc2NhbGUsIFN4LCBTeSwgU3opO1xyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNjYWxlIGJ5IHZlY3RvclxyXG4gICAgICogQHBhcmFtIHtnbE1hdHJpeC52ZWMzfSBzY2FsZVxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX1cclxuICAgICAqL1xyXG4gICAgdlNjYWxlQnkoc2NhbGUpIHtcclxuICAgICAgICB2ZWMzLm11bHRpcGx5KHRoaXMuc2NhbGUsIHRoaXMuc2NhbGUsIHNjYWxlKTtcclxuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0Um90YXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRpb247XHJcbiAgICB9XHJcbiAgICBzZXRSb3RhdGlvbih5YXcsIHBpdGNoLCByb2xsKSB7XHJcbiAgICAgICAgcXVhdC5mcm9tRXVsZXIodGhpcy5yb3RhdGlvbiwgeWF3LCBwaXRjaCwgcm9sbCk7XHJcbiAgICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHZTZXRSb3RhdGlvbihvcmllbnRhdGlvbikge1xyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbi5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAgcXVhdC5mcm9tRXVsZXIodGhpcy5yb3RhdGlvbiwgb3JpZW50YXRpb25bMF0sIG9yaWVudGF0aW9uWzFdLCBvcmllbnRhdGlvblsyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBxdWF0LnNldCh0aGlzLnJvdGF0aW9uLCBvcmllbnRhdGlvblswXSwgb3JpZW50YXRpb25bMV0sIG9yaWVudGF0aW9uWzJdLCBvcmllbnRhdGlvblszXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJvdGF0ZSB0aGUgdHJhbnNmb3JtIGJ5IHRoZSBnaXZlbiBhbW91bnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfFZlY3RvcjN9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeV1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbel1cclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XHJcbiAgICAgKi9cclxuICAgIHJvdGF0ZUJ5KHgsIHksIHopIHtcclxuICAgICAgICBxdWF0LnJvdGF0ZVgodGhpcy5yb3RhdGlvbiwgdGhpcy5yb3RhdGlvbiwgeCk7XHJcbiAgICAgICAgcXVhdC5yb3RhdGVZKHRoaXMucm90YXRpb24sIHRoaXMucm90YXRpb24sIHkpO1xyXG4gICAgICAgIHF1YXQucm90YXRlWih0aGlzLnJvdGF0aW9uLCB0aGlzLnJvdGF0aW9uLCB6KTtcclxuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgdlJvdGF0ZUJ5KGRlbHRhKSB7XHJcbiAgICAgICAgcXVhdC5yb3RhdGVYKHRoaXMucm90YXRpb24sIHRoaXMucm90YXRpb24sIGRlbHRhWzBdKTtcclxuICAgICAgICBxdWF0LnJvdGF0ZVkodGhpcy5yb3RhdGlvbiwgdGhpcy5yb3RhdGlvbiwgZGVsdGFbMV0pO1xyXG4gICAgICAgIHF1YXQucm90YXRlWih0aGlzLnJvdGF0aW9uLCB0aGlzLnJvdGF0aW9uLCBkZWx0YVsyXSk7XHJcbiAgICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB0cmFuc2Zvcm0gbWF0cml4LCByZS1jYWxjdWxhdGluZyB2YWx1ZXMgaWYgdHJhbnNmb3JtIGlzIGRpcnR5XHJcbiAgICAgKiBAcmV0dXJucyB7Z2xNYXRyaXgubWF0NH1cclxuICAgICAqL1xyXG4gICAgZ2V0TWF0cml4KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGlydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG1hdDQuZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZU9yaWdpbih0aGlzLm1hdHJpeCwgdGhpcy5yb3RhdGlvbiwgdGhpcy5wb3NpdGlvbiwgdGhpcy5zY2FsZSwgdGhpcy5vcmlnaW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tYXRyaXg7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UcmFuc2Zvcm0gPSBUcmFuc2Zvcm07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyYW5zZm9ybS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuZnVuY3Rpb24gX19leHBvcnQobSkge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8gY29yZSBtYWxsZXRcclxuX19leHBvcnQocmVxdWlyZShcIi4vbWFsbGV0LmRlcGVkZW5jeS10cmVlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vbGliL2xvZ2dlclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2xpYi9pbmplY3Rvci1wbHVzXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vcmVuZGVyLXRhcmdldC5mYWN0b3J5XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vcmVuZGVyLXRhcmdldC5jb21wb25lbnRcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zY2hlZHVsZXIuc2VydmljZVwiKSk7XHJcbi8vIGdlb21ldHJ5XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2dlb21ldHJ5L2VudGl0eVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2dlb21ldHJ5L3RyYW5zZm9ybVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2dlb21ldHJ5L21lc2hcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9nZW9tZXRyeS9jYW1lcmFcIikpO1xyXG4vLyBjYW52YXMgMmRcclxuLy8gd2ViZ2xcclxuX19leHBvcnQocmVxdWlyZShcIi4vd2ViZ2wvd2ViZ2wubW9kdWxlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vd2ViZ2wvd2ViZ2wtc3RhZ2VcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi93ZWJnbC9yZW5kZXJlclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3dlYmdsL3dlYmdsLWFwcFwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3dlYmdsL3dlYmdsLW1lc2hcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi93ZWJnbC9zaGFkZXJcIikpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIENyZWF0ZWQgYnkgR3JlZyBvbiAzLzI0LzIwMTcuXHJcbiAqL1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBAZW51bWVyYWJsZSBkZWNvcmF0b3IgdGhhdCBzZXRzIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG9mIGEgY2xhc3MgZmllbGQgdG8gZmFsc2UuXHJcbiAqIEBwYXJhbSB2YWx1ZSB0cnVlfGZhbHNlXHJcbiAqL1xyXG5mdW5jdGlvbiBlbnVtZXJhYmxlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KSB8fCB7fTtcclxuICAgICAgICBpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZW51bWVyYWJsZSA9IGVudW1lcmFibGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlY29yYXRvcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcInJlZmxlY3QtbWV0YWRhdGFcIik7XHJcbmNvbnN0IGxvZ2dlcl8xID0gcmVxdWlyZShcIi4vbG9nZ2VyXCIpO1xyXG5jb25zdCBsb2dnZXIgPSBuZXcgbG9nZ2VyXzEuTG9nZ2VyKCk7XHJcbmxvZ2dlci5jb25maWcoeyBsZXZlbDogbG9nZ2VyXzEuTGV2ZWwuVmVyYm9zZSB9KTtcclxuY29uc3QgaW5qZWN0YWJsZU1ldGhvZE5hbWUgPSAnZXhlYyc7XHJcbmNvbnN0IHByb3ZpZGVyR2V0ID0gJyRnZXQnO1xyXG5jb25zdCBhbm5vdGF0aW9uS2V5ID0gU3ltYm9sKCdkZXBlbmRlbmNpZXMnKTtcclxuLyoqXHJcbiAqIERlZmluZSB0aGUgaW5qZWN0aW9uIGFubm90YXRpb24gZm9yIGEgZ2l2ZW4gYW5ndWxhciBwcm92aWRlclxyXG4gKiBAcGFyYW0ge3N0cmluZ30gaWRlbnRpZmllclxyXG4gKiBAcmV0dXJucyB7UGFyYW1ldGVyRGVjb3JhdG9yfVxyXG4gKi9cclxuZnVuY3Rpb24gaW5qZWN0KGlkZW50aWZpZXIpIHtcclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjYWxsYWJsZS10eXBlc1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGFubm90YXRpb24odGFyZ2V0LCBrZXksIGluZGV4KSB7XHJcbiAgICAgICAgaWYgKGtleSAmJiBrZXkgIT09IGluamVjdGFibGVNZXRob2ROYW1lICYmIGtleSAhPT0gcHJvdmlkZXJHZXQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRGVwZW5kZW5jaWVzIGNhbiBvbmx5IGJlIGluamVjdGVkIG9uIGNvbnN0cnVjdG9yLCBpbmplY3RhYmxlIG1ldGhvZCBleGVjdXRvciwgb3IgcHJvdmlkZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYW5ub3RhdGlvbnMgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKGFubm90YXRpb25LZXksIHRhcmdldCkgfHwgbmV3IEFycmF5KHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIGFubm90YXRpb25zW2luZGV4XSA9IGlkZW50aWZpZXI7XHJcbiAgICAgICAgbG9nZ2VyLnZlcmJvc2UoYEFkZCBpbmplY3Rpb24gJHtpZGVudGlmaWVyfSB0byAke3RhcmdldC5uYW1lfWApO1xyXG4gICAgICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoYW5ub3RhdGlvbktleSwgYW5ub3RhdGlvbnMsIHRhcmdldCk7XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuaW5qZWN0ID0gaW5qZWN0O1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tbmFtZXNwYWNlXHJcbihmdW5jdGlvbiAoaW5qZWN0KSB7XHJcbiAgICBpbmplY3QucHJvdmlkZXIgPSAoaWRlbnRpZmllcikgPT4gaW5qZWN0KGAke2lkZW50aWZpZXJ9UHJvdmlkZXJgKTtcclxufSkoaW5qZWN0ID0gZXhwb3J0cy5pbmplY3QgfHwgKGV4cG9ydHMuaW5qZWN0ID0ge30pKTtcclxuZnVuY3Rpb24gbmdBbm5vdGF0ZVByb3ZpZGVyKGNvbnN0cnVjdG9yKSB7XHJcbiAgICBjb25zdCBwcm92aWRlciA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTtcclxuICAgIGNvbnN0IGFubm90YXRpb25zID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShhbm5vdGF0aW9uS2V5LCBjb25zdHJ1Y3RvcikgfHwgW107XHJcbiAgICBjb25zdCBtZXRob2QgPSBwcm92aWRlci4kZ2V0O1xyXG4gICAgaWYgKGFubm90YXRpb25zLmxlbmd0aCAhPT0gbWV0aG9kLmxlbmd0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQW5ub3RhdGlvbnMgYXJlIG5vdCBkZWZpbmVkIGZvciBhbGwgZGVwZW5kZW5jaWVzIG9mICR7bWV0aG9kLm5hbWV9OiBcclxuICAgICAgICAgICAgZXhwZWN0ZWQgJHttZXRob2QubGVuZ3RofSBhbm5vdGF0aW9ucyBhbmQgZm91bmQgJHthbm5vdGF0aW9ucy5sZW5ndGh9YCk7XHJcbiAgICB9XHJcbiAgICBsb2dnZXIudmVyYm9zZShgQW5ub3RhdGVkICR7YW5ub3RhdGlvbnMubGVuZ3RofSBwcm92aWRlciBkZXBlbmRlbmNpZXMgZm9yICR7Y29uc3RydWN0b3IubmFtZX1gKTtcclxuICAgIHByb3ZpZGVyLiRnZXQgPSBbLi4uYW5ub3RhdGlvbnMsIG1ldGhvZF07XHJcbn1cclxuZXhwb3J0cy5uZ0Fubm90YXRlUHJvdmlkZXIgPSBuZ0Fubm90YXRlUHJvdmlkZXI7XHJcbi8qKlxyXG4gKiBDb25zdHJ1Y3QgYW4gYW5ndWxhciBhbm5vdGF0aW9uIGFycmF5IGZyb20gZGVwZW5kZW5jeSBtZXRhZGF0YVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcm92aWRlclxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBiYXNlQ2xhc3NcclxuICogQHJldHVybnMge0FycmF5PHN0cmluZyB8IEZ1bmN0aW9uPn1cclxuICovXHJcbmZ1bmN0aW9uIG5nQW5ub3RhdGUocHJvdmlkZXIsIGJhc2VDbGFzcyA9IG51bGwpIHtcclxuICAgIGxldCBjbGF6eiA9IGJhc2VDbGFzcyB8fCBwcm92aWRlcjtcclxuICAgIGxldCBhbm5vdGF0aW9ucyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoYW5ub3RhdGlvbktleSwgY2xhenopIHx8IFtdO1xyXG4gICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYW55IGFubm90YXRpb25zIG9uIHRoZSBjbGFzcywgbG9vayBpbiBpdCdzIHByb3RvdHlwZSBjaGFpblxyXG4gICAgaWYgKGFubm90YXRpb25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgY2xhenogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2xhenopO1xyXG4gICAgICAgICAgICBhbm5vdGF0aW9ucyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoYW5ub3RhdGlvbktleSwgY2xhenopIHx8IFtdO1xyXG4gICAgICAgICAgICBsb2dnZXIudmVyYm9zZShgQ2hlY2tpbmcgJHtjbGF6ei5uYW1lfSBmb3IgYW5ub3RhdGlvbnMuIEZvdW5kICR7YW5ub3RhdGlvbnMubGVuZ3RofWApO1xyXG4gICAgICAgIH0gd2hpbGUgKGFubm90YXRpb25zLmxlbmd0aCA9PT0gMCAmJiBjbGF6ei5uYW1lICE9PSAnJyk7XHJcbiAgICAgICAgLy8gcmVzZXQgdGhlIGNsYXNzIHJlZmVyZW5jZSB0byB0aGUgcHJvdmlkZXIgaWYgd2UgZGlkbid0IGZpbmQgYW55IGFubm90YXRpb25zXHJcbiAgICAgICAgaWYgKGNsYXp6Lm5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIGNsYXp6ID0gcHJvdmlkZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IG1ldGhvZCA9IHByb3ZpZGVyO1xyXG4gICAgbGV0IG1ldGhvZE5hbWUgPSBwcm92aWRlci5uYW1lO1xyXG4gICAgaWYgKHByb3ZpZGVyLmxlbmd0aCA9PT0gMCAmJiBwcm92aWRlci5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoaW5qZWN0YWJsZU1ldGhvZE5hbWUpKSB7XHJcbiAgICAgICAgbWV0aG9kID0gcHJvdmlkZXIucHJvdG90eXBlW2luamVjdGFibGVNZXRob2ROYW1lXTtcclxuICAgICAgICBtZXRob2ROYW1lICs9IGAuJHtpbmplY3RhYmxlTWV0aG9kTmFtZX1gO1xyXG4gICAgfVxyXG4gICAgLy8gdGhlIG51bWJlciBhbm5vdGF0aW9ucyBzaG91bGQgbWF0Y2ggZWl0aGVyIHRoZSBtZXRob2QgbGVuZ3RoIG9yIHRoZSBiYXNlIGNsYXNzIGN0b3IgbGVuZ3RoXHJcbiAgICBpZiAoYW5ub3RhdGlvbnMubGVuZ3RoICE9PSBtZXRob2QubGVuZ3RoICYmIGNsYXp6Lmxlbmd0aCAhPT0gYW5ub3RhdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbm5vdGF0aW9ucyBhcmUgbm90IGRlZmluZWQgZm9yIGFsbCBkZXBlbmRlbmNpZXMgb2YgJHttZXRob2ROYW1lfTogXHJcbiAgICAgICAgICAgIGV4cGVjdGVkICR7bWV0aG9kLmxlbmd0aH0gYW5ub3RhdGlvbnMgYW5kIGZvdW5kICR7YW5ub3RhdGlvbnMubGVuZ3RofWApO1xyXG4gICAgfVxyXG4gICAgbG9nZ2VyLnZlcmJvc2UoYEFubm90YXRlZCAke2Fubm90YXRpb25zLmxlbmd0aH0gZGVwZW5kZW5jaWVzIGZvciAke3Byb3ZpZGVyLm5hbWV9YCk7XHJcbiAgICByZXR1cm4gWy4uLmFubm90YXRpb25zLCBtZXRob2RdO1xyXG59XHJcbmV4cG9ydHMubmdBbm5vdGF0ZSA9IG5nQW5ub3RhdGU7XHJcbmZ1bmN0aW9uIGJ1aWxkVHJlZSh0cmVlLCBtb2R1bGUpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodHJlZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RyZWUgb2JqZWN0IG11c3QgYmUgc2VyaWFsaXphYmxlIHRvIGJ1aWxkIGEgdmFsaWQgdHJlZScpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdHJhdmVyc2VOb2RlKG5vZGUsIHByb3AsIGlkZW50aWZpZXIpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IG5vZGVbcHJvcF07XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBbLi4uaWRlbnRpZmllciwgcHJvcF0uam9pbignLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyYXZlcnNlTm9kZSh2YWx1ZSwga2V5LCBbLi4uaWRlbnRpZmllciwgcHJvcF0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBPYmplY3Qua2V5cyh0cmVlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICB0cmF2ZXJzZU5vZGUodHJlZSwga2V5LCBbbW9kdWxlXSk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmJ1aWxkVHJlZSA9IGJ1aWxkVHJlZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5qZWN0b3ItcGx1cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3Qgc3RhdGVfbWFjaGluZV8xID0gcmVxdWlyZShcIi4vc3RhdGUtbWFjaGluZVwiKTtcclxuLy8gZXZlbnR1YWwgc291cmNlIG1hcHBpbmcgc3R1ZmZcclxuLy8gY29uc3QgY29udmVydCA9IHJlcXVpcmUoJ2NvbnZlcnQtc291cmNlLW1hcCcpO1xyXG4vLyBjb25zdCBjdXJyZW50U2NyaXB0ID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XHJcbmNsYXNzIExldmVsIGV4dGVuZHMgc3RhdGVfbWFjaGluZV8xLlN0YXRlTWFjaGluZSB7XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBzdGF0ZV9tYWNoaW5lXzEuc3RhdGUsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxyXG5dLCBMZXZlbCwgXCJOb25lXCIsIHZvaWQgMCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgTGV2ZWwsIFwiRXJyb3JcIiwgdm9pZCAwKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBzdGF0ZV9tYWNoaW5lXzEuc3RhdGUsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxyXG5dLCBMZXZlbCwgXCJXYXJuXCIsIHZvaWQgMCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgTGV2ZWwsIFwiSW5mb1wiLCB2b2lkIDApO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHN0YXRlX21hY2hpbmVfMS5zdGF0ZSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXHJcbl0sIExldmVsLCBcIkRlYnVnXCIsIHZvaWQgMCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgTGV2ZWwsIFwiVmVyYm9zZVwiLCB2b2lkIDApO1xyXG5leHBvcnRzLkxldmVsID0gTGV2ZWw7XHJcbi8qKlxyXG4gKiBCcm93c2VyLWZyaWVuZGx5IGxvZ2dpbmcgdXRpbGl0eSB3aXRoIG11bHRpcGxlIGxvZ2dlcnMgYW5kIGxldmVsIHN3aXRjaGVzXHJcbiAqIEBhdXRob3IgR3JlZyBSb3ptYXJ5bm93eWN6PGdyZWdAdGh1bmRlcmxhYi5uZXQ+XHJcbiAqL1xyXG5jbGFzcyBMb2dnZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhY2tcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY2FsbHM9MF1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldFRyYWNlKHN0YWNrLCBjYWxscyA9IDApIHtcclxuICAgICAgICBjb25zdCBjYWxsID0gc3RhY2tcclxuICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVtjYWxscyArIDNdXHJcbiAgICAgICAgICAgIC5zcGxpdCgnIGF0ICcpLnBvcCgpO1xyXG4gICAgICAgIC8vIHdlIGhhdmUgdG8gdHJhY2UgYmFjayB0byAyIGNhbGxzIGJlY2F1c2Ugb2YgY2FsbHMgZnJvbSB0aGUgbG9nZ2VyXHJcbiAgICAgICAgY29uc3QgZmlsZSA9IGNhbGwuc3BsaXQoJy8nKS5wb3AoKTtcclxuICAgICAgICBjb25zdCBtZXRob2QgPSBjYWxsLnNwbGl0KCcgKCcpLnNoaWZ0KCk7XHJcbiAgICAgICAgcmV0dXJuIGAoJHttZXRob2R9OiR7ZmlsZX1gO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBMZXZlbCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2V0U3RhdGUoTGV2ZWwuSW5mbyk7XHJcbiAgICAgICAgLy8gYWRkIGNvbnNvbGUgbG9nZ2VyIGJ5IGRlZmF1bHRcclxuICAgICAgICB0aGlzLmxvZ2dlcnMgPSBbeyBsZXZlbDogTGV2ZWwuVmVyYm9zZSwgYXBpOiBjb25zb2xlIH1dO1xyXG4gICAgfVxyXG4gICAgYWRkTG9nZ2VyKGxvZ2dlciwgbG9nZ2VyTGV2ZWwpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlcnMucHVzaCh7IGFwaTogbG9nZ2VyLCBsZXZlbDogbG9nZ2VyTGV2ZWwgfSk7XHJcbiAgICB9XHJcbiAgICBjb25maWcocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zZXRTdGF0ZSh0eXBlb2YgKHBhcmFtcy5sZXZlbCkgIT09ICd1bmRlZmluZWQnID8gcGFyYW1zLmxldmVsIDogKHRoaXMuc3RhdGUuZ2V0U3RhdGUoKSB8fCBMZXZlbC5FcnJvcikpO1xyXG4gICAgfVxyXG4gICAgZXJyb3IoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmdldFN0YXRlKCkgPCBMZXZlbC5FcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9nT3V0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLCBMZXZlbC5FcnJvciwgJ2Vycm9yJyk7XHJcbiAgICB9XHJcbiAgICB3YXJuKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5nZXRTdGF0ZSgpIDwgTGV2ZWwuV2Fybikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9nT3V0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLCBMZXZlbC5XYXJuLCAnd2FybicpO1xyXG4gICAgfVxyXG4gICAgaW5mbyguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZ2V0U3RhdGUoKSA8IExldmVsLkluZm8pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ091dChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKSwgTGV2ZWwuSW5mbywgJ2luZm8nKTtcclxuICAgIH1cclxuICAgIGRlYnVnKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5nZXRTdGF0ZSgpIDwgTGV2ZWwuRGVidWcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ091dChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKSwgTGV2ZWwuRGVidWcsICdkZWJ1ZycpO1xyXG4gICAgfVxyXG4gICAgdmVyYm9zZSguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZ2V0U3RhdGUoKSA8IExldmVsLlZlcmJvc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ091dChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKSwgTGV2ZWwuVmVyYm9zZSwgJ2RlYnVnJyk7XHJcbiAgICB9XHJcbiAgICBsb2dPdXQoYXJncywgbXNnTGV2ZWwsIGZ1bmMpIHtcclxuICAgICAgICBjb25zdCBzdGFjayA9IEVycm9yKCkuc3RhY2s7XHJcbiAgICAgICAgY29uc3QgdHJhY2UgPSBMb2dnZXIuZ2V0VHJhY2Uoc3RhY2spO1xyXG4gICAgICAgIGNvbnN0IGxldmVsID0gdGhpcy5zdGF0ZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGlmIChtc2dMZXZlbCA+IGxldmVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYXJnc1swXSA9IGAke3RyYWNlfSAke2FyZ3NbMF19YDtcclxuICAgICAgICBhcmdzLnVuc2hpZnQodHJhY2UpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sb2dnZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBsb2dnZXJMZXZlbCA9IE51bWJlci5pc0ludGVnZXIodGhpcy5sb2dnZXJzW2ldLmxldmVsKSA/IHRoaXMubG9nZ2Vyc1tpXS5sZXZlbCA6IGxldmVsO1xyXG4gICAgICAgICAgICBpZiAobXNnTGV2ZWwgPD0gbG9nZ2VyTGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2Vyc1tpXS5hcGlbZnVuY10oLi4uYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ2dlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIENyZWF0ZWQgYnkgR3JlZyBvbiAzLzI0LzIwMTcuXHJcbiAqL1xyXG5jb25zdCBkZWNvcmF0b3JzXzEgPSByZXF1aXJlKFwiLi9kZWNvcmF0b3JzXCIpO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1zaGFkb3dlZC12YXJpYWJsZVxyXG5jbGFzcyBTdGF0ZUxpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgICBnZXRTdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZTtcclxuICAgIH1cclxuICAgIGludm9rZShwcmV2U3RhdGUpIHtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMuc3RhdGUsIHByZXZTdGF0ZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gc3RhdGUodGFyZ2V0LCBrZXkpIHtcclxuICAgIGlmIChkZWxldGUgdGFyZ2V0W2tleV0pIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IE1hdGgucG93KDIsIE9iamVjdC5rZXlzKHRhcmdldCkubGVuZ3RoKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnN0YXRlID0gc3RhdGU7XHJcbi8qIHRzbGludDpkaXNhYmxlOm5vLXNoYWRvd2VkLXZhcmlhYmxlICovXHJcbmNsYXNzIFN0YXRlTWFjaGluZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnN0YXRlID0gMDtcclxuICAgICAgICB0aGlzLnN0YXRlTGlzdGVuZXJzID0gW107XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYWxsKG1hY2hpbmUpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobWFjaGluZSkucmVkdWNlKChhbGwsIHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbGwgfCBtYWNoaW5lW3N0YXRlXTtcclxuICAgICAgICB9LCAwKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW5kaWNhdGVzIGlmIGEgZ2l2ZW4gc3RhdGUgaXMgYWN0aXZlXHJcbiAgICAgKiBAcGFyYW0gc3RhdGVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBpcyhzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybiAoc3RhdGUgfCB0aGlzLnN0YXRlKSA9PT0gdGhpcy5zdGF0ZTtcclxuICAgIH1cclxuICAgIGdldFN0YXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgZ2l2ZW4gc3RhdGVcclxuICAgICAqIEBwYXJhbSBzdGF0ZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIG9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZUxpc3RlbmVycy5wdXNoKG5ldyBTdGF0ZUxpc3RlbmVyKHN0YXRlLCBjYWxsYmFjaykpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciBhbGwgc3RhdGUgbGlzdGVuZXJzXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVN0YXRlTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGVMaXN0ZW5lcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuICAgIHNldFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgcHJldlN0YXRlID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgaWYgKHByZXZTdGF0ZSAhPT0gdGhpcy5zdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmludm9rZVN0YXRlTGlzdGVuZXJzKHRoaXMuc3RhdGUsIHByZXZTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYWRkU3RhdGUoc3RhdGUpIHtcclxuICAgICAgICBjb25zdCBwcmV2U3RhdGUgPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgfD0gc3RhdGU7XHJcbiAgICAgICAgaWYgKHByZXZTdGF0ZSAhPT0gdGhpcy5zdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmludm9rZVN0YXRlTGlzdGVuZXJzKHRoaXMuc3RhdGUsIHByZXZTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IDA7XHJcbiAgICB9XHJcbiAgICByZW1vdmVTdGF0ZShzdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHByZXZTdGF0ZSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSBePSBzdGF0ZTtcclxuICAgICAgICBpZiAocHJldlN0YXRlICE9PSB0aGlzLnN0YXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW52b2tlU3RhdGVMaXN0ZW5lcnModGhpcy5zdGF0ZSwgcHJldlN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbnZva2VTdGF0ZUxpc3RlbmVycyhzdGF0ZSwgcHJldlN0YXRlKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKGxpc3RlbmVyLmdldFN0YXRlKCkgfCBzdGF0ZSkgPT09IHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5pbnZva2UocHJldlN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgZGVjb3JhdG9yc18xLmVudW1lcmFibGUoZmFsc2UpLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgU3RhdGVNYWNoaW5lLnByb3RvdHlwZSwgXCJzdGF0ZVwiLCB2b2lkIDApO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGRlY29yYXRvcnNfMS5lbnVtZXJhYmxlKGZhbHNlKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBBcnJheSlcclxuXSwgU3RhdGVNYWNoaW5lLnByb3RvdHlwZSwgXCJzdGF0ZUxpc3RlbmVyc1wiLCB2b2lkIDApO1xyXG5leHBvcnRzLlN0YXRlTWFjaGluZSA9IFN0YXRlTWFjaGluZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhdGUtbWFjaGluZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY29uc3QgYW5ndWxhciA9IHJlcXVpcmUoXCJhbmd1bGFyXCIpO1xyXG5jbGFzcyBEVE8ge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBwYXJhbXMpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRFRPID0gRFRPO1xyXG5jbGFzcyBTdGF0aWNTb3VyY2Uge1xyXG4gICAgY29uc3RydWN0b3IoZW50cmllcywgb3JkZXIgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5lbnRyaWVzID0gZW50cmllcztcclxuICAgICAgICB0aGlzLm9yZGVyID0gb3JkZXI7XHJcbiAgICB9XHJcbiAgICBnZXQoaWQpIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZW50cmllc1tpZF0pO1xyXG4gICAgfVxyXG4gICAgZ2V0QWxsKCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoT2JqZWN0LmtleXModGhpcy5lbnRyaWVzKS5tYXAoKGtleSkgPT4gdGhpcy5lbnRyaWVzW2tleV0pKTtcclxuICAgIH1cclxuICAgIGdldE9yZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yZGVyO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuU3RhdGljU291cmNlID0gU3RhdGljU291cmNlO1xyXG4vKipcclxuICpcclxuICovXHJcbmNsYXNzIFNvdXJjZUFkYXB0ZXIge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBwYXJhbXMuc291cmNlO1xyXG4gICAgICAgIHRoaXMubWV0aG9kID0gcGFyYW1zLm1ldGhvZDtcclxuICAgICAgICB0aGlzLnN1Y2Nlc3NNZXRob2QgPSBwYXJhbXMuc3VjY2Vzc01ldGhvZCB8fCAndGhlbic7XHJcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gWyduZycsIC4uLnBhcmFtcy5tb2R1bGVzIHx8IFtdXTtcclxuICAgICAgICB0aGlzLm9yZGVyID0gdHlwZW9mIHBhcmFtcy5vcmRlciA9PT0gJ251bWJlcicgPyBwYXJhbXMub3JkZXIgOiAwO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBwYXJhbXMuY2FsbGJhY2sgfHwgZmFsc2U7XHJcbiAgICAgICAgLy8gbWFrZSBsb2dpYyBzaW1wbGVyIGJ5IGRlZmF1bHRpbmcgdG8gYSBuby1vcDsgd2UgZG9uJ3QgY2FyZSBhYm91dCBvdmVyaGVhZCBoZXJlXHJcbiAgICAgICAgY29uc3Qgbm9vcCA9IChpbnB1dCkgPT4gaW5wdXQ7XHJcbiAgICAgICAgdGhpcy5pbnB1dFRyYW5zZm9ybSA9IHBhcmFtcy5pbnB1dFRyYW5zZm9ybSB8fCBub29wO1xyXG4gICAgICAgIHRoaXMub3V0cHV0VHJhbnNmb3JtID0gcGFyYW1zLm91dHB1dFRyYW5zZm9ybSB8fCBub29wO1xyXG4gICAgfVxyXG4gICAgZ2V0KGlkKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnNvdXJjZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBhbmd1bGFyLmluamVjdG9yKHRoaXMubW9kdWxlcykuZ2V0KHRoaXMuc291cmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZVt0aGlzLm1ldGhvZF0odGhpcy5pbnB1dFRyYW5zZm9ybShpZCksIHJlc29sdmUpO1xyXG4gICAgICAgICAgICB9KS50aGVuKHRoaXMub3V0cHV0VHJhbnNmb3JtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMubWV0aG9kXSh0aGlzLmlucHV0VHJhbnNmb3JtKGlkKSlbdGhpcy5zdWNjZXNzTWV0aG9kXSh0aGlzLm91dHB1dFRyYW5zZm9ybSk7XHJcbiAgICB9XHJcbiAgICBnZXRBbGwoKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdTb3VyY2UgQWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGdldEFsbCBmdW5jdGlvbmFsaXR5Jyk7XHJcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKCdTb3VyY2UgQWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGdldEFsbCBmdW5jdGlvbmFsaXR5Jyk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XHJcbiAgICB9XHJcbiAgICBnZXRPcmRlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcmRlcjtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlNvdXJjZUFkYXB0ZXIgPSBTb3VyY2VBZGFwdGVyO1xyXG4vKipcclxuICogQmFzaWMgJGh0dHAgYWRhcHRlclxyXG4gKi9cclxuY2xhc3MgSHR0cEFkYXB0ZXIgZXh0ZW5kcyBTb3VyY2VBZGFwdGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhdGgpIHtcclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIHNvdXJjZTogJyRodHRwJyxcclxuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgICAgICAgICAgaW5wdXRUcmFuc2Zvcm06IChpZCkgPT4gYCR7cGF0aH0vJHtpZH1gLFxyXG4gICAgICAgICAgICBvdXRwdXRUcmFuc2Zvcm06IChyZXNwKSA9PiByZXNwLmRhdGEsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5IdHRwQWRhcHRlciA9IEh0dHBBZGFwdGVyO1xyXG4vKipcclxuICogRmFsbHMgYmFjayB0aHJvdWdoIHByb3ZpZGVkIHNvdXJjZXMgdG8gcmV0cmlldmUgYSBEVE8sIGJ1aWxkaW5nIGFuZCByZXR1cm5pbmcgYW4gZW50aXR5XHJcbiAqL1xyXG5jbGFzcyBMaWJyYXJ5IHtcclxuICAgIGNvbnN0cnVjdG9yKGN0b3IsIHNvdXJjZXMpIHtcclxuICAgICAgICB0aGlzLmN0b3IgPSBjdG9yO1xyXG4gICAgICAgIHRoaXMuc291cmNlcyA9IHNvdXJjZXM7XHJcbiAgICAgICAgdGhpcy5yZXR1cm5EVE8gPSAhdGhpcy5jdG9yOyAvLyByZXR1cm4gRFRPIGluc3RlYWQgb2YgY29uc3RydWN0aW5nIGFuIGVudGl0eVxyXG4gICAgfVxyXG4gICAgYWRkU291cmNlcyhzb3VyY2VzKSB7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2godGhpcy5zb3VyY2VzLCBzb3VyY2VzKTtcclxuICAgIH1cclxuICAgIGdldChpZCkge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VzLnNvcnQoKGEsIGIpID0+IGEuZ2V0T3JkZXIoKSAtIGIuZ2V0T3JkZXIoKSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZhbGxiYWNrR2V0KG51bGwpLnRoZW4odGhpcy5wcm9jZXNzUmVzdWx0KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgYWxsIGl0ZW1zIGZyb20gZWFjaCBzb3VyY2UsIGFuZCBhZ2dyZWdhdGUgaXRlbXMgdG8gYSBzaW5nbGUgYXJyYXlcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFRbXT59XHJcbiAgICAgKi9cclxuICAgIGdldEFsbEl0ZW1zKCkge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLnNvdXJjZXMubWFwKChzb3VyY2UpID0+IHNvdXJjZS5nZXRBbGwoKSkpXHJcbiAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCByZXN1bHRzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVjdXJzZSB0aHJvdWdoIGVhY2ggc291cmNlLCBvbmx5IGNhbGxpbmcgYSBzb3VyY2UgaWYgdGhlIHByZXZpb3VzIHJldHVybiBubyByZXN1bHQgb3IgZmFpbGVkXHJcbiAgICAgKiBAcGFyYW0gcmVzdWx0XHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmcgfCBUPn1cclxuICAgICAqL1xyXG4gICAgZmFsbGJhY2tHZXQocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlSW5kZXggPj0gdGhpcy5zb3VyY2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VzW3RoaXMuc291cmNlSW5kZXgrK10uZ2V0KHRoaXMuaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbih0aGlzLmZhbGxiYWNrR2V0KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgU291cmNlIGdldCBmYWlsZWQgZm9yICR7dGhpcy5jdG9yLm5hbWV9YCwgZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mYWxsYmFja0dldChudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zZm9ybSB0aGUgRFRPIG9yIHN0cmluZyBpbnRvIGFuIGVudGl0eVxyXG4gICAgICogQHBhcmFtIHtPYmplY3QgfCBzdHJpbmd9IHJlc3VsdFxyXG4gICAgICogQHJldHVybnMge1R9XHJcbiAgICAgKi9cclxuICAgIHByb2Nlc3NSZXN1bHQocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCB8fCByZXN1bHQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJldHVybkRUTyA/IHJlc3VsdCA6IG5ldyB0aGlzLmN0b3IocmVzdWx0KTtcclxuICAgIH1cclxufVxyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIFByb21pc2UpXHJcbl0sIExpYnJhcnkucHJvdG90eXBlLCBcImZhbGxiYWNrR2V0XCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIE9iamVjdClcclxuXSwgTGlicmFyeS5wcm90b3R5cGUsIFwicHJvY2Vzc1Jlc3VsdFwiLCBudWxsKTtcclxuLyoqXHJcbiAqIExpYnJhcnkgd2l0aCBkeW5hbWljYWxseSBidWlsdCBlbnRyaWVzIHRoYXQgYXJlIHByZXBhcmVkIGR1cmluZyBhcHBsaWNhdGlvbiBzZXR1cFxyXG4gKi9cclxuY2xhc3MgUHJlcGFyZWRMaWJyYXJ5IGV4dGVuZHMgTGlicmFyeSB7XHJcbiAgICBjb25zdHJ1Y3RvcihjdG9yLCBzb3VyY2VzKSB7XHJcbiAgICAgICAgc3VwZXIoY3Rvciwgc291cmNlcyk7XHJcbiAgICB9XHJcbiAgICBwcm9jZXNzUmVzdWx0KHJlc3VsdCkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgTGlicmFyeVByb3ZpZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubGliYXJpZXMgPSBuZXcgTWFwKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEFkZCBzb3VyY2UgZW50cmllcyBmb3IgdGhlIGdpdmVuIHR5cGVcclxuICAgICAqIEBwYXJhbSB7SUVudGl0eUN0b3I8VCwgUD59IGN0b3JcclxuICAgICAqIEBwYXJhbSB7QXJyYXk8SVNvdXJjZTxUPj59IHNvdXJjZXNcclxuICAgICAqL1xyXG4gICAgYWRkU291cmNlcyhjdG9yLCBzb3VyY2VzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGliYXJpZXMuaGFzKGN0b3IpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGliYXJpZXMuZ2V0KGN0b3IpLmFkZFNvdXJjZXMoc291cmNlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxpYmFyaWVzLnNldChjdG9yLCBuZXcgTGlicmFyeShjdG9yLCBzb3VyY2VzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBsaWJyYXJ5IHdpdGggc291cmNlcyBjb25maWd1cmVkIGFmdGVyIGFwcGxpY2F0aW9uIHNldHVwXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gY3RvclxyXG4gICAgICogQHBhcmFtIHtBcnJheTxJU291cmNlPGFueT4+fSBzb3VyY2VzXHJcbiAgICAgKi9cclxuICAgIGFkZFByZXBhcmVkU291cmNlcyhjdG9yLCBzb3VyY2VzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGliYXJpZXMuaGFzKGN0b3IpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGliYXJpZXMuZ2V0KGN0b3IpLmFkZFNvdXJjZXMoc291cmNlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxpYmFyaWVzLnNldChjdG9yLCBuZXcgUHJlcGFyZWRMaWJyYXJ5KGN0b3IsIHNvdXJjZXMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIGVudGl0eSBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgaWRcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHR5cGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyfSBpZFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8VD59XHJcbiAgICAgKi9cclxuICAgIGdldCh0eXBlLCBpZCkge1xyXG4gICAgICAgIGlmICghdGhpcy5saWJhcmllcy5oYXModHlwZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBObyBzb3VyY2VzIGFyZSBjb25maWd1cmVkIGZvciAke3R5cGUubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGliYXJpZXMuZ2V0KHR5cGUpLmdldChpZCk7XHJcbiAgICB9XHJcbiAgICBnZXRBbGwodHlwZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5saWJhcmllcy5oYXModHlwZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBObyBzb3VyY2VzIGFyZSBjb25maWd1cmVkIGZvciAke3R5cGUubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGliYXJpZXMuZ2V0KHR5cGUpLmdldEFsbEl0ZW1zKCk7XHJcbiAgICB9XHJcbiAgICAkZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiB7IGdldDogdGhpcy5nZXQsIGdldEFsbDogdGhpcy5nZXRBbGwsIGFkZFNvdXJjZXM6IHRoaXMuYWRkUHJlcGFyZWRTb3VyY2VzIH07XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtGdW5jdGlvbiwgT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgTGlicmFyeVByb3ZpZGVyLnByb3RvdHlwZSwgXCJnZXRcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgYmluZF9kZWNvcmF0b3JfMS5kZWZhdWx0LFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbRnVuY3Rpb25dKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBMaWJyYXJ5UHJvdmlkZXIucHJvdG90eXBlLCBcImdldEFsbFwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBPYmplY3QpXHJcbl0sIExpYnJhcnlQcm92aWRlci5wcm90b3R5cGUsIFwiJGdldFwiLCBudWxsKTtcclxuZXhwb3J0cy5MaWJyYXJ5UHJvdmlkZXIgPSBMaWJyYXJ5UHJvdmlkZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpYnJhcnkucHJvdmlkZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vIHJlLWV4cG9ydCB0aGUgbG9nZ2VyIHV0aWxpdHkgdG8gbWFpbnRhaW4gY29uc2lzdGVudCBwYXRoaW5nIGluIHRoZSBtb2R1bGUgZGVmaW5pdGlvblxyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9saWIvbG9nZ2VyXCIpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nZ2VyLnNlcnZpY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbmNvbnN0IGFuZ3VsYXIgPSByZXF1aXJlKFwiYW5ndWxhclwiKTtcclxuY29uc3QgY29uc3RhbnRzID0gYW5ndWxhci5tb2R1bGUoJ21hbGxldC1jb25zdGFudHMnLCBbXSlcclxuICAgIC5jb25zdGFudChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuY29uc3QuU2NhbGVGYWN0b3IsICgoKSA9PiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSgpKVxyXG4gICAgLmNvbnN0YW50KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5jb25zdC5TYW1wbGVDb3VudCwgMTAyNClcclxuICAgIC5jb25zdGFudChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuY29uc3QuTWF4RnJhbWVSYXRlLCA2MClcclxuICAgIC5jb25zdGFudChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuY29uc3QuS2V5cywgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBEb3duOiA0MCxcclxuICAgIFVwOiAzOCxcclxuICAgIFJpZ2h0OiAzOSxcclxuICAgIExlZnQ6IDM3LFxyXG4gICAgU3BhY2U6IDMyLFxyXG4gICAgRXNjYXBlOiAyNyxcclxufSkpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50cy5uYW1lO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWxsZXQuY29uc3RhbnRzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGluamVjdG9yX3BsdXNfMSA9IHJlcXVpcmUoXCIuL2xpYi9pbmplY3Rvci1wbHVzXCIpO1xyXG5jb25zdCBNRFQgPSB7XHJcbiAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICB3ZWJHTFN0YWdlOiAnbWFsbGV0V2ViZ2xTdGFnZScsXHJcbiAgICAgICAgcmVuZGVyVGFyZ2V0OiAnbWFsbGV0UmVuZGVyVGFyZ2V0JyxcclxuICAgIH0sXHJcbiAgICBjb25maWc6IHtcclxuICAgICAgICBQYXRoOiAnJyxcclxuICAgIH0sXHJcbiAgICBbJ2NvbnN0J106IHtcclxuICAgICAgICBLZXlzOiAnJyxcclxuICAgICAgICBNYXhGcmFtZVJhdGU6ICcnLFxyXG4gICAgICAgIFNhbXBsZUNvdW50OiAnJyxcclxuICAgICAgICBTY2FsZUZhY3RvcjogJycsXHJcbiAgICB9LFxyXG4gICAgbmc6IHtcclxuICAgICAgICAkZWxlbWVudDogJyRlbGVtZW50JyxcclxuICAgICAgICAkbG9jYXRpb246ICckbG9jYXRpb24nLFxyXG4gICAgICAgICR3aW5kb3c6ICckd2luZG93JyxcclxuICAgICAgICAkaHR0cDogJyRodHRwJyxcclxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlcjogJyRsb2NhdGlvblByb3ZpZGVyJyxcclxuICAgICAgICAkcTogJyRxJyxcclxuICAgICAgICAkcm9vdFNjb3BlOiAnJHJvb3RTY29wZScsXHJcbiAgICAgICAgJHNjb3BlOiAnJHNjb3BlJyxcclxuICAgICAgICAkc29ja2V0OiAnc29ja2V0RmFjdG9yeScsXHJcbiAgICAgICAgJHN0YXRlOiAnJHN0YXRlJyxcclxuICAgICAgICAkc3RhdGVQYXJhbXM6ICckc3RhdGVQYXJhbXMnLFxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyOiAnJHN0YXRlUHJvdmlkZXInLFxyXG4gICAgICAgICR0aW1lb3V0OiAnJHRpbWVvdXQnLFxyXG4gICAgICAgICR1cmxTZXJ2aWNlOiAnJHVybFNlcnZpY2UnLFxyXG4gICAgfSxcclxuICAgIEFzeW5jUmVxdWVzdDogJycsXHJcbiAgICBDYW1lcmE6ICcnLFxyXG4gICAgQ29sb3I6ICcnLFxyXG4gICAgR2VvbWV0cnk6ICcnLFxyXG4gICAgS2V5Ym9hcmQ6ICcnLFxyXG4gICAgTG9nZ2VyOiAnJyxcclxuICAgIE1hdGg6ICcnLFxyXG4gICAgTW91c2VVdGlsczogJycsXHJcbiAgICBQYXJ0aWNsZUVtaXR0ZXI6ICcnLFxyXG4gICAgUGFydGljbGVFbWl0dGVyMkQ6ICcnLFxyXG4gICAgU2NoZWR1bGVyOiAnJyxcclxuICAgIEFwcFN0YXRlOiAnJyxcclxuICAgIFN0YXRlTWFjaGluZTogJycsXHJcbiAgICBUaHJlYWQ6ICcnLFxyXG4gICAgUmVuZGVyVGFyZ2V0OiAnJyxcclxuICAgIExpYnJhcnk6ICcnLFxyXG4gICAgd2ViZ2w6IHtcclxuICAgICAgICBTaGFkZXJTb3VyY2U6ICcnLFxyXG4gICAgICAgIFdlYkdMU3RhZ2U6ICcnLFxyXG4gICAgfSxcclxufTtcclxuZXhwb3J0cy5NRFQgPSBNRFQ7XHJcbmluamVjdG9yX3BsdXNfMS5idWlsZFRyZWUoTURULCAnbWFsbGV0Jyk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hbGxldC5kZXBlZGVuY3ktdHJlZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMSA9IHJlcXVpcmUoXCIuL21hbGxldC5kZXBlZGVuY3ktdHJlZVwiKTtcclxuY29uc3QgaW5qZWN0b3JfcGx1c18xID0gcmVxdWlyZShcIi4vbGliL2luamVjdG9yLXBsdXNcIik7XHJcbmNvbnN0IHJlbmRlcl90YXJnZXRfZmFjdG9yeV8xID0gcmVxdWlyZShcIi4vcmVuZGVyLXRhcmdldC5mYWN0b3J5XCIpO1xyXG5jb25zdCBhcHBfc3RhdGVfc2VydmljZV8xID0gcmVxdWlyZShcIi4vYXBwLXN0YXRlLnNlcnZpY2VcIik7XHJcbmNvbnN0IHNjaGVkdWxlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zY2hlZHVsZXIuc2VydmljZVwiKTtcclxuY29uc3QgbG9nZ2VyX3NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL2xvZ2dlci5zZXJ2aWNlXCIpO1xyXG5jb25zdCByZW5kZXJfdGFyZ2V0X2NvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vcmVuZGVyLXRhcmdldC5jb21wb25lbnRcIik7XHJcbmNvbnN0IGxpYnJhcnlfcHJvdmlkZXJfMSA9IHJlcXVpcmUoXCIuL2xpYnJhcnkucHJvdmlkZXJcIik7XHJcbi8vIHRzbGludDpkaXNhYmxlOm5vLXZhci1yZXF1aXJlc1xyXG5leHBvcnRzLm1hbGxldCA9IHJlcXVpcmUoJ2FuZ3VsYXInKS5tb2R1bGUoJ21hbGxldCcsIFtcclxuICAgIHJlcXVpcmUoJy4vbWFsbGV0LmNvbnN0YW50cycpLFxyXG5dKTtcclxuZXhwb3J0cy5tYWxsZXQucHJvdmlkZXIobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULkxpYnJhcnksIGluamVjdG9yX3BsdXNfMS5uZ0Fubm90YXRlKGxpYnJhcnlfcHJvdmlkZXJfMS5MaWJyYXJ5UHJvdmlkZXIpKTtcclxuZXhwb3J0cy5tYWxsZXQuc2VydmljZShtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuU2NoZWR1bGVyLCBpbmplY3Rvcl9wbHVzXzEubmdBbm5vdGF0ZShzY2hlZHVsZXJfc2VydmljZV8xLlNjaGVkdWxlcikpO1xyXG5leHBvcnRzLm1hbGxldC5zZXJ2aWNlKG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5BcHBTdGF0ZSwgaW5qZWN0b3JfcGx1c18xLm5nQW5ub3RhdGUoYXBwX3N0YXRlX3NlcnZpY2VfMS5BcHBTdGF0ZSkpO1xyXG5leHBvcnRzLm1hbGxldC5zZXJ2aWNlKG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5Mb2dnZXIsIGluamVjdG9yX3BsdXNfMS5uZ0Fubm90YXRlKGxvZ2dlcl9zZXJ2aWNlXzEuTG9nZ2VyKSk7XHJcbmV4cG9ydHMubWFsbGV0LmZhY3RvcnkobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULlJlbmRlclRhcmdldCwgaW5qZWN0b3JfcGx1c18xLm5nQW5ub3RhdGUocmVuZGVyX3RhcmdldF9mYWN0b3J5XzEucmVuZGVyVGFyZ2V0RmFjdG9yeSkpO1xyXG5leHBvcnRzLm1hbGxldC5jb21wb25lbnQobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULmNvbXBvbmVudC5yZW5kZXJUYXJnZXQsIHJlbmRlcl90YXJnZXRfY29tcG9uZW50XzEub3B0aW9ucyk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hbGxldC5tb2R1bGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX21ldGFkYXRhID0gKHRoaXMgJiYgdGhpcy5fX21ldGFkYXRhKSB8fCBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xyXG59O1xyXG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaW5qZWN0b3JfcGx1c18xID0gcmVxdWlyZShcIi4vbGliL2luamVjdG9yLXBsdXNcIik7XHJcbmNvbnN0IG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xID0gcmVxdWlyZShcIi4vbWFsbGV0LmRlcGVkZW5jeS10cmVlXCIpO1xyXG5jb25zdCBzY2hlZHVsZXJfc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2NoZWR1bGVyLnNlcnZpY2VcIik7XHJcbmNvbnN0IGFuZ3VsYXJfMSA9IHJlcXVpcmUoXCJhbmd1bGFyXCIpO1xyXG5jb25zdCBiaW5kX2RlY29yYXRvcl8xID0gcmVxdWlyZShcImJpbmQtZGVjb3JhdG9yXCIpO1xyXG5jb25zdCBsb2dnZXJfMSA9IHJlcXVpcmUoXCIuL2xpYi9sb2dnZXJcIik7XHJcbmxldCBSZW5kZXJUYXJnZXRDdHJsID0gY2xhc3MgUmVuZGVyVGFyZ2V0Q3RybCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXIsICRlbGVtZW50LCBtU3RhdGUsIHNjaGVkdWxlciwgcmVuZGVyVGFyZ2V0RmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcclxuICAgICAgICB0aGlzLm1TdGF0ZSA9IG1TdGF0ZTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcclxuICAgICAgICB0aGlzLnJlbmRlclRhcmdldEZhY3RvcnkgPSByZW5kZXJUYXJnZXRGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMuTk9fU1VQUE9SVF9NRVNTQUdFID0gJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGNhbnZhcy4gUGxlYXNlIGNvbnNpZGVyIHVwZ3JhZGluZy4nO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldENvbnRyb2xsZXIoJGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTk5NTEwOC9hbmd1bGFyLWdldC1jb250cm9sbGVyLWZyb20tZWxlbWVudFxyXG4gICAgICAgIGNvbnN0IHRhcmdldFRhZyA9ICdtYWxsZXQtcmVuZGVyLXRhcmdldCc7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyVGFyZ2V0ID0gJGVsZW1lbnRbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFyZ2V0VGFnKTtcclxuICAgICAgICBpZiAoIXJlbmRlclRhcmdldCB8fCAhcmVuZGVyVGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYEZhaWxlZCB0byBmaW5kIHJlbmRlciB0YXJnZXQgJHt0YXJnZXRUYWd9IGluIGNvbXBvbmVudCAkeyRlbGVtZW50WzBdfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjdHJsID0gYW5ndWxhcl8xLmVsZW1lbnQocmVuZGVyVGFyZ2V0KS5jb250cm9sbGVyKG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5jb21wb25lbnQucmVuZGVyVGFyZ2V0KTtcclxuICAgICAgICBpZiAoIWN0cmwpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyID0gYEZhaWxlZCB0byBnZXQgY29udHJvbGxlciBmcm9tIHJlbmRlciB0YXJnZXQuIEVuc3VyZSB0aGlzIGZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZCBpbiAkcG9zdExpbmsgb3IgbGF0ZXIuYDtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjdHJsO1xyXG4gICAgfVxyXG4gICAgJG9uSW5pdCgpIHtcclxuICAgICAgICAvLyBDcmVhdGUgdGhlIHJlbmRlciB0YXJnZXRcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuJGVsZW1lbnRbMF0uY2xpZW50V2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy4kZWxlbWVudFswXS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYENyZWF0ZSByZW5kZXIgdGFyZ2V0IHdpdGggdHlwZSAke3RoaXMudHlwZS5uYW1lfWApO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ID0gdGhpcy5yZW5kZXJUYXJnZXRGYWN0b3J5KHRoaXMudHlwZSwgeyB3aWR0aCwgaGVpZ2h0IH0pO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5yZW5kZXJUYXJnZXQuZ2V0Q29udGV4dCgpO1xyXG4gICAgICAgIC8vIFNldHVwIGFuZCBhdHRhY2ggY2FudmFzXHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5yZW5kZXJUYXJnZXQuZ2V0Q2FudmFzKCk7XHJcbiAgICAgICAgY2FudmFzLmlubmVySFRNTCA9IHRoaXMuTk9fU1VQUE9SVF9NRVNTQUdFO1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYXBwZW5kKGNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUodGhpcy51cGRhdGUsIDApO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKTtcclxuICAgIH1cclxuICAgICRvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpO1xyXG4gICAgfVxyXG4gICAgZ2V0Q29udGV4dCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdHg7XHJcbiAgICB9XHJcbiAgICBnZXRSZW5kZXJUYXJnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyVGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGNvbnN0IGxvd1Jlc1NjYWxlID0gMC43NTtcclxuICAgICAgICAvLyBSZWR1Y2UgY2FudmFzIHJlc29sdXRpb24gaXMgcGVyZm9ybWFuY2UgaXMgYmFkXHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZWR1bGVyLkZQUyA8IDMwICYmIHRoaXMuc2NhbGUgPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZSA9IGxvd1Jlc1NjYWxlO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclRhcmdldC5yZXNpemUodGhpcy5zY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc2NoZWR1bGVyLkZQUyA+IDQwICYmIHRoaXMuc2NhbGUgPT09IGxvd1Jlc1NjYWxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclRhcmdldC5yZXNpemUodGhpcy5zY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVyLmRyYXcoKCkgPT4gdGhpcy5yZW5kZXJUYXJnZXQuY2xlYXIoKSwgLTEpO1xyXG4gICAgfVxyXG4gICAgb25SZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXQucmVzaXplKHRoaXMuc2NhbGUpO1xyXG4gICAgfVxyXG59O1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgUmVuZGVyVGFyZ2V0Q3RybC5wcm90b3R5cGUsIFwidXBkYXRlXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgUmVuZGVyVGFyZ2V0Q3RybC5wcm90b3R5cGUsIFwib25SZXNpemVcIiwgbnVsbCk7XHJcblJlbmRlclRhcmdldEN0cmwgPSBfX2RlY29yYXRlKFtcclxuICAgIF9fcGFyYW0oMCwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuTG9nZ2VyKSksXHJcbiAgICBfX3BhcmFtKDEsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULm5nLiRlbGVtZW50KSksXHJcbiAgICBfX3BhcmFtKDIsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULkFwcFN0YXRlKSksXHJcbiAgICBfX3BhcmFtKDMsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULlNjaGVkdWxlcikpLFxyXG4gICAgX19wYXJhbSg0LCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5SZW5kZXJUYXJnZXQpKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbbG9nZ2VyXzEuTG9nZ2VyLCBPYmplY3QsIE9iamVjdCwgc2NoZWR1bGVyX3NlcnZpY2VfMS5TY2hlZHVsZXIsIEZ1bmN0aW9uXSlcclxuXSwgUmVuZGVyVGFyZ2V0Q3RybCk7XHJcbmV4cG9ydHMuUmVuZGVyVGFyZ2V0Q3RybCA9IFJlbmRlclRhcmdldEN0cmw7XHJcbmNsYXNzIFJlbmRlclRhcmdldDJEQ3RybCBleHRlbmRzIFJlbmRlclRhcmdldEN0cmwge1xyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLm1TdGF0ZS5pcyh0aGlzLm1TdGF0ZS5EZWJ1ZykpIHtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuZHJhdygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChgRlBTOiAke35+dGhpcy5zY2hlZHVsZXIuRlBTfWAsIDI1LCAyNSk7XHJcbiAgICAgICAgICAgIH0sIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLm9wdGlvbnMgPSB7XHJcbiAgICBjb250cm9sbGVyOiBpbmplY3Rvcl9wbHVzXzEubmdBbm5vdGF0ZShSZW5kZXJUYXJnZXRDdHJsKSxcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInJlbmRlci10YXJnZXRcIj48L2Rpdj4nLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB0eXBlOiAnPCcsXHJcbiAgICB9LFxyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW5kZXItdGFyZ2V0LmNvbXBvbmVudC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogQ3JlYXRlZCBieSBnanJ3Y3Mgb24gOS8xNS8yMDE2LlxyXG4gKi9cclxuY29uc3QgaW5qZWN0b3JfcGx1c18xID0gcmVxdWlyZShcIi4vbGliL2luamVjdG9yLXBsdXNcIik7XHJcbmNvbnN0IGxvZ2dlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9sb2dnZXIuc2VydmljZVwiKTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbnZhciBDYW52YXNDb250ZXh0O1xyXG4oZnVuY3Rpb24gKENhbnZhc0NvbnRleHQpIHtcclxuICAgIENhbnZhc0NvbnRleHRbXCJiYXNpY1wiXSA9IFwiMmRcIjtcclxuICAgIENhbnZhc0NvbnRleHRbXCJ3ZWJnbFwiXSA9IFwid2ViZ2xcIjtcclxuICAgIENhbnZhc0NvbnRleHRbXCJ3ZWJnbEV4cGVyaW1lbnRhbFwiXSA9IFwid2ViZ2wtZXhwZXJpbWVudGFsXCI7XHJcbn0pKENhbnZhc0NvbnRleHQgfHwgKENhbnZhc0NvbnRleHQgPSB7fSkpO1xyXG5jbGFzcyBSZW5kZXJUYXJnZXQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVycywgbG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBwYXJhbWV0ZXJzO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmdldE5ld0NvbnRleHQoKTtcclxuICAgIH1cclxuICAgIGdldEFzcGVjdFJhdGlvKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcy5jbGllbnRXaWR0aCAvIHRoaXMuY2FudmFzLmNsaWVudEhlaWdodDtcclxuICAgIH1cclxuICAgIGdldENvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4O1xyXG4gICAgfVxyXG4gICAgZ2V0Q2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcztcclxuICAgIH1cclxuICAgIHJlc2l6ZShzY2FsZSA9IDEpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgcmVzaXplICR7dGhpcy5jYW52YXMuaWQgfHwgdGhpcy5jYW52YXMuY2xhc3NOYW1lfSB0byAke3NjYWxlfWApO1xyXG4gICAgICAgIC8vIGZpbmFsbHkgcXVlcnkgdGhlIHZhcmlvdXMgcGl4ZWwgcmF0aW9zXHJcbiAgICAgICAgY29uc3QgZGV2aWNlUGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XHJcbiAgICAgICAgY29uc3QgYmFja2luZ1N0b3JlUmF0aW8gPSB0aGlzLmN0eC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcclxuICAgICAgICAgICAgdGhpcy5jdHgubXNCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY3R4Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcclxuICAgICAgICBjb25zdCByYXRpbyA9IGRldmljZVBpeGVsUmF0aW8gLyBiYWNraW5nU3RvcmVSYXRpbztcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoICogc2NhbGU7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0ICogc2NhbGU7XHJcbiAgICAgICAgaWYgKGRldmljZVBpeGVsUmF0aW8gIT09IGJhY2tpbmdTdG9yZVJhdGlvIHx8IHNjYWxlICE9PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoICo9IHJhdGlvO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgKj0gcmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuY3R4ID0gdGhpcy5nZXROZXdDb250ZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUmVuZGVyVGFyZ2V0ID0gUmVuZGVyVGFyZ2V0O1xyXG5jbGFzcyBSZW5kZXJUYXJnZXQyRCBleHRlbmRzIFJlbmRlclRhcmdldCB7XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci52ZXJib3NlKGBjbGVhciByZW5kZXIgdGFyZ2V0ICR7dGhpcy5jYW52YXMuaWQgfHwgdGhpcy5jYW52YXMuY2xhc3NOYW1lfWApO1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIGdldENvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmdldENvbnRleHQoKTtcclxuICAgIH1cclxuICAgIGdldE5ld0NvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLmdldENvbnRleHQoQ2FudmFzQ29udGV4dC5iYXNpYyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5SZW5kZXJUYXJnZXQyRCA9IFJlbmRlclRhcmdldDJEO1xyXG5jbGFzcyBSZW5kZXJUYXJnZXRXZWJHTCBleHRlbmRzIFJlbmRlclRhcmdldCB7XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci52ZXJib3NlKGBjbGVhciByZW5kZXIgdGFyZ2V0ICR7dGhpcy5jYW52YXMuaWQgfHwgdGhpcy5jYW52YXMuY2xhc3NOYW1lfWApO1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyKHRoaXMuY3R4LkNPTE9SX0JVRkZFUl9CSVQpO1xyXG4gICAgfVxyXG4gICAgZ2V0Q29udGV4dCgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0Q29udGV4dCgpO1xyXG4gICAgfVxyXG4gICAgZ2V0TmV3Q29udGV4dCgpIHtcclxuICAgICAgICBjb25zdCBnbCA9ICh0aGlzLmNhbnZhcy5nZXRDb250ZXh0KENhbnZhc0NvbnRleHQud2ViZ2wpIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmdldENvbnRleHQoQ2FudmFzQ29udGV4dC53ZWJnbEV4cGVyaW1lbnRhbCkpO1xyXG4gICAgICAgIGdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIHJldHVybiBnbDtcclxuICAgIH1cclxuICAgIGlzV2ViR0xTdXBwb3J0ZWQoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICAgIHJldHVybiAhISh3aW5kb3cuV2ViR0xSZW5kaW5nQ29udGV4dCAmJiB0aGlzLmdldE5ld0NvbnRleHQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5SZW5kZXJUYXJnZXRXZWJHTCA9IFJlbmRlclRhcmdldFdlYkdMO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxyXG5jbGFzcyByZW5kZXJUYXJnZXRGYWN0b3J5IHtcclxuICAgIGV4ZWMobG9nZ2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIChjdG9yLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgY3RvcihvcHRpb25zLCBsb2dnZXIpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBfX3BhcmFtKDAsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULkxvZ2dlcikpLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbbG9nZ2VyX3NlcnZpY2VfMS5Mb2dnZXJdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIHJlbmRlclRhcmdldEZhY3RvcnkucHJvdG90eXBlLCBcImV4ZWNcIiwgbnVsbCk7XHJcbmV4cG9ydHMucmVuZGVyVGFyZ2V0RmFjdG9yeSA9IHJlbmRlclRhcmdldEZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlci10YXJnZXQuZmFjdG9yeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbmplY3Rvcl9wbHVzXzEgPSByZXF1aXJlKFwiLi9saWIvaW5qZWN0b3ItcGx1c1wiKTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbmNvbnN0IGxvZ2dlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9sb2dnZXIuc2VydmljZVwiKTtcclxuY29uc3QgcHVsc2FyX2xpYl8xID0gcmVxdWlyZShcInB1bHNhci1saWJcIik7XHJcbmNvbnN0IGJpbmRfZGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiYmluZC1kZWNvcmF0b3JcIik7XHJcbmNvbnN0IGFwcF9zdGF0ZV9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9hcHAtc3RhdGUuc2VydmljZVwiKTtcclxuLyoqXHJcbiAqIEV4ZWN1dGVzIGFuZCBtb25pdG9ycyB0aGUgZW5naW5lIGxvb3BcclxuICovXHJcbmxldCBTY2hlZHVsZXIgPSBjbGFzcyBTY2hlZHVsZXIge1xyXG4gICAgY29uc3RydWN0b3IobWF4RnJhbWVSYXRlLCBhcHBTdGF0ZSwgbG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5tYXhGcmFtZVJhdGUgPSBtYXhGcmFtZVJhdGU7XHJcbiAgICAgICAgdGhpcy5hcHBTdGF0ZSA9IGFwcFN0YXRlO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gQ3VycmVudCBGcmFtZXMgUGVyIFNlY29uZCAqL1xyXG4gICAgICAgIHRoaXMuZnBzID0gMDtcclxuICAgICAgICAvKiogQGRlc2NyaXB0aW9uIHRpbWVzdGFtcCBvZiBsYXN0IEZQUyBkb1VwZGF0ZSAqL1xyXG4gICAgICAgIHRoaXMubGFzdEZQU1VwZGF0ZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiBmcmFtZXMgZXhlY3V0ZWQgaW4gbGFzdCBzZWNvbmQgKi9cclxuICAgICAgICB0aGlzLmZyYW1lc1RoaXNTZWNvbmQgPSAwO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gc3VzcGVuZCBtYWluIGxvb3AgaWYgdGhlIHdpbmRvdyBsb3NlcyBmb2N1cyAqL1xyXG4gICAgICAgIHRoaXMuc3VzcGVuZE9uQmx1ciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gdGltZXN0YW1wIHdoZW4gZmlyc3QgZnJhbWUgZXhlY3V0ZWQgKi9cclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiBtaWxsaXNlY29uZHMgc2luY2UgZG9VcGRhdGUgbG9vcCB3YXMgcnVuICovXHJcbiAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSAwO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gIG1pbGxpc2Vjb25kcyBzaW5jZSBsYXN0IGZyYW1lICovXHJcbiAgICAgICAgdGhpcy5lbGFwc2VkVGltZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiB0aW1lc3RhbXAgb2YgdGhlIGxhc3QgZnJhbWUgKi9cclxuICAgICAgICB0aGlzLmxhc3RGcmFtZVRpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMudXBkYXRlT3BlcmF0aW9ucyA9IG5ldyBwdWxzYXJfbGliXzEuUHJpb3JpdHlRdWV1ZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0NvbW1hbmRzID0gbmV3IHB1bHNhcl9saWJfMS5Qcmlvcml0eVF1ZXVlKCk7XHJcbiAgICAgICAgdGhpcy5wb3N0RHJhd0NvbW1hbmRzID0gbmV3IHB1bHNhcl9saWJfMS5Qcmlvcml0eVF1ZXVlKCk7XHJcbiAgICAgICAgdGhpcy50aW1lc3RlcCA9IDEwMDAgLyB0aGlzLm1heEZyYW1lUmF0ZTtcclxuICAgICAgICB0aGlzLmZwcyA9IHRoaXMubWF4RnJhbWVSYXRlO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5zdXNwZW5kKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzY2hlZHVsZUNvbW1hbmQoY29tbWFuZCwgcHJpb3JpdHksIHF1ZXVlKSB7XHJcbiAgICAgICAgaWYgKGNvbW1hbmQgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XHJcbiAgICAgICAgICAgIHF1ZXVlLmVucXVldWUocHJpb3JpdHksIGNvbW1hbmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT3BlcmF0aW9uIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYXZlcmFnZSBGcmFtZXMgZXhlY3V0ZWQgcGVyIHNlY29uZCBvdmVyIHRoZSBsYXN0XHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGdldCBGUFMoKSB7IHJldHVybiB0aGlzLmZwczsgfVxyXG4gICAgc3VzcGVuZChlKSB7XHJcbiAgICAgICAgaWYgKCEoZSAmJiBlLnR5cGUgPT09ICdibHVyJyAmJiB0aGlzLnN1c3BlbmRPbkJsdXIgPT09IGZhbHNlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0YXRlLnNldFN0YXRlKGFwcF9zdGF0ZV9zZXJ2aWNlXzEuQXBwU3RhdGUuU3VzcGVuZGVkKTtcclxuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XHJcbiAgICAgICAgICAgIC8vICRyb290U2NvcGUuJGV2YWxBc3luYygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlc3VtZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5hcHBTdGF0ZS5pcyhhcHBfc3RhdGVfc2VydmljZV8xLkFwcFN0YXRlLlN1c3BlbmRlZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydE1haW5Mb29wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBtYWluIGFwcCBsb29wXHJcbiAgICAgKi9cclxuICAgIHN0YXJ0TWFpbkxvb3AoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xyXG4gICAgICAgIHRoaXMubGFzdEZyYW1lVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLm1haW5Mb29wKTtcclxuICAgICAgICB0aGlzLmFwcFN0YXRlLnNldFN0YXRlKGFwcF9zdGF0ZV9zZXJ2aWNlXzEuQXBwU3RhdGUuUnVubmluZyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNjaGVkdWxlIGFuIGRvVXBkYXRlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWQgZWFjaCBmcmFtZVxyXG4gICAgICogQHBhcmFtIG9wZXJhdGlvblxyXG4gICAgICogQHBhcmFtIG9yZGVyXHJcbiAgICAgKi9cclxuICAgIHNjaGVkdWxlKG9wZXJhdGlvbiwgb3JkZXIpIHtcclxuICAgICAgICBTY2hlZHVsZXIuc2NoZWR1bGVDb21tYW5kKG9wZXJhdGlvbiwgb3JkZXIsIHRoaXMudXBkYXRlT3BlcmF0aW9ucyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFF1ZXVlIGEgZHJhdyBvcGVhcnRpb24gdG8gYmUgZXhlY3V0ZWQgb25jZSBhbmQgZGlzY2FyZGVkXHJcbiAgICAgKiBAcGFyYW0gb3BlcmF0aW9uXHJcbiAgICAgKiBAcGFyYW0gekluZGV4XHJcbiAgICAgKi9cclxuICAgIGRyYXcob3BlcmF0aW9uLCB6SW5kZXgpIHtcclxuICAgICAgICBTY2hlZHVsZXIuc2NoZWR1bGVDb21tYW5kKG9wZXJhdGlvbiwgekluZGV4LCB0aGlzLmRyYXdDb21tYW5kcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgc2V0IG9mIHJlZ2lzdGVyZWQgZG9VcGRhdGUgb3BlcmF0aW9uc1xyXG4gICAgICovXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU9wZXJhdGlvbnMuY2xlYXIoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVG9nZ2xlcyBzdXNwZW5zaW9uIG9mIHRoZSBtYWluIGxvb3Agd2hlbiB0aGUgd2luZG93IGlzIGJsdXJyZWRcclxuICAgICAqIEBwYXJhbSBmbGFnXHJcbiAgICAgKi9cclxuICAgIHNldFN1c3BlbmRPbkJsdXIoZmxhZykge1xyXG4gICAgICAgIHRoaXMuc3VzcGVuZE9uQmx1ciA9IHR5cGVvZiBmbGFnICE9PSAndW5kZWZpbmVkJyA/IGZsYWcgOiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIGFsbCBkb1VwZGF0ZSBvcGVhcnRpb25zIHdoaWxlIHByZXNlcnZpbmcgdGhlIGRvVXBkYXRlIHF1ZXVlXHJcbiAgICAgKiBAcGFyYW0gc3RlcERlbHRhVGltZSAoaW4gbWlsbGlzZWNvbmRzKVxyXG4gICAgICogQHBhcmFtIHRvdGFsRWxhcHNlZFRpbWUgKGluIG1pbGxpc2Vjb25kcylcclxuICAgICAqL1xyXG4gICAgZG9VcGRhdGUoc3RlcERlbHRhVGltZSwgdG90YWxFbGFwc2VkVGltZSkge1xyXG4gICAgICAgIC8vIHJlc2V0IGRyYXcgY29tbWFuZHMgdG8gcHJldmVudCBkdXBsaWNhdGUgZnJhbWVzIGJlaW5nIHJlbmRlcmVkXHJcbiAgICAgICAgdGhpcy5kcmF3Q29tbWFuZHMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnBvc3REcmF3Q29tbWFuZHMuY2xlYXIoKTtcclxuICAgICAgICBjb25zdCBvcHNJdGVyYXRvciA9IHRoaXMudXBkYXRlT3BlcmF0aW9ucy5nZXRJdGVyYXRvcigpO1xyXG4gICAgICAgIHdoaWxlICghb3BzSXRlcmF0b3IuaXNFbmQoKSkge1xyXG4gICAgICAgICAgICBvcHNJdGVyYXRvci5uZXh0KCkuY2FsbChudWxsLCBzdGVwRGVsdGFUaW1lLCB0b3RhbEVsYXBzZWRUaW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVGhlcmUgbWlnaHQgYmUgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMsIGJ1dCBub3QgcmVhbGx5IHNsb3dpbmcgdGhpbmdzIGRvd24gcmlnaHQgbm93XHJcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTsgbWlnaHQgbm90IGJlIG5lY2Vzc2FyeSB3aXRoICRjdHJsIGFyY2hpdGVjdHVyZVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIGFsbCBkcmF3IGFuZCBwb3N0LWRyYXcgY29tbWFuZHMsIGVtcHR5aW5nIGVhY2ggcXVldWVcclxuICAgICAqIEBwYXJhbSBzdGVwRGVsdGFUaW1lXHJcbiAgICAgKiBAcGFyYW0gdG90YWxFbGFwc2VkVGltZVxyXG4gICAgICovXHJcbiAgICBkb0RyYXcoc3RlcERlbHRhVGltZSwgdG90YWxFbGFwc2VkVGltZSkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLmRyYXdDb21tYW5kcy5wZWVrKCkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Q29tbWFuZHMuZGVxdWV1ZSgpLmNhbGwobnVsbCwgc3RlcERlbHRhVGltZSwgdG90YWxFbGFwc2VkVGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlICh0aGlzLnBvc3REcmF3Q29tbWFuZHMucGVlaygpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zdERyYXdDb21tYW5kcy5kZXF1ZXVlKCkuY2FsbChudWxsLCBzdGVwRGVsdGFUaW1lLCB0b3RhbEVsYXBzZWRUaW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgRlBTIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0gdG90YWxFbGFwc2VkVGltZVxyXG4gICAgICovXHJcbiAgICB1cGRhdGVGUFModG90YWxFbGFwc2VkVGltZSkge1xyXG4gICAgICAgIHRoaXMuZnJhbWVzVGhpc1NlY29uZCsrO1xyXG4gICAgICAgIGlmICh0b3RhbEVsYXBzZWRUaW1lID4gdGhpcy5sYXN0RlBTVXBkYXRlICsgMTAwMCkge1xyXG4gICAgICAgICAgICBjb25zdCB3ZWlnaHRGYWN0b3IgPSAwLjI1O1xyXG4gICAgICAgICAgICB0aGlzLmZwcyA9ICh3ZWlnaHRGYWN0b3IgKiB0aGlzLmZyYW1lc1RoaXNTZWNvbmQpICsgKCgxIC0gd2VpZ2h0RmFjdG9yKSAqIHRoaXMuZnBzKTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0RlBTVXBkYXRlID0gdG90YWxFbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZXNUaGlzU2Vjb25kID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERlcml2ZWQgRnJvbVxyXG4gICAgICogSXNhYWMgU3VraW5cclxuICAgICAqIGh0dHA6Ly93d3cuaXNhYWNzdWtpbi5jb20vbmV3cy8yMDE1LzAxL2RldGFpbGVkLWV4cGxhbmF0aW9uLWphdmFzY3JpcHQtZ2FtZS1sb29wcy1hbmQtdGltaW5nXHJcbiAgICAgKi9cclxuICAgIG1haW5Mb29wKCkge1xyXG4gICAgICAgIGNvbnN0IGZyYW1lVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpOyAvLyB0aGlzIGluIG1pY3Jvc2Vjb25kcywgMXMgPSAxLDAwMCwwMDAgbWljcm9zZWNvbmRzXHJcbiAgICAgICAgdGhpcy5kZWx0YVRpbWUgKz0gZnJhbWVUaW1lIC0gdGhpcy5sYXN0RnJhbWVUaW1lO1xyXG4gICAgICAgIHRoaXMubGFzdEZyYW1lVGltZSA9IGZyYW1lVGltZTtcclxuICAgICAgICB0aGlzLmVsYXBzZWRUaW1lID0gZnJhbWVUaW1lIC0gdGhpcy5zdGFydFRpbWU7XHJcbiAgICAgICAgY29uc3QgZWxhcHNlZE1zID0gKHRoaXMuZWxhcHNlZFRpbWUgLyAxMDAwKSB8IDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGVGUFMoZWxhcHNlZE1zKTtcclxuICAgICAgICBsZXQgdXBkYXRlU3RlcHMgPSAwO1xyXG4gICAgICAgIGNvbnN0IGZyYW1lRGVsdGFUaW1lID0gdGhpcy5kZWx0YVRpbWU7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuZGVsdGFUaW1lID4gdGhpcy50aW1lc3RlcCkge1xyXG4gICAgICAgICAgICB0aGlzLmRvVXBkYXRlKCh0aGlzLnRpbWVzdGVwIC8gMTAwMCkgfCAwLCBlbGFwc2VkTXMpO1xyXG4gICAgICAgICAgICB0aGlzLmRlbHRhVGltZSAtPSB0aGlzLnRpbWVzdGVwO1xyXG4gICAgICAgICAgICBjb25zdCBtYXhDb25zZWNTdGVwcyA9IDI0MDtcclxuICAgICAgICAgICAgaWYgKCsrdXBkYXRlU3RlcHMgPiBtYXhDb25zZWNTdGVwcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybihgVXBkYXRlIExvb3AgRXhjZWVkZWQgJHttYXhDb25zZWNTdGVwc30gQ2FsbHNgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsdGFUaW1lID0gMDsgLy8gZG9uJ3QgZG8gYSBzaWxseSAjIG9mIHVwZGF0ZXNcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZG9EcmF3KGZyYW1lRGVsdGFUaW1lLCB0aGlzLmVsYXBzZWRUaW1lKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubWFpbkxvb3ApO1xyXG4gICAgfVxyXG59O1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW0V2ZW50XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBTY2hlZHVsZXIucHJvdG90eXBlLCBcInN1c3BlbmRcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgYmluZF9kZWNvcmF0b3JfMS5kZWZhdWx0LFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBTY2hlZHVsZXIucHJvdG90eXBlLCBcInJlc3VtZVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIFNjaGVkdWxlci5wcm90b3R5cGUsIFwibWFpbkxvb3BcIiwgbnVsbCk7XHJcblNjaGVkdWxlciA9IF9fZGVjb3JhdGUoW1xyXG4gICAgX19wYXJhbSgwLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5jb25zdC5NYXhGcmFtZVJhdGUpKSxcclxuICAgIF9fcGFyYW0oMSwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuQXBwU3RhdGUpKSxcclxuICAgIF9fcGFyYW0oMiwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuTG9nZ2VyKSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW051bWJlciwgYXBwX3N0YXRlX3NlcnZpY2VfMS5BcHBTdGF0ZSxcclxuICAgICAgICBsb2dnZXJfc2VydmljZV8xLkxvZ2dlcl0pXHJcbl0sIFNjaGVkdWxlcik7XHJcbmV4cG9ydHMuU2NoZWR1bGVyID0gU2NoZWR1bGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZXIuc2VydmljZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB3ZWJnbF9yZXNvdXJjZV8xID0gcmVxdWlyZShcIi4vd2ViZ2wtcmVzb3VyY2VcIik7XHJcbmNvbnN0IHNoYWRlcl8xID0gcmVxdWlyZShcIi4vc2hhZGVyXCIpO1xyXG5jb25zdCBieXRlU2l6ZXMgPSB7XHJcbiAgICBbc2hhZGVyXzEuR0xEYXRhVHlwZS5CWVRFXTogMSxcclxuICAgIFtzaGFkZXJfMS5HTERhdGFUeXBlLlVOU0lHTkVEX1NIT1JUXTogMixcclxuICAgIFtzaGFkZXJfMS5HTERhdGFUeXBlLkZMT0FUXTogNCxcclxuICAgIFtzaGFkZXJfMS5HTERhdGFUeXBlLlNIT1JUXTogMixcclxuICAgIFtzaGFkZXJfMS5HTERhdGFUeXBlLlVOU0lHTkVEX0JZVEVdOiAxLFxyXG4gICAgW3NoYWRlcl8xLkdMRGF0YVR5cGUuSEFMRl9GTE9BVF06IDIsXHJcbn07XHJcbmNsYXNzIEJ1ZmZlckZvcm1hdCBleHRlbmRzIHdlYmdsX3Jlc291cmNlXzEuV2ViR0xSZXNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLmFwcGx5ID0gdGhpcy5jcmVhdGVMYXlvdXREZXNjcmlwdGlvbihvcHRpb25zLnNoYWRlclNwZWMuYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcbiAgICAvLyBwdWJsaWMgdXBkYXRlQnVmZmVyKGRhdGE6IEFycmF5QnVmZmVyIHwgQXJyYXlCdWZmZXJWaWV3LCBvZmZzZXQ6IG51bWJlciA9IDApIHtcclxuICAgIC8vICAgICBjb25zdCB7Z2x9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgLy8gICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnZibyk7XHJcbiAgICAvLyAgICAgZ2wuYnVmZmVyU3ViRGF0YShnbC5BUlJBWV9CVUZGRVIsIG9mZnNldCwgZGF0YSk7XHJcbiAgICAvLyB9XHJcbiAgICByZWxlYXNlKCkge1xyXG4gICAgICAgIC8vIG5vLW9wXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBhIGxheW91dCBtZXRob2QgZm9yIHRoZSBidWZmZXIgd2l0aCBib3VuZCBkYXRhIHRvIG9wdGltaXplIGZvciBwZXJmb3JtYW5jZVxyXG4gICAgICogQHBhcmFtIHtJQXR0cmliRGVzY3JpcHRpb25bXX0gYXR0cmlic1xyXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVMYXlvdXREZXNjcmlwdGlvbihhdHRyaWJzKSB7XHJcbiAgICAgICAgY29uc3QgeyBnbCwgcHJvZ3JhbSB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGNvbnN0IHZlcnRleFNpemUgPSBhdHRyaWJzLnJlZHVjZSgodG90YWwsIGF0dHJpYikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdG90YWwgKyBieXRlU2l6ZXNbYXR0cmliLnR5cGVdICogYXR0cmliLnNpemUgfCAwO1xyXG4gICAgICAgIH0sIDApO1xyXG4gICAgICAgIC8vIGNvbGxlY3Rpb24gb2YgZnVuY3Rpb25zIHdpdGggYm91bmQgZGF0YVxyXG4gICAgICAgIGNvbnN0IGxheW91dE9wcyA9IFtdO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG4gICAgICAgIGF0dHJpYnMuZm9yRWFjaCgoYXR0cmliKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgcG9zaXRpb24gb2YgdGhlIGF0dHJpYnV0ZSBpbiB0aGUgdmVydGV4IHNoYWRlciwgd2UgY2FuIGVpdGhlciByZXRyaWV2ZSBmcm9tIHRoZSBzaGFkZXJcclxuICAgICAgICAgICAgLy8gb3IgZm9yY2UgdGhlIHNoYWRlciB0byB1c2UgYSBnaXZlbiBwb3NpdGlvbiB3aXRoIGJpbmRBdHRyaWJMb2NhdGlvblxyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIGF0dHJpYi5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5kZWJ1ZyhgU2tpcHBpbmcgbGF5b3V0IG9mICR7YXR0cmliLm5hbWV9LCB1bnVzZWQgaW4gc2hhZGVyIHByb2dyYW1gKTtcclxuICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlIHRoZSBvZmZzZXQgZm9yIHRoZSBuZXh0IGF0dHJpYlxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IGJ5dGVTaXplc1thdHRyaWIudHlwZV0gKiBhdHRyaWIuc2l6ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBkZXNjcmliZSB0aGUgYXR0cmlidXRlIGluIHRoZSBidWZmZXJcclxuICAgICAgICAgICAgbGF5b3V0T3BzLnB1c2goZ2wudmVydGV4QXR0cmliUG9pbnRlci5iaW5kKGdsLCBpbmRleCwgYXR0cmliLnNpemUgfHwgMCwgZ2xbYXR0cmliLnR5cGVdLCBhdHRyaWIubm9ybWFsaXplIHx8IGZhbHNlLCB2ZXJ0ZXhTaXplLCBvZmZzZXQpKTtcclxuICAgICAgICAgICAgLy8gdHVybiBvbiB0aGUgYXR0cmlidXRlIGF0IHRoaXMgaW5kZXhcclxuICAgICAgICAgICAgbGF5b3V0T3BzLnB1c2goZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkuYmluZChnbCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgLy8gc3dpdGNoaW5nIHRvIGJpbmQgYXR0cmliIGxvY2F0aW9uIG1heSBpbXByb3ZlIHBlcmZvcm1hbmNlIGlmIDAgaW5kZXggaXMgdW51c2VkXHJcbiAgICAgICAgICAgIC8vIGdsLmJpbmRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCBpbmRleCwgYXR0cmliLm5hbWUpOyAvLyBjb25uZWN0IGF0dHJpYnV0ZSB0byB2ZXJ0ZXggc2hhZGVyXHJcbiAgICAgICAgICAgIC8vIGluY3JlYXNlIHRoZSBvZmZzZXQgZm9yIHRoZSBuZXh0IGF0dHJpYlxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gYnl0ZVNpemVzW2F0dHJpYi50eXBlXSAqIGF0dHJpYi5zaXplO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5sb2dnZXIuZGVidWcoYENyZWF0ZWQgYnVmZmVyIGxheW91dCBmdW5jdGlvbmAsIGxheW91dE9wcyk7XHJcbiAgICAgICAgcmV0dXJuICgoKSA9PiBsYXlvdXRPcHMuZm9yRWFjaCgoZikgPT4gZigpKSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5CdWZmZXJGb3JtYXQgPSBCdWZmZXJGb3JtYXQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1ZmZlci1mb3JtYXQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX21ldGFkYXRhID0gKHRoaXMgJiYgdGhpcy5fX21ldGFkYXRhKSB8fCBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGVudGl0eV8xID0gcmVxdWlyZShcIi4uL2dlb21ldHJ5L2VudGl0eVwiKTtcclxuY29uc3Qgd2ViZ2xfcmVzb3VyY2VfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLXJlc291cmNlXCIpO1xyXG5jb25zdCBiaW5kX2RlY29yYXRvcl8xID0gcmVxdWlyZShcImJpbmQtZGVjb3JhdG9yXCIpO1xyXG5jbGFzcyBSZW5kZXJlciBleHRlbmRzIHdlYmdsX3Jlc291cmNlXzEuV2ViR0xSZXNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9ncmFtID0gbnVsbDtcclxuICAgICAgICB0aGlzLmFjdGl2ZUNhbWVyYSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVQcm9ncmFtKG9wdGlvbnMucHJvZ3JhbSk7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVDYW1lcmEob3B0aW9ucy5jYW1lcmEpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBlbnRpdHlfMS5FbnRpdHkuZ2V0SW5kZXgoKTtcclxuICAgIH1cclxuICAgIHJlbmRlclNjZW5lKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnNldFZpZXdNYXRyaXgoZmFsc2UsIHRoaXMuYWN0aXZlQ2FtZXJhLmdldFZpZXdNYXRyaXgoKSk7XHJcbiAgICAgICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLmVudGl0aWVzO1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IGVudGl0aWVzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCByZW5kZXIgPSB0aGlzLnJlbmRlckVudGl0eTtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgcmVuZGVyKGVudGl0aWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXJFbnRpdHkoZW50aXR5KSB7XHJcbiAgICAgICAgY29uc3QgeyBnbCB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGNvbnN0IG1lc2ggPSBlbnRpdHkuZ2V0TWVzaCgpO1xyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYwNzcwMDIvdXNpbmctd2ViZ2wtaW5kZXgtYnVmZmVycy1mb3ItZHJhd2luZy1tZXNoZXNcclxuICAgICAgICAvLyBnZXQgdGhlIHZlcnRleCBidWZmZXIgZnJvbSB0aGUgbWVzaCAmIHNlbmQgdGhlIHZlcnRleCBidWZmZXIgdG8gdGhlIEdQVVxyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBtZXNoLmdldFZlcnRleEJ1ZmZlcigpKTtcclxuICAgICAgICAvLyB1c2UgcHJvZ3JhbSAmIGVuYWJsZSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9ncmFtLnVzZSgpO1xyXG4gICAgICAgIC8vIHNlbmQgaW5kZXggYnVmZmVyIHRvIHRoZSBHUFVcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBtZXNoLmdldEluZGV4QnVmZmVyKCkpO1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IGVudGl0eS5nZXRUcmFuc2Zvcm0oKS5nZXRNYXRyaXgoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRyaXgpO1xyXG4gICAgICAgIHRoaXMuc2V0V29ybGRNYXRyaXgoZmFsc2UsIG1hdHJpeCk7XHJcbiAgICAgICAgLy8gcGVyZm9ybSB0aGUgZHJhdyBjYWxsXHJcbiAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsLlRSSUFOR0xFUywgbWVzaC5nZXRWZXJ0ZXhDb3VudCgpLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmVDYW1lcmEoY2FtZXJhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlUHJvZ3JhbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZXQgYWN0aXZlIGNhbWVyYSB3aXRob3V0IGFjdGl2ZSBwcm9ncmFtIHNldC4gQ2FsbCBzZXRBY3RpdmVQcm9ncmFtLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFjdGl2ZUNhbWVyYSA9IGNhbWVyYTtcclxuICAgICAgICAvLyB0aGlzIHdpbGwgaGF2ZSB0byBtb3ZlIHRvIGRvIHpvb21pbmcgb3Igc2ltaWxhclxyXG4gICAgICAgIHRoaXMuc2V0UHJvamVjdGlvbk1hdHJpeChmYWxzZSwgY2FtZXJhLmdldFByb2plY3Rpb25NYXRyaXgoKSk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmVQcm9ncmFtKHByb2dyYW0pIHtcclxuICAgICAgICBpZiAoIXByb2dyYW0pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdBY3RpdmUgcHJvZ3JhbSBjYW5ub3QgYmUgbnVsbCBvciB1bmRlZmluZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9ncmFtID0gcHJvZ3JhbTtcclxuICAgICAgICB0aGlzLnNldFZpZXdNYXRyaXggPSB0aGlzLmFjdGl2ZVByb2dyYW0uZ2V0VW5pZm9ybVNldHRlcigndmlldycpO1xyXG4gICAgICAgIHRoaXMuc2V0V29ybGRNYXRyaXggPSB0aGlzLmFjdGl2ZVByb2dyYW0uZ2V0VW5pZm9ybVNldHRlcignd29ybGQnKTtcclxuICAgICAgICB0aGlzLnNldFByb2plY3Rpb25NYXRyaXggPSB0aGlzLmFjdGl2ZVByb2dyYW0uZ2V0VW5pZm9ybVNldHRlcigncHJvamVjdGlvbicpO1xyXG4gICAgICAgIC8vIFRPRE86IHNvbWV0aGluZyBiZXR0ZXIgd2l0aCB0aGlzXHJcbiAgICAgICAgLy8gdGhpcy5hY3RpdmVQcm9ncmFtLmdldFVuaWZvcm1TZXR0ZXIoJ2xpZ2h0LmFtYmllbnRDb2xvcicpKDAuMSwgMC4xLCAwLjEsIDEuMCk7XHJcbiAgICAgICAgLy8gdGhpcy5hY3RpdmVQcm9ncmFtLmdldFVuaWZvcm1TZXR0ZXIoJ2xpZ2h0LmRpZmZ1c2VDb2xvcicpKDAuOCwgMC44LCAwLjgsIDEuMCk7XHJcbiAgICAgICAgLy8gdGhpcy5hY3RpdmVQcm9ncmFtLmdldFVuaWZvcm1TZXR0ZXIoJ2xpZ2h0LmRpcmVjdGlvbicpKC0xLCAwLCAwKTtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDYW1lcmEgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRQcm9qZWN0aW9uTWF0cml4KGZhbHNlLCB0aGlzLmFjdGl2ZUNhbWVyYS5nZXRQcm9qZWN0aW9uTWF0cml4KCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyKGNvbG9yID0gWzAsIDAsIDAsIDFdKSB7XHJcbiAgICAgICAgY29uc3QgeyBnbCB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoMC4zMywgMC4zMywgMC4zMywgMSk7XHJcbiAgICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbiAgICB9XHJcbiAgICByZWxlYXNlKCkge1xyXG4gICAgICAgIC8vIG5vb3BcclxuICAgIH1cclxufVxyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgUmVuZGVyZXIucHJvdG90eXBlLCBcInJlbmRlclNjZW5lXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgUmVuZGVyZXIucHJvdG90eXBlLCBcInJlbmRlckVudGl0eVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtBcnJheV0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgUmVuZGVyZXIucHJvdG90eXBlLCBcImNsZWFyXCIsIG51bGwpO1xyXG5leHBvcnRzLlJlbmRlcmVyID0gUmVuZGVyZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlcmVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBzaGFkZXJfMSA9IHJlcXVpcmUoXCIuL3NoYWRlclwiKTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY29uc3Qgd2ViZ2xfcmVzb3VyY2VfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLXJlc291cmNlXCIpO1xyXG5jb25zdCBidWZmZXJfZm9ybWF0XzEgPSByZXF1aXJlKFwiLi9idWZmZXItZm9ybWF0XCIpO1xyXG5jb25zdCBsaWJyYXJ5X3Byb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vbGlicmFyeS5wcm92aWRlclwiKTtcclxuY2xhc3MgUHJvZ3JhbU9wdGlvbnNEVE8gZXh0ZW5kcyBsaWJyYXJ5X3Byb3ZpZGVyXzEuRFRPIHtcclxufVxyXG5leHBvcnRzLlByb2dyYW1PcHRpb25zRFRPID0gUHJvZ3JhbU9wdGlvbnNEVE87XHJcbmNsYXNzIFNoYWRlclByb2dyYW0gZXh0ZW5kcyB3ZWJnbF9yZXNvdXJjZV8xLldlYkdMUmVzb3VyY2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCwgY29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLmNvbnRleHQucHJvZ3JhbSA9IGNvbnRleHQuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgICAgIGNvbnN0IHsgZ2wsIHByb2dyYW0sIGxvZ2dlciB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IHRoaXMuY3JlYXRlU2hhZGVyKGNvbmZpZy5zaGFkZXJzLnZlcnRleCk7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoYWRlci5nZXRTaGFkZXIoKSk7XHJcbiAgICAgICAgdmVydGV4U2hhZGVyLnJlbGVhc2UoKTtcclxuICAgICAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IHRoaXMuY3JlYXRlU2hhZGVyKGNvbmZpZy5zaGFkZXJzLmZyYWdtZW50KTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIuZ2V0U2hhZGVyKCkpO1xyXG4gICAgICAgIGZyYWdtZW50U2hhZGVyLnJlbGVhc2UoKTtcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyk7XHJcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbTogJHtnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTsgLy8gcmV0cmlldmUgYW5kIHN0b3JlIHByb2dyYW0gdmFyaWFibGUgaW5mb3JtYXRpb25cclxuICAgICAgICB0aGlzLmJ1ZmZlckZvcm1hdCA9IG5ldyBidWZmZXJfZm9ybWF0XzEuQnVmZmVyRm9ybWF0KHRoaXMuY29udGV4dCwgeyBzaGFkZXJTcGVjOiBjb25maWcuc2hhZGVycy52ZXJ0ZXguc3BlYyB9KTtcclxuICAgICAgICB0aGlzLnVuaWZvcm1zID0ge307XHJcbiAgICAgICAgdGhpcy5jYWNoZVVuaWZvcm1zKFtcclxuICAgICAgICAgICAgY29uZmlnLnNoYWRlcnMudmVydGV4LnNwZWMudW5pZm9ybXMgfHwge30sXHJcbiAgICAgICAgICAgIGNvbmZpZy5zaGFkZXJzLmZyYWdtZW50LnNwZWMudW5pZm9ybXMgfHwge31cclxuICAgICAgICBdKTtcclxuICAgIH1cclxuICAgIGdldFVuaWZvcm1TZXR0ZXIobmFtZSkge1xyXG4gICAgICAgIGNvbnN0IHsgZ2wgfSA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBjb25zdCB1bmlmb3JtID0gdGhpcy51bmlmb3Jtc1tuYW1lXTtcclxuICAgICAgICByZXR1cm4gZ2xbdW5pZm9ybS50eXBlXS5iaW5kKGdsLCB1bmlmb3JtLmxvY2F0aW9uKTtcclxuICAgIH1cclxuICAgIHVzZSgpIHtcclxuICAgICAgICBjb25zdCB7IGdsLCBwcm9ncmFtIH0gPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlckZvcm1hdC5hcHBseSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0R0xQcm9ncmFtKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQucHJvZ3JhbTtcclxuICAgIH1cclxuICAgIHJlbGVhc2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBnbCwgcHJvZ3JhbSB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVTaGFkZXIoY29uZmlnKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBzaGFkZXJfMS5TaGFkZXIodGhpcy5jb250ZXh0LCBjb25maWcpO1xyXG4gICAgfVxyXG4gICAgY2FjaGVVbmlmb3JtcyhzcGVjKSB7XHJcbiAgICAgICAgY29uc3QgeyBwcm9ncmFtLCBnbCB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHNwZWMuZm9yRWFjaCgodW5pZm9ybXMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mbGF0dGVuVW5pZm9ybXModW5pZm9ybXMpLmZvckVhY2goKG5hbWVQY3MpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lUGNzLmpvaW4oJy4nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZ2V0VW5pZm9ybVR5cGUodW5pZm9ybXMsIG5hbWVQY3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmxvZ2dlci5kZWJ1ZyhgQ2FjaGluZyB1bmlmb3JtICR7bmFtZX0gKCR7dHlwZX0pIGF0IGxvY2F0aW9uICR7bG9jYXRpb259YCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuaWZvcm1zW25hbWVdID0geyBuYW1lLCBsb2NhdGlvbiwgdHlwZSB9O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZsYXR0ZW5Vbmlmb3JtcyhzdHJ1Y3QsIGtleXMgPSBbXSwgcGllY2VzID0gW10pIHtcclxuICAgICAgICBpZiAoIXN0cnVjdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwaWVjZXMubGVuZ3RoID4gNSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmlmb3JtIHN0cnVjdHMgd2l0aCBtb3JlIHRoYW4gNSBsZXZlbHMgYXJlIG5vdCBzdXBwb3J0ZWQsIHlvdXIgc3RydWN0IG9iamVjdCBtYXkgaGF2ZSBjeWNsZXMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmtleXMoc3RydWN0KS5mb3JFYWNoKChwcm9wKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBzdHJ1Y3RbcHJvcF07XHJcbiAgICAgICAgICAgIC8vIFR5cGUgLT4gbmV3IGtleSBhcnJheVxyXG4gICAgICAgICAgICBpZiAoc2hhZGVyXzEuR0xVbmlmb3JtVHlwZVt0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKFsuLi5waWVjZXMsIHByb3BdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxhdHRlblVuaWZvcm1zKHR5cGUsIGtleXMsIFsuLi5waWVjZXMsIHByb3BdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBrZXlzO1xyXG4gICAgfVxyXG4gICAgZ2V0VW5pZm9ybVR5cGUodW5pZm9ybSwgbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lLnJlZHVjZSgoc3RydWN0LCBwcm9wKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJ1Y3RbcHJvcF07XHJcbiAgICAgICAgfSwgdW5pZm9ybSk7XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBPYmplY3QpXHJcbl0sIFNoYWRlclByb2dyYW0ucHJvdG90eXBlLCBcImNyZWF0ZVNoYWRlclwiLCBudWxsKTtcclxuZXhwb3J0cy5TaGFkZXJQcm9ncmFtID0gU2hhZGVyUHJvZ3JhbTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2hhZGVyLXByb2dyYW0uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3Qgd2ViZ2xfcmVzb3VyY2VfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLXJlc291cmNlXCIpO1xyXG5jb25zdCBsaWJyYXJ5X3Byb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vbGlicmFyeS5wcm92aWRlclwiKTtcclxudmFyIEdMRGF0YVR5cGU7XHJcbihmdW5jdGlvbiAoR0xEYXRhVHlwZSkge1xyXG4gICAgR0xEYXRhVHlwZVtcIkJZVEVcIl0gPSBcIkJZVEVcIjtcclxuICAgIEdMRGF0YVR5cGVbXCJGTE9BVFwiXSA9IFwiRkxPQVRcIjtcclxuICAgIEdMRGF0YVR5cGVbXCJTSE9SVFwiXSA9IFwiU0hPUlRcIjtcclxuICAgIEdMRGF0YVR5cGVbXCJVTlNJR05FRF9TSE9SVFwiXSA9IFwiVU5TSUdORURfU0hPUlRcIjtcclxuICAgIEdMRGF0YVR5cGVbXCJVTlNJR05FRF9CWVRFXCJdID0gXCJVTlNJR05FRF9CWVRFXCI7XHJcbiAgICBHTERhdGFUeXBlW1wiSEFMRl9GTE9BVFwiXSA9IFwiSEFMRl9GTE9BVFwiO1xyXG59KShHTERhdGFUeXBlID0gZXhwb3J0cy5HTERhdGFUeXBlIHx8IChleHBvcnRzLkdMRGF0YVR5cGUgPSB7fSkpO1xyXG52YXIgR0xVbmlmb3JtVHlwZTtcclxuKGZ1bmN0aW9uIChHTFVuaWZvcm1UeXBlKSB7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTFmXCJdID0gXCJ1bmlmb3JtMWZcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtMWZ2XCJdID0gXCJ1bmlmb3JtMWZ2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTJmXCJdID0gXCJ1bmlmb3JtMmZcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtMmZ2XCJdID0gXCJ1bmlmb3JtMmZ2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTNmXCJdID0gXCJ1bmlmb3JtM2ZcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtM2Z2XCJdID0gXCJ1bmlmb3JtM2Z2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTRmXCJdID0gXCJ1bmlmb3JtNGZcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtNGZ2XCJdID0gXCJ1bmlmb3JtNGZ2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybU1hdHJpeDJmdlwiXSA9IFwidW5pZm9ybU1hdHJpeDJmdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm1NYXRyaXgzZnZcIl0gPSBcInVuaWZvcm1NYXRyaXgzZnZcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtTWF0cml4NGZ2XCJdID0gXCJ1bmlmb3JtTWF0cml4NGZ2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTFpXCJdID0gXCJ1bmlmb3JtMWlcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtMWl2XCJdID0gXCJ1bmlmb3JtMWl2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTJpXCJdID0gXCJ1bmlmb3JtMmlcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtMml2XCJdID0gXCJ1bmlmb3JtMml2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTNpXCJdID0gXCJ1bmlmb3JtM2lcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtM2l2XCJdID0gXCJ1bmlmb3JtM2l2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTRpXCJdID0gXCJ1bmlmb3JtNGlcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtNGl2XCJdID0gXCJ1bmlmb3JtNGl2XCI7XHJcbn0pKEdMVW5pZm9ybVR5cGUgPSBleHBvcnRzLkdMVW5pZm9ybVR5cGUgfHwgKGV4cG9ydHMuR0xVbmlmb3JtVHlwZSA9IHt9KSk7XHJcbnZhciBTaGFkZXJUeXBlO1xyXG4oZnVuY3Rpb24gKFNoYWRlclR5cGUpIHtcclxuICAgIFNoYWRlclR5cGVbXCJWRVJURVhfU0hBREVSXCJdID0gXCJWRVJURVhfU0hBREVSXCI7XHJcbiAgICBTaGFkZXJUeXBlW1wiRlJBR01FTlRfU0hBREVSXCJdID0gXCJGUkFHTUVOVF9TSEFERVJcIjtcclxufSkoU2hhZGVyVHlwZSA9IGV4cG9ydHMuU2hhZGVyVHlwZSB8fCAoZXhwb3J0cy5TaGFkZXJUeXBlID0ge30pKTtcclxuY2xhc3MgU2hhZGVyRFRPIGV4dGVuZHMgbGlicmFyeV9wcm92aWRlcl8xLkRUTyB7XHJcbn1cclxuZXhwb3J0cy5TaGFkZXJEVE8gPSBTaGFkZXJEVE87XHJcbmNsYXNzIFNoYWRlciBleHRlbmRzIHdlYmdsX3Jlc291cmNlXzEuV2ViR0xSZXNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICBjb25zdCB7IGdsIH0gPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuaWQgPSBvcHRpb25zLmlkO1xyXG4gICAgICAgIGNvbnN0IHNoYWRlclNvdXJjZSA9IG9wdGlvbnMuc3JjIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuaWQpLnRleHRDb250ZW50O1xyXG4gICAgICAgIGlmICghc2hhZGVyU291cmNlIHx8IHR5cGVvZiBzaGFkZXJTb3VyY2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGdldCB2YWxpZCBzaGFkZXIgc291cmNlIGZvciAke29wdGlvbnMuaWR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsW29wdGlvbnMudHlwZV0pO1xyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZSh0aGlzLnNoYWRlciwgc2hhZGVyU291cmNlKTsgLy8gc2VuZCB0aGUgc291cmNlIHRvIHRoZSBzaGFkZXIgb2JqZWN0XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcih0aGlzLnNoYWRlcik7IC8vIGNvbXBpbGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICAgICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIodGhpcy5zaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyh0aGlzLnNoYWRlcik7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcih0aGlzLnNoYWRlcik7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvbXBpbGUgJHt0aGlzLmlkfTogJHtpbmZvfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldFNoYWRlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zaGFkZXI7XHJcbiAgICB9XHJcbiAgICBnZXRJZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pZDtcclxuICAgIH1cclxuICAgIHByZXBhcmUoeyBnbCB9KSB7XHJcbiAgICAgICAgLy8gbm8tb3BcclxuICAgIH1cclxuICAgIHJlbGVhc2UoKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmdsLmRlbGV0ZVNoYWRlcih0aGlzLnNoYWRlcik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5TaGFkZXIgPSBTaGFkZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNoYWRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbmplY3Rvcl9wbHVzXzEgPSByZXF1aXJlKFwiLi4vbGliL2luamVjdG9yLXBsdXNcIik7XHJcbmNvbnN0IG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xID0gcmVxdWlyZShcIi4uL21hbGxldC5kZXBlZGVuY3ktdHJlZVwiKTtcclxuY29uc3QgbG9nZ2VyXzEgPSByZXF1aXJlKFwiLi4vbGliL2xvZ2dlclwiKTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY29uc3QgZW50aXR5XzEgPSByZXF1aXJlKFwiLi4vZ2VvbWV0cnkvZW50aXR5XCIpO1xyXG5sZXQgV2ViR0xBcHAgPSBjbGFzcyBXZWJHTEFwcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihtYXhGcmFtZVJhdGUsICRxLCBsaWJyYXJ5LCBzdGFnZSwgJGVsZW1lbnQsIGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMubWF4RnJhbWVSYXRlID0gbWF4RnJhbWVSYXRlO1xyXG4gICAgICAgIHRoaXMuJHEgPSAkcTtcclxuICAgICAgICB0aGlzLmxpYnJhcnkgPSBsaWJyYXJ5O1xyXG4gICAgICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy5wcmVVcGRhdGUgPSBudWxsO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gQ3VycmVudCBGcmFtZXMgUGVyIFNlY29uZCAqL1xyXG4gICAgICAgIHRoaXMuZnBzID0gMDtcclxuICAgICAgICAvKiogQGRlc2NyaXB0aW9uIHRpbWVzdGFtcCBvZiBsYXN0IEZQUyBkb1VwZGF0ZSAqL1xyXG4gICAgICAgIHRoaXMubGFzdEZQU1VwZGF0ZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiBmcmFtZXMgZXhlY3V0ZWQgaW4gbGFzdCBzZWNvbmQgKi9cclxuICAgICAgICB0aGlzLmZyYW1lc1RoaXNTZWNvbmQgPSAwO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gc3VzcGVuZCBtYWluIGxvb3AgaWYgdGhlIHdpbmRvdyBsb3NlcyBmb2N1cyAqL1xyXG4gICAgICAgIHRoaXMuc3VzcGVuZE9uQmx1ciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gdGltZXN0YW1wIHdoZW4gZmlyc3QgZnJhbWUgZXhlY3V0ZWQgKi9cclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiBtaWxsaXNlY29uZHMgc2luY2UgZG9VcGRhdGUgbG9vcCB3YXMgcnVuICovXHJcbiAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSAwO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gIG1pbGxpc2Vjb25kcyBzaW5jZSBsYXN0IGZyYW1lICovXHJcbiAgICAgICAgdGhpcy5lbGFwc2VkVGltZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiB0aW1lc3RhbXAgb2YgdGhlIGxhc3QgZnJhbWUgKi9cclxuICAgICAgICB0aGlzLmxhc3RGcmFtZVRpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBlbnRpdHlfMS5FbnRpdHkuZ2V0SW5kZXgoKTtcclxuICAgICAgICB0aGlzLmVudGl0eVVwZGF0ZXMgPSBlbnRpdHlfMS5FbnRpdHkuZ2V0VXBkYXRlSW5kZXgoKTtcclxuICAgICAgICBpZiAodGhpcy5wcmVVcGRhdGUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmVudGl0eVVwZGF0ZXMucHVzaCh0aGlzLnByZVVwZGF0ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aW1lc3RlcCA9ICgxMDAwIC8gdGhpcy5tYXhGcmFtZVJhdGUpO1xyXG4gICAgICAgIHRoaXMuZnBzID0gdGhpcy5tYXhGcmFtZVJhdGU7XHJcbiAgICAgICAgdGhpcy5jb25maWcoKTtcclxuICAgIH1cclxuICAgICRwb3N0TGluaygpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLnN0YWdlLmdldENvbnRleHQoKTtcclxuICAgICAgICB0aGlzLiRxLndoZW4odGhpcy5pbml0KHRoaXMuY29udGV4dCkpXHJcbiAgICAgICAgICAgIC50aGVuKHRoaXMuc3RhcnRNYWluTG9vcClcclxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBpbml0aWFsaXplIFdlYkdMIGFwcGAsIGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwb3N0VXBkYXRlKGR0LCB0dCkge1xyXG4gICAgICAgIC8vIG5vLW9wXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgRlBTIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0gdG90YWxFbGFwc2VkVGltZVxyXG4gICAgICovXHJcbiAgICB1cGRhdGVGUFModG90YWxFbGFwc2VkVGltZSkge1xyXG4gICAgICAgIHRoaXMuZnJhbWVzVGhpc1NlY29uZCsrO1xyXG4gICAgICAgIGlmICh0b3RhbEVsYXBzZWRUaW1lID4gdGhpcy5sYXN0RlBTVXBkYXRlICsgMTAwMCkge1xyXG4gICAgICAgICAgICBjb25zdCB3ZWlnaHRGYWN0b3IgPSAwLjI1O1xyXG4gICAgICAgICAgICB0aGlzLmZwcyA9ICh3ZWlnaHRGYWN0b3IgKiB0aGlzLmZyYW1lc1RoaXNTZWNvbmQpICsgKCgxIC0gd2VpZ2h0RmFjdG9yKSAqIHRoaXMuZnBzKTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0RlBTVXBkYXRlID0gdG90YWxFbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZXNUaGlzU2Vjb25kID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERlcml2ZWQgRnJvbVxyXG4gICAgICogSXNhYWMgU3VraW5cclxuICAgICAqIGh0dHA6Ly93d3cuaXNhYWNzdWtpbi5jb20vbmV3cy8yMDE1LzAxL2RldGFpbGVkLWV4cGxhbmF0aW9uLWphdmFzY3JpcHQtZ2FtZS1sb29wcy1hbmQtdGltaW5nXHJcbiAgICAgKi9cclxuICAgIG1haW5Mb29wKCkge1xyXG4gICAgICAgIGNvbnN0IGZyYW1lVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHRoaXMuZGVsdGFUaW1lICs9IGZyYW1lVGltZSAtIHRoaXMubGFzdEZyYW1lVGltZTtcclxuICAgICAgICB0aGlzLmxhc3RGcmFtZVRpbWUgPSBmcmFtZVRpbWU7XHJcbiAgICAgICAgdGhpcy5lbGFwc2VkVGltZSA9IGZyYW1lVGltZSAtIHRoaXMuc3RhcnRUaW1lO1xyXG4gICAgICAgIGxldCBlbGFwc2VkTXMgPSB0aGlzLmVsYXBzZWRUaW1lIHwgMDtcclxuICAgICAgICB0aGlzLnVwZGF0ZUZQUyhlbGFwc2VkTXMpO1xyXG4gICAgICAgIGxldCB1cGRhdGVTdGVwcyA9IDA7XHJcbiAgICAgICAgLy8gY29uc3QgZnJhbWVEZWx0YVRpbWUgPSB0aGlzLmRlbHRhVGltZTtcclxuICAgICAgICBjb25zdCBkdE1zID0gdGhpcy50aW1lc3RlcCB8IDA7XHJcbiAgICAgICAgY29uc3Qgb3BzID0gdGhpcy5lbnRpdHlVcGRhdGVzO1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IG9wcy5sZW5ndGg7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuZGVsdGFUaW1lID4gdGhpcy50aW1lc3RlcCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBvcHNbaV0oZHRNcywgZWxhcHNlZE1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnBvc3RVcGRhdGUoZHRNcywgZWxhcHNlZE1zKTtcclxuICAgICAgICAgICAgdGhpcy5kZWx0YVRpbWUgLT0gdGhpcy50aW1lc3RlcDtcclxuICAgICAgICAgICAgZWxhcHNlZE1zICs9IGR0TXM7XHJcbiAgICAgICAgICAgIGNvbnN0IG1heENvbnNlY1N0ZXBzID0gMjQwO1xyXG4gICAgICAgICAgICBpZiAoKyt1cGRhdGVTdGVwcyA+IG1heENvbnNlY1N0ZXBzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGBVcGRhdGUgTG9vcCBFeGNlZWRlZCAke21heENvbnNlY1N0ZXBzfSBDYWxsc2ApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSAwOyAvLyBkb24ndCBkbyBhIHNpbGx5ICMgb2YgdXBkYXRlc1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXJTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5tYWluTG9vcCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIG1haW4gYXBwIGxvb3BcclxuICAgICAqL1xyXG4gICAgc3RhcnRNYWluTG9vcCgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnU3RhcnRpbmcgbWFpbiBHTCBhcHBsaWNhdGlvbiBsb29wJyk7XHJcbiAgICAgICAgdGhpcy5sYXN0RnJhbWVUaW1lID0gdGhpcy5zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubWFpbkxvb3ApO1xyXG4gICAgICAgIC8vIHRoaXMuYXBwU3RhdGUuc2V0U3RhdGUoQXBwU3RhdGUuUnVubmluZyk7XHJcbiAgICB9XHJcbn07XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgYmluZF9kZWNvcmF0b3JfMS5kZWZhdWx0LFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBXZWJHTEFwcC5wcm90b3R5cGUsIFwibWFpbkxvb3BcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgYmluZF9kZWNvcmF0b3JfMS5kZWZhdWx0LFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBXZWJHTEFwcC5wcm90b3R5cGUsIFwic3RhcnRNYWluTG9vcFwiLCBudWxsKTtcclxuV2ViR0xBcHAgPSBfX2RlY29yYXRlKFtcclxuICAgIF9fcGFyYW0oMCwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuY29uc3QuTWF4RnJhbWVSYXRlKSksXHJcbiAgICBfX3BhcmFtKDEsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULm5nLiRxKSksXHJcbiAgICBfX3BhcmFtKDIsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULkxpYnJhcnkpKSxcclxuICAgIF9fcGFyYW0oMywgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQud2ViZ2wuV2ViR0xTdGFnZSkpLFxyXG4gICAgX19wYXJhbSg0LCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5uZy4kZWxlbWVudCkpLFxyXG4gICAgX19wYXJhbSg1LCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5Mb2dnZXIpKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbTnVtYmVyLCBGdW5jdGlvbiwgT2JqZWN0LCBPYmplY3QsIE9iamVjdCwgbG9nZ2VyXzEuTG9nZ2VyXSlcclxuXSwgV2ViR0xBcHApO1xyXG5leHBvcnRzLldlYkdMQXBwID0gV2ViR0xBcHA7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdlYmdsLWFwcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBtZXNoXzEgPSByZXF1aXJlKFwiLi4vZ2VvbWV0cnkvbWVzaFwiKTtcclxuY29uc3Qgd2ViZ2xfcmVzb3VyY2VfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLXJlc291cmNlXCIpO1xyXG5jbGFzcyBXZWJHTE1lc2ggZXh0ZW5kcyB3ZWJnbF9yZXNvdXJjZV8xLldlYkdMUmVzb3VyY2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xyXG4gICAgICAgIGNvbnN0IHsgZ2wgfSA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCA9IG9wdGlvbnMubWVzaC5nZXRJbmRleENvdW50KCk7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhTaXplID0gbWVzaF8xLk1lc2guVkVSVF9TSVpFO1xyXG4gICAgICAgIHRoaXMuZ2xWZXJ0ZXhCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICAvLyBnbC5BUlJBWV9CVUZGRVIgaW5kaWNhdGVzIHBlciB2ZXJ0ZXggZGF0YVxyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmdsVmVydGV4QnVmZmVyKTtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgb3B0aW9ucy5tZXNoLmdldFZlcnRleEJ1ZmZlcigpLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgdGhpcy5nbEluZGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgLy8gZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIgaW5kaWNhdGVzIGFuZCBpbmRleCBidWZmZXJcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmdsSW5kZXhCdWZmZXIpO1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG9wdGlvbnMubWVzaC5nZXRJbmRleEJ1ZmZlcigpLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgLy8gcHJldmVudCBhY2NpZGVudGFsIG1vZGlmaWNhdGlvbnMgdG8gdGhpcyBtZXNoXHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgfVxyXG4gICAgZ2V0SW5kZXhCdWZmZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2xJbmRleEJ1ZmZlcjtcclxuICAgIH1cclxuICAgIGdldFZlcnRleEJ1ZmZlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nbFZlcnRleEJ1ZmZlcjtcclxuICAgIH1cclxuICAgIGdldFZlcnRleENvdW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZlcnRleENvdW50O1xyXG4gICAgfVxyXG4gICAgZ2V0VmVydGV4U2l6ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0ZXhTaXplO1xyXG4gICAgfVxyXG4gICAgcmVsZWFzZSgpIHtcclxuICAgICAgICBjb25zdCB7IGdsIH0gPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgZ2wuZGVsZXRlQnVmZmVyKHRoaXMuZ2xWZXJ0ZXhCdWZmZXIpO1xyXG4gICAgICAgIGdsLmRlbGV0ZUJ1ZmZlcih0aGlzLmdsSW5kZXhCdWZmZXIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuV2ViR0xNZXNoID0gV2ViR0xNZXNoO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD13ZWJnbC1tZXNoLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB3ZWJnbF9tZXNoXzEgPSByZXF1aXJlKFwiLi93ZWJnbC1tZXNoXCIpO1xyXG5jb25zdCBtZXNoXzEgPSByZXF1aXJlKFwiLi4vZ2VvbWV0cnkvbWVzaFwiKTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY2xhc3MgV2ViR0xSZXNvdXJjZUZhY3Rvcnkge1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCwgbGlicmFyeSkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5saWJyYXJ5ID0gbGlicmFyeTtcclxuICAgICAgICB0aGlzLnJlc291cmNlQ2FjaGUgPSB7fTtcclxuICAgIH1cclxuICAgIGluaXQobWVzaE5hbWVzKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKG1lc2hOYW1lcy5tYXAodGhpcy5yZWdpc3Rlck1lc2gpKTtcclxuICAgICAgICAvLyAudGhlbigoKSA9PiB0aGlzLmxpYnJhcnkuYWRkU291cmNlcyhXZWJHTE1lc2gsIFtuZXcgU3RhdGljU291cmNlKHRoaXMucmVzb3VyY2VDYWNoZSldKSk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoY3Rvciwgb3B0aW9ucyA9IG51bGwpIHtcclxuICAgICAgICBjb25zdCByZXMgPSBuZXcgY3Rvcih0aGlzLmNvbnRleHQsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJlcy5pbml0KHRoaXMucmVzb3VyY2VDYWNoZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyTWVzaChuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlicmFyeS5nZXQobWVzaF8xLk1lc2gsIG5hbWUpXHJcbiAgICAgICAgICAgIC50aGVuKChtZXNoKSA9PiB0aGlzLmNyZWF0ZSh3ZWJnbF9tZXNoXzEuV2ViR0xNZXNoLCB7IG1lc2ggfSkpXHJcbiAgICAgICAgICAgIC50aGVuKChnbE1lc2gpID0+IHRoaXMucmVzb3VyY2VDYWNoZVtuYW1lXSA9IGdsTWVzaCk7XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtTdHJpbmddKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBXZWJHTFJlc291cmNlRmFjdG9yeS5wcm90b3R5cGUsIFwicmVnaXN0ZXJNZXNoXCIsIG51bGwpO1xyXG5leHBvcnRzLldlYkdMUmVzb3VyY2VGYWN0b3J5ID0gV2ViR0xSZXNvdXJjZUZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdlYmdsLXJlc291cmNlLWZhY3RvcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgV2ViR0xSZXNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgIH1cclxuICAgIGluaXQocmVzb3VyY2VDYWNoZSkge1xyXG4gICAgICAgIC8vIG5vLW9wXHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5XZWJHTFJlc291cmNlID0gV2ViR0xSZXNvdXJjZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2ViZ2wtcmVzb3VyY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX21ldGFkYXRhID0gKHRoaXMgJiYgdGhpcy5fX21ldGFkYXRhKSB8fCBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xyXG59O1xyXG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaW5qZWN0b3JfcGx1c18xID0gcmVxdWlyZShcIi4uL2xpYi9pbmplY3Rvci1wbHVzXCIpO1xyXG5jb25zdCByZW5kZXJfdGFyZ2V0X2ZhY3RvcnlfMSA9IHJlcXVpcmUoXCIuLi9yZW5kZXItdGFyZ2V0LmZhY3RvcnlcIik7XHJcbmNvbnN0IGxvZ2dlcl8xID0gcmVxdWlyZShcIi4uL2xpYi9sb2dnZXJcIik7XHJcbmNvbnN0IG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xID0gcmVxdWlyZShcIi4uL21hbGxldC5kZXBlZGVuY3ktdHJlZVwiKTtcclxuY29uc3Qgc2NoZWR1bGVyX3NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuLi9zY2hlZHVsZXIuc2VydmljZVwiKTtcclxuY29uc3QgcmVuZGVyX3RhcmdldF9jb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9yZW5kZXItdGFyZ2V0LmNvbXBvbmVudFwiKTtcclxubGV0IFdlYkdMU3RhZ2VDdHJsID0gY2xhc3MgV2ViR0xTdGFnZUN0cmwge1xyXG4gICAgY29uc3RydWN0b3Ioc3RhZ2UsIHNjaGVkdWxlciwgJGVsZW1lbnQsIGxvZ2dlcikge1xyXG4gICAgICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy50eXBlID0gcmVuZGVyX3RhcmdldF9mYWN0b3J5XzEuUmVuZGVyVGFyZ2V0V2ViR0w7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbygnQnVpbGQgV2ViR0wgU3RhZ2UnKTtcclxuICAgIH1cclxuICAgICRwb3N0TGluaygpIHtcclxuICAgICAgICB0aGlzLmxvYWRSZW5kZXJpbmdDb250ZXh0KCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdGFnZS5zZXQodGhpcy5yZW5kZXJUYXJnZXQpO1xyXG4gICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEZhaWxlZCB0byBXZWJHTCBzdGFnZSwgZXhpdGluZyBzZXR1cCBtZXRob2RgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxvYWRSZW5kZXJpbmdDb250ZXh0KCkge1xyXG4gICAgICAgIGNvbnN0IFJUQ3RybCA9IHJlbmRlcl90YXJnZXRfY29tcG9uZW50XzEuUmVuZGVyVGFyZ2V0Q3RybC5nZXRDb250cm9sbGVyKHRoaXMuJGVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuZ2wgPSBSVEN0cmwuZ2V0Q29udGV4dCgpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ID0gUlRDdHJsLmdldFJlbmRlclRhcmdldCgpO1xyXG4gICAgfVxyXG59O1xyXG5XZWJHTFN0YWdlQ3RybCA9IF9fZGVjb3JhdGUoW1xyXG4gICAgX19wYXJhbSgwLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC53ZWJnbC5XZWJHTFN0YWdlKSksXHJcbiAgICBfX3BhcmFtKDEsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULlNjaGVkdWxlcikpLFxyXG4gICAgX19wYXJhbSgyLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5uZy4kZWxlbWVudCkpLFxyXG4gICAgX19wYXJhbSgzLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5Mb2dnZXIpKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0LCBzY2hlZHVsZXJfc2VydmljZV8xLlNjaGVkdWxlciwgT2JqZWN0LCBsb2dnZXJfMS5Mb2dnZXJdKVxyXG5dLCBXZWJHTFN0YWdlQ3RybCk7XHJcbmV4cG9ydHMud2ViR0xTdGFnZU9wdGlvbnMgPSB7XHJcbiAgICBjb250cm9sbGVyOiBpbmplY3Rvcl9wbHVzXzEubmdBbm5vdGF0ZShXZWJHTFN0YWdlQ3RybCksXHJcbiAgICB0ZW1wbGF0ZTogJzxtYWxsZXQtcmVuZGVyLXRhcmdldCB0eXBlPVwiJGN0cmwudHlwZVwiPjwvbWFsbGV0LXJlbmRlci10YXJnZXQ+JyxcclxufTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2ViZ2wtc3RhZ2UuY29tcG9uZW50LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcclxufTtcclxudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHJlbmRlcl90YXJnZXRfZmFjdG9yeV8xID0gcmVxdWlyZShcIi4uL3JlbmRlci10YXJnZXQuZmFjdG9yeVwiKTtcclxuY29uc3Qgd2ViZ2xfcmVzb3VyY2VfZmFjdG9yeV8xID0gcmVxdWlyZShcIi4vd2ViZ2wtcmVzb3VyY2UtZmFjdG9yeVwiKTtcclxuY29uc3QgaW5qZWN0b3JfcGx1c18xID0gcmVxdWlyZShcIi4uL2xpYi9pbmplY3Rvci1wbHVzXCIpO1xyXG5jb25zdCBtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMSA9IHJlcXVpcmUoXCIuLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbmNvbnN0IGxvZ2dlcl8xID0gcmVxdWlyZShcIi4uL2xpYi9sb2dnZXJcIik7XHJcbmNvbnN0IGJpbmRfZGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiYmluZC1kZWNvcmF0b3JcIik7XHJcbmNvbnN0IHNoYWRlcl9wcm9ncmFtXzEgPSByZXF1aXJlKFwiLi9zaGFkZXItcHJvZ3JhbVwiKTtcclxubGV0IFdlYkdMU3RhZ2UgPSBjbGFzcyBXZWJHTFN0YWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKGxpYnJhcnksICRxLCBsb2dnZXIpIHtcclxuICAgICAgICB0aGlzLmxpYnJhcnkgPSBsaWJyYXJ5O1xyXG4gICAgICAgIHRoaXMuJHEgPSAkcTtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgIGdsOiBudWxsLFxyXG4gICAgICAgICAgICBwcm9ncmFtOiBudWxsLFxyXG4gICAgICAgICAgICBsb2dnZXIsXHJcbiAgICAgICAgICAgIHJlbmRlclRhcmdldDogbnVsbCxcclxuICAgICAgICAgICAgdHJhbnNmb3JtQnVmZmVyOiBudWxsLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wcm9ncmFtcyA9IHt9O1xyXG4gICAgfVxyXG4gICAgc2V0KHJlbmRlclRhcmdldCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBTZXR0aW5nIFdlYkdMIFN0YWdlYCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXQgPSByZW5kZXJUYXJnZXQ7XHJcbiAgICAgICAgdGhpcy5nbCA9IHJlbmRlclRhcmdldC5nZXRDb250ZXh0KCk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LnJlbmRlclRhcmdldCA9IHJlbmRlclRhcmdldDtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgZ2wgfSA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpOyAvLyBjb3VsZCByZXBsYWNlIHRoaXMgd2l0aCBibGVuZGluZzogaHR0cDovL2xlYXJuaW5nd2ViZ2wuY29tL2Jsb2cvP3A9ODU5XHJcbiAgICAgICAgICAgIC8vIFRPRE86IGNyZWF0ZSBtYXRlcmlhbHNcclxuICAgICAgICAgICAgdGhpcy5nbEZhY3RvcnkgPSBuZXcgd2ViZ2xfcmVzb3VyY2VfZmFjdG9yeV8xLldlYkdMUmVzb3VyY2VGYWN0b3J5KHRoaXMuY29udGV4dCwgdGhpcy5saWJyYXJ5KTtcclxuICAgICAgICAgICAgdGhpcy5nbEZhY3RvcnkuaW5pdChbJ2N1YmUnXSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBXZWJHTCBTdGFnZSBzZXRgKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGUubWVzc2FnZSB8fCBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldENvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbmV3IHNoYWRlciBwcm9ncmFtIGFuZCBhZGQgaXQgdG8gYXZhaWxhYmxlIHN0YWdlIHByb2dyYW1zXHJcbiAgICAgKiBAcGFyYW0ge0lQcm9ncmFtT3B0aW9uc30gcHJvZ3JhbUNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzZXRBY3RpdmVcclxuICAgICAqIEByZXR1cm5zIHtJU2hhZGVyUHJvZ3JhbX1cclxuICAgICAqL1xyXG4gICAgYWRkUHJvZ3JhbShwcm9ncmFtQ29uZmlnLCBzZXRBY3RpdmUgPSBmYWxzZSkge1xyXG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSBuZXcgc2hhZGVyX3Byb2dyYW1fMS5TaGFkZXJQcm9ncmFtKHRoaXMuY29udGV4dCwgcHJvZ3JhbUNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5wcm9ncmFtc1twcm9ncmFtQ29uZmlnLm5hbWVdID0gcHJvZ3JhbTtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0LnByb2dyYW0gPT09IG51bGwgfHwgc2V0QWN0aXZlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlUHJvZ3JhbShwcm9ncmFtQ29uZmlnLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvZ3JhbTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBhY3RpdmUgcHJvZ3JhbVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgICAqL1xyXG4gICAgc2V0QWN0aXZlUHJvZ3JhbShuYW1lKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb2dyYW1zW25hbWVdKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUHJvZ3JhbSB3aXRoICR7bmFtZX0gZG9lcyBub3QgZXhpc3QgaW4gdGhpcyBzdGFnZWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbnRleHQucHJvZ3JhbSA9IHRoaXMucHJvZ3JhbXNbbmFtZV07XHJcbiAgICAgICAgdGhpcy5wcm9ncmFtc1tuYW1lXS51c2UoKTtcclxuICAgIH1cclxuICAgIGdldEZhY3RvcnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2xGYWN0b3J5O1xyXG4gICAgfVxyXG59O1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW3JlbmRlcl90YXJnZXRfZmFjdG9yeV8xLlJlbmRlclRhcmdldFdlYkdMXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgQm9vbGVhbilcclxuXSwgV2ViR0xTdGFnZS5wcm90b3R5cGUsIFwic2V0XCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdCwgQm9vbGVhbl0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIE9iamVjdClcclxuXSwgV2ViR0xTdGFnZS5wcm90b3R5cGUsIFwiYWRkUHJvZ3JhbVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtTdHJpbmddKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIFdlYkdMU3RhZ2UucHJvdG90eXBlLCBcInNldEFjdGl2ZVByb2dyYW1cIiwgbnVsbCk7XHJcbldlYkdMU3RhZ2UgPSBfX2RlY29yYXRlKFtcclxuICAgIF9fcGFyYW0oMCwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuTGlicmFyeSkpLFxyXG4gICAgX19wYXJhbSgxLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5uZy4kcSkpLFxyXG4gICAgX19wYXJhbSgyLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5Mb2dnZXIpKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0LCBGdW5jdGlvbiwgbG9nZ2VyXzEuTG9nZ2VyXSlcclxuXSwgV2ViR0xTdGFnZSk7XHJcbmV4cG9ydHMuV2ViR0xTdGFnZSA9IFdlYkdMU3RhZ2U7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdlYmdsLXN0YWdlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcclxufTtcclxudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGxpYnJhcnlfcHJvdmlkZXJfMSA9IHJlcXVpcmUoXCIuLi9saWJyYXJ5LnByb3ZpZGVyXCIpO1xyXG5jb25zdCBtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMSA9IHJlcXVpcmUoXCIuLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbmNvbnN0IGluamVjdG9yX3BsdXNfMSA9IHJlcXVpcmUoXCIuLi9saWIvaW5qZWN0b3ItcGx1c1wiKTtcclxuY29uc3Qgc2hhZGVyXzEgPSByZXF1aXJlKFwiLi9zaGFkZXJcIik7XHJcbmNvbnN0IG1lc2hfMSA9IHJlcXVpcmUoXCIuLi9nZW9tZXRyeS9tZXNoXCIpO1xyXG5jb25zdCBnbE1hdHJpeCA9IHJlcXVpcmUoXCJnbC1tYXRyaXhcIik7XHJcbmNvbnN0IHsgdmVjMyB9ID0gZ2xNYXRyaXg7XHJcbi8vIHRoaXMga2luZGEgc3Vja3MgYnV0IGl0J3MgdGhlIG9ubHkgd2F5IHRvIHNvbWUgcmVhc29uYWJseSBoYXZlIGFjY2VzcyB0byB0aGlzIGRhdGEuLi5cclxuY29uc3QgZW1iZWRkZWRTaGFkZXJzID0ge1xyXG4gICAgLy8gbGFuZ3VhZ2U9R0xTTFxyXG4gICAgdmVydGV4U2hhZGVyM2Q6IGAjdmVyc2lvbiAxMDBcclxuLy9hbiBhdHRyaWJ1dGUgd2lsbCByZWNlaXZlIGRhdGEgZnJvbSBhIGJ1ZmZlclxyXG5hdHRyaWJ1dGUgdmVjMyBhX3Bvc2l0aW9uO1xyXG5hdHRyaWJ1dGUgdmVjMyBhX25vcm1hbDtcclxuYXR0cmlidXRlIHZlYzMgYV9jb2xvcjtcclxuXHJcbnVuaWZvcm0gbWF0NCB3b3JsZDtcclxudW5pZm9ybSBtYXQ0IHZpZXc7XHJcbnVuaWZvcm0gbWF0NCBwcm9qZWN0aW9uO1xyXG5cclxudmFyeWluZyBoaWdocCB2ZWM0IHZDb2xvcjtcclxudmFyeWluZyBoaWdocCB2ZWMzIHZOb3JtYWw7XHJcbi8vc3RhcnRpbmcgcG9pbnRcclxudm9pZCBtYWluKCkge1xyXG4gICAgLy8gVGhlIHZlcnRleCdzIHBvc2l0aW9uIChpbnB1dC5wb3NpdGlvbikgbXVzdCBiZSBjb252ZXJ0ZWQgdG8gd29ybGQgc3BhY2UsXHJcblx0Ly8gdGhlbiBjYW1lcmEgc3BhY2UgKHJlbGF0aXZlIHRvIG91ciAzRCBjYW1lcmEpLCB0aGVuIHRvIHByb3BlciBob21vZ2Vub3VzIFxyXG5cdC8vIHNjcmVlbi1zcGFjZSBjb29yZGluYXRlcy4gIFRoaXMgaXMgdGFrZW4gY2FyZSBvZiBieSBvdXIgd29ybGQsIHZpZXcgYW5kXHJcblx0Ly8gcHJvamVjdGlvbiBtYXRyaWNlcy4gIFxyXG5cdC8vXHJcblx0Ly8gRmlyc3Qgd2UgbXVsdGlwbHkgdGhlbSB0b2dldGhlciB0byBnZXQgYSBzaW5nbGUgbWF0cml4IHdoaWNoIHJlcHJlc2VudHNcclxuXHQvLyBhbGwgb2YgdGhvc2UgdHJhbnNmb3JtYXRpb25zICh3b3JsZCB0byB2aWV3IHRvIHByb2plY3Rpb24gc3BhY2UpXHJcbiAgICAvLyBjYWxjdWxhdGUgdGhlIHdvcmxkVmlld1Byb2plY3Rpb24gbWF0NCAoZG9lcyB0aGlzIG5lZWQgdG8gYmUgZm9yIGV2ZXJ5IHZlcnRleD8/PyBqdXN0IGZvciBvYmplY3Q/XHJcbiAgICBtYXQ0IHByb2plY3Rpb25WaWV3V29ybGQgPSBwcm9qZWN0aW9uICogd29ybGQgKiB2aWV3O1xyXG4gICBcclxuICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvblZpZXdXb3JsZCAqIHZlYzQoYV9wb3NpdGlvbiwgMSk7XHJcbiAgICBcclxuICAgIHZDb2xvciA9IHZlYzQoYV9jb2xvciwgMS4wKTtcclxuICAgIHZOb3JtYWwgPSB2ZWMzKHdvcmxkICogdmlldyAqIHZlYzQoYV9ub3JtYWwsIDEpKTtcclxufWAsXHJcbiAgICAvLyBsYW5ndWFnZT1HTFNMXHJcbiAgICBmcmFnbWVudFNoYWRlcjogYCN2ZXJzaW9uIDEwMFxyXG4vLyBmcmFnbWVudCBzaGFkZXJzIGRvbid0IGh2YWUgZGVmYXVsdCBwcmVjaXNpb24sIHNvIGRlZmluZVxyXG4vLyBhcyBtZWRpdW1wLCBcIm1lZGl1bSBwcmVjaXNpb25cIlxyXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcclxuXHJcbnZhcnlpbmcgaGlnaHAgdmVjNCB2Q29sb3I7XHJcbnZhcnlpbmcgaGlnaHAgdmVjMyB2Tm9ybWFsO1xyXG5cclxuc3RydWN0IExpZ2h0IHtcclxuICAgIHZlYzQgYW1iaWVudENvbG9yO1xyXG4gICAgdmVjNCBkaWZmdXNlQ29sb3I7XHJcbiAgICB2ZWMzIGRpcmVjdGlvbjtcclxufTtcclxuXHJcbi8vIHVuaWZvcm0gaW50IG51bUxpZ2h0cztcclxudW5pZm9ybSBMaWdodCBsaWdodDtcclxuXHJcbnZlYzQgZ2V0TGlnaHRDb2xvcihMaWdodCBsaWdodCwgdmVjMyBub3JtYWwpIHtcclxuICAgIHZlYzMgbGlnaHREaXIgPSBub3JtYWxpemUoLWxpZ2h0LmRpcmVjdGlvbik7XHJcbiAgICBmbG9hdCBsaWdodEFtdCA9IGNsYW1wKGRvdChsaWdodERpciwgbm9ybWFsKSwgMC4wLCAxLjApO1xyXG4gICAgXHJcbiAgICByZXR1cm4gbGlnaHQuZGlmZnVzZUNvbG9yICogbGlnaHRBbXQ7ICAgXHJcbn1cclxuXHJcbnZvaWQgbWFpbigpIHtcclxuICAgIC8vIGdsX0ZyYWdDb2xvciBpcyB0aGUgb3V0cG91dCBvZiB0aGUgZnJhZ21lbnRcclxuICAgIGdsX0ZyYWdDb2xvciA9IGxpZ2h0LmFtYmllbnRDb2xvciAqIHZDb2xvciArIGdldExpZ2h0Q29sb3IobGlnaHQsIHZOb3JtYWwpICogdkNvbG9yO1xyXG59YFxyXG59O1xyXG5jb25zdCBzaGFkZXJDb25maWcgPSB7XHJcbiAgICAnM2QtdmVydGV4LXNoYWRlcic6IHtcclxuICAgICAgICBpZDogJzNkLXZlcnRleC1zaGFkZXInLFxyXG4gICAgICAgIHNyYzogZW1iZWRkZWRTaGFkZXJzLnZlcnRleFNoYWRlcjNkLFxyXG4gICAgICAgIHR5cGU6IHNoYWRlcl8xLlNoYWRlclR5cGUuVkVSVEVYX1NIQURFUixcclxuICAgICAgICBzcGVjOiB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2FfcG9zaXRpb24nLCBzaXplOiAzLCB0eXBlOiBzaGFkZXJfMS5HTERhdGFUeXBlLkZMT0FUIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdhX25vcm1hbCcsIHNpemU6IDMsIHR5cGU6IHNoYWRlcl8xLkdMRGF0YVR5cGUuRkxPQVQsIG5vcm1hbGl6ZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYV9jb2xvcicsIHNpemU6IDMsIHR5cGU6IHNoYWRlcl8xLkdMRGF0YVR5cGUuRkxPQVQgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB1bmlmb3Jtczoge1xyXG4gICAgICAgICAgICAgICAgdmlldzogc2hhZGVyXzEuR0xVbmlmb3JtVHlwZS51bmlmb3JtTWF0cml4NGZ2LFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbjogc2hhZGVyXzEuR0xVbmlmb3JtVHlwZS51bmlmb3JtTWF0cml4NGZ2LFxyXG4gICAgICAgICAgICAgICAgd29ybGQ6IHNoYWRlcl8xLkdMVW5pZm9ybVR5cGUudW5pZm9ybU1hdHJpeDRmdixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgICdmcmFnbWVudC1zaGFkZXInOiB7XHJcbiAgICAgICAgaWQ6ICdmcmFnbWVudC1zaGFkZXInLFxyXG4gICAgICAgIHNyYzogZW1iZWRkZWRTaGFkZXJzLmZyYWdtZW50U2hhZGVyLFxyXG4gICAgICAgIHR5cGU6IHNoYWRlcl8xLlNoYWRlclR5cGUuRlJBR01FTlRfU0hBREVSLFxyXG4gICAgICAgIHNwZWM6IHtcclxuICAgICAgICAgICAgdW5pZm9ybXM6IHtcclxuICAgICAgICAgICAgICAgIGxpZ2h0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW1iaWVudENvbG9yOiBzaGFkZXJfMS5HTFVuaWZvcm1UeXBlLnVuaWZvcm00ZixcclxuICAgICAgICAgICAgICAgICAgICBkaWZmdXNlQ29sb3I6IHNoYWRlcl8xLkdMVW5pZm9ybVR5cGUudW5pZm9ybTRmLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogc2hhZGVyXzEuR0xVbmlmb3JtVHlwZS51bmlmb3JtM2YsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG59O1xyXG5jb25zdCBtZXNoZXMgPSB7IGN1YmU6IHtcclxuICAgICAgICBjb2xvcnM6IFtcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKDEuMCwgMC4wLCAwLjApLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoMC4wLCAxLjAsIDAuMCksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygwLjAsIDAuMCwgMS4wKSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKDEuMCwgMS4wLCAwLjApLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoMC4wLCAxLjAsIDEuMCksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygxLjAsIDAuMCwgMS4wKSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKDAuMCwgMC4wLCAwLjApLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoMS4wLCAxLjAsIDEuMCksXHJcbiAgICAgICAgXSxcclxuICAgICAgICBpbmRpY2VzOiBbXHJcbiAgICAgICAgICAgIDAsIDIsIDEsIDAsIDMsIDIsXHJcbiAgICAgICAgICAgIDIsIDMsIDYsIDMsIDcsIDYsXHJcbiAgICAgICAgICAgIDEsIDYsIDUsIDEsIDIsIDYsXHJcbiAgICAgICAgICAgIDQsIDUsIDYsIDQsIDYsIDcsXHJcbiAgICAgICAgICAgIDAsIDEsIDUsIDAsIDUsIDQsXHJcbiAgICAgICAgICAgIDAsIDcsIDMsIDAsIDQsIDcsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBwb3NpdGlvbnM6IFtcclxuICAgICAgICAgICAgLyogICA1ICArLS0tKyA2XHJcbiAgICAgICAgICAgICAqICAgIC8gICAvIHxcclxuICAgICAgICAgICAgICogMSArLS0tKzIgKyA3XHJcbiAgICAgICAgICAgICAqICAgfCAgIHwgL1xyXG4gICAgICAgICAgICAgKiAwICstLS0rIDNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygtMC41LCAtMC41LCArMC41KSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKC0wLjUsICswLjUsICswLjUpLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoKzAuNSwgKzAuNSwgKzAuNSksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygrMC41LCAtMC41LCArMC41KSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKC0wLjUsIC0wLjUsIC0wLjUpLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoLTAuNSwgKzAuNSwgLTAuNSksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygrMC41LCArMC41LCAtMC41KSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKCswLjUsIC0wLjUsIC0wLjUpXHJcbiAgICAgICAgXSxcclxuICAgIH0gfTtcclxubGV0IFdlYkdMTGlicmFyeUNvbmZpZyA9IGNsYXNzIFdlYkdMTGlicmFyeUNvbmZpZyB7XHJcbiAgICBjb25zdHJ1Y3RvcihsaWJyYXJ5UHJvdmlkZXIpIHtcclxuICAgICAgICBsaWJyYXJ5UHJvdmlkZXIuYWRkU291cmNlcyhzaGFkZXJfMS5TaGFkZXJEVE8sIFtuZXcgbGlicmFyeV9wcm92aWRlcl8xLlN0YXRpY1NvdXJjZShzaGFkZXJDb25maWcpXSk7XHJcbiAgICAgICAgbGlicmFyeVByb3ZpZGVyLmFkZFNvdXJjZXMobWVzaF8xLk1lc2gsIFtuZXcgbGlicmFyeV9wcm92aWRlcl8xLlN0YXRpY1NvdXJjZShtZXNoZXMpXSk7XHJcbiAgICB9XHJcbn07XHJcbldlYkdMTGlicmFyeUNvbmZpZyA9IF9fZGVjb3JhdGUoW1xyXG4gICAgX19wYXJhbSgwLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0LnByb3ZpZGVyKG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5MaWJyYXJ5KSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW2xpYnJhcnlfcHJvdmlkZXJfMS5MaWJyYXJ5UHJvdmlkZXJdKVxyXG5dLCBXZWJHTExpYnJhcnlDb25maWcpO1xyXG5leHBvcnRzLldlYkdMTGlicmFyeUNvbmZpZyA9IFdlYkdMTGlicmFyeUNvbmZpZztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2ViZ2wubGlicmFyeS5jb25maWcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgbWFsbGV0X21vZHVsZV8xID0gcmVxdWlyZShcIi4uL21hbGxldC5tb2R1bGVcIik7XHJcbmNvbnN0IGFuZ3VsYXIgPSByZXF1aXJlKFwiYW5ndWxhclwiKTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi4vbWFsbGV0LmRlcGVkZW5jeS10cmVlXCIpO1xyXG5jb25zdCB3ZWJnbF9zdGFnZV9jb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLXN0YWdlLmNvbXBvbmVudFwiKTtcclxuY29uc3Qgd2ViZ2xfc3RhZ2VfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLXN0YWdlXCIpO1xyXG5jb25zdCBpbmplY3Rvcl9wbHVzXzEgPSByZXF1aXJlKFwiLi4vbGliL2luamVjdG9yLXBsdXNcIik7XHJcbmNvbnN0IGdlb21ldHJ5X21vZHVsZV8xID0gcmVxdWlyZShcIi4uL2dlb21ldHJ5L2dlb21ldHJ5Lm1vZHVsZVwiKTtcclxuY29uc3Qgd2ViZ2xfbGlicmFyeV9jb25maWdfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLmxpYnJhcnkuY29uZmlnXCIpO1xyXG5leHBvcnRzLm1hbGxldFdlYkdMID0gYW5ndWxhci5tb2R1bGUoJ21hbGxldC53ZWJnbCcsIFtcclxuICAgIG1hbGxldF9tb2R1bGVfMS5tYWxsZXQubmFtZSxcclxuICAgIGdlb21ldHJ5X21vZHVsZV8xLm1hbGxldEdlb21ldHJ5Lm5hbWVcclxuXSkuY29uZmlnKGluamVjdG9yX3BsdXNfMS5uZ0Fubm90YXRlKHdlYmdsX2xpYnJhcnlfY29uZmlnXzEuV2ViR0xMaWJyYXJ5Q29uZmlnKSk7XHJcbmV4cG9ydHMubWFsbGV0V2ViR0wuc2VydmljZShtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQud2ViZ2wuV2ViR0xTdGFnZSwgaW5qZWN0b3JfcGx1c18xLm5nQW5ub3RhdGUod2ViZ2xfc3RhZ2VfMS5XZWJHTFN0YWdlKSk7XHJcbmV4cG9ydHMubWFsbGV0V2ViR0wuY29tcG9uZW50KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5jb21wb25lbnQud2ViR0xTdGFnZSwgd2ViZ2xfc3RhZ2VfY29tcG9uZW50XzEud2ViR0xTdGFnZU9wdGlvbnMpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD13ZWJnbC5tb2R1bGUuanMubWFwIl19
