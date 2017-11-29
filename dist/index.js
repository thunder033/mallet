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

},{"./lib/injector-plus":8,"./lib/state-machine":10,"./logger.service":12,"./mallet.depedency-tree":14,"buffer":undefined}],2:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\geometry\\camera.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\geometry")

},{"./transform":5,"buffer":undefined,"gl-matrix":undefined}],3:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
exports.malletGeometry = angular.module('mallet.geometry', []);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\geometry\\geometry.module.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\geometry")

},{"angular":undefined,"buffer":undefined}],4:[function(require,module,exports){
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

},{"buffer":undefined,"gl-matrix":undefined}],5:[function(require,module,exports){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\geometry\\transform.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\geometry")

},{"buffer":undefined,"gl-matrix":undefined}],6:[function(require,module,exports){
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
__export(require("./geometry/transform"));
__export(require("./geometry/mesh"));
__export(require("./geometry/camera"));
// canvas 2d
// webgl
__export(require("./webgl/webgl.module"));
__export(require("./webgl/webgl-stage"));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\index.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./geometry/camera":2,"./geometry/mesh":4,"./geometry/transform":5,"./lib/injector-plus":8,"./lib/logger":9,"./mallet.depedency-tree":14,"./render-target.component":16,"./render-target.factory":17,"./scheduler.service":18,"./webgl/webgl-stage":26,"./webgl/webgl.module":28,"buffer":undefined}],7:[function(require,module,exports){
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

},{"buffer":undefined}],8:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const logger_1 = require("./logger");
const logger = new logger_1.Logger();
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
 * @returns {Array<string | Function>}
 */
function ngAnnotate(provider) {
    const annotations = Reflect.getOwnMetadata(annotationKey, provider) || [];
    let method = provider;
    let methodName = provider.name;
    if (provider.length === 0 && provider.prototype.hasOwnProperty(injectableMethodName)) {
        method = provider.prototype[injectableMethodName];
        methodName += `.${injectableMethodName}`;
    }
    if (annotations.length !== method.length) {
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

},{"./logger":9,"buffer":undefined,"reflect-metadata":undefined}],9:[function(require,module,exports){
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

},{"./state-machine":10,"buffer":undefined}],10:[function(require,module,exports){
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

},{"./decorators":7,"buffer":undefined}],11:[function(require,module,exports){
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
    get(id) {
        const result = null;
        this.sources.sort((a, b) => a.getOrder() - b.getOrder());
        this.sourceIndex = 0;
        this.id = id;
        return this.fallbackGet(null).then(this.processResult);
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
class LibraryProvider {
    constructor() {
        this.libaries = new Map();
    }
    /**
     * Add a new library for the type with provided sources
     * @param {IEntityCtor<T, P>} ctor
     * @param {Array<ISource<T>>} sources
     */
    addLibrary(ctor, sources) {
        this.libaries.set(ctor, new Library(ctor, sources));
    }
    /**
     * Retrieve entity of the given type and id
     * @param {Function} type
     * @param {string | number} id
     * @returns {Promise<T>}
     */
    get(type, id) {
        if (!this.libaries.has(type)) {
            throw new ReferenceError(`No Library is configured for ${type.name}`);
        }
        return this.libaries.get(type).get(id);
    }
    $get() {
        return { get: this.get };
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
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], LibraryProvider.prototype, "$get", null);
exports.LibraryProvider = LibraryProvider;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\library.provider.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"angular":undefined,"bind-decorator":undefined,"buffer":undefined}],12:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// re-export the logger utility to maintain consistent pathing in the module definition
__export(require("./lib/logger"));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\logger.service.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet")

},{"./lib/logger":9,"buffer":undefined}],13:[function(require,module,exports){
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

},{"./mallet.depedency-tree":14,"angular":undefined,"buffer":undefined}],14:[function(require,module,exports){
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

},{"./lib/injector-plus":8,"buffer":undefined}],15:[function(require,module,exports){
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

},{"./app-state.service":1,"./lib/injector-plus":8,"./library.provider":11,"./logger.service":12,"./mallet.constants":13,"./mallet.depedency-tree":14,"./render-target.component":16,"./render-target.factory":17,"./scheduler.service":18,"angular":undefined,"buffer":undefined}],16:[function(require,module,exports){
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
        this.renderTarget.resize();
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

},{"./lib/injector-plus":8,"./lib/logger":9,"./mallet.depedency-tree":14,"./scheduler.service":18,"angular":undefined,"bind-decorator":undefined,"buffer":undefined}],17:[function(require,module,exports){
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

},{"./lib/injector-plus":8,"./logger.service":12,"./mallet.depedency-tree":14,"buffer":undefined}],18:[function(require,module,exports){
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
     * Queue a post process operation to be executed one and discarded
     * @param operation
     * @param zIndex
     */
    postProcess(operation, zIndex) {
        Scheduler.scheduleCommand(operation, zIndex, this.postDrawCommands);
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
     * @param stepDeltaTime
     * @param totalElapsedTime
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
        const frameTime = (new Date()).getTime();
        this.deltaTime += frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;
        this.elapsedTime = frameTime - this.startTime;
        this.updateFPS(this.elapsedTime);
        let updateSteps = 0;
        const frameDeltaTime = this.deltaTime;
        while (this.deltaTime > this.timestep) {
            this.doUpdate(this.timestep, this.elapsedTime);
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

},{"./app-state.service":1,"./lib/injector-plus":8,"./logger.service":12,"./mallet.depedency-tree":14,"bind-decorator":undefined,"buffer":undefined,"pulsar-lib":undefined}],19:[function(require,module,exports){
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

},{"./shader":21,"./webgl-resource":24,"buffer":undefined}],20:[function(require,module,exports){
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

},{"./buffer-format":19,"./shader":21,"./webgl-resource":24,"bind-decorator":undefined,"buffer":undefined}],21:[function(require,module,exports){
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

},{"../library.provider":11,"./webgl-resource":24,"buffer":undefined}],22:[function(require,module,exports){
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

},{"../geometry/mesh":4,"./webgl-resource":24,"buffer":undefined}],23:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebGLResourceFactory {
    constructor(context) {
        this.context = context;
    }
    create(ctor, options) {
        return new ctor(this.context, options);
    }
}
exports.WebGLResourceFactory = WebGLResourceFactory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-resource-factory.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"buffer":undefined}],24:[function(require,module,exports){
(function (global,Buffer,__filename,__argument0,__argument1,__argument2,__argument3,__dirname){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebGLResource {
    constructor(context) {
        this.context = context;
    }
}
exports.WebGLResource = WebGLResource;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-resource.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"buffer":undefined}],25:[function(require,module,exports){
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
const shader_1 = require("./shader");
const mesh_1 = require("../geometry/mesh");
const webgl_mesh_1 = require("./webgl-mesh");
const camera_1 = require("../geometry/camera");
let WebGLStageCtrl = class WebGLStageCtrl {
    constructor(library, stage, scheduler, $element, logger) {
        this.library = library;
        this.stage = stage;
        this.scheduler = scheduler;
        this.$element = $element;
        this.logger = logger;
        this.type = render_target_factory_1.RenderTargetWebGL;
        this.logger.info('Build WebGL Stage');
    }
    $postLink() {
        this.loadContext();
        Promise.all([
            this.library.get(shader_1.ShaderDTO, '3d-vertex-shader'),
            this.library.get(shader_1.ShaderDTO, 'fragment-shader'),
            this.library.get(mesh_1.Mesh, 'cube'),
        ]).then(([vertex, fragment, cube]) => {
            const result = this.stage.set(this.renderTarget, { shaders: { vertex, fragment } });
            this.camera = new camera_1.Camera(this.getAspectRatio());
            this.stage.setActiveCamera(this.camera);
            const glCube = this.stage.getFactory().create(webgl_mesh_1.WebGLMesh, { mesh: cube });
            if (!result) {
                this.logger.warn(`Failed to WebGL stage, exiting setup method`);
                return;
            }
            this.scheduler.schedule((dt, tt) => {
                this.camera.update(dt, tt);
                this.scheduler.draw(this.stage.clear, 1);
                this.scheduler.draw(() => { this.stage.render(glCube); }, 2);
            }, 1);
        });
    }
    loadContext() {
        const RTCtrl = render_target_component_1.RenderTargetCtrl.getController(this.$element);
        this.gl = RTCtrl.getContext();
        this.renderTarget = RTCtrl.getRenderTarget();
    }
    getAspectRatio() {
        const elem = this.$element[0];
        return elem.clientWidth / elem.clientHeight;
    }
};
WebGLStageCtrl = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Library)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.webgl.WebGLStage)),
    __param(2, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Scheduler)),
    __param(3, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$element)),
    __param(4, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Object, Object, scheduler_service_1.Scheduler, Object, logger_1.Logger])
], WebGLStageCtrl);
exports.webGLStageOptions = {
    controller: injector_plus_1.ngAnnotate(WebGLStageCtrl),
    template: '<mallet-render-target type="$ctrl.type"></mallet-render-target>',
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-stage.component.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../geometry/camera":2,"../geometry/mesh":4,"../lib/injector-plus":8,"../lib/logger":9,"../mallet.depedency-tree":14,"../render-target.component":16,"../render-target.factory":17,"../scheduler.service":18,"./shader":21,"./webgl-mesh":22,"buffer":undefined}],26:[function(require,module,exports){
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
const gl_matrix_1 = require("gl-matrix");
let WebGLStage = class WebGLStage {
    constructor($q, logger) {
        this.$q = $q;
        this.logger = logger;
        this.identity = gl_matrix_1.mat4.create();
        this.cubeZ = -1;
        this.cubeDelta = 1 / 500;
        this.cubeRot = 0;
    }
    set(renderTarget, programConfig) {
        this.logger.debug(`Setting WebGL Stage`);
        this.renderTarget = renderTarget;
        this.gl = renderTarget.getContext();
        this.context = { gl: this.gl, program: null, logger: this.logger };
        try {
            this.program = new shader_program_1.ShaderProgram(this.context, programConfig);
            this.context.program = this.program.getGLProgram();
            const { gl } = this.context;
            gl.enable(gl.DEPTH_TEST); // could replace this with blending: http://learningwebgl.com/blog/?p=859
            this.setViewMatrix = this.program.getUniformSetter('view');
            this.setWorldMatrix = this.program.getUniformSetter('world');
            this.setProjectionMatrix = this.program.getUniformSetter('projection');
            this.program.getUniformSetter('light.ambientColor')(0.1, 0.1, 0.1, 1.0);
            this.program.getUniformSetter('light.diffuseColor')(0.8, 0.8, 0.8, 1.0);
            this.program.getUniformSetter('light.direction')(-1, 0, 0);
            // TODO: create materials
            this.glFactory = new webgl_resource_factory_1.WebGLResourceFactory(this.context);
            this.logger.debug(`WebGL Stage set`);
            return true;
        }
        catch (e) {
            this.logger.error(e.message || e);
            return false;
        }
    }
    getFactory() {
        return this.glFactory;
    }
    setActiveCamera(camera) {
        this.activeCamera = camera;
        // this will have to move to do zooming or similar
        this.setProjectionMatrix(false, camera.getProjectionMatrix());
    }
    render(mesh) {
        if (!this.gl || !this.context.program) {
            this.logger.debug(`WebGL context or program not present. Skipping frame render`);
            return;
        }
        const { gl } = this.context;
        // https://stackoverflow.com/questions/6077002/using-webgl-index-buffers-for-drawing-meshes
        // get the vertex buffer from the mesh & send the vertex buffer to the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.getVertexBuffer());
        // use program & enable attributes
        this.program.use();
        // send index buffer to the GPU
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndexBuffer());
        const cubeTransform = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.translate(cubeTransform, this.identity, [.25, -.15, this.cubeZ]);
        gl_matrix_1.mat4.rotateX(cubeTransform, cubeTransform, this.cubeRot);
        gl_matrix_1.mat4.rotateY(cubeTransform, cubeTransform, this.cubeRot);
        gl_matrix_1.mat4.rotateZ(cubeTransform, cubeTransform, this.cubeRot);
        this.setWorldMatrix(false, cubeTransform);
        // perform the draw call
        gl.drawElements(gl.TRIANGLES, mesh.getVertexCount(), gl.UNSIGNED_SHORT, 0);
    }
    clear(dt) {
        if (!this.gl || !this.context.program) {
            this.logger.debug(`WebGL context or program not present. Skipping frame render`);
            return;
        }
        const { gl } = this.context;
        gl.clearColor(0.33, 0.33, 0.33, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // kind of out of scope, but clear is first draw operation, so works for now
        this.setViewMatrix(false, this.activeCamera.getViewMatrix());
        this.cubeZ += dt * this.cubeDelta;
        this.cubeRot += dt * this.cubeDelta;
        const min = -10;
        const max = -0.1 - 0.5;
        if (this.cubeZ < min || this.cubeZ > max) {
            this.cubeZ = Math.min(min, Math.max(this.cubeZ, max));
            this.cubeDelta *= -1;
        }
    }
};
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [render_target_factory_1.RenderTargetWebGL, Object]),
    __metadata("design:returntype", Boolean)
], WebGLStage.prototype, "set", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WebGLStage.prototype, "clear", null);
WebGLStage = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$q)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Function, logger_1.Logger])
], WebGLStage);
exports.WebGLStage = WebGLStage;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl-stage.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../lib/injector-plus":8,"../lib/logger":9,"../mallet.depedency-tree":14,"../render-target.factory":17,"./shader-program":20,"./webgl-resource-factory":23,"bind-decorator":undefined,"buffer":undefined,"gl-matrix":undefined}],27:[function(require,module,exports){
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
    gl_FragColor = light.ambientColor + getLightColor(light, vNormal);
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
        libraryProvider.addLibrary(shader_1.ShaderDTO, [new library_provider_1.StaticSource(shaderConfig)]);
        libraryProvider.addLibrary(mesh_1.Mesh, [new library_provider_1.StaticSource(meshes)]);
    }
};
WebGLLibraryConfig = __decorate([
    __param(0, injector_plus_1.inject.provider(mallet_depedency_tree_1.MDT.Library)),
    __metadata("design:paramtypes", [library_provider_1.LibraryProvider])
], WebGLLibraryConfig);
exports.WebGLLibraryConfig = WebGLLibraryConfig;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,"/src\\mallet\\webgl\\webgl.library.config.js",arguments[3],arguments[4],arguments[5],arguments[6],"/src\\mallet\\webgl")

},{"../geometry/mesh":4,"../lib/injector-plus":8,"../library.provider":11,"../mallet.depedency-tree":14,"./shader":21,"buffer":undefined,"gl-matrix":undefined}],28:[function(require,module,exports){
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

},{"../geometry/geometry.module":3,"../lib/injector-plus":8,"../mallet.depedency-tree":14,"../mallet.module":15,"./webgl-stage":26,"./webgl-stage.component":25,"./webgl.library.config":27,"angular":undefined,"buffer":undefined}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL0dyZWcvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL21hbGxldC9hcHAtc3RhdGUuc2VydmljZS5qcyIsInNyYy9tYWxsZXQvZ2VvbWV0cnkvY2FtZXJhLmpzIiwic3JjL21hbGxldC9nZW9tZXRyeS9nZW9tZXRyeS5tb2R1bGUuanMiLCJzcmMvbWFsbGV0L2dlb21ldHJ5L21lc2guanMiLCJzcmMvbWFsbGV0L2dlb21ldHJ5L3RyYW5zZm9ybS5qcyIsInNyYy9tYWxsZXQvaW5kZXguanMiLCJzcmMvbWFsbGV0L2xpYi9kZWNvcmF0b3JzLmpzIiwic3JjL21hbGxldC9saWIvaW5qZWN0b3ItcGx1cy5qcyIsInNyYy9tYWxsZXQvbGliL2xvZ2dlci5qcyIsInNyYy9tYWxsZXQvbGliL3N0YXRlLW1hY2hpbmUuanMiLCJzcmMvbWFsbGV0L2xpYnJhcnkucHJvdmlkZXIuanMiLCJzcmMvbWFsbGV0L2xvZ2dlci5zZXJ2aWNlLmpzIiwic3JjL21hbGxldC9tYWxsZXQuY29uc3RhbnRzLmpzIiwic3JjL21hbGxldC9tYWxsZXQuZGVwZWRlbmN5LXRyZWUuanMiLCJzcmMvbWFsbGV0L21hbGxldC5tb2R1bGUuanMiLCJzcmMvbWFsbGV0L3JlbmRlci10YXJnZXQuY29tcG9uZW50LmpzIiwic3JjL21hbGxldC9yZW5kZXItdGFyZ2V0LmZhY3RvcnkuanMiLCJzcmMvbWFsbGV0L3NjaGVkdWxlci5zZXJ2aWNlLmpzIiwic3JjL21hbGxldC93ZWJnbC9idWZmZXItZm9ybWF0LmpzIiwic3JjL21hbGxldC93ZWJnbC9zaGFkZXItcHJvZ3JhbS5qcyIsInNyYy9tYWxsZXQvd2ViZ2wvc2hhZGVyLmpzIiwic3JjL21hbGxldC93ZWJnbC93ZWJnbC1tZXNoLmpzIiwic3JjL21hbGxldC93ZWJnbC93ZWJnbC1yZXNvdXJjZS1mYWN0b3J5LmpzIiwic3JjL21hbGxldC93ZWJnbC93ZWJnbC1yZXNvdXJjZS5qcyIsInNyYy9tYWxsZXQvd2ViZ2wvd2ViZ2wtc3RhZ2UuY29tcG9uZW50LmpzIiwic3JjL21hbGxldC93ZWJnbC93ZWJnbC1zdGFnZS5qcyIsInNyYy9tYWxsZXQvd2ViZ2wvd2ViZ2wubGlicmFyeS5jb25maWcuanMiLCJzcmMvbWFsbGV0L3dlYmdsL3dlYmdsLm1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDckxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzVOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbmplY3Rvcl9wbHVzXzEgPSByZXF1aXJlKFwiLi9saWIvaW5qZWN0b3ItcGx1c1wiKTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbmNvbnN0IGxvZ2dlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9sb2dnZXIuc2VydmljZVwiKTtcclxuY29uc3Qgc3RhdGVfbWFjaGluZV8xID0gcmVxdWlyZShcIi4vbGliL3N0YXRlLW1hY2hpbmVcIik7XHJcbmxldCBBcHBTdGF0ZSA9IGNsYXNzIEFwcFN0YXRlIGV4dGVuZHMgc3RhdGVfbWFjaGluZV8xLlN0YXRlTWFjaGluZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigkbG9jYXRpb24sIGxvZ2dlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy4kbG9jYXRpb24gPSAkbG9jYXRpb247XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy5jbGVhclN0YXRlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgZXhjbHVzaXZpdHkgcnVsZXMgZm9yIGFwcCBzdGF0ZXMgdG8gYmFzaWMgc3RhdGUtbWFjaGluZSBmdW5jdGlvbmFsaXR5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbmV3U3RhdGVcclxuICAgICAqL1xyXG4gICAgYWRkU3RhdGUobmV3U3RhdGUpIHtcclxuICAgICAgICBzd2l0Y2ggKG5ld1N0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQXBwU3RhdGUuU3VzcGVuZGVkOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTdGF0ZShBcHBTdGF0ZS5SdW5uaW5nIHwgQXBwU3RhdGUuTG9hZGluZyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBBcHBTdGF0ZS5SdW5uaW5nOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTdGF0ZShBcHBTdGF0ZS5TdXNwZW5kZWQgfCBBcHBTdGF0ZS5Mb2FkaW5nKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cGVyLmFkZFN0YXRlKG5ld1N0YXRlKTtcclxuICAgIH1cclxuICAgIGNsZWFyU3RhdGUoKSB7XHJcbiAgICAgICAgY29uc3QgZGVidWcgPSB0aGlzLiRsb2NhdGlvbi5zZWFyY2goKS5kZWJ1ZyA9PT0gJzEnID8gQXBwU3RhdGUuRGVidWcgOiAwO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoQXBwU3RhdGUuTG9hZGluZyB8IGRlYnVnKTtcclxuICAgICAgICB0aGlzLnJlbW92ZVN0YXRlTGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcbn07XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgQXBwU3RhdGUsIFwiUnVubmluZ1wiLCB2b2lkIDApO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHN0YXRlX21hY2hpbmVfMS5zdGF0ZSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXHJcbl0sIEFwcFN0YXRlLCBcIkxvYWRpbmdcIiwgdm9pZCAwKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBzdGF0ZV9tYWNoaW5lXzEuc3RhdGUsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxyXG5dLCBBcHBTdGF0ZSwgXCJEZWJ1Z1wiLCB2b2lkIDApO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHN0YXRlX21hY2hpbmVfMS5zdGF0ZSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXHJcbl0sIEFwcFN0YXRlLCBcIlN1c3BlbmRlZFwiLCB2b2lkIDApO1xyXG5BcHBTdGF0ZSA9IF9fZGVjb3JhdGUoW1xyXG4gICAgX19wYXJhbSgwLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5uZy4kbG9jYXRpb24pKSxcclxuICAgIF9fcGFyYW0oMSwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuTG9nZ2VyKSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdCwgbG9nZ2VyX3NlcnZpY2VfMS5Mb2dnZXJdKVxyXG5dLCBBcHBTdGF0ZSk7XHJcbmV4cG9ydHMuQXBwU3RhdGUgPSBBcHBTdGF0ZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXN0YXRlLnNlcnZpY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZ2xfbWF0cml4XzEgPSByZXF1aXJlKFwiZ2wtbWF0cml4XCIpO1xyXG5jb25zdCB0cmFuc2Zvcm1fMSA9IHJlcXVpcmUoXCIuL3RyYW5zZm9ybVwiKTtcclxuY2xhc3MgQ2FtZXJhIHtcclxuICAgIGNvbnN0cnVjdG9yKGFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBuZXcgdHJhbnNmb3JtXzEuVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uTWF0cml4ID0gZ2xfbWF0cml4XzEubWF0NC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLnZpZXdNYXRyaXggPSBnbF9tYXRyaXhfMS5tYXQ0LmNyZWF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZm9yd2FyZCA9IGdsX21hdHJpeF8xLnZlYzMuZnJvbVZhbHVlcygwLCAwLCAtMSk7XHJcbiAgICAgICAgdGhpcy5zdGFsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGlzcCA9IGdsX21hdHJpeF8xLnZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgdGhpcy51cCA9IGdsX21hdHJpeF8xLnZlYzMuZnJvbVZhbHVlcygwLCAxLCAwKTtcclxuICAgICAgICB0aGlzLnNldEFzcGVjdFJhdGlvKGFzcGVjdFJhdGlvKTtcclxuICAgIH1cclxuICAgIGdldEZvcndhcmQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhbGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgZ2xfbWF0cml4XzEudmVjMy50cmFuc2Zvcm1RdWF0KHRoaXMuZm9yd2FyZCwgdGhpcy5mb3J3YXJkLCB0aGlzLnRyYW5zZm9ybS5nZXRSb3RhdGlvbigpKTtcclxuICAgICAgICAgICAgdGhpcy5zdGFsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5mb3J3YXJkO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGR0LCB0dCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld01hdHJpeCgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmlld01hdHJpeCgpIHtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGdsX21hdHJpeF8xLnZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEudmVjMy5hZGQocG9zaXRpb24sIHRoaXMudHJhbnNmb3JtLmdldFBvc2l0aW9uKCksIHRoaXMuZ2V0Rm9yd2FyZCgpKTtcclxuICAgICAgICBnbF9tYXRyaXhfMS5tYXQ0Lmxvb2tBdCh0aGlzLnZpZXdNYXRyaXgsIHRoaXMudHJhbnNmb3JtLmdldFBvc2l0aW9uKCksIHBvc2l0aW9uLCB0aGlzLnVwKTtcclxuICAgIH1cclxuICAgIHNldEFzcGVjdFJhdGlvKGFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgdGhpcy5hc3BlY3RSYXRpbyA9IGFzcGVjdFJhdGlvO1xyXG4gICAgICAgIC8vIGNyZWF0ZS91cGRhdGUgdGhlIHByb2plY3Rpb24gbWF0cml4XHJcbiAgICAgICAgZ2xfbWF0cml4XzEubWF0NC5wZXJzcGVjdGl2ZSh0aGlzLnByb2plY3Rpb25NYXRyaXgsIE1hdGguUEkgLyAyLCAvLyB2ZXJ0aWNhbCBmaWVsZCBvZiB2aWV3IChyYWRpYW5zKVxyXG4gICAgICAgIHRoaXMuYXNwZWN0UmF0aW8sIC8vIGFzcGVjdCByYXRpbywgZnJhY3Rpb25cclxuICAgICAgICAwLjEsIC8vIG5lYXIgY2xpcHBpbmcgZGlzdGFuY2VcclxuICAgICAgICAxMDApOyAvLyBmYXIgY2xpcHBpbmcgZGlzdGFuY2VcclxuICAgIH1cclxuICAgIGFkdmFuY2UoZGlzdGFuY2UpIHtcclxuICAgICAgICB0aGlzLnN0YWxlID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGdsX21hdHJpeF8xLnZlYzMuY2xvbmUodGhpcy50cmFuc2Zvcm0uZ2V0UG9zaXRpb24oKSk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEudmVjMy5zY2FsZSh0aGlzLmRpc3AsIHRoaXMuZ2V0Rm9yd2FyZCgpLCBkaXN0YW5jZSk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEudmVjMy5hZGQocG9zaXRpb24sIHBvc2l0aW9uLCB0aGlzLmRpc3ApO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtLnNldFBvc2l0aW9uLmFwcGx5KHRoaXMudHJhbnNmb3JtLCBwb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgICBzdHJhZmUoZGlzdGFuY2UpIHtcclxuICAgICAgICB0aGlzLnN0YWxlID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGdsX21hdHJpeF8xLnZlYzMuY2xvbmUodGhpcy50cmFuc2Zvcm0uZ2V0UG9zaXRpb24oKSk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEudmVjMy5jcm9zcyh0aGlzLmRpc3AsIHRoaXMuZ2V0Rm9yd2FyZCgpLCBbMCwgMSwgMF0pO1xyXG4gICAgICAgIGdsX21hdHJpeF8xLnZlYzMuc2NhbGUodGhpcy5kaXNwLCB0aGlzLmRpc3AsIGRpc3RhbmNlKTtcclxuICAgICAgICBnbF9tYXRyaXhfMS52ZWMzLmFkZChwb3NpdGlvbiwgcG9zaXRpb24sIHRoaXMuZGlzcCk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0uc2V0UG9zaXRpb24uYXBwbHkodGhpcy50cmFuc2Zvcm0sIHBvc2l0aW9uKTtcclxuICAgIH1cclxuICAgIGFzY2VuZChkaXN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMuc3RhbGUgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2xfbWF0cml4XzEudmVjMy5jbG9uZSh0aGlzLnRyYW5zZm9ybS5nZXRQb3NpdGlvbigpKTtcclxuICAgICAgICBnbF9tYXRyaXhfMS52ZWMzLnNjYWxlKHRoaXMuZGlzcCwgdGhpcy51cCwgZGlzdGFuY2UpO1xyXG4gICAgICAgIGdsX21hdHJpeF8xLnZlYzMuYWRkKHBvc2l0aW9uLCBwb3NpdGlvbiwgdGhpcy5kaXNwKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS5zZXRQb3NpdGlvbi5hcHBseSh0aGlzLnRyYW5zZm9ybSwgcG9zaXRpb24pO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybS5yb3RhdGVCeSh4LCB5LCAwKTtcclxuICAgIH1cclxuICAgIGdldFRyYW5zZm9ybSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm07XHJcbiAgICB9XHJcbiAgICBnZXRWaWV3TWF0cml4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZXdNYXRyaXg7XHJcbiAgICB9XHJcbiAgICBnZXRQcm9qZWN0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Rpb25NYXRyaXg7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5DYW1lcmEgPSBDYW1lcmE7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhbWVyYS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBhbmd1bGFyID0gcmVxdWlyZShcImFuZ3VsYXJcIik7XHJcbmV4cG9ydHMubWFsbGV0R2VvbWV0cnkgPSBhbmd1bGFyLm1vZHVsZSgnbWFsbGV0Lmdlb21ldHJ5JywgW10pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZW9tZXRyeS5tb2R1bGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZ2xNYXRyaXggPSByZXF1aXJlKFwiZ2wtbWF0cml4XCIpO1xyXG5jb25zdCB7IHZlYzMgfSA9IGdsTWF0cml4O1xyXG5jbGFzcyBNZXNoIHtcclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lcyBhIHNldCBvZiBwb2ludHMgaW4gc3BhY2UgYW5kIGhvdyB0aGV5IGZvcm0gYSAzRCBvYmplY3RcclxuICAgICAqIEBwYXJhbSB7SU1lc2hPcHRpb25zfSBwYXJhbXNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBwYXJhbXMucG9zaXRpb25zO1xyXG4gICAgICAgIHRoaXMuaW5kaWNlcyA9IHBhcmFtcy5pbmRpY2VzO1xyXG4gICAgICAgIHRoaXMudmVydGV4Q291bnQgPSAocGFyYW1zLnBvc2l0aW9ucy5sZW5ndGggLyAzKSB8IDA7XHJcbiAgICAgICAgdGhpcy5pbmRleENvdW50ID0gcGFyYW1zLmluZGljZXMubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IE1lc2guZ2V0U2l6ZShwYXJhbXMucG9zaXRpb25zKTtcclxuICAgICAgICBjb25zdCBmYWNlTm9ybWFscyA9IE1lc2guY2FsY3VsYXRlRmFjZU5vcm1hbHModGhpcy5wb3NpdGlvbnMsIHRoaXMuaW5kaWNlcykgfHwgW107XHJcbiAgICAgICAgY29uc3QgdmVydGV4Tm9ybWFscyA9IE1lc2guY2FsY3VsYXRlVmVydGV4Tm9ybWFscyh0aGlzLnBvc2l0aW9ucywgdGhpcy5pbmRpY2VzLCBmYWNlTm9ybWFscyk7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXIgPSBPYmplY3QuZnJlZXplKE1lc2guYnVpbGRWZXJ0ZXhCdWZmZXIodGhpcy5wb3NpdGlvbnMsIHZlcnRleE5vcm1hbHMsIHBhcmFtcy5jb2xvcnMpKTtcclxuICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gT2JqZWN0LmZyZWV6ZSgobmV3IFVpbnQxNkFycmF5KHRoaXMuaW5kaWNlcykpLmJ1ZmZlcik7XHJcbiAgICAgICAgT2JqZWN0LnNlYWwodGhpcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgbWVzaCBidWZmZXJcclxuICAgICAqIEBwYXJhbSB2ZXJ0c1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0U2l6ZSh2ZXJ0cykge1xyXG4gICAgICAgIGlmICh2ZXJ0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1pbiA9IHZlYzMuY2xvbmUodmVydHNbMF0pO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IHZlYzMuY2xvbmUodmVydHNbMF0pO1xyXG4gICAgICAgIHZlcnRzLmZvckVhY2goKHYpID0+IHtcclxuICAgICAgICAgICAgaWYgKHZbMF0gPCBtaW5bMF0pIHtcclxuICAgICAgICAgICAgICAgIG1pblswXSA9IHZbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodlswXSA+IG1heFswXSkge1xyXG4gICAgICAgICAgICAgICAgbWF4WzBdID0gdlswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodlsxXSA8IG1pblsxXSkge1xyXG4gICAgICAgICAgICAgICAgbWluWzFdID0gdlsxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh2WzFdID4gbWF4WzFdKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhbMV0gPSB2WzFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2WzJdIDwgbWluWzJdKSB7XHJcbiAgICAgICAgICAgICAgICBtaW5bMl0gPSB2WzJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHZbMl0gPiBtYXhbMl0pIHtcclxuICAgICAgICAgICAgICAgIG1heFsyXSA9IHZbMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBzaXplID0gdmVjMy5jcmVhdGUoKTtcclxuICAgICAgICB2ZWMzLnN1YnRyYWN0KHNpemUsIG1pbiwgbWF4KTtcclxuICAgICAgICByZXR1cm4gc2l6ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgbm9ybWFscyBmb3IgZWFjaCBmYWNlXHJcbiAgICAgKiBAcGFyYW0ge2dsTWF0cml4LnZlYzNbXX0gdmVydHNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IGluZGljZXNcclxuICAgICAqIEByZXR1cm5zIHtnbE1hdHJpeC52ZWMzW119XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjYWxjdWxhdGVGYWNlTm9ybWFscyh2ZXJ0cywgaW5kaWNlcykge1xyXG4gICAgICAgIGNvbnN0IGZhY2VTaXplID0gMztcclxuICAgICAgICBpZiAoaW5kaWNlcy5sZW5ndGggJSBmYWNlU2l6ZSAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYWIgPSB2ZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGFjID0gdmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBjb25zdCBmYWNlTm9ybWFscyA9IG5ldyBBcnJheShNYXRoLmZsb29yKGluZGljZXMubGVuZ3RoIC8gZmFjZVNpemUpKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXMubGVuZ3RoOyBpICs9IGZhY2VTaXplKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSB2ZXJ0c1tpbmRpY2VzW2ldXTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IHZlcnRzW2luZGljZXNbaSArIDFdXTtcclxuICAgICAgICAgICAgY29uc3QgYyA9IHZlcnRzW2luZGljZXNbaSArIDJdXTtcclxuICAgICAgICAgICAgdmVjMy5zdWJ0cmFjdChhYiwgYiwgYSk7XHJcbiAgICAgICAgICAgIHZlYzMuc3VidHJhY3QoYWMsIGMsIGEpO1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWwgPSB2ZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB2ZWMzLmNyb3NzKG5vcm1hbCwgYWIsIGFjKTtcclxuICAgICAgICAgICAgdmVjMy5ub3JtYWxpemUobm9ybWFsLCBub3JtYWwpO1xyXG4gICAgICAgICAgICBjb25zdCBmYWNlSW5kZXggPSBpIC8gZmFjZVNpemU7XHJcbiAgICAgICAgICAgIGZhY2VOb3JtYWxzW2ZhY2VJbmRleF0gPSBub3JtYWw7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBGYWNlICR7ZmFjZUluZGV4fTogJHthbmdsZX0gJHtub3JtYWx9ICR7dW5pdE5vcm1hbH1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhY2VOb3JtYWxzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdmVydGV4IG5vcm1hbHMgYnkgYXZlcmFnaW5nIHRoZSBmYWNlIG5vcm1hbHMgZm9yIGVhY2ggdmVydGV4XHJcbiAgICAgKiBAcGFyYW0ge2dsTWF0cml4LnZlYzNbXX0gdmVydHNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IGluZGljZXNcclxuICAgICAqIEBwYXJhbSB7Z2xNYXRyaXgudmVjM1tdfSBmYWNlTm9ybWFsc1xyXG4gICAgICogQHJldHVybnMge2dsTWF0cml4LnZlYzNbXX1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNhbGN1bGF0ZVZlcnRleE5vcm1hbHModmVydHMsIGluZGljZXMsIGZhY2VOb3JtYWxzKSB7XHJcbiAgICAgICAgY29uc3QgdmVydGV4Tm9ybWFscyA9IHZlcnRzLm1hcCgoKSA9PiB2ZWMzLmNyZWF0ZSgpKTtcclxuICAgICAgICBjb25zdCBmYWNlU2l6ZSA9IDM7XHJcbiAgICAgICAgbGV0IGY7IC8vIGluZGV4IG9mIHRoZSBjdXJyZW50IGZhY2U7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGYgPSAoaSAvIGZhY2VTaXplKSB8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHZuID0gdmVydGV4Tm9ybWFsc1tpbmRpY2VzW2ldXTtcclxuICAgICAgICAgICAgdmVjMy5hZGQodm4sIHZuLCBmYWNlTm9ybWFsc1tmXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZlcnRleE5vcm1hbHMuZm9yRWFjaCgobm9ybWFsKSA9PiB2ZWMzLm5vcm1hbGl6ZShub3JtYWwsIG5vcm1hbCkpO1xyXG4gICAgICAgIHJldHVybiB2ZXJ0ZXhOb3JtYWxzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSB2ZXJ0ZXggYnVmZmVyIGZyb20gdGhlIHBvc2l0aW9ucyBhbmQgbm9ybWFscyBhcnJheXNcclxuICAgICAqIEBwYXJhbSB7Z2xNYXRyaXgudmVjM1tdfSBwb3NpdGlvbnNcclxuICAgICAqIEBwYXJhbSB7Z2xNYXRyaXgudmVjM1tdfSBub3JtYWxzXHJcbiAgICAgKiBAcGFyYW0ge2dsTWF0cml4LnZlYzNbXX0gY29sb3JzXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBidWlsZFZlcnRleEJ1ZmZlcihwb3NpdGlvbnMsIG5vcm1hbHMsIGNvbG9ycykge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zLmxlbmd0aCAqIE1lc2guVkVSVF9TSVpFKTtcclxuICAgICAgICBwb3NpdGlvbnMuZm9yRWFjaCgodmVydCwgaSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0SW5kZXggPSBpICogTWVzaC5WRVJUX1NJWkU7XHJcbiAgICAgICAgICAgIGJ1ZmZlclt2ZXJ0SW5kZXhdID0gdmVydFswXTtcclxuICAgICAgICAgICAgYnVmZmVyW3ZlcnRJbmRleCArIDFdID0gdmVydFsxXTtcclxuICAgICAgICAgICAgYnVmZmVyW3ZlcnRJbmRleCArIDJdID0gdmVydFsyXTtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gbm9ybWFsc1tpXTtcclxuICAgICAgICAgICAgYnVmZmVyW3ZlcnRJbmRleCArIDNdID0gbm9ybWFsWzBdO1xyXG4gICAgICAgICAgICBidWZmZXJbdmVydEluZGV4ICsgNF0gPSBub3JtYWxbMV07XHJcbiAgICAgICAgICAgIGJ1ZmZlclt2ZXJ0SW5kZXggKyA1XSA9IG5vcm1hbFsyXTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBjb2xvcnNbaV07XHJcbiAgICAgICAgICAgIGJ1ZmZlclt2ZXJ0SW5kZXggKyA2XSA9IGNvbG9yWzBdO1xyXG4gICAgICAgICAgICBidWZmZXJbdmVydEluZGV4ICsgN10gPSBjb2xvclsxXTtcclxuICAgICAgICAgICAgYnVmZmVyW3ZlcnRJbmRleCArIDhdID0gY29sb3JbMl07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYnVmZmVyKTtcclxuICAgICAgICByZXR1cm4gYnVmZmVyLmJ1ZmZlcjtcclxuICAgIH1cclxuICAgIGdldFZlcnRleENvdW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZlcnRleENvdW50O1xyXG4gICAgfVxyXG4gICAgZ2V0SW5kZXhDb3VudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleENvdW50O1xyXG4gICAgfVxyXG4gICAgZ2V0VmVydGV4QnVmZmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZlcnRleEJ1ZmZlcjtcclxuICAgIH1cclxuICAgIGdldEluZGV4QnVmZmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4QnVmZmVyO1xyXG4gICAgfVxyXG59XHJcbk1lc2guVkVSVF9TSVpFID0gOTtcclxuZXhwb3J0cy5NZXNoID0gTWVzaDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVzaC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBnbE1hdHJpeCA9IHJlcXVpcmUoXCJnbC1tYXRyaXhcIik7XHJcbmNvbnN0IHsgdmVjMywgbWF0NCwgcXVhdCB9ID0gZ2xNYXRyaXg7XHJcbmNsYXNzIFRyYW5zZm9ybSB7XHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhbmQgbWFuaXB1bGF0ZXMgX3Bvc2l0aW9uLCBzY2FsZSwgYW5kIHJvdGF0aW9uIGRhdGEgZm9yIGFuIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHtUcmFuc2Zvcm19IFtwYXJlbnQ9bnVsbF1cclxuICAgICAqXHJcbiAgICAgKiBAcHJvcGVydHkge1ZlY3RvcjN9IHBvc2l0aW9uXHJcbiAgICAgKiBAcHJvcGVydHkge1ZlY3RvcjN9IHNjYWxlXHJcbiAgICAgKiBAcHJvcGVydHkge1ZlY3RvcjN9IHJvdGF0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB2ZWMzLmZyb21WYWx1ZXMoMCwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IHZlYzMuZnJvbVZhbHVlcygxLCAxLCAxKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gcXVhdC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IG1hdDQuY3JlYXRlKCk7XHJcbiAgICAgICAgbWF0NC5pZGVudGl0eSh0aGlzLm1hdHJpeCk7XHJcbiAgICAgICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgT2JqZWN0LnNlYWwodGhpcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcGFyZW50IHRyYW5zZm9ybVxyXG4gICAgICogQHJldHVybnMge0lUcmFuc2Zvcm19XHJcbiAgICAgKi9cclxuICAgIGdldFBhcmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbGF0ZSB0aGUgdHJhbnNmb3JtIHVzaW5nIHRoZSB2ZWxvY2l0eSBzY2FsZWQgYnkgZGVsdGFUaW1lXHJcbiAgICAgKiBAcGFyYW0gdmVsb2NpdHlcclxuICAgICAqIEBwYXJhbSBkZWx0YVRpbWVcclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XHJcbiAgICAgKi9cclxuICAgIHZUaW1lVHJhbnNsYXRlKHZlbG9jaXR5LCBkZWx0YVRpbWUpIHtcclxuICAgICAgICBjb25zdCBQeCA9IHRoaXMucG9zaXRpb25bMF0gKyB2ZWxvY2l0eVswXSAqIGRlbHRhVGltZTtcclxuICAgICAgICBjb25zdCBQeSA9IHRoaXMucG9zaXRpb25bMV0gKyB2ZWxvY2l0eVsxXSAqIGRlbHRhVGltZTtcclxuICAgICAgICBjb25zdCBQeiA9IHRoaXMucG9zaXRpb25bMl0gKyB2ZWxvY2l0eVsyXSAqIGRlbHRhVGltZTtcclxuICAgICAgICB2ZWMzLnNldCh0aGlzLnBvc2l0aW9uLCBQeCwgUHksIFB6KTtcclxuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0UG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XHJcbiAgICB9XHJcbiAgICBzZXRQb3NpdGlvbih4LCB5LCB6KSB7XHJcbiAgICAgICAgdmVjMy5zZXQodGhpcy5wb3NpdGlvbiwgeCwgeSwgeik7XHJcbiAgICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogbW92ZSB0aGUgdHJhbnNmb3JtIGJ5IHRoZSBnaXZlbiBhbW91bnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ldXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3pdXHJcbiAgICAgKiBAcmV0dXJucyB7VHJhbnNmb3JtfVxyXG4gICAgICovXHJcbiAgICB0cmFuc2xhdGUoeCwgeSwgeikge1xyXG4gICAgICAgIGNvbnN0IFB4ID0gdGhpcy5wb3NpdGlvblswXSArIHg7XHJcbiAgICAgICAgY29uc3QgUHkgPSB0aGlzLnBvc2l0aW9uWzFdICsgeTtcclxuICAgICAgICBjb25zdCBQeiA9IHRoaXMucG9zaXRpb25bMl0gKyB6O1xyXG4gICAgICAgIHZlYzMuc2V0KHRoaXMucG9zaXRpb24sIFB4LCBQeSwgUHopO1xyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbGF0ZSBieSBhIHZlY3RvclxyXG4gICAgICogQHBhcmFtIHtnbE1hdHJpeC52ZWMzfSBkZWx0YVxyXG4gICAgICovXHJcbiAgICB2VHJhbnNsYXRlKGRlbHRhKSB7XHJcbiAgICAgICAgdmVjMy5hZGQodGhpcy5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvbiwgZGVsdGEpO1xyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBnZXRTY2FsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZTtcclxuICAgIH1cclxuICAgIHNldFNjYWxlKHgsIHksIHopIHtcclxuICAgICAgICB2ZWMzLnNldCh0aGlzLnNjYWxlLCB4LCB5LCB6KTtcclxuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBzY2FsZSB0aGUgdHJhbnNmb3JtIGJ5IHRoZSBnaXZlbiBhbW91bnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfFZlY3RvcjN9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeV1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbel1cclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XHJcbiAgICAgKi9cclxuICAgIHNjYWxlQnkoeCwgeSwgeikge1xyXG4gICAgICAgIGNvbnN0IFN4ID0gdGhpcy5zY2FsZVswXSAqIHg7XHJcbiAgICAgICAgY29uc3QgU3kgPSB0aGlzLnNjYWxlWzFdICogeTtcclxuICAgICAgICBjb25zdCBTeiA9IHRoaXMuc2NhbGVbMl0gKiB6O1xyXG4gICAgICAgIHZlYzMuc2V0KHRoaXMuc2NhbGUsIFN4LCBTeSwgU3opO1xyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNjYWxlIGJ5IHZlY3RvclxyXG4gICAgICogQHBhcmFtIHtnbE1hdHJpeC52ZWMzfSBzY2FsZVxyXG4gICAgICogQHJldHVybnMge1RyYW5zZm9ybX1cclxuICAgICAqL1xyXG4gICAgdlNjYWxlQnkoc2NhbGUpIHtcclxuICAgICAgICB2ZWMzLm11bHRpcGx5KHRoaXMuc2NhbGUsIHRoaXMuc2NhbGUsIHNjYWxlKTtcclxuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0Um90YXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRpb247XHJcbiAgICB9XHJcbiAgICBzZXRSb3RhdGlvbih5YXcsIHBpdGNoLCByb2xsKSB7XHJcbiAgICAgICAgcXVhdC5mcm9tRXVsZXIodGhpcy5yb3RhdGlvbiwgeWF3LCBwaXRjaCwgcm9sbCk7XHJcbiAgICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHZTZXRSb3RhdGlvbihyb3RhdGlvbikge1xyXG4gICAgICAgIHF1YXQuZnJvbUV1bGVyKHRoaXMucm90YXRpb24sIHJvdGF0aW9uWzBdLCByb3RhdGlvblsxXSwgcm90YXRpb25bMl0pO1xyXG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJvdGF0ZSB0aGUgdHJhbnNmb3JtIGJ5IHRoZSBnaXZlbiBhbW91bnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfFZlY3RvcjN9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeV1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbel1cclxuICAgICAqIEByZXR1cm5zIHtUcmFuc2Zvcm19XHJcbiAgICAgKi9cclxuICAgIHJvdGF0ZUJ5KHgsIHksIHopIHtcclxuICAgICAgICBxdWF0LnJvdGF0ZVgodGhpcy5yb3RhdGlvbiwgdGhpcy5yb3RhdGlvbiwgeCk7XHJcbiAgICAgICAgcXVhdC5yb3RhdGVZKHRoaXMucm90YXRpb24sIHRoaXMucm90YXRpb24sIHkpO1xyXG4gICAgICAgIHF1YXQucm90YXRlWih0aGlzLnJvdGF0aW9uLCB0aGlzLnJvdGF0aW9uLCB6KTtcclxuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgdlJvdGF0ZUJ5KGRlbHRhKSB7XHJcbiAgICAgICAgcXVhdC5yb3RhdGVYKHRoaXMucm90YXRpb24sIHRoaXMucm90YXRpb24sIGRlbHRhWzBdKTtcclxuICAgICAgICBxdWF0LnJvdGF0ZVkodGhpcy5yb3RhdGlvbiwgdGhpcy5yb3RhdGlvbiwgZGVsdGFbMV0pO1xyXG4gICAgICAgIHF1YXQucm90YXRlWih0aGlzLnJvdGF0aW9uLCB0aGlzLnJvdGF0aW9uLCBkZWx0YVsyXSk7XHJcbiAgICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB0cmFuc2Zvcm0gbWF0cml4LCByZS1jYWxjdWxhdGluZyB2YWx1ZXMgaWYgdHJhbnNmb3JtIGlzIGRpcnR5XHJcbiAgICAgKiBAcmV0dXJucyB7Z2xNYXRyaXgubWF0NH1cclxuICAgICAqL1xyXG4gICAgZ2V0TWF0cml4KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGlydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG1hdDQuZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZU9yaWdpbih0aGlzLm1hdHJpeCwgdGhpcy5yb3RhdGlvbiwgdGhpcy5wb3NpdGlvbiwgdGhpcy5zY2FsZSwgdGhpcy5vcmlnaW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tYXRyaXg7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UcmFuc2Zvcm0gPSBUcmFuc2Zvcm07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyYW5zZm9ybS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuZnVuY3Rpb24gX19leHBvcnQobSkge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8gY29yZSBtYWxsZXRcclxuX19leHBvcnQocmVxdWlyZShcIi4vbWFsbGV0LmRlcGVkZW5jeS10cmVlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vbGliL2xvZ2dlclwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2xpYi9pbmplY3Rvci1wbHVzXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vcmVuZGVyLXRhcmdldC5mYWN0b3J5XCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vcmVuZGVyLXRhcmdldC5jb21wb25lbnRcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zY2hlZHVsZXIuc2VydmljZVwiKSk7XHJcbi8vIGdlb21ldHJ5XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2dlb21ldHJ5L3RyYW5zZm9ybVwiKSk7XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2dlb21ldHJ5L21lc2hcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9nZW9tZXRyeS9jYW1lcmFcIikpO1xyXG4vLyBjYW52YXMgMmRcclxuLy8gd2ViZ2xcclxuX19leHBvcnQocmVxdWlyZShcIi4vd2ViZ2wvd2ViZ2wubW9kdWxlXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vd2ViZ2wvd2ViZ2wtc3RhZ2VcIikpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIENyZWF0ZWQgYnkgR3JlZyBvbiAzLzI0LzIwMTcuXHJcbiAqL1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBAZW51bWVyYWJsZSBkZWNvcmF0b3IgdGhhdCBzZXRzIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG9mIGEgY2xhc3MgZmllbGQgdG8gZmFsc2UuXHJcbiAqIEBwYXJhbSB2YWx1ZSB0cnVlfGZhbHNlXHJcbiAqL1xyXG5mdW5jdGlvbiBlbnVtZXJhYmxlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gKHRhcmdldCwgcHJvcGVydHlLZXkpID0+IHtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KSB8fCB7fTtcclxuICAgICAgICBpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZW51bWVyYWJsZSA9IGVudW1lcmFibGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlY29yYXRvcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcInJlZmxlY3QtbWV0YWRhdGFcIik7XHJcbmNvbnN0IGxvZ2dlcl8xID0gcmVxdWlyZShcIi4vbG9nZ2VyXCIpO1xyXG5jb25zdCBsb2dnZXIgPSBuZXcgbG9nZ2VyXzEuTG9nZ2VyKCk7XHJcbmNvbnN0IGluamVjdGFibGVNZXRob2ROYW1lID0gJ2V4ZWMnO1xyXG5jb25zdCBwcm92aWRlckdldCA9ICckZ2V0JztcclxuY29uc3QgYW5ub3RhdGlvbktleSA9IFN5bWJvbCgnZGVwZW5kZW5jaWVzJyk7XHJcbi8qKlxyXG4gKiBEZWZpbmUgdGhlIGluamVjdGlvbiBhbm5vdGF0aW9uIGZvciBhIGdpdmVuIGFuZ3VsYXIgcHJvdmlkZXJcclxuICogQHBhcmFtIHtzdHJpbmd9IGlkZW50aWZpZXJcclxuICogQHJldHVybnMge1BhcmFtZXRlckRlY29yYXRvcn1cclxuICovXHJcbmZ1bmN0aW9uIGluamVjdChpZGVudGlmaWVyKSB7XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2FsbGFibGUtdHlwZXNcclxuICAgIHJldHVybiBmdW5jdGlvbiBhbm5vdGF0aW9uKHRhcmdldCwga2V5LCBpbmRleCkge1xyXG4gICAgICAgIGlmIChrZXkgJiYga2V5ICE9PSBpbmplY3RhYmxlTWV0aG9kTmFtZSAmJiBrZXkgIT09IHByb3ZpZGVyR2V0KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0RlcGVuZGVuY2llcyBjYW4gb25seSBiZSBpbmplY3RlZCBvbiBjb25zdHJ1Y3RvciwgaW5qZWN0YWJsZSBtZXRob2QgZXhlY3V0b3IsIG9yIHByb3ZpZGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGtleSkge1xyXG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQuY29uc3RydWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFubm90YXRpb25zID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShhbm5vdGF0aW9uS2V5LCB0YXJnZXQpIHx8IG5ldyBBcnJheSh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBhbm5vdGF0aW9uc1tpbmRleF0gPSBpZGVudGlmaWVyO1xyXG4gICAgICAgIGxvZ2dlci52ZXJib3NlKGBBZGQgaW5qZWN0aW9uICR7aWRlbnRpZmllcn0gdG8gJHt0YXJnZXQubmFtZX1gKTtcclxuICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGFubm90YXRpb25LZXksIGFubm90YXRpb25zLCB0YXJnZXQpO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmluamVjdCA9IGluamVjdDtcclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW5hbWVzcGFjZVxyXG4oZnVuY3Rpb24gKGluamVjdCkge1xyXG4gICAgaW5qZWN0LnByb3ZpZGVyID0gKGlkZW50aWZpZXIpID0+IGluamVjdChgJHtpZGVudGlmaWVyfVByb3ZpZGVyYCk7XHJcbn0pKGluamVjdCA9IGV4cG9ydHMuaW5qZWN0IHx8IChleHBvcnRzLmluamVjdCA9IHt9KSk7XHJcbmZ1bmN0aW9uIG5nQW5ub3RhdGVQcm92aWRlcihjb25zdHJ1Y3Rvcikge1xyXG4gICAgY29uc3QgcHJvdmlkZXIgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XHJcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoYW5ub3RhdGlvbktleSwgY29uc3RydWN0b3IpIHx8IFtdO1xyXG4gICAgY29uc3QgbWV0aG9kID0gcHJvdmlkZXIuJGdldDtcclxuICAgIGlmIChhbm5vdGF0aW9ucy5sZW5ndGggIT09IG1ldGhvZC5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFubm90YXRpb25zIGFyZSBub3QgZGVmaW5lZCBmb3IgYWxsIGRlcGVuZGVuY2llcyBvZiAke21ldGhvZC5uYW1lfTogXHJcbiAgICAgICAgICAgIGV4cGVjdGVkICR7bWV0aG9kLmxlbmd0aH0gYW5ub3RhdGlvbnMgYW5kIGZvdW5kICR7YW5ub3RhdGlvbnMubGVuZ3RofWApO1xyXG4gICAgfVxyXG4gICAgbG9nZ2VyLnZlcmJvc2UoYEFubm90YXRlZCAke2Fubm90YXRpb25zLmxlbmd0aH0gcHJvdmlkZXIgZGVwZW5kZW5jaWVzIGZvciAke2NvbnN0cnVjdG9yLm5hbWV9YCk7XHJcbiAgICBwcm92aWRlci4kZ2V0ID0gWy4uLmFubm90YXRpb25zLCBtZXRob2RdO1xyXG59XHJcbmV4cG9ydHMubmdBbm5vdGF0ZVByb3ZpZGVyID0gbmdBbm5vdGF0ZVByb3ZpZGVyO1xyXG4vKipcclxuICogQ29uc3RydWN0IGFuIGFuZ3VsYXIgYW5ub3RhdGlvbiBhcnJheSBmcm9tIGRlcGVuZGVuY3kgbWV0YWRhdGFcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJvdmlkZXJcclxuICogQHJldHVybnMge0FycmF5PHN0cmluZyB8IEZ1bmN0aW9uPn1cclxuICovXHJcbmZ1bmN0aW9uIG5nQW5ub3RhdGUocHJvdmlkZXIpIHtcclxuICAgIGNvbnN0IGFubm90YXRpb25zID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShhbm5vdGF0aW9uS2V5LCBwcm92aWRlcikgfHwgW107XHJcbiAgICBsZXQgbWV0aG9kID0gcHJvdmlkZXI7XHJcbiAgICBsZXQgbWV0aG9kTmFtZSA9IHByb3ZpZGVyLm5hbWU7XHJcbiAgICBpZiAocHJvdmlkZXIubGVuZ3RoID09PSAwICYmIHByb3ZpZGVyLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShpbmplY3RhYmxlTWV0aG9kTmFtZSkpIHtcclxuICAgICAgICBtZXRob2QgPSBwcm92aWRlci5wcm90b3R5cGVbaW5qZWN0YWJsZU1ldGhvZE5hbWVdO1xyXG4gICAgICAgIG1ldGhvZE5hbWUgKz0gYC4ke2luamVjdGFibGVNZXRob2ROYW1lfWA7XHJcbiAgICB9XHJcbiAgICBpZiAoYW5ub3RhdGlvbnMubGVuZ3RoICE9PSBtZXRob2QubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbm5vdGF0aW9ucyBhcmUgbm90IGRlZmluZWQgZm9yIGFsbCBkZXBlbmRlbmNpZXMgb2YgJHttZXRob2ROYW1lfTogXHJcbiAgICAgICAgICAgIGV4cGVjdGVkICR7bWV0aG9kLmxlbmd0aH0gYW5ub3RhdGlvbnMgYW5kIGZvdW5kICR7YW5ub3RhdGlvbnMubGVuZ3RofWApO1xyXG4gICAgfVxyXG4gICAgbG9nZ2VyLnZlcmJvc2UoYEFubm90YXRlZCAke2Fubm90YXRpb25zLmxlbmd0aH0gZGVwZW5kZW5jaWVzIGZvciAke3Byb3ZpZGVyLm5hbWV9YCk7XHJcbiAgICByZXR1cm4gWy4uLmFubm90YXRpb25zLCBtZXRob2RdO1xyXG59XHJcbmV4cG9ydHMubmdBbm5vdGF0ZSA9IG5nQW5ub3RhdGU7XHJcbmZ1bmN0aW9uIGJ1aWxkVHJlZSh0cmVlLCBtb2R1bGUpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodHJlZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RyZWUgb2JqZWN0IG11c3QgYmUgc2VyaWFsaXphYmxlIHRvIGJ1aWxkIGEgdmFsaWQgdHJlZScpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdHJhdmVyc2VOb2RlKG5vZGUsIHByb3AsIGlkZW50aWZpZXIpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IG5vZGVbcHJvcF07XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBbLi4uaWRlbnRpZmllciwgcHJvcF0uam9pbignLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyYXZlcnNlTm9kZSh2YWx1ZSwga2V5LCBbLi4uaWRlbnRpZmllciwgcHJvcF0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBPYmplY3Qua2V5cyh0cmVlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICB0cmF2ZXJzZU5vZGUodHJlZSwga2V5LCBbbW9kdWxlXSk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmJ1aWxkVHJlZSA9IGJ1aWxkVHJlZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5qZWN0b3ItcGx1cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3Qgc3RhdGVfbWFjaGluZV8xID0gcmVxdWlyZShcIi4vc3RhdGUtbWFjaGluZVwiKTtcclxuLy8gZXZlbnR1YWwgc291cmNlIG1hcHBpbmcgc3R1ZmZcclxuLy8gY29uc3QgY29udmVydCA9IHJlcXVpcmUoJ2NvbnZlcnQtc291cmNlLW1hcCcpO1xyXG4vLyBjb25zdCBjdXJyZW50U2NyaXB0ID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XHJcbmNsYXNzIExldmVsIGV4dGVuZHMgc3RhdGVfbWFjaGluZV8xLlN0YXRlTWFjaGluZSB7XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBzdGF0ZV9tYWNoaW5lXzEuc3RhdGUsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxyXG5dLCBMZXZlbCwgXCJOb25lXCIsIHZvaWQgMCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgTGV2ZWwsIFwiRXJyb3JcIiwgdm9pZCAwKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBzdGF0ZV9tYWNoaW5lXzEuc3RhdGUsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxyXG5dLCBMZXZlbCwgXCJXYXJuXCIsIHZvaWQgMCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgTGV2ZWwsIFwiSW5mb1wiLCB2b2lkIDApO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHN0YXRlX21hY2hpbmVfMS5zdGF0ZSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXHJcbl0sIExldmVsLCBcIkRlYnVnXCIsIHZvaWQgMCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgc3RhdGVfbWFjaGluZV8xLnN0YXRlLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgTGV2ZWwsIFwiVmVyYm9zZVwiLCB2b2lkIDApO1xyXG5leHBvcnRzLkxldmVsID0gTGV2ZWw7XHJcbi8qKlxyXG4gKiBCcm93c2VyLWZyaWVuZGx5IGxvZ2dpbmcgdXRpbGl0eSB3aXRoIG11bHRpcGxlIGxvZ2dlcnMgYW5kIGxldmVsIHN3aXRjaGVzXHJcbiAqIEBhdXRob3IgR3JlZyBSb3ptYXJ5bm93eWN6PGdyZWdAdGh1bmRlcmxhYi5uZXQ+XHJcbiAqL1xyXG5jbGFzcyBMb2dnZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhY2tcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY2FsbHM9MF1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldFRyYWNlKHN0YWNrLCBjYWxscyA9IDApIHtcclxuICAgICAgICBjb25zdCBjYWxsID0gc3RhY2tcclxuICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVtjYWxscyArIDNdXHJcbiAgICAgICAgICAgIC5zcGxpdCgnIGF0ICcpLnBvcCgpO1xyXG4gICAgICAgIC8vIHdlIGhhdmUgdG8gdHJhY2UgYmFjayB0byAyIGNhbGxzIGJlY2F1c2Ugb2YgY2FsbHMgZnJvbSB0aGUgbG9nZ2VyXHJcbiAgICAgICAgY29uc3QgZmlsZSA9IGNhbGwuc3BsaXQoJy8nKS5wb3AoKTtcclxuICAgICAgICBjb25zdCBtZXRob2QgPSBjYWxsLnNwbGl0KCcgKCcpLnNoaWZ0KCk7XHJcbiAgICAgICAgcmV0dXJuIGAoJHttZXRob2R9OiR7ZmlsZX1gO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBMZXZlbCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2V0U3RhdGUoTGV2ZWwuSW5mbyk7XHJcbiAgICAgICAgLy8gYWRkIGNvbnNvbGUgbG9nZ2VyIGJ5IGRlZmF1bHRcclxuICAgICAgICB0aGlzLmxvZ2dlcnMgPSBbeyBsZXZlbDogTGV2ZWwuVmVyYm9zZSwgYXBpOiBjb25zb2xlIH1dO1xyXG4gICAgfVxyXG4gICAgYWRkTG9nZ2VyKGxvZ2dlciwgbG9nZ2VyTGV2ZWwpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlcnMucHVzaCh7IGFwaTogbG9nZ2VyLCBsZXZlbDogbG9nZ2VyTGV2ZWwgfSk7XHJcbiAgICB9XHJcbiAgICBjb25maWcocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zZXRTdGF0ZSh0eXBlb2YgKHBhcmFtcy5sZXZlbCkgIT09ICd1bmRlZmluZWQnID8gcGFyYW1zLmxldmVsIDogKHRoaXMuc3RhdGUuZ2V0U3RhdGUoKSB8fCBMZXZlbC5FcnJvcikpO1xyXG4gICAgfVxyXG4gICAgZXJyb3IoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmdldFN0YXRlKCkgPCBMZXZlbC5FcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9nT3V0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLCBMZXZlbC5FcnJvciwgJ2Vycm9yJyk7XHJcbiAgICB9XHJcbiAgICB3YXJuKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5nZXRTdGF0ZSgpIDwgTGV2ZWwuV2Fybikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9nT3V0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLCBMZXZlbC5XYXJuLCAnd2FybicpO1xyXG4gICAgfVxyXG4gICAgaW5mbyguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZ2V0U3RhdGUoKSA8IExldmVsLkluZm8pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ091dChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKSwgTGV2ZWwuSW5mbywgJ2luZm8nKTtcclxuICAgIH1cclxuICAgIGRlYnVnKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5nZXRTdGF0ZSgpIDwgTGV2ZWwuRGVidWcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ091dChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKSwgTGV2ZWwuRGVidWcsICdkZWJ1ZycpO1xyXG4gICAgfVxyXG4gICAgdmVyYm9zZSguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZ2V0U3RhdGUoKSA8IExldmVsLlZlcmJvc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ091dChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKSwgTGV2ZWwuVmVyYm9zZSwgJ2RlYnVnJyk7XHJcbiAgICB9XHJcbiAgICBsb2dPdXQoYXJncywgbXNnTGV2ZWwsIGZ1bmMpIHtcclxuICAgICAgICBjb25zdCBzdGFjayA9IEVycm9yKCkuc3RhY2s7XHJcbiAgICAgICAgY29uc3QgdHJhY2UgPSBMb2dnZXIuZ2V0VHJhY2Uoc3RhY2spO1xyXG4gICAgICAgIGNvbnN0IGxldmVsID0gdGhpcy5zdGF0ZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGlmIChtc2dMZXZlbCA+IGxldmVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYXJnc1swXSA9IGAke3RyYWNlfSAke2FyZ3NbMF19YDtcclxuICAgICAgICBhcmdzLnVuc2hpZnQodHJhY2UpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sb2dnZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBsb2dnZXJMZXZlbCA9IE51bWJlci5pc0ludGVnZXIodGhpcy5sb2dnZXJzW2ldLmxldmVsKSA/IHRoaXMubG9nZ2Vyc1tpXS5sZXZlbCA6IGxldmVsO1xyXG4gICAgICAgICAgICBpZiAobXNnTGV2ZWwgPD0gbG9nZ2VyTGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2Vyc1tpXS5hcGlbZnVuY10oLi4uYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Mb2dnZXIgPSBMb2dnZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ2dlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIENyZWF0ZWQgYnkgR3JlZyBvbiAzLzI0LzIwMTcuXHJcbiAqL1xyXG5jb25zdCBkZWNvcmF0b3JzXzEgPSByZXF1aXJlKFwiLi9kZWNvcmF0b3JzXCIpO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1zaGFkb3dlZC12YXJpYWJsZVxyXG5jbGFzcyBTdGF0ZUxpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgICBnZXRTdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZTtcclxuICAgIH1cclxuICAgIGludm9rZShwcmV2U3RhdGUpIHtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMuc3RhdGUsIHByZXZTdGF0ZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gc3RhdGUodGFyZ2V0LCBrZXkpIHtcclxuICAgIGlmIChkZWxldGUgdGFyZ2V0W2tleV0pIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IE1hdGgucG93KDIsIE9iamVjdC5rZXlzKHRhcmdldCkubGVuZ3RoKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnN0YXRlID0gc3RhdGU7XHJcbi8qIHRzbGludDpkaXNhYmxlOm5vLXNoYWRvd2VkLXZhcmlhYmxlICovXHJcbmNsYXNzIFN0YXRlTWFjaGluZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnN0YXRlID0gMDtcclxuICAgICAgICB0aGlzLnN0YXRlTGlzdGVuZXJzID0gW107XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYWxsKG1hY2hpbmUpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobWFjaGluZSkucmVkdWNlKChhbGwsIHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbGwgfCBtYWNoaW5lW3N0YXRlXTtcclxuICAgICAgICB9LCAwKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW5kaWNhdGVzIGlmIGEgZ2l2ZW4gc3RhdGUgaXMgYWN0aXZlXHJcbiAgICAgKiBAcGFyYW0gc3RhdGVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBpcyhzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybiAoc3RhdGUgfCB0aGlzLnN0YXRlKSA9PT0gdGhpcy5zdGF0ZTtcclxuICAgIH1cclxuICAgIGdldFN0YXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgZ2l2ZW4gc3RhdGVcclxuICAgICAqIEBwYXJhbSBzdGF0ZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIG9uU3RhdGUoc3RhdGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZUxpc3RlbmVycy5wdXNoKG5ldyBTdGF0ZUxpc3RlbmVyKHN0YXRlLCBjYWxsYmFjaykpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciBhbGwgc3RhdGUgbGlzdGVuZXJzXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVN0YXRlTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGVMaXN0ZW5lcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuICAgIHNldFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgcHJldlN0YXRlID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgaWYgKHByZXZTdGF0ZSAhPT0gdGhpcy5zdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmludm9rZVN0YXRlTGlzdGVuZXJzKHRoaXMuc3RhdGUsIHByZXZTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYWRkU3RhdGUoc3RhdGUpIHtcclxuICAgICAgICBjb25zdCBwcmV2U3RhdGUgPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgfD0gc3RhdGU7XHJcbiAgICAgICAgaWYgKHByZXZTdGF0ZSAhPT0gdGhpcy5zdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmludm9rZVN0YXRlTGlzdGVuZXJzKHRoaXMuc3RhdGUsIHByZXZTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IDA7XHJcbiAgICB9XHJcbiAgICByZW1vdmVTdGF0ZShzdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHByZXZTdGF0ZSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSBePSBzdGF0ZTtcclxuICAgICAgICBpZiAocHJldlN0YXRlICE9PSB0aGlzLnN0YXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW52b2tlU3RhdGVMaXN0ZW5lcnModGhpcy5zdGF0ZSwgcHJldlN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbnZva2VTdGF0ZUxpc3RlbmVycyhzdGF0ZSwgcHJldlN0YXRlKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKGxpc3RlbmVyLmdldFN0YXRlKCkgfCBzdGF0ZSkgPT09IHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5pbnZva2UocHJldlN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgZGVjb3JhdG9yc18xLmVudW1lcmFibGUoZmFsc2UpLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcclxuXSwgU3RhdGVNYWNoaW5lLnByb3RvdHlwZSwgXCJzdGF0ZVwiLCB2b2lkIDApO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGRlY29yYXRvcnNfMS5lbnVtZXJhYmxlKGZhbHNlKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBBcnJheSlcclxuXSwgU3RhdGVNYWNoaW5lLnByb3RvdHlwZSwgXCJzdGF0ZUxpc3RlbmVyc1wiLCB2b2lkIDApO1xyXG5leHBvcnRzLlN0YXRlTWFjaGluZSA9IFN0YXRlTWFjaGluZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhdGUtbWFjaGluZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY29uc3QgYW5ndWxhciA9IHJlcXVpcmUoXCJhbmd1bGFyXCIpO1xyXG5jbGFzcyBEVE8ge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBwYXJhbXMpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRFRPID0gRFRPO1xyXG5jbGFzcyBTdGF0aWNTb3VyY2Uge1xyXG4gICAgY29uc3RydWN0b3IoZW50cmllcywgb3JkZXIgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5lbnRyaWVzID0gZW50cmllcztcclxuICAgICAgICB0aGlzLm9yZGVyID0gb3JkZXI7XHJcbiAgICB9XHJcbiAgICBnZXQoaWQpIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZW50cmllc1tpZF0pO1xyXG4gICAgfVxyXG4gICAgZ2V0T3JkZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3JkZXI7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5TdGF0aWNTb3VyY2UgPSBTdGF0aWNTb3VyY2U7XHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuY2xhc3MgU291cmNlQWRhcHRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHBhcmFtcy5zb3VyY2U7XHJcbiAgICAgICAgdGhpcy5tZXRob2QgPSBwYXJhbXMubWV0aG9kO1xyXG4gICAgICAgIHRoaXMuc3VjY2Vzc01ldGhvZCA9IHBhcmFtcy5zdWNjZXNzTWV0aG9kIHx8ICd0aGVuJztcclxuICAgICAgICB0aGlzLm1vZHVsZXMgPSBbJ25nJywgLi4ucGFyYW1zLm1vZHVsZXMgfHwgW11dO1xyXG4gICAgICAgIHRoaXMub3JkZXIgPSB0eXBlb2YgcGFyYW1zLm9yZGVyID09PSAnbnVtYmVyJyA/IHBhcmFtcy5vcmRlciA6IDA7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IHBhcmFtcy5jYWxsYmFjayB8fCBmYWxzZTtcclxuICAgICAgICAvLyBtYWtlIGxvZ2ljIHNpbXBsZXIgYnkgZGVmYXVsdGluZyB0byBhIG5vLW9wOyB3ZSBkb24ndCBjYXJlIGFib3V0IG92ZXJoZWFkIGhlcmVcclxuICAgICAgICBjb25zdCBub29wID0gKGlucHV0KSA9PiBpbnB1dDtcclxuICAgICAgICB0aGlzLmlucHV0VHJhbnNmb3JtID0gcGFyYW1zLmlucHV0VHJhbnNmb3JtIHx8IG5vb3A7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRUcmFuc2Zvcm0gPSBwYXJhbXMub3V0cHV0VHJhbnNmb3JtIHx8IG5vb3A7XHJcbiAgICB9XHJcbiAgICBnZXQoaWQpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc291cmNlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IGFuZ3VsYXIuaW5qZWN0b3IodGhpcy5tb2R1bGVzKS5nZXQodGhpcy5zb3VyY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlW3RoaXMubWV0aG9kXSh0aGlzLmlucHV0VHJhbnNmb3JtKGlkKSwgcmVzb2x2ZSk7XHJcbiAgICAgICAgICAgIH0pLnRoZW4odGhpcy5vdXRwdXRUcmFuc2Zvcm0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VbdGhpcy5tZXRob2RdKHRoaXMuaW5wdXRUcmFuc2Zvcm0oaWQpKVt0aGlzLnN1Y2Nlc3NNZXRob2RdKHRoaXMub3V0cHV0VHJhbnNmb3JtKTtcclxuICAgIH1cclxuICAgIGdldE9yZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yZGVyO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuU291cmNlQWRhcHRlciA9IFNvdXJjZUFkYXB0ZXI7XHJcbi8qKlxyXG4gKiBCYXNpYyAkaHR0cCBhZGFwdGVyXHJcbiAqL1xyXG5jbGFzcyBIdHRwQWRhcHRlciBleHRlbmRzIFNvdXJjZUFkYXB0ZXIge1xyXG4gICAgY29uc3RydWN0b3IocGF0aCkge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgc291cmNlOiAnJGh0dHAnLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICBpbnB1dFRyYW5zZm9ybTogKGlkKSA9PiBgJHtwYXRofS8ke2lkfWAsXHJcbiAgICAgICAgICAgIG91dHB1dFRyYW5zZm9ybTogKHJlc3ApID0+IHJlc3AuZGF0YSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkh0dHBBZGFwdGVyID0gSHR0cEFkYXB0ZXI7XHJcbi8qKlxyXG4gKiBGYWxscyBiYWNrIHRocm91Z2ggcHJvdmlkZWQgc291cmNlcyB0byByZXRyaWV2ZSBhIERUTywgYnVpbGRpbmcgYW5kIHJldHVybmluZyBhbiBlbnRpdHlcclxuICovXHJcbmNsYXNzIExpYnJhcnkge1xyXG4gICAgY29uc3RydWN0b3IoY3Rvciwgc291cmNlcykge1xyXG4gICAgICAgIHRoaXMuY3RvciA9IGN0b3I7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VzID0gc291cmNlcztcclxuICAgICAgICB0aGlzLnJldHVybkRUTyA9ICF0aGlzLmN0b3I7IC8vIHJldHVybiBEVE8gaW5zdGVhZCBvZiBjb25zdHJ1Y3RpbmcgYW4gZW50aXR5XHJcbiAgICB9XHJcbiAgICBnZXQoaWQpIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc291cmNlcy5zb3J0KChhLCBiKSA9PiBhLmdldE9yZGVyKCkgLSBiLmdldE9yZGVyKCkpO1xyXG4gICAgICAgIHRoaXMuc291cmNlSW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICByZXR1cm4gdGhpcy5mYWxsYmFja0dldChudWxsKS50aGVuKHRoaXMucHJvY2Vzc1Jlc3VsdCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2UgdGhyb3VnaCBlYWNoIHNvdXJjZSwgb25seSBjYWxsaW5nIGEgc291cmNlIGlmIHRoZSBwcmV2aW91cyByZXR1cm4gbm8gcmVzdWx0IG9yIGZhaWxlZFxyXG4gICAgICogQHBhcmFtIHJlc3VsdFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nIHwgVD59XHJcbiAgICAgKi9cclxuICAgIGZhbGxiYWNrR2V0KHJlc3VsdCkge1xyXG4gICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZUluZGV4ID49IHRoaXMuc291cmNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlc1t0aGlzLnNvdXJjZUluZGV4KytdLmdldCh0aGlzLmlkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4odGhpcy5mYWxsYmFja0dldClcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFNvdXJjZSBnZXQgZmFpbGVkIGZvciAke3RoaXMuY3Rvci5uYW1lfWAsIGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFsbGJhY2tHZXQobnVsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFuc2Zvcm0gdGhlIERUTyBvciBzdHJpbmcgaW50byBhbiBlbnRpdHlcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0IHwgc3RyaW5nfSByZXN1bHRcclxuICAgICAqIEByZXR1cm5zIHtUfVxyXG4gICAgICovXHJcbiAgICBwcm9jZXNzUmVzdWx0KHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgcmVzdWx0ID09PSAnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5EVE8gPyByZXN1bHQgOiBuZXcgdGhpcy5jdG9yKHJlc3VsdCk7XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBQcm9taXNlKVxyXG5dLCBMaWJyYXJ5LnByb3RvdHlwZSwgXCJmYWxsYmFja0dldFwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBPYmplY3QpXHJcbl0sIExpYnJhcnkucHJvdG90eXBlLCBcInByb2Nlc3NSZXN1bHRcIiwgbnVsbCk7XHJcbmNsYXNzIExpYnJhcnlQcm92aWRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpYmFyaWVzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBuZXcgbGlicmFyeSBmb3IgdGhlIHR5cGUgd2l0aCBwcm92aWRlZCBzb3VyY2VzXHJcbiAgICAgKiBAcGFyYW0ge0lFbnRpdHlDdG9yPFQsIFA+fSBjdG9yXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5PElTb3VyY2U8VD4+fSBzb3VyY2VzXHJcbiAgICAgKi9cclxuICAgIGFkZExpYnJhcnkoY3Rvciwgc291cmNlcykge1xyXG4gICAgICAgIHRoaXMubGliYXJpZXMuc2V0KGN0b3IsIG5ldyBMaWJyYXJ5KGN0b3IsIHNvdXJjZXMpKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgZW50aXR5IG9mIHRoZSBnaXZlbiB0eXBlIGFuZCBpZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdHlwZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXJ9IGlkXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cclxuICAgICAqL1xyXG4gICAgZ2V0KHR5cGUsIGlkKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmxpYmFyaWVzLmhhcyh0eXBlKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYE5vIExpYnJhcnkgaXMgY29uZmlndXJlZCBmb3IgJHt0eXBlLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmxpYmFyaWVzLmdldCh0eXBlKS5nZXQoaWQpO1xyXG4gICAgfVxyXG4gICAgJGdldCgpIHtcclxuICAgICAgICByZXR1cm4geyBnZXQ6IHRoaXMuZ2V0IH07XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtGdW5jdGlvbiwgT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgUHJvbWlzZSlcclxuXSwgTGlicmFyeVByb3ZpZGVyLnByb3RvdHlwZSwgXCJnZXRcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgYmluZF9kZWNvcmF0b3JfMS5kZWZhdWx0LFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgT2JqZWN0KVxyXG5dLCBMaWJyYXJ5UHJvdmlkZXIucHJvdG90eXBlLCBcIiRnZXRcIiwgbnVsbCk7XHJcbmV4cG9ydHMuTGlicmFyeVByb3ZpZGVyID0gTGlicmFyeVByb3ZpZGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saWJyYXJ5LnByb3ZpZGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyByZS1leHBvcnQgdGhlIGxvZ2dlciB1dGlsaXR5IHRvIG1haW50YWluIGNvbnNpc3RlbnQgcGF0aGluZyBpbiB0aGUgbW9kdWxlIGRlZmluaXRpb25cclxuX19leHBvcnQocmVxdWlyZShcIi4vbGliL2xvZ2dlclwiKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ2dlci5zZXJ2aWNlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xID0gcmVxdWlyZShcIi4vbWFsbGV0LmRlcGVkZW5jeS10cmVlXCIpO1xyXG5jb25zdCBhbmd1bGFyID0gcmVxdWlyZShcImFuZ3VsYXJcIik7XHJcbmNvbnN0IGNvbnN0YW50cyA9IGFuZ3VsYXIubW9kdWxlKCdtYWxsZXQtY29uc3RhbnRzJywgW10pXHJcbiAgICAuY29uc3RhbnQobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULmNvbnN0LlNjYWxlRmFjdG9yLCAoKCkgPT4gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSkoKSlcclxuICAgIC5jb25zdGFudChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuY29uc3QuU2FtcGxlQ291bnQsIDEwMjQpXHJcbiAgICAuY29uc3RhbnQobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULmNvbnN0Lk1heEZyYW1lUmF0ZSwgNjApXHJcbiAgICAuY29uc3RhbnQobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULmNvbnN0LktleXMsIE9iamVjdC5mcmVlemUoe1xyXG4gICAgRG93bjogNDAsXHJcbiAgICBVcDogMzgsXHJcbiAgICBSaWdodDogMzksXHJcbiAgICBMZWZ0OiAzNyxcclxuICAgIFNwYWNlOiAzMixcclxuICAgIEVzY2FwZTogMjcsXHJcbn0pKTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudHMubmFtZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFsbGV0LmNvbnN0YW50cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbmplY3Rvcl9wbHVzXzEgPSByZXF1aXJlKFwiLi9saWIvaW5qZWN0b3ItcGx1c1wiKTtcclxuY29uc3QgTURUID0ge1xyXG4gICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgd2ViR0xTdGFnZTogJ21hbGxldFdlYmdsU3RhZ2UnLFxyXG4gICAgICAgIHJlbmRlclRhcmdldDogJ21hbGxldFJlbmRlclRhcmdldCcsXHJcbiAgICB9LFxyXG4gICAgY29uZmlnOiB7XHJcbiAgICAgICAgUGF0aDogJycsXHJcbiAgICB9LFxyXG4gICAgWydjb25zdCddOiB7XHJcbiAgICAgICAgS2V5czogJycsXHJcbiAgICAgICAgTWF4RnJhbWVSYXRlOiAnJyxcclxuICAgICAgICBTYW1wbGVDb3VudDogJycsXHJcbiAgICAgICAgU2NhbGVGYWN0b3I6ICcnLFxyXG4gICAgfSxcclxuICAgIG5nOiB7XHJcbiAgICAgICAgJGVsZW1lbnQ6ICckZWxlbWVudCcsXHJcbiAgICAgICAgJGxvY2F0aW9uOiAnJGxvY2F0aW9uJyxcclxuICAgICAgICAkd2luZG93OiAnJHdpbmRvdycsXHJcbiAgICAgICAgJGh0dHA6ICckaHR0cCcsXHJcbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXI6ICckbG9jYXRpb25Qcm92aWRlcicsXHJcbiAgICAgICAgJHE6ICckcScsXHJcbiAgICAgICAgJHJvb3RTY29wZTogJyRyb290U2NvcGUnLFxyXG4gICAgICAgICRzY29wZTogJyRzY29wZScsXHJcbiAgICAgICAgJHNvY2tldDogJ3NvY2tldEZhY3RvcnknLFxyXG4gICAgICAgICRzdGF0ZTogJyRzdGF0ZScsXHJcbiAgICAgICAgJHN0YXRlUGFyYW1zOiAnJHN0YXRlUGFyYW1zJyxcclxuICAgICAgICAkc3RhdGVQcm92aWRlcjogJyRzdGF0ZVByb3ZpZGVyJyxcclxuICAgICAgICAkdGltZW91dDogJyR0aW1lb3V0JyxcclxuICAgICAgICAkdXJsU2VydmljZTogJyR1cmxTZXJ2aWNlJyxcclxuICAgIH0sXHJcbiAgICBBc3luY1JlcXVlc3Q6ICcnLFxyXG4gICAgQ2FtZXJhOiAnJyxcclxuICAgIENvbG9yOiAnJyxcclxuICAgIEdlb21ldHJ5OiAnJyxcclxuICAgIEtleWJvYXJkOiAnJyxcclxuICAgIExvZ2dlcjogJycsXHJcbiAgICBNYXRoOiAnJyxcclxuICAgIE1vdXNlVXRpbHM6ICcnLFxyXG4gICAgUGFydGljbGVFbWl0dGVyOiAnJyxcclxuICAgIFBhcnRpY2xlRW1pdHRlcjJEOiAnJyxcclxuICAgIFNjaGVkdWxlcjogJycsXHJcbiAgICBBcHBTdGF0ZTogJycsXHJcbiAgICBTdGF0ZU1hY2hpbmU6ICcnLFxyXG4gICAgVGhyZWFkOiAnJyxcclxuICAgIFJlbmRlclRhcmdldDogJycsXHJcbiAgICBMaWJyYXJ5OiAnJyxcclxuICAgIHdlYmdsOiB7XHJcbiAgICAgICAgU2hhZGVyU291cmNlOiAnJyxcclxuICAgICAgICBXZWJHTFN0YWdlOiAnJyxcclxuICAgIH0sXHJcbn07XHJcbmV4cG9ydHMuTURUID0gTURUO1xyXG5pbmplY3Rvcl9wbHVzXzEuYnVpbGRUcmVlKE1EVCwgJ21hbGxldCcpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWxsZXQuZGVwZWRlbmN5LXRyZWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbmNvbnN0IGluamVjdG9yX3BsdXNfMSA9IHJlcXVpcmUoXCIuL2xpYi9pbmplY3Rvci1wbHVzXCIpO1xyXG5jb25zdCByZW5kZXJfdGFyZ2V0X2ZhY3RvcnlfMSA9IHJlcXVpcmUoXCIuL3JlbmRlci10YXJnZXQuZmFjdG9yeVwiKTtcclxuY29uc3QgYXBwX3N0YXRlX3NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL2FwcC1zdGF0ZS5zZXJ2aWNlXCIpO1xyXG5jb25zdCBzY2hlZHVsZXJfc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2NoZWR1bGVyLnNlcnZpY2VcIik7XHJcbmNvbnN0IGxvZ2dlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9sb2dnZXIuc2VydmljZVwiKTtcclxuY29uc3QgcmVuZGVyX3RhcmdldF9jb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL3JlbmRlci10YXJnZXQuY29tcG9uZW50XCIpO1xyXG5jb25zdCBsaWJyYXJ5X3Byb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi9saWJyYXJ5LnByb3ZpZGVyXCIpO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby12YXItcmVxdWlyZXNcclxuZXhwb3J0cy5tYWxsZXQgPSByZXF1aXJlKCdhbmd1bGFyJykubW9kdWxlKCdtYWxsZXQnLCBbXHJcbiAgICByZXF1aXJlKCcuL21hbGxldC5jb25zdGFudHMnKSxcclxuXSk7XHJcbmV4cG9ydHMubWFsbGV0LnByb3ZpZGVyKG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5MaWJyYXJ5LCBpbmplY3Rvcl9wbHVzXzEubmdBbm5vdGF0ZShsaWJyYXJ5X3Byb3ZpZGVyXzEuTGlicmFyeVByb3ZpZGVyKSk7XHJcbmV4cG9ydHMubWFsbGV0LnNlcnZpY2UobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULlNjaGVkdWxlciwgaW5qZWN0b3JfcGx1c18xLm5nQW5ub3RhdGUoc2NoZWR1bGVyX3NlcnZpY2VfMS5TY2hlZHVsZXIpKTtcclxuZXhwb3J0cy5tYWxsZXQuc2VydmljZShtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuQXBwU3RhdGUsIGluamVjdG9yX3BsdXNfMS5uZ0Fubm90YXRlKGFwcF9zdGF0ZV9zZXJ2aWNlXzEuQXBwU3RhdGUpKTtcclxuZXhwb3J0cy5tYWxsZXQuc2VydmljZShtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuTG9nZ2VyLCBpbmplY3Rvcl9wbHVzXzEubmdBbm5vdGF0ZShsb2dnZXJfc2VydmljZV8xLkxvZ2dlcikpO1xyXG5leHBvcnRzLm1hbGxldC5mYWN0b3J5KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5SZW5kZXJUYXJnZXQsIGluamVjdG9yX3BsdXNfMS5uZ0Fubm90YXRlKHJlbmRlcl90YXJnZXRfZmFjdG9yeV8xLnJlbmRlclRhcmdldEZhY3RvcnkpKTtcclxuZXhwb3J0cy5tYWxsZXQuY29tcG9uZW50KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5jb21wb25lbnQucmVuZGVyVGFyZ2V0LCByZW5kZXJfdGFyZ2V0X2NvbXBvbmVudF8xLm9wdGlvbnMpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWxsZXQubW9kdWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcclxufTtcclxudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGluamVjdG9yX3BsdXNfMSA9IHJlcXVpcmUoXCIuL2xpYi9pbmplY3Rvci1wbHVzXCIpO1xyXG5jb25zdCBtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMSA9IHJlcXVpcmUoXCIuL21hbGxldC5kZXBlZGVuY3ktdHJlZVwiKTtcclxuY29uc3Qgc2NoZWR1bGVyX3NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3NjaGVkdWxlci5zZXJ2aWNlXCIpO1xyXG5jb25zdCBhbmd1bGFyXzEgPSByZXF1aXJlKFwiYW5ndWxhclwiKTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY29uc3QgbG9nZ2VyXzEgPSByZXF1aXJlKFwiLi9saWIvbG9nZ2VyXCIpO1xyXG5sZXQgUmVuZGVyVGFyZ2V0Q3RybCA9IGNsYXNzIFJlbmRlclRhcmdldEN0cmwge1xyXG4gICAgY29uc3RydWN0b3IobG9nZ2VyLCAkZWxlbWVudCwgbVN0YXRlLCBzY2hlZHVsZXIsIHJlbmRlclRhcmdldEZhY3RvcnkpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5tU3RhdGUgPSBtU3RhdGU7XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXRGYWN0b3J5ID0gcmVuZGVyVGFyZ2V0RmFjdG9yeTtcclxuICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgICAgICB0aGlzLk5PX1NVUFBPUlRfTUVTU0FHRSA9ICdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBjYW52YXMuIFBsZWFzZSBjb25zaWRlciB1cGdyYWRpbmcuJztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRDb250cm9sbGVyKCRlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjE5OTUxMDgvYW5ndWxhci1nZXQtY29udHJvbGxlci1mcm9tLWVsZW1lbnRcclxuICAgICAgICBjb25zdCB0YXJnZXRUYWcgPSAnbWFsbGV0LXJlbmRlci10YXJnZXQnO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclRhcmdldCA9ICRlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhcmdldFRhZyk7XHJcbiAgICAgICAgaWYgKCFyZW5kZXJUYXJnZXQgfHwgIXJlbmRlclRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBGYWlsZWQgdG8gZmluZCByZW5kZXIgdGFyZ2V0ICR7dGFyZ2V0VGFnfSBpbiBjb21wb25lbnQgJHskZWxlbWVudFswXX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY3RybCA9IGFuZ3VsYXJfMS5lbGVtZW50KHJlbmRlclRhcmdldCkuY29udHJvbGxlcihtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuY29tcG9uZW50LnJlbmRlclRhcmdldCk7XHJcbiAgICAgICAgaWYgKCFjdHJsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IGBGYWlsZWQgdG8gZ2V0IGNvbnRyb2xsZXIgZnJvbSByZW5kZXIgdGFyZ2V0LiBFbnN1cmUgdGhpcyBmdW5jdGlvbiBpcyBiZWluZyBjYWxsZWQgaW4gJHBvc3RMaW5rIG9yIGxhdGVyLmA7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3RybDtcclxuICAgIH1cclxuICAgICRvbkluaXQoKSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSByZW5kZXIgdGFyZ2V0XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLiRlbGVtZW50WzBdLmNsaWVudFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuJGVsZW1lbnRbMF0uY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBDcmVhdGUgcmVuZGVyIHRhcmdldCB3aXRoIHR5cGUgJHt0aGlzLnR5cGUubmFtZX1gKTtcclxuICAgICAgICB0aGlzLnJlbmRlclRhcmdldCA9IHRoaXMucmVuZGVyVGFyZ2V0RmFjdG9yeSh0aGlzLnR5cGUsIHsgd2lkdGgsIGhlaWdodCB9KTtcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMucmVuZGVyVGFyZ2V0LmdldENvbnRleHQoKTtcclxuICAgICAgICAvLyBTZXR1cCBhbmQgYXR0YWNoIGNhbnZhc1xyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMucmVuZGVyVGFyZ2V0LmdldENhbnZhcygpO1xyXG4gICAgICAgIGNhbnZhcy5pbm5lckhUTUwgPSB0aGlzLk5PX1NVUFBPUlRfTUVTU0FHRTtcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmFwcGVuZChjYW52YXMpO1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVyLnNjaGVkdWxlKHRoaXMudXBkYXRlLCAwKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vblJlc2l6ZSk7XHJcbiAgICB9XHJcbiAgICAkb25EZXN0cm95KCkge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKTtcclxuICAgIH1cclxuICAgIGdldENvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4O1xyXG4gICAgfVxyXG4gICAgZ2V0UmVuZGVyVGFyZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclRhcmdldDtcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBjb25zdCBsb3dSZXNTY2FsZSA9IDAuNzU7XHJcbiAgICAgICAgLy8gUmVkdWNlIGNhbnZhcyByZXNvbHV0aW9uIGlzIHBlcmZvcm1hbmNlIGlzIGJhZFxyXG4gICAgICAgIGlmICh0aGlzLnNjaGVkdWxlci5GUFMgPCAzMCAmJiB0aGlzLnNjYWxlID09PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGUgPSBsb3dSZXNTY2FsZTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXQucmVzaXplKHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnNjaGVkdWxlci5GUFMgPiA0MCAmJiB0aGlzLnNjYWxlID09PSBsb3dSZXNTY2FsZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJUYXJnZXQucmVzaXplKHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjaGVkdWxlci5kcmF3KCgpID0+IHRoaXMucmVuZGVyVGFyZ2V0LmNsZWFyKCksIC0xKTtcclxuICAgIH1cclxuICAgIG9uUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0LnJlc2l6ZSgpO1xyXG4gICAgfVxyXG59O1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgUmVuZGVyVGFyZ2V0Q3RybC5wcm90b3R5cGUsIFwidXBkYXRlXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgUmVuZGVyVGFyZ2V0Q3RybC5wcm90b3R5cGUsIFwib25SZXNpemVcIiwgbnVsbCk7XHJcblJlbmRlclRhcmdldEN0cmwgPSBfX2RlY29yYXRlKFtcclxuICAgIF9fcGFyYW0oMCwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuTG9nZ2VyKSksXHJcbiAgICBfX3BhcmFtKDEsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULm5nLiRlbGVtZW50KSksXHJcbiAgICBfX3BhcmFtKDIsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULkFwcFN0YXRlKSksXHJcbiAgICBfX3BhcmFtKDMsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULlNjaGVkdWxlcikpLFxyXG4gICAgX19wYXJhbSg0LCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5SZW5kZXJUYXJnZXQpKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbbG9nZ2VyXzEuTG9nZ2VyLCBPYmplY3QsIE9iamVjdCwgc2NoZWR1bGVyX3NlcnZpY2VfMS5TY2hlZHVsZXIsIEZ1bmN0aW9uXSlcclxuXSwgUmVuZGVyVGFyZ2V0Q3RybCk7XHJcbmV4cG9ydHMuUmVuZGVyVGFyZ2V0Q3RybCA9IFJlbmRlclRhcmdldEN0cmw7XHJcbmNsYXNzIFJlbmRlclRhcmdldDJEQ3RybCBleHRlbmRzIFJlbmRlclRhcmdldEN0cmwge1xyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLm1TdGF0ZS5pcyh0aGlzLm1TdGF0ZS5EZWJ1ZykpIHtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuZHJhdygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChgRlBTOiAke35+dGhpcy5zY2hlZHVsZXIuRlBTfWAsIDI1LCAyNSk7XHJcbiAgICAgICAgICAgIH0sIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLm9wdGlvbnMgPSB7XHJcbiAgICBjb250cm9sbGVyOiBpbmplY3Rvcl9wbHVzXzEubmdBbm5vdGF0ZShSZW5kZXJUYXJnZXRDdHJsKSxcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInJlbmRlci10YXJnZXRcIj48L2Rpdj4nLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB0eXBlOiAnPCcsXHJcbiAgICB9LFxyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW5kZXItdGFyZ2V0LmNvbXBvbmVudC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogQ3JlYXRlZCBieSBnanJ3Y3Mgb24gOS8xNS8yMDE2LlxyXG4gKi9cclxuY29uc3QgaW5qZWN0b3JfcGx1c18xID0gcmVxdWlyZShcIi4vbGliL2luamVjdG9yLXBsdXNcIik7XHJcbmNvbnN0IGxvZ2dlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9sb2dnZXIuc2VydmljZVwiKTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbnZhciBDYW52YXNDb250ZXh0O1xyXG4oZnVuY3Rpb24gKENhbnZhc0NvbnRleHQpIHtcclxuICAgIENhbnZhc0NvbnRleHRbXCJiYXNpY1wiXSA9IFwiMmRcIjtcclxuICAgIENhbnZhc0NvbnRleHRbXCJ3ZWJnbFwiXSA9IFwid2ViZ2xcIjtcclxuICAgIENhbnZhc0NvbnRleHRbXCJ3ZWJnbEV4cGVyaW1lbnRhbFwiXSA9IFwid2ViZ2wtZXhwZXJpbWVudGFsXCI7XHJcbn0pKENhbnZhc0NvbnRleHQgfHwgKENhbnZhc0NvbnRleHQgPSB7fSkpO1xyXG5jbGFzcyBSZW5kZXJUYXJnZXQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVycywgbG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBwYXJhbWV0ZXJzO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmdldE5ld0NvbnRleHQoKTtcclxuICAgIH1cclxuICAgIGdldENvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4O1xyXG4gICAgfVxyXG4gICAgZ2V0Q2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcztcclxuICAgIH1cclxuICAgIHJlc2l6ZShzY2FsZSA9IDEpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgcmVzaXplICR7dGhpcy5jYW52YXMuaWQgfHwgdGhpcy5jYW52YXMuY2xhc3NOYW1lfSB0byAke3NjYWxlfWApO1xyXG4gICAgICAgIC8vIGZpbmFsbHkgcXVlcnkgdGhlIHZhcmlvdXMgcGl4ZWwgcmF0aW9zXHJcbiAgICAgICAgY29uc3QgZGV2aWNlUGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XHJcbiAgICAgICAgY29uc3QgYmFja2luZ1N0b3JlUmF0aW8gPSB0aGlzLmN0eC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcclxuICAgICAgICAgICAgdGhpcy5jdHgubXNCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY3R4Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcclxuICAgICAgICBjb25zdCByYXRpbyA9IGRldmljZVBpeGVsUmF0aW8gLyBiYWNraW5nU3RvcmVSYXRpbztcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzLmNsaWVudFdpZHRoICogc2NhbGU7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuY2xpZW50SGVpZ2h0ICogc2NhbGU7XHJcbiAgICAgICAgaWYgKGRldmljZVBpeGVsUmF0aW8gIT09IGJhY2tpbmdTdG9yZVJhdGlvIHx8IHNjYWxlICE9PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoICo9IHJhdGlvO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgKj0gcmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuY3R4ID0gdGhpcy5nZXROZXdDb250ZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUmVuZGVyVGFyZ2V0ID0gUmVuZGVyVGFyZ2V0O1xyXG5jbGFzcyBSZW5kZXJUYXJnZXQyRCBleHRlbmRzIFJlbmRlclRhcmdldCB7XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci52ZXJib3NlKGBjbGVhciByZW5kZXIgdGFyZ2V0ICR7dGhpcy5jYW52YXMuaWQgfHwgdGhpcy5jYW52YXMuY2xhc3NOYW1lfWApO1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIGdldENvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmdldENvbnRleHQoKTtcclxuICAgIH1cclxuICAgIGdldE5ld0NvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLmdldENvbnRleHQoQ2FudmFzQ29udGV4dC5iYXNpYyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5SZW5kZXJUYXJnZXQyRCA9IFJlbmRlclRhcmdldDJEO1xyXG5jbGFzcyBSZW5kZXJUYXJnZXRXZWJHTCBleHRlbmRzIFJlbmRlclRhcmdldCB7XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci52ZXJib3NlKGBjbGVhciByZW5kZXIgdGFyZ2V0ICR7dGhpcy5jYW52YXMuaWQgfHwgdGhpcy5jYW52YXMuY2xhc3NOYW1lfWApO1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyKHRoaXMuY3R4LkNPTE9SX0JVRkZFUl9CSVQpO1xyXG4gICAgfVxyXG4gICAgZ2V0Q29udGV4dCgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0Q29udGV4dCgpO1xyXG4gICAgfVxyXG4gICAgZ2V0TmV3Q29udGV4dCgpIHtcclxuICAgICAgICBjb25zdCBnbCA9ICh0aGlzLmNhbnZhcy5nZXRDb250ZXh0KENhbnZhc0NvbnRleHQud2ViZ2wpIHx8XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmdldENvbnRleHQoQ2FudmFzQ29udGV4dC53ZWJnbEV4cGVyaW1lbnRhbCkpO1xyXG4gICAgICAgIGdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIHJldHVybiBnbDtcclxuICAgIH1cclxuICAgIGlzV2ViR0xTdXBwb3J0ZWQoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICAgIHJldHVybiAhISh3aW5kb3cuV2ViR0xSZW5kaW5nQ29udGV4dCAmJiB0aGlzLmdldE5ld0NvbnRleHQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5SZW5kZXJUYXJnZXRXZWJHTCA9IFJlbmRlclRhcmdldFdlYkdMO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxyXG5jbGFzcyByZW5kZXJUYXJnZXRGYWN0b3J5IHtcclxuICAgIGV4ZWMobG9nZ2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIChjdG9yLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgY3RvcihvcHRpb25zLCBsb2dnZXIpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICBfX3BhcmFtKDAsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULkxvZ2dlcikpLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbbG9nZ2VyX3NlcnZpY2VfMS5Mb2dnZXJdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIHJlbmRlclRhcmdldEZhY3RvcnkucHJvdG90eXBlLCBcImV4ZWNcIiwgbnVsbCk7XHJcbmV4cG9ydHMucmVuZGVyVGFyZ2V0RmFjdG9yeSA9IHJlbmRlclRhcmdldEZhY3Rvcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlci10YXJnZXQuZmFjdG9yeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBpbmplY3Rvcl9wbHVzXzEgPSByZXF1aXJlKFwiLi9saWIvaW5qZWN0b3ItcGx1c1wiKTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi9tYWxsZXQuZGVwZWRlbmN5LXRyZWVcIik7XHJcbmNvbnN0IGxvZ2dlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9sb2dnZXIuc2VydmljZVwiKTtcclxuY29uc3QgcHVsc2FyX2xpYl8xID0gcmVxdWlyZShcInB1bHNhci1saWJcIik7XHJcbmNvbnN0IGJpbmRfZGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiYmluZC1kZWNvcmF0b3JcIik7XHJcbmNvbnN0IGFwcF9zdGF0ZV9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9hcHAtc3RhdGUuc2VydmljZVwiKTtcclxuLyoqXHJcbiAqIEV4ZWN1dGVzIGFuZCBtb25pdG9ycyB0aGUgZW5naW5lIGxvb3BcclxuICovXHJcbmxldCBTY2hlZHVsZXIgPSBjbGFzcyBTY2hlZHVsZXIge1xyXG4gICAgY29uc3RydWN0b3IobWF4RnJhbWVSYXRlLCBhcHBTdGF0ZSwgbG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5tYXhGcmFtZVJhdGUgPSBtYXhGcmFtZVJhdGU7XHJcbiAgICAgICAgdGhpcy5hcHBTdGF0ZSA9IGFwcFN0YXRlO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gQ3VycmVudCBGcmFtZXMgUGVyIFNlY29uZCAqL1xyXG4gICAgICAgIHRoaXMuZnBzID0gMDtcclxuICAgICAgICAvKiogQGRlc2NyaXB0aW9uIHRpbWVzdGFtcCBvZiBsYXN0IEZQUyBkb1VwZGF0ZSAqL1xyXG4gICAgICAgIHRoaXMubGFzdEZQU1VwZGF0ZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiBmcmFtZXMgZXhlY3V0ZWQgaW4gbGFzdCBzZWNvbmQgKi9cclxuICAgICAgICB0aGlzLmZyYW1lc1RoaXNTZWNvbmQgPSAwO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gc3VzcGVuZCBtYWluIGxvb3AgaWYgdGhlIHdpbmRvdyBsb3NlcyBmb2N1cyAqL1xyXG4gICAgICAgIHRoaXMuc3VzcGVuZE9uQmx1ciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gdGltZXN0YW1wIHdoZW4gZmlyc3QgZnJhbWUgZXhlY3V0ZWQgKi9cclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiBtaWxsaXNlY29uZHMgc2luY2UgZG9VcGRhdGUgbG9vcCB3YXMgcnVuICovXHJcbiAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSAwO1xyXG4gICAgICAgIC8qKiBAZGVzY3JpcHRpb24gIG1pbGxpc2Vjb25kcyBzaW5jZSBsYXN0IGZyYW1lICovXHJcbiAgICAgICAgdGhpcy5lbGFwc2VkVGltZSA9IDA7XHJcbiAgICAgICAgLyoqIEBkZXNjcmlwdGlvbiB0aW1lc3RhbXAgb2YgdGhlIGxhc3QgZnJhbWUgKi9cclxuICAgICAgICB0aGlzLmxhc3RGcmFtZVRpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMudXBkYXRlT3BlcmF0aW9ucyA9IG5ldyBwdWxzYXJfbGliXzEuUHJpb3JpdHlRdWV1ZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhd0NvbW1hbmRzID0gbmV3IHB1bHNhcl9saWJfMS5Qcmlvcml0eVF1ZXVlKCk7XHJcbiAgICAgICAgdGhpcy5wb3N0RHJhd0NvbW1hbmRzID0gbmV3IHB1bHNhcl9saWJfMS5Qcmlvcml0eVF1ZXVlKCk7XHJcbiAgICAgICAgdGhpcy50aW1lc3RlcCA9IDEwMDAgLyB0aGlzLm1heEZyYW1lUmF0ZTtcclxuICAgICAgICB0aGlzLmZwcyA9IHRoaXMubWF4RnJhbWVSYXRlO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5zdXNwZW5kKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzY2hlZHVsZUNvbW1hbmQoY29tbWFuZCwgcHJpb3JpdHksIHF1ZXVlKSB7XHJcbiAgICAgICAgaWYgKGNvbW1hbmQgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XHJcbiAgICAgICAgICAgIHF1ZXVlLmVucXVldWUocHJpb3JpdHksIGNvbW1hbmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT3BlcmF0aW9uIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYXZlcmFnZSBGcmFtZXMgZXhlY3V0ZWQgcGVyIHNlY29uZCBvdmVyIHRoZSBsYXN0XHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGdldCBGUFMoKSB7IHJldHVybiB0aGlzLmZwczsgfVxyXG4gICAgc3VzcGVuZChlKSB7XHJcbiAgICAgICAgaWYgKCEoZSAmJiBlLnR5cGUgPT09ICdibHVyJyAmJiB0aGlzLnN1c3BlbmRPbkJsdXIgPT09IGZhbHNlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0YXRlLnNldFN0YXRlKGFwcF9zdGF0ZV9zZXJ2aWNlXzEuQXBwU3RhdGUuU3VzcGVuZGVkKTtcclxuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XHJcbiAgICAgICAgICAgIC8vICRyb290U2NvcGUuJGV2YWxBc3luYygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlc3VtZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5hcHBTdGF0ZS5pcyhhcHBfc3RhdGVfc2VydmljZV8xLkFwcFN0YXRlLlN1c3BlbmRlZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydE1haW5Mb29wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBtYWluIGFwcCBsb29wXHJcbiAgICAgKi9cclxuICAgIHN0YXJ0TWFpbkxvb3AoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xyXG4gICAgICAgIHRoaXMubGFzdEZyYW1lVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLm1haW5Mb29wKTtcclxuICAgICAgICB0aGlzLmFwcFN0YXRlLnNldFN0YXRlKGFwcF9zdGF0ZV9zZXJ2aWNlXzEuQXBwU3RhdGUuUnVubmluZyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNjaGVkdWxlIGFuIGRvVXBkYXRlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWQgZWFjaCBmcmFtZVxyXG4gICAgICogQHBhcmFtIG9wZXJhdGlvblxyXG4gICAgICogQHBhcmFtIG9yZGVyXHJcbiAgICAgKi9cclxuICAgIHNjaGVkdWxlKG9wZXJhdGlvbiwgb3JkZXIpIHtcclxuICAgICAgICBTY2hlZHVsZXIuc2NoZWR1bGVDb21tYW5kKG9wZXJhdGlvbiwgb3JkZXIsIHRoaXMudXBkYXRlT3BlcmF0aW9ucyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFF1ZXVlIGEgZHJhdyBvcGVhcnRpb24gdG8gYmUgZXhlY3V0ZWQgb25jZSBhbmQgZGlzY2FyZGVkXHJcbiAgICAgKiBAcGFyYW0gb3BlcmF0aW9uXHJcbiAgICAgKiBAcGFyYW0gekluZGV4XHJcbiAgICAgKi9cclxuICAgIGRyYXcob3BlcmF0aW9uLCB6SW5kZXgpIHtcclxuICAgICAgICBTY2hlZHVsZXIuc2NoZWR1bGVDb21tYW5kKG9wZXJhdGlvbiwgekluZGV4LCB0aGlzLmRyYXdDb21tYW5kcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFF1ZXVlIGEgcG9zdCBwcm9jZXNzIG9wZXJhdGlvbiB0byBiZSBleGVjdXRlZCBvbmUgYW5kIGRpc2NhcmRlZFxyXG4gICAgICogQHBhcmFtIG9wZXJhdGlvblxyXG4gICAgICogQHBhcmFtIHpJbmRleFxyXG4gICAgICovXHJcbiAgICBwb3N0UHJvY2VzcyhvcGVyYXRpb24sIHpJbmRleCkge1xyXG4gICAgICAgIFNjaGVkdWxlci5zY2hlZHVsZUNvbW1hbmQob3BlcmF0aW9uLCB6SW5kZXgsIHRoaXMucG9zdERyYXdDb21tYW5kcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgc2V0IG9mIHJlZ2lzdGVyZWQgZG9VcGRhdGUgb3BlcmF0aW9uc1xyXG4gICAgICovXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU9wZXJhdGlvbnMuY2xlYXIoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVG9nZ2xlcyBzdXNwZW5zaW9uIG9mIHRoZSBtYWluIGxvb3Agd2hlbiB0aGUgd2luZG93IGlzIGJsdXJyZWRcclxuICAgICAqIEBwYXJhbSBmbGFnXHJcbiAgICAgKi9cclxuICAgIHNldFN1c3BlbmRPbkJsdXIoZmxhZykge1xyXG4gICAgICAgIHRoaXMuc3VzcGVuZE9uQmx1ciA9IHR5cGVvZiBmbGFnICE9PSAndW5kZWZpbmVkJyA/IGZsYWcgOiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIGFsbCBkb1VwZGF0ZSBvcGVhcnRpb25zIHdoaWxlIHByZXNlcnZpbmcgdGhlIGRvVXBkYXRlIHF1ZXVlXHJcbiAgICAgKiBAcGFyYW0gc3RlcERlbHRhVGltZVxyXG4gICAgICogQHBhcmFtIHRvdGFsRWxhcHNlZFRpbWVcclxuICAgICAqL1xyXG4gICAgZG9VcGRhdGUoc3RlcERlbHRhVGltZSwgdG90YWxFbGFwc2VkVGltZSkge1xyXG4gICAgICAgIC8vIHJlc2V0IGRyYXcgY29tbWFuZHMgdG8gcHJldmVudCBkdXBsaWNhdGUgZnJhbWVzIGJlaW5nIHJlbmRlcmVkXHJcbiAgICAgICAgdGhpcy5kcmF3Q29tbWFuZHMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnBvc3REcmF3Q29tbWFuZHMuY2xlYXIoKTtcclxuICAgICAgICBjb25zdCBvcHNJdGVyYXRvciA9IHRoaXMudXBkYXRlT3BlcmF0aW9ucy5nZXRJdGVyYXRvcigpO1xyXG4gICAgICAgIHdoaWxlICghb3BzSXRlcmF0b3IuaXNFbmQoKSkge1xyXG4gICAgICAgICAgICBvcHNJdGVyYXRvci5uZXh0KCkuY2FsbChudWxsLCBzdGVwRGVsdGFUaW1lLCB0b3RhbEVsYXBzZWRUaW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVGhlcmUgbWlnaHQgYmUgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMsIGJ1dCBub3QgcmVhbGx5IHNsb3dpbmcgdGhpbmdzIGRvd24gcmlnaHQgbm93XHJcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTsgbWlnaHQgbm90IGJlIG5lY2Vzc2FyeSB3aXRoICRjdHJsIGFyY2hpdGVjdHVyZVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIGFsbCBkcmF3IGFuZCBwb3N0LWRyYXcgY29tbWFuZHMsIGVtcHR5aW5nIGVhY2ggcXVldWVcclxuICAgICAqIEBwYXJhbSBzdGVwRGVsdGFUaW1lXHJcbiAgICAgKiBAcGFyYW0gdG90YWxFbGFwc2VkVGltZVxyXG4gICAgICovXHJcbiAgICBkb0RyYXcoc3RlcERlbHRhVGltZSwgdG90YWxFbGFwc2VkVGltZSkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLmRyYXdDb21tYW5kcy5wZWVrKCkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Q29tbWFuZHMuZGVxdWV1ZSgpLmNhbGwobnVsbCwgc3RlcERlbHRhVGltZSwgdG90YWxFbGFwc2VkVGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlICh0aGlzLnBvc3REcmF3Q29tbWFuZHMucGVlaygpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zdERyYXdDb21tYW5kcy5kZXF1ZXVlKCkuY2FsbChudWxsLCBzdGVwRGVsdGFUaW1lLCB0b3RhbEVsYXBzZWRUaW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgRlBTIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0gdG90YWxFbGFwc2VkVGltZVxyXG4gICAgICovXHJcbiAgICB1cGRhdGVGUFModG90YWxFbGFwc2VkVGltZSkge1xyXG4gICAgICAgIHRoaXMuZnJhbWVzVGhpc1NlY29uZCsrO1xyXG4gICAgICAgIGlmICh0b3RhbEVsYXBzZWRUaW1lID4gdGhpcy5sYXN0RlBTVXBkYXRlICsgMTAwMCkge1xyXG4gICAgICAgICAgICBjb25zdCB3ZWlnaHRGYWN0b3IgPSAwLjI1O1xyXG4gICAgICAgICAgICB0aGlzLmZwcyA9ICh3ZWlnaHRGYWN0b3IgKiB0aGlzLmZyYW1lc1RoaXNTZWNvbmQpICsgKCgxIC0gd2VpZ2h0RmFjdG9yKSAqIHRoaXMuZnBzKTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0RlBTVXBkYXRlID0gdG90YWxFbGFwc2VkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZXNUaGlzU2Vjb25kID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERlcml2ZWQgRnJvbVxyXG4gICAgICogSXNhYWMgU3VraW5cclxuICAgICAqIGh0dHA6Ly93d3cuaXNhYWNzdWtpbi5jb20vbmV3cy8yMDE1LzAxL2RldGFpbGVkLWV4cGxhbmF0aW9uLWphdmFzY3JpcHQtZ2FtZS1sb29wcy1hbmQtdGltaW5nXHJcbiAgICAgKi9cclxuICAgIG1haW5Mb29wKCkge1xyXG4gICAgICAgIGNvbnN0IGZyYW1lVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdGhpcy5kZWx0YVRpbWUgKz0gZnJhbWVUaW1lIC0gdGhpcy5sYXN0RnJhbWVUaW1lO1xyXG4gICAgICAgIHRoaXMubGFzdEZyYW1lVGltZSA9IGZyYW1lVGltZTtcclxuICAgICAgICB0aGlzLmVsYXBzZWRUaW1lID0gZnJhbWVUaW1lIC0gdGhpcy5zdGFydFRpbWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVGUFModGhpcy5lbGFwc2VkVGltZSk7XHJcbiAgICAgICAgbGV0IHVwZGF0ZVN0ZXBzID0gMDtcclxuICAgICAgICBjb25zdCBmcmFtZURlbHRhVGltZSA9IHRoaXMuZGVsdGFUaW1lO1xyXG4gICAgICAgIHdoaWxlICh0aGlzLmRlbHRhVGltZSA+IHRoaXMudGltZXN0ZXApIHtcclxuICAgICAgICAgICAgdGhpcy5kb1VwZGF0ZSh0aGlzLnRpbWVzdGVwLCB0aGlzLmVsYXBzZWRUaW1lKTtcclxuICAgICAgICAgICAgdGhpcy5kZWx0YVRpbWUgLT0gdGhpcy50aW1lc3RlcDtcclxuICAgICAgICAgICAgY29uc3QgbWF4Q29uc2VjU3RlcHMgPSAyNDA7XHJcbiAgICAgICAgICAgIGlmICgrK3VwZGF0ZVN0ZXBzID4gbWF4Q29uc2VjU3RlcHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYFVwZGF0ZSBMb29wIEV4Y2VlZGVkICR7bWF4Q29uc2VjU3RlcHN9IENhbGxzYCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbHRhVGltZSA9IDA7IC8vIGRvbid0IGRvIGEgc2lsbHkgIyBvZiB1cGRhdGVzXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRvRHJhdyhmcmFtZURlbHRhVGltZSwgdGhpcy5lbGFwc2VkVGltZSk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLm1haW5Mb29wKTtcclxuICAgIH1cclxufTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICBiaW5kX2RlY29yYXRvcl8xLmRlZmF1bHQsXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtFdmVudF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgU2NoZWR1bGVyLnByb3RvdHlwZSwgXCJzdXNwZW5kXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgU2NoZWR1bGVyLnByb3RvdHlwZSwgXCJyZXN1bWVcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgYmluZF9kZWNvcmF0b3JfMS5kZWZhdWx0LFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBTY2hlZHVsZXIucHJvdG90eXBlLCBcIm1haW5Mb29wXCIsIG51bGwpO1xyXG5TY2hlZHVsZXIgPSBfX2RlY29yYXRlKFtcclxuICAgIF9fcGFyYW0oMCwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuY29uc3QuTWF4RnJhbWVSYXRlKSksXHJcbiAgICBfX3BhcmFtKDEsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULkFwcFN0YXRlKSksXHJcbiAgICBfX3BhcmFtKDIsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULkxvZ2dlcikpLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtOdW1iZXIsIGFwcF9zdGF0ZV9zZXJ2aWNlXzEuQXBwU3RhdGUsXHJcbiAgICAgICAgbG9nZ2VyX3NlcnZpY2VfMS5Mb2dnZXJdKVxyXG5dLCBTY2hlZHVsZXIpO1xyXG5leHBvcnRzLlNjaGVkdWxlciA9IFNjaGVkdWxlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVyLnNlcnZpY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3Qgd2ViZ2xfcmVzb3VyY2VfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLXJlc291cmNlXCIpO1xyXG5jb25zdCBzaGFkZXJfMSA9IHJlcXVpcmUoXCIuL3NoYWRlclwiKTtcclxuY29uc3QgYnl0ZVNpemVzID0ge1xyXG4gICAgW3NoYWRlcl8xLkdMRGF0YVR5cGUuQllURV06IDEsXHJcbiAgICBbc2hhZGVyXzEuR0xEYXRhVHlwZS5VTlNJR05FRF9TSE9SVF06IDIsXHJcbiAgICBbc2hhZGVyXzEuR0xEYXRhVHlwZS5GTE9BVF06IDQsXHJcbiAgICBbc2hhZGVyXzEuR0xEYXRhVHlwZS5TSE9SVF06IDIsXHJcbiAgICBbc2hhZGVyXzEuR0xEYXRhVHlwZS5VTlNJR05FRF9CWVRFXTogMSxcclxuICAgIFtzaGFkZXJfMS5HTERhdGFUeXBlLkhBTEZfRkxPQVRdOiAyLFxyXG59O1xyXG5jbGFzcyBCdWZmZXJGb3JtYXQgZXh0ZW5kcyB3ZWJnbF9yZXNvdXJjZV8xLldlYkdMUmVzb3VyY2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5hcHBseSA9IHRoaXMuY3JlYXRlTGF5b3V0RGVzY3JpcHRpb24ob3B0aW9ucy5zaGFkZXJTcGVjLmF0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG4gICAgLy8gcHVibGljIHVwZGF0ZUJ1ZmZlcihkYXRhOiBBcnJheUJ1ZmZlciB8IEFycmF5QnVmZmVyVmlldywgb2Zmc2V0OiBudW1iZXIgPSAwKSB7XHJcbiAgICAvLyAgICAgY29uc3Qge2dsfSA9IHRoaXMuY29udGV4dDtcclxuICAgIC8vICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52Ym8pO1xyXG4gICAgLy8gICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBvZmZzZXQsIGRhdGEpO1xyXG4gICAgLy8gfVxyXG4gICAgcmVsZWFzZSgpIHtcclxuICAgICAgICAvLyBuby1vcFxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZW5lcmF0ZXMgYSBsYXlvdXQgbWV0aG9kIGZvciB0aGUgYnVmZmVyIHdpdGggYm91bmQgZGF0YSB0byBvcHRpbWl6ZSBmb3IgcGVyZm9ybWFuY2VcclxuICAgICAqIEBwYXJhbSB7SUF0dHJpYkRlc2NyaXB0aW9uW119IGF0dHJpYnNcclxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cclxuICAgICAqL1xyXG4gICAgY3JlYXRlTGF5b3V0RGVzY3JpcHRpb24oYXR0cmlicykge1xyXG4gICAgICAgIGNvbnN0IHsgZ2wsIHByb2dyYW0gfSA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhTaXplID0gYXR0cmlicy5yZWR1Y2UoKHRvdGFsLCBhdHRyaWIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRvdGFsICsgYnl0ZVNpemVzW2F0dHJpYi50eXBlXSAqIGF0dHJpYi5zaXplIHwgMDtcclxuICAgICAgICB9LCAwKTtcclxuICAgICAgICAvLyBjb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB3aXRoIGJvdW5kIGRhdGFcclxuICAgICAgICBjb25zdCBsYXlvdXRPcHMgPSBbXTtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgICAgICBhdHRyaWJzLmZvckVhY2goKGF0dHJpYikgPT4ge1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBhdHRyaWJ1dGUgaW4gdGhlIHZlcnRleCBzaGFkZXIsIHdlIGNhbiBlaXRoZXIgcmV0cmlldmUgZnJvbSB0aGUgc2hhZGVyXHJcbiAgICAgICAgICAgIC8vIG9yIGZvcmNlIHRoZSBzaGFkZXIgdG8gdXNlIGEgZ2l2ZW4gcG9zaXRpb24gd2l0aCBiaW5kQXR0cmliTG9jYXRpb25cclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCBhdHRyaWIubmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5sb2dnZXIuZGVidWcoYFNraXBwaW5nIGxheW91dCBvZiAke2F0dHJpYi5uYW1lfSwgdW51c2VkIGluIHNoYWRlciBwcm9ncmFtYCk7XHJcbiAgICAgICAgICAgICAgICAvLyBpbmNyZWFzZSB0aGUgb2Zmc2V0IGZvciB0aGUgbmV4dCBhdHRyaWJcclxuICAgICAgICAgICAgICAgIG9mZnNldCArPSBieXRlU2l6ZXNbYXR0cmliLnR5cGVdICogYXR0cmliLnNpemU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZGVzY3JpYmUgdGhlIGF0dHJpYnV0ZSBpbiB0aGUgYnVmZmVyXHJcbiAgICAgICAgICAgIGxheW91dE9wcy5wdXNoKGdsLnZlcnRleEF0dHJpYlBvaW50ZXIuYmluZChnbCwgaW5kZXgsIGF0dHJpYi5zaXplIHx8IDAsIGdsW2F0dHJpYi50eXBlXSwgYXR0cmliLm5vcm1hbGl6ZSB8fCBmYWxzZSwgdmVydGV4U2l6ZSwgb2Zmc2V0KSk7XHJcbiAgICAgICAgICAgIC8vIHR1cm4gb24gdGhlIGF0dHJpYnV0ZSBhdCB0aGlzIGluZGV4XHJcbiAgICAgICAgICAgIGxheW91dE9wcy5wdXNoKGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5LmJpbmQoZ2wsIGluZGV4KSk7XHJcbiAgICAgICAgICAgIC8vIHN3aXRjaGluZyB0byBiaW5kIGF0dHJpYiBsb2NhdGlvbiBtYXkgaW1wcm92ZSBwZXJmb3JtYW5jZSBpZiAwIGluZGV4IGlzIHVudXNlZFxyXG4gICAgICAgICAgICAvLyBnbC5iaW5kQXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgaW5kZXgsIGF0dHJpYi5uYW1lKTsgLy8gY29ubmVjdCBhdHRyaWJ1dGUgdG8gdmVydGV4IHNoYWRlclxyXG4gICAgICAgICAgICAvLyBpbmNyZWFzZSB0aGUgb2Zmc2V0IGZvciB0aGUgbmV4dCBhdHRyaWJcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IGJ5dGVTaXplc1thdHRyaWIudHlwZV0gKiBhdHRyaWIuc2l6ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvbnRleHQubG9nZ2VyLmRlYnVnKGBDcmVhdGVkIGJ1ZmZlciBsYXlvdXQgZnVuY3Rpb25gLCBsYXlvdXRPcHMpO1xyXG4gICAgICAgIHJldHVybiAoKCkgPT4gbGF5b3V0T3BzLmZvckVhY2goKGYpID0+IGYoKSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuQnVmZmVyRm9ybWF0ID0gQnVmZmVyRm9ybWF0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWZmZXItZm9ybWF0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59O1xyXG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBzaGFkZXJfMSA9IHJlcXVpcmUoXCIuL3NoYWRlclwiKTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY29uc3Qgd2ViZ2xfcmVzb3VyY2VfMSA9IHJlcXVpcmUoXCIuL3dlYmdsLXJlc291cmNlXCIpO1xyXG5jb25zdCBidWZmZXJfZm9ybWF0XzEgPSByZXF1aXJlKFwiLi9idWZmZXItZm9ybWF0XCIpO1xyXG5jbGFzcyBTaGFkZXJQcm9ncmFtIGV4dGVuZHMgd2ViZ2xfcmVzb3VyY2VfMS5XZWJHTFJlc291cmNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQsIGNvbmZpZykge1xyXG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LnByb2dyYW0gPSBjb250ZXh0LmdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICBjb25zdCB7IGdsLCBwcm9ncmFtLCBsb2dnZXIgfSA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSB0aGlzLmNyZWF0ZVNoYWRlcihjb25maWcuc2hhZGVycy52ZXJ0ZXgpO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIuZ2V0U2hhZGVyKCkpO1xyXG4gICAgICAgIHZlcnRleFNoYWRlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSB0aGlzLmNyZWF0ZVNoYWRlcihjb25maWcuc2hhZGVycy5mcmFnbWVudCk7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50U2hhZGVyLmdldFNoYWRlcigpKTtcclxuICAgICAgICBmcmFnbWVudFNoYWRlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xyXG4gICAgICAgIGlmICghc3VjY2Vzcykge1xyXG4gICAgICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsaW5rIHByb2dyYW06ICR7Z2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSl9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7IC8vIHJldHJpZXZlIGFuZCBzdG9yZSBwcm9ncmFtIHZhcmlhYmxlIGluZm9ybWF0aW9uXHJcbiAgICAgICAgdGhpcy5idWZmZXJGb3JtYXQgPSBuZXcgYnVmZmVyX2Zvcm1hdF8xLkJ1ZmZlckZvcm1hdCh0aGlzLmNvbnRleHQsIHsgc2hhZGVyU3BlYzogY29uZmlnLnNoYWRlcnMudmVydGV4LnNwZWMgfSk7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuY2FjaGVVbmlmb3JtcyhbXHJcbiAgICAgICAgICAgIGNvbmZpZy5zaGFkZXJzLnZlcnRleC5zcGVjLnVuaWZvcm1zIHx8IHt9LFxyXG4gICAgICAgICAgICBjb25maWcuc2hhZGVycy5mcmFnbWVudC5zcGVjLnVuaWZvcm1zIHx8IHt9XHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcbiAgICBnZXRVbmlmb3JtU2V0dGVyKG5hbWUpIHtcclxuICAgICAgICBjb25zdCB7IGdsIH0gPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgY29uc3QgdW5pZm9ybSA9IHRoaXMudW5pZm9ybXNbbmFtZV07XHJcbiAgICAgICAgcmV0dXJuIGdsW3VuaWZvcm0udHlwZV0uYmluZChnbCwgdW5pZm9ybS5sb2NhdGlvbik7XHJcbiAgICB9XHJcbiAgICB1c2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBnbCwgcHJvZ3JhbSB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgdGhpcy5idWZmZXJGb3JtYXQuYXBwbHkoKTtcclxuICAgIH1cclxuICAgIGdldEdMUHJvZ3JhbSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LnByb2dyYW07XHJcbiAgICB9XHJcbiAgICByZWxlYXNlKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZ2wsIHByb2dyYW0gfSA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlU2hhZGVyKGNvbmZpZykge1xyXG4gICAgICAgIHJldHVybiBuZXcgc2hhZGVyXzEuU2hhZGVyKHRoaXMuY29udGV4dCwgY29uZmlnKTtcclxuICAgIH1cclxuICAgIGNhY2hlVW5pZm9ybXMoc3BlYykge1xyXG4gICAgICAgIGNvbnN0IHsgcHJvZ3JhbSwgZ2wgfSA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBzcGVjLmZvckVhY2goKHVuaWZvcm1zKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmxhdHRlblVuaWZvcm1zKHVuaWZvcm1zKS5mb3JFYWNoKChuYW1lUGNzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gbmFtZVBjcy5qb2luKCcuJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmdldFVuaWZvcm1UeXBlKHVuaWZvcm1zLCBuYW1lUGNzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5sb2dnZXIuZGVidWcoYENhY2hpbmcgdW5pZm9ybSAke25hbWV9ICgke3R5cGV9KSBhdCBsb2NhdGlvbiAke2xvY2F0aW9ufWApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51bmlmb3Jtc1tuYW1lXSA9IHsgbmFtZSwgbG9jYXRpb24sIHR5cGUgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmbGF0dGVuVW5pZm9ybXMoc3RydWN0LCBrZXlzID0gW10sIHBpZWNlcyA9IFtdKSB7XHJcbiAgICAgICAgaWYgKCFzdHJ1Y3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGllY2VzLmxlbmd0aCA+IDUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5pZm9ybSBzdHJ1Y3RzIHdpdGggbW9yZSB0aGFuIDUgbGV2ZWxzIGFyZSBub3Qgc3VwcG9ydGVkLCB5b3VyIHN0cnVjdCBvYmplY3QgbWF5IGhhdmUgY3ljbGVzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5rZXlzKHN0cnVjdCkuZm9yRWFjaCgocHJvcCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gc3RydWN0W3Byb3BdO1xyXG4gICAgICAgICAgICAvLyBUeXBlIC0+IG5ldyBrZXkgYXJyYXlcclxuICAgICAgICAgICAgaWYgKHNoYWRlcl8xLkdMVW5pZm9ybVR5cGVbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIGtleXMucHVzaChbLi4ucGllY2VzLCBwcm9wXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsYXR0ZW5Vbmlmb3Jtcyh0eXBlLCBrZXlzLCBbLi4ucGllY2VzLCBwcm9wXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4ga2V5cztcclxuICAgIH1cclxuICAgIGdldFVuaWZvcm1UeXBlKHVuaWZvcm0sIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gbmFtZS5yZWR1Y2UoKHN0cnVjdCwgcHJvcCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RydWN0W3Byb3BdO1xyXG4gICAgICAgIH0sIHVuaWZvcm0pO1xyXG4gICAgfVxyXG59XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgYmluZF9kZWNvcmF0b3JfMS5kZWZhdWx0LFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgT2JqZWN0KVxyXG5dLCBTaGFkZXJQcm9ncmFtLnByb3RvdHlwZSwgXCJjcmVhdGVTaGFkZXJcIiwgbnVsbCk7XHJcbmV4cG9ydHMuU2hhZGVyUHJvZ3JhbSA9IFNoYWRlclByb2dyYW07XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNoYWRlci1wcm9ncmFtLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHdlYmdsX3Jlc291cmNlXzEgPSByZXF1aXJlKFwiLi93ZWJnbC1yZXNvdXJjZVwiKTtcclxuY29uc3QgbGlicmFyeV9wcm92aWRlcl8xID0gcmVxdWlyZShcIi4uL2xpYnJhcnkucHJvdmlkZXJcIik7XHJcbnZhciBHTERhdGFUeXBlO1xyXG4oZnVuY3Rpb24gKEdMRGF0YVR5cGUpIHtcclxuICAgIEdMRGF0YVR5cGVbXCJCWVRFXCJdID0gXCJCWVRFXCI7XHJcbiAgICBHTERhdGFUeXBlW1wiRkxPQVRcIl0gPSBcIkZMT0FUXCI7XHJcbiAgICBHTERhdGFUeXBlW1wiU0hPUlRcIl0gPSBcIlNIT1JUXCI7XHJcbiAgICBHTERhdGFUeXBlW1wiVU5TSUdORURfU0hPUlRcIl0gPSBcIlVOU0lHTkVEX1NIT1JUXCI7XHJcbiAgICBHTERhdGFUeXBlW1wiVU5TSUdORURfQllURVwiXSA9IFwiVU5TSUdORURfQllURVwiO1xyXG4gICAgR0xEYXRhVHlwZVtcIkhBTEZfRkxPQVRcIl0gPSBcIkhBTEZfRkxPQVRcIjtcclxufSkoR0xEYXRhVHlwZSA9IGV4cG9ydHMuR0xEYXRhVHlwZSB8fCAoZXhwb3J0cy5HTERhdGFUeXBlID0ge30pKTtcclxudmFyIEdMVW5pZm9ybVR5cGU7XHJcbihmdW5jdGlvbiAoR0xVbmlmb3JtVHlwZSkge1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm0xZlwiXSA9IFwidW5pZm9ybTFmXCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTFmdlwiXSA9IFwidW5pZm9ybTFmdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm0yZlwiXSA9IFwidW5pZm9ybTJmXCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTJmdlwiXSA9IFwidW5pZm9ybTJmdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm0zZlwiXSA9IFwidW5pZm9ybTNmXCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTNmdlwiXSA9IFwidW5pZm9ybTNmdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm00ZlwiXSA9IFwidW5pZm9ybTRmXCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTRmdlwiXSA9IFwidW5pZm9ybTRmdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm1NYXRyaXgyZnZcIl0gPSBcInVuaWZvcm1NYXRyaXgyZnZcIjtcclxuICAgIEdMVW5pZm9ybVR5cGVbXCJ1bmlmb3JtTWF0cml4M2Z2XCJdID0gXCJ1bmlmb3JtTWF0cml4M2Z2XCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybU1hdHJpeDRmdlwiXSA9IFwidW5pZm9ybU1hdHJpeDRmdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm0xaVwiXSA9IFwidW5pZm9ybTFpXCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTFpdlwiXSA9IFwidW5pZm9ybTFpdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm0yaVwiXSA9IFwidW5pZm9ybTJpXCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTJpdlwiXSA9IFwidW5pZm9ybTJpdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm0zaVwiXSA9IFwidW5pZm9ybTNpXCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTNpdlwiXSA9IFwidW5pZm9ybTNpdlwiO1xyXG4gICAgR0xVbmlmb3JtVHlwZVtcInVuaWZvcm00aVwiXSA9IFwidW5pZm9ybTRpXCI7XHJcbiAgICBHTFVuaWZvcm1UeXBlW1widW5pZm9ybTRpdlwiXSA9IFwidW5pZm9ybTRpdlwiO1xyXG59KShHTFVuaWZvcm1UeXBlID0gZXhwb3J0cy5HTFVuaWZvcm1UeXBlIHx8IChleHBvcnRzLkdMVW5pZm9ybVR5cGUgPSB7fSkpO1xyXG52YXIgU2hhZGVyVHlwZTtcclxuKGZ1bmN0aW9uIChTaGFkZXJUeXBlKSB7XHJcbiAgICBTaGFkZXJUeXBlW1wiVkVSVEVYX1NIQURFUlwiXSA9IFwiVkVSVEVYX1NIQURFUlwiO1xyXG4gICAgU2hhZGVyVHlwZVtcIkZSQUdNRU5UX1NIQURFUlwiXSA9IFwiRlJBR01FTlRfU0hBREVSXCI7XHJcbn0pKFNoYWRlclR5cGUgPSBleHBvcnRzLlNoYWRlclR5cGUgfHwgKGV4cG9ydHMuU2hhZGVyVHlwZSA9IHt9KSk7XHJcbmNsYXNzIFNoYWRlckRUTyBleHRlbmRzIGxpYnJhcnlfcHJvdmlkZXJfMS5EVE8ge1xyXG59XHJcbmV4cG9ydHMuU2hhZGVyRFRPID0gU2hhZGVyRFRPO1xyXG5jbGFzcyBTaGFkZXIgZXh0ZW5kcyB3ZWJnbF9yZXNvdXJjZV8xLldlYkdMUmVzb3VyY2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCwgb3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgY29uc3QgeyBnbCB9ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLmlkID0gb3B0aW9ucy5pZDtcclxuICAgICAgICBjb25zdCBzaGFkZXJTb3VyY2UgPSBvcHRpb25zLnNyYyB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb25zLmlkKS50ZXh0Q29udGVudDtcclxuICAgICAgICBpZiAoIXNoYWRlclNvdXJjZSB8fCB0eXBlb2Ygc2hhZGVyU291cmNlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBnZXQgdmFsaWQgc2hhZGVyIHNvdXJjZSBmb3IgJHtvcHRpb25zLmlkfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbFtvcHRpb25zLnR5cGVdKTtcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2UodGhpcy5zaGFkZXIsIHNoYWRlclNvdXJjZSk7IC8vIHNlbmQgdGhlIHNvdXJjZSB0byB0aGUgc2hhZGVyIG9iamVjdFxyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIodGhpcy5zaGFkZXIpOyAvLyBjb21waWxlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHRoaXMuc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IGdsLmdldFNoYWRlckluZm9Mb2codGhpcy5zaGFkZXIpO1xyXG4gICAgICAgICAgICBnbC5kZWxldGVTaGFkZXIodGhpcy5zaGFkZXIpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjb21waWxlICR7dGhpcy5pZH06ICR7aW5mb31gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRTaGFkZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hhZGVyO1xyXG4gICAgfVxyXG4gICAgZ2V0SWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQ7XHJcbiAgICB9XHJcbiAgICBwcmVwYXJlKHsgZ2wgfSkge1xyXG4gICAgICAgIC8vIG5vLW9wXHJcbiAgICB9XHJcbiAgICByZWxlYXNlKCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5nbC5kZWxldGVTaGFkZXIodGhpcy5zaGFkZXIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuU2hhZGVyID0gU2hhZGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaGFkZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgbWVzaF8xID0gcmVxdWlyZShcIi4uL2dlb21ldHJ5L21lc2hcIik7XHJcbmNvbnN0IHdlYmdsX3Jlc291cmNlXzEgPSByZXF1aXJlKFwiLi93ZWJnbC1yZXNvdXJjZVwiKTtcclxuY2xhc3MgV2ViR0xNZXNoIGV4dGVuZHMgd2ViZ2xfcmVzb3VyY2VfMS5XZWJHTFJlc291cmNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihjb250ZXh0KTtcclxuICAgICAgICBjb25zdCB7IGdsIH0gPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMudmVydGV4Q291bnQgPSBvcHRpb25zLm1lc2guZ2V0SW5kZXhDb3VudCgpO1xyXG4gICAgICAgIHRoaXMudmVydGV4U2l6ZSA9IG1lc2hfMS5NZXNoLlZFUlRfU0laRTtcclxuICAgICAgICB0aGlzLmdsVmVydGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgLy8gZ2wuQVJSQVlfQlVGRkVSIGluZGljYXRlcyBwZXIgdmVydGV4IGRhdGFcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5nbFZlcnRleEJ1ZmZlcik7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG9wdGlvbnMubWVzaC5nZXRWZXJ0ZXhCdWZmZXIoKSwgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgIHRoaXMuZ2xJbmRleEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIC8vIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSIGluZGljYXRlcyBhbmQgaW5kZXggYnVmZmVyXHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5nbEluZGV4QnVmZmVyKTtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBvcHRpb25zLm1lc2guZ2V0SW5kZXhCdWZmZXIoKSwgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgIC8vIHByZXZlbnQgYWNjaWRlbnRhbCBtb2RpZmljYXRpb25zIHRvIHRoaXMgbWVzaFxyXG4gICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgIH1cclxuICAgIGdldEluZGV4QnVmZmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdsSW5kZXhCdWZmZXI7XHJcbiAgICB9XHJcbiAgICBnZXRWZXJ0ZXhCdWZmZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2xWZXJ0ZXhCdWZmZXI7XHJcbiAgICB9XHJcbiAgICBnZXRWZXJ0ZXhDb3VudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0ZXhDb3VudDtcclxuICAgIH1cclxuICAgIGdldFZlcnRleFNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGV4U2l6ZTtcclxuICAgIH1cclxuICAgIHJlbGVhc2UoKSB7XHJcbiAgICAgICAgY29uc3QgeyBnbCB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGdsLmRlbGV0ZUJ1ZmZlcih0aGlzLmdsVmVydGV4QnVmZmVyKTtcclxuICAgICAgICBnbC5kZWxldGVCdWZmZXIodGhpcy5nbEluZGV4QnVmZmVyKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLldlYkdMTWVzaCA9IFdlYkdMTWVzaDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2ViZ2wtbWVzaC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBXZWJHTFJlc291cmNlRmFjdG9yeSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgIH1cclxuICAgIGNyZWF0ZShjdG9yLCBvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBjdG9yKHRoaXMuY29udGV4dCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5XZWJHTFJlc291cmNlRmFjdG9yeSA9IFdlYkdMUmVzb3VyY2VGYWN0b3J5O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD13ZWJnbC1yZXNvdXJjZS1mYWN0b3J5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIFdlYkdMUmVzb3VyY2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5XZWJHTFJlc291cmNlID0gV2ViR0xSZXNvdXJjZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2ViZ2wtcmVzb3VyY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX21ldGFkYXRhID0gKHRoaXMgJiYgdGhpcy5fX21ldGFkYXRhKSB8fCBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xyXG59O1xyXG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgaW5qZWN0b3JfcGx1c18xID0gcmVxdWlyZShcIi4uL2xpYi9pbmplY3Rvci1wbHVzXCIpO1xyXG5jb25zdCByZW5kZXJfdGFyZ2V0X2ZhY3RvcnlfMSA9IHJlcXVpcmUoXCIuLi9yZW5kZXItdGFyZ2V0LmZhY3RvcnlcIik7XHJcbmNvbnN0IGxvZ2dlcl8xID0gcmVxdWlyZShcIi4uL2xpYi9sb2dnZXJcIik7XHJcbmNvbnN0IG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xID0gcmVxdWlyZShcIi4uL21hbGxldC5kZXBlZGVuY3ktdHJlZVwiKTtcclxuY29uc3Qgc2NoZWR1bGVyX3NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuLi9zY2hlZHVsZXIuc2VydmljZVwiKTtcclxuY29uc3QgcmVuZGVyX3RhcmdldF9jb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9yZW5kZXItdGFyZ2V0LmNvbXBvbmVudFwiKTtcclxuY29uc3Qgc2hhZGVyXzEgPSByZXF1aXJlKFwiLi9zaGFkZXJcIik7XHJcbmNvbnN0IG1lc2hfMSA9IHJlcXVpcmUoXCIuLi9nZW9tZXRyeS9tZXNoXCIpO1xyXG5jb25zdCB3ZWJnbF9tZXNoXzEgPSByZXF1aXJlKFwiLi93ZWJnbC1tZXNoXCIpO1xyXG5jb25zdCBjYW1lcmFfMSA9IHJlcXVpcmUoXCIuLi9nZW9tZXRyeS9jYW1lcmFcIik7XHJcbmxldCBXZWJHTFN0YWdlQ3RybCA9IGNsYXNzIFdlYkdMU3RhZ2VDdHJsIHtcclxuICAgIGNvbnN0cnVjdG9yKGxpYnJhcnksIHN0YWdlLCBzY2hlZHVsZXIsICRlbGVtZW50LCBsb2dnZXIpIHtcclxuICAgICAgICB0aGlzLmxpYnJhcnkgPSBsaWJyYXJ5O1xyXG4gICAgICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy50eXBlID0gcmVuZGVyX3RhcmdldF9mYWN0b3J5XzEuUmVuZGVyVGFyZ2V0V2ViR0w7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbygnQnVpbGQgV2ViR0wgU3RhZ2UnKTtcclxuICAgIH1cclxuICAgICRwb3N0TGluaygpIHtcclxuICAgICAgICB0aGlzLmxvYWRDb250ZXh0KCk7XHJcbiAgICAgICAgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgICAgICB0aGlzLmxpYnJhcnkuZ2V0KHNoYWRlcl8xLlNoYWRlckRUTywgJzNkLXZlcnRleC1zaGFkZXInKSxcclxuICAgICAgICAgICAgdGhpcy5saWJyYXJ5LmdldChzaGFkZXJfMS5TaGFkZXJEVE8sICdmcmFnbWVudC1zaGFkZXInKSxcclxuICAgICAgICAgICAgdGhpcy5saWJyYXJ5LmdldChtZXNoXzEuTWVzaCwgJ2N1YmUnKSxcclxuICAgICAgICBdKS50aGVuKChbdmVydGV4LCBmcmFnbWVudCwgY3ViZV0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdGFnZS5zZXQodGhpcy5yZW5kZXJUYXJnZXQsIHsgc2hhZGVyczogeyB2ZXJ0ZXgsIGZyYWdtZW50IH0gfSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IGNhbWVyYV8xLkNhbWVyYSh0aGlzLmdldEFzcGVjdFJhdGlvKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YWdlLnNldEFjdGl2ZUNhbWVyYSh0aGlzLmNhbWVyYSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGdsQ3ViZSA9IHRoaXMuc3RhZ2UuZ2V0RmFjdG9yeSgpLmNyZWF0ZSh3ZWJnbF9tZXNoXzEuV2ViR0xNZXNoLCB7IG1lc2g6IGN1YmUgfSk7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGBGYWlsZWQgdG8gV2ViR0wgc3RhZ2UsIGV4aXRpbmcgc2V0dXAgbWV0aG9kYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoKGR0LCB0dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEudXBkYXRlKGR0LCB0dCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlci5kcmF3KHRoaXMuc3RhZ2UuY2xlYXIsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuZHJhdygoKSA9PiB7IHRoaXMuc3RhZ2UucmVuZGVyKGdsQ3ViZSk7IH0sIDIpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGxvYWRDb250ZXh0KCkge1xyXG4gICAgICAgIGNvbnN0IFJUQ3RybCA9IHJlbmRlcl90YXJnZXRfY29tcG9uZW50XzEuUmVuZGVyVGFyZ2V0Q3RybC5nZXRDb250cm9sbGVyKHRoaXMuJGVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuZ2wgPSBSVEN0cmwuZ2V0Q29udGV4dCgpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ID0gUlRDdHJsLmdldFJlbmRlclRhcmdldCgpO1xyXG4gICAgfVxyXG4gICAgZ2V0QXNwZWN0UmF0aW8oKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuJGVsZW1lbnRbMF07XHJcbiAgICAgICAgcmV0dXJuIGVsZW0uY2xpZW50V2lkdGggLyBlbGVtLmNsaWVudEhlaWdodDtcclxuICAgIH1cclxufTtcclxuV2ViR0xTdGFnZUN0cmwgPSBfX2RlY29yYXRlKFtcclxuICAgIF9fcGFyYW0oMCwgaW5qZWN0b3JfcGx1c18xLmluamVjdChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuTGlicmFyeSkpLFxyXG4gICAgX19wYXJhbSgxLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC53ZWJnbC5XZWJHTFN0YWdlKSksXHJcbiAgICBfX3BhcmFtKDIsIGluamVjdG9yX3BsdXNfMS5pbmplY3QobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULlNjaGVkdWxlcikpLFxyXG4gICAgX19wYXJhbSgzLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5uZy4kZWxlbWVudCkpLFxyXG4gICAgX19wYXJhbSg0LCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5Mb2dnZXIpKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0LCBPYmplY3QsIHNjaGVkdWxlcl9zZXJ2aWNlXzEuU2NoZWR1bGVyLCBPYmplY3QsIGxvZ2dlcl8xLkxvZ2dlcl0pXHJcbl0sIFdlYkdMU3RhZ2VDdHJsKTtcclxuZXhwb3J0cy53ZWJHTFN0YWdlT3B0aW9ucyA9IHtcclxuICAgIGNvbnRyb2xsZXI6IGluamVjdG9yX3BsdXNfMS5uZ0Fubm90YXRlKFdlYkdMU3RhZ2VDdHJsKSxcclxuICAgIHRlbXBsYXRlOiAnPG1hbGxldC1yZW5kZXItdGFyZ2V0IHR5cGU9XCIkY3RybC50eXBlXCI+PC9tYWxsZXQtcmVuZGVyLXRhcmdldD4nLFxyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD13ZWJnbC1zdGFnZS5jb21wb25lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX21ldGFkYXRhID0gKHRoaXMgJiYgdGhpcy5fX21ldGFkYXRhKSB8fCBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xyXG59O1xyXG52YXIgX19wYXJhbSA9ICh0aGlzICYmIHRoaXMuX19wYXJhbSkgfHwgZnVuY3Rpb24gKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgcmVuZGVyX3RhcmdldF9mYWN0b3J5XzEgPSByZXF1aXJlKFwiLi4vcmVuZGVyLXRhcmdldC5mYWN0b3J5XCIpO1xyXG5jb25zdCB3ZWJnbF9yZXNvdXJjZV9mYWN0b3J5XzEgPSByZXF1aXJlKFwiLi93ZWJnbC1yZXNvdXJjZS1mYWN0b3J5XCIpO1xyXG5jb25zdCBpbmplY3Rvcl9wbHVzXzEgPSByZXF1aXJlKFwiLi4vbGliL2luamVjdG9yLXBsdXNcIik7XHJcbmNvbnN0IG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xID0gcmVxdWlyZShcIi4uL21hbGxldC5kZXBlZGVuY3ktdHJlZVwiKTtcclxuY29uc3QgbG9nZ2VyXzEgPSByZXF1aXJlKFwiLi4vbGliL2xvZ2dlclwiKTtcclxuY29uc3QgYmluZF9kZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCJiaW5kLWRlY29yYXRvclwiKTtcclxuY29uc3Qgc2hhZGVyX3Byb2dyYW1fMSA9IHJlcXVpcmUoXCIuL3NoYWRlci1wcm9ncmFtXCIpO1xyXG5jb25zdCBnbF9tYXRyaXhfMSA9IHJlcXVpcmUoXCJnbC1tYXRyaXhcIik7XHJcbmxldCBXZWJHTFN0YWdlID0gY2xhc3MgV2ViR0xTdGFnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigkcSwgbG9nZ2VyKSB7XHJcbiAgICAgICAgdGhpcy4kcSA9ICRxO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgICAgIHRoaXMuaWRlbnRpdHkgPSBnbF9tYXRyaXhfMS5tYXQ0LmNyZWF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY3ViZVogPSAtMTtcclxuICAgICAgICB0aGlzLmN1YmVEZWx0YSA9IDEgLyA1MDA7XHJcbiAgICAgICAgdGhpcy5jdWJlUm90ID0gMDtcclxuICAgIH1cclxuICAgIHNldChyZW5kZXJUYXJnZXQsIHByb2dyYW1Db25maWcpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgU2V0dGluZyBXZWJHTCBTdGFnZWApO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ID0gcmVuZGVyVGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuZ2wgPSByZW5kZXJUYXJnZXQuZ2V0Q29udGV4dCgpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHsgZ2w6IHRoaXMuZ2wsIHByb2dyYW06IG51bGwsIGxvZ2dlcjogdGhpcy5sb2dnZXIgfTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyYW0gPSBuZXcgc2hhZGVyX3Byb2dyYW1fMS5TaGFkZXJQcm9ncmFtKHRoaXMuY29udGV4dCwgcHJvZ3JhbUNvbmZpZyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5wcm9ncmFtID0gdGhpcy5wcm9ncmFtLmdldEdMUHJvZ3JhbSgpO1xyXG4gICAgICAgICAgICBjb25zdCB7IGdsIH0gPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTsgLy8gY291bGQgcmVwbGFjZSB0aGlzIHdpdGggYmxlbmRpbmc6IGh0dHA6Ly9sZWFybmluZ3dlYmdsLmNvbS9ibG9nLz9wPTg1OVxyXG4gICAgICAgICAgICB0aGlzLnNldFZpZXdNYXRyaXggPSB0aGlzLnByb2dyYW0uZ2V0VW5pZm9ybVNldHRlcigndmlldycpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFdvcmxkTWF0cml4ID0gdGhpcy5wcm9ncmFtLmdldFVuaWZvcm1TZXR0ZXIoJ3dvcmxkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UHJvamVjdGlvbk1hdHJpeCA9IHRoaXMucHJvZ3JhbS5nZXRVbmlmb3JtU2V0dGVyKCdwcm9qZWN0aW9uJyk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3JhbS5nZXRVbmlmb3JtU2V0dGVyKCdsaWdodC5hbWJpZW50Q29sb3InKSgwLjEsIDAuMSwgMC4xLCAxLjApO1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyYW0uZ2V0VW5pZm9ybVNldHRlcignbGlnaHQuZGlmZnVzZUNvbG9yJykoMC44LCAwLjgsIDAuOCwgMS4wKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9ncmFtLmdldFVuaWZvcm1TZXR0ZXIoJ2xpZ2h0LmRpcmVjdGlvbicpKC0xLCAwLCAwKTtcclxuICAgICAgICAgICAgLy8gVE9ETzogY3JlYXRlIG1hdGVyaWFsc1xyXG4gICAgICAgICAgICB0aGlzLmdsRmFjdG9yeSA9IG5ldyB3ZWJnbF9yZXNvdXJjZV9mYWN0b3J5XzEuV2ViR0xSZXNvdXJjZUZhY3RvcnkodGhpcy5jb250ZXh0KTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYFdlYkdMIFN0YWdlIHNldGApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZS5tZXNzYWdlIHx8IGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0RmFjdG9yeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nbEZhY3Rvcnk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmVDYW1lcmEoY2FtZXJhKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgLy8gdGhpcyB3aWxsIGhhdmUgdG8gbW92ZSB0byBkbyB6b29taW5nIG9yIHNpbWlsYXJcclxuICAgICAgICB0aGlzLnNldFByb2plY3Rpb25NYXRyaXgoZmFsc2UsIGNhbWVyYS5nZXRQcm9qZWN0aW9uTWF0cml4KCkpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKG1lc2gpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZ2wgfHwgIXRoaXMuY29udGV4dC5wcm9ncmFtKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBXZWJHTCBjb250ZXh0IG9yIHByb2dyYW0gbm90IHByZXNlbnQuIFNraXBwaW5nIGZyYW1lIHJlbmRlcmApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHsgZ2wgfSA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82MDc3MDAyL3VzaW5nLXdlYmdsLWluZGV4LWJ1ZmZlcnMtZm9yLWRyYXdpbmctbWVzaGVzXHJcbiAgICAgICAgLy8gZ2V0IHRoZSB2ZXJ0ZXggYnVmZmVyIGZyb20gdGhlIG1lc2ggJiBzZW5kIHRoZSB2ZXJ0ZXggYnVmZmVyIHRvIHRoZSBHUFVcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbWVzaC5nZXRWZXJ0ZXhCdWZmZXIoKSk7XHJcbiAgICAgICAgLy8gdXNlIHByb2dyYW0gJiBlbmFibGUgYXR0cmlidXRlc1xyXG4gICAgICAgIHRoaXMucHJvZ3JhbS51c2UoKTtcclxuICAgICAgICAvLyBzZW5kIGluZGV4IGJ1ZmZlciB0byB0aGUgR1BVXHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbWVzaC5nZXRJbmRleEJ1ZmZlcigpKTtcclxuICAgICAgICBjb25zdCBjdWJlVHJhbnNmb3JtID0gZ2xfbWF0cml4XzEubWF0NC5jcmVhdGUoKTtcclxuICAgICAgICBnbF9tYXRyaXhfMS5tYXQ0LnRyYW5zbGF0ZShjdWJlVHJhbnNmb3JtLCB0aGlzLmlkZW50aXR5LCBbLjI1LCAtLjE1LCB0aGlzLmN1YmVaXSk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEubWF0NC5yb3RhdGVYKGN1YmVUcmFuc2Zvcm0sIGN1YmVUcmFuc2Zvcm0sIHRoaXMuY3ViZVJvdCk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEubWF0NC5yb3RhdGVZKGN1YmVUcmFuc2Zvcm0sIGN1YmVUcmFuc2Zvcm0sIHRoaXMuY3ViZVJvdCk7XHJcbiAgICAgICAgZ2xfbWF0cml4XzEubWF0NC5yb3RhdGVaKGN1YmVUcmFuc2Zvcm0sIGN1YmVUcmFuc2Zvcm0sIHRoaXMuY3ViZVJvdCk7XHJcbiAgICAgICAgdGhpcy5zZXRXb3JsZE1hdHJpeChmYWxzZSwgY3ViZVRyYW5zZm9ybSk7XHJcbiAgICAgICAgLy8gcGVyZm9ybSB0aGUgZHJhdyBjYWxsXHJcbiAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsLlRSSUFOR0xFUywgbWVzaC5nZXRWZXJ0ZXhDb3VudCgpLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XHJcbiAgICB9XHJcbiAgICBjbGVhcihkdCkge1xyXG4gICAgICAgIGlmICghdGhpcy5nbCB8fCAhdGhpcy5jb250ZXh0LnByb2dyYW0pIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYFdlYkdMIGNvbnRleHQgb3IgcHJvZ3JhbSBub3QgcHJlc2VudC4gU2tpcHBpbmcgZnJhbWUgcmVuZGVyYCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBnbCB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoMC4zMywgMC4zMywgMC4zMywgMSk7XHJcbiAgICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbiAgICAgICAgLy8ga2luZCBvZiBvdXQgb2Ygc2NvcGUsIGJ1dCBjbGVhciBpcyBmaXJzdCBkcmF3IG9wZXJhdGlvbiwgc28gd29ya3MgZm9yIG5vd1xyXG4gICAgICAgIHRoaXMuc2V0Vmlld01hdHJpeChmYWxzZSwgdGhpcy5hY3RpdmVDYW1lcmEuZ2V0Vmlld01hdHJpeCgpKTtcclxuICAgICAgICB0aGlzLmN1YmVaICs9IGR0ICogdGhpcy5jdWJlRGVsdGE7XHJcbiAgICAgICAgdGhpcy5jdWJlUm90ICs9IGR0ICogdGhpcy5jdWJlRGVsdGE7XHJcbiAgICAgICAgY29uc3QgbWluID0gLTEwO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IC0wLjEgLSAwLjU7XHJcbiAgICAgICAgaWYgKHRoaXMuY3ViZVogPCBtaW4gfHwgdGhpcy5jdWJlWiA+IG1heCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1YmVaID0gTWF0aC5taW4obWluLCBNYXRoLm1heCh0aGlzLmN1YmVaLCBtYXgpKTtcclxuICAgICAgICAgICAgdGhpcy5jdWJlRGVsdGEgKj0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5fX2RlY29yYXRlKFtcclxuICAgIGJpbmRfZGVjb3JhdG9yXzEuZGVmYXVsdCxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW3JlbmRlcl90YXJnZXRfZmFjdG9yeV8xLlJlbmRlclRhcmdldFdlYkdMLCBPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCBCb29sZWFuKVxyXG5dLCBXZWJHTFN0YWdlLnByb3RvdHlwZSwgXCJzZXRcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgYmluZF9kZWNvcmF0b3JfMS5kZWZhdWx0LFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbTnVtYmVyXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBXZWJHTFN0YWdlLnByb3RvdHlwZSwgXCJjbGVhclwiLCBudWxsKTtcclxuV2ViR0xTdGFnZSA9IF9fZGVjb3JhdGUoW1xyXG4gICAgX19wYXJhbSgwLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5uZy4kcSkpLFxyXG4gICAgX19wYXJhbSgxLCBpbmplY3Rvcl9wbHVzXzEuaW5qZWN0KG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xLk1EVC5Mb2dnZXIpKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbRnVuY3Rpb24sIGxvZ2dlcl8xLkxvZ2dlcl0pXHJcbl0sIFdlYkdMU3RhZ2UpO1xyXG5leHBvcnRzLldlYkdMU3RhZ2UgPSBXZWJHTFN0YWdlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD13ZWJnbC1zdGFnZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBsaWJyYXJ5X3Byb3ZpZGVyXzEgPSByZXF1aXJlKFwiLi4vbGlicmFyeS5wcm92aWRlclwiKTtcclxuY29uc3QgbWFsbGV0X2RlcGVkZW5jeV90cmVlXzEgPSByZXF1aXJlKFwiLi4vbWFsbGV0LmRlcGVkZW5jeS10cmVlXCIpO1xyXG5jb25zdCBpbmplY3Rvcl9wbHVzXzEgPSByZXF1aXJlKFwiLi4vbGliL2luamVjdG9yLXBsdXNcIik7XHJcbmNvbnN0IHNoYWRlcl8xID0gcmVxdWlyZShcIi4vc2hhZGVyXCIpO1xyXG5jb25zdCBtZXNoXzEgPSByZXF1aXJlKFwiLi4vZ2VvbWV0cnkvbWVzaFwiKTtcclxuY29uc3QgZ2xNYXRyaXggPSByZXF1aXJlKFwiZ2wtbWF0cml4XCIpO1xyXG5jb25zdCB7IHZlYzMgfSA9IGdsTWF0cml4O1xyXG4vLyB0aGlzIGtpbmRhIHN1Y2tzIGJ1dCBpdCdzIHRoZSBvbmx5IHdheSB0byBzb21lIHJlYXNvbmFibHkgaGF2ZSBhY2Nlc3MgdG8gdGhpcyBkYXRhLi4uXHJcbmNvbnN0IGVtYmVkZGVkU2hhZGVycyA9IHtcclxuICAgIC8vIGxhbmd1YWdlPUdMU0xcclxuICAgIHZlcnRleFNoYWRlcjNkOiBgI3ZlcnNpb24gMTAwXHJcbi8vYW4gYXR0cmlidXRlIHdpbGwgcmVjZWl2ZSBkYXRhIGZyb20gYSBidWZmZXJcclxuYXR0cmlidXRlIHZlYzMgYV9wb3NpdGlvbjtcclxuYXR0cmlidXRlIHZlYzMgYV9ub3JtYWw7XHJcbmF0dHJpYnV0ZSB2ZWMzIGFfY29sb3I7XHJcblxyXG51bmlmb3JtIG1hdDQgd29ybGQ7XHJcbnVuaWZvcm0gbWF0NCB2aWV3O1xyXG51bmlmb3JtIG1hdDQgcHJvamVjdGlvbjtcclxuXHJcbnZhcnlpbmcgaGlnaHAgdmVjNCB2Q29sb3I7XHJcbnZhcnlpbmcgaGlnaHAgdmVjMyB2Tm9ybWFsO1xyXG4vL3N0YXJ0aW5nIHBvaW50XHJcbnZvaWQgbWFpbigpIHtcclxuICAgIC8vIFRoZSB2ZXJ0ZXgncyBwb3NpdGlvbiAoaW5wdXQucG9zaXRpb24pIG11c3QgYmUgY29udmVydGVkIHRvIHdvcmxkIHNwYWNlLFxyXG5cdC8vIHRoZW4gY2FtZXJhIHNwYWNlIChyZWxhdGl2ZSB0byBvdXIgM0QgY2FtZXJhKSwgdGhlbiB0byBwcm9wZXIgaG9tb2dlbm91cyBcclxuXHQvLyBzY3JlZW4tc3BhY2UgY29vcmRpbmF0ZXMuICBUaGlzIGlzIHRha2VuIGNhcmUgb2YgYnkgb3VyIHdvcmxkLCB2aWV3IGFuZFxyXG5cdC8vIHByb2plY3Rpb24gbWF0cmljZXMuICBcclxuXHQvL1xyXG5cdC8vIEZpcnN0IHdlIG11bHRpcGx5IHRoZW0gdG9nZXRoZXIgdG8gZ2V0IGEgc2luZ2xlIG1hdHJpeCB3aGljaCByZXByZXNlbnRzXHJcblx0Ly8gYWxsIG9mIHRob3NlIHRyYW5zZm9ybWF0aW9ucyAod29ybGQgdG8gdmlldyB0byBwcm9qZWN0aW9uIHNwYWNlKVxyXG4gICAgLy8gY2FsY3VsYXRlIHRoZSB3b3JsZFZpZXdQcm9qZWN0aW9uIG1hdDQgKGRvZXMgdGhpcyBuZWVkIHRvIGJlIGZvciBldmVyeSB2ZXJ0ZXg/Pz8ganVzdCBmb3Igb2JqZWN0P1xyXG4gICAgbWF0NCBwcm9qZWN0aW9uVmlld1dvcmxkID0gcHJvamVjdGlvbiAqIHdvcmxkICogdmlldztcclxuICAgXHJcbiAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25WaWV3V29ybGQgKiB2ZWM0KGFfcG9zaXRpb24sIDEpO1xyXG4gICAgXHJcbiAgICB2Q29sb3IgPSB2ZWM0KGFfY29sb3IsIDEuMCk7XHJcbiAgICB2Tm9ybWFsID0gdmVjMyh3b3JsZCAqIHZpZXcgKiB2ZWM0KGFfbm9ybWFsLCAxKSk7XHJcbn1gLFxyXG4gICAgLy8gbGFuZ3VhZ2U9R0xTTFxyXG4gICAgZnJhZ21lbnRTaGFkZXI6IGAjdmVyc2lvbiAxMDBcclxuLy8gZnJhZ21lbnQgc2hhZGVycyBkb24ndCBodmFlIGRlZmF1bHQgcHJlY2lzaW9uLCBzbyBkZWZpbmVcclxuLy8gYXMgbWVkaXVtcCwgXCJtZWRpdW0gcHJlY2lzaW9uXCJcclxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XHJcblxyXG52YXJ5aW5nIGhpZ2hwIHZlYzQgdkNvbG9yO1xyXG52YXJ5aW5nIGhpZ2hwIHZlYzMgdk5vcm1hbDtcclxuXHJcbnN0cnVjdCBMaWdodCB7XHJcbiAgICB2ZWM0IGFtYmllbnRDb2xvcjtcclxuICAgIHZlYzQgZGlmZnVzZUNvbG9yO1xyXG4gICAgdmVjMyBkaXJlY3Rpb247XHJcbn07XHJcblxyXG4vLyB1bmlmb3JtIGludCBudW1MaWdodHM7XHJcbnVuaWZvcm0gTGlnaHQgbGlnaHQ7XHJcblxyXG52ZWM0IGdldExpZ2h0Q29sb3IoTGlnaHQgbGlnaHQsIHZlYzMgbm9ybWFsKSB7XHJcbiAgICB2ZWMzIGxpZ2h0RGlyID0gbm9ybWFsaXplKC1saWdodC5kaXJlY3Rpb24pO1xyXG4gICAgZmxvYXQgbGlnaHRBbXQgPSBjbGFtcChkb3QobGlnaHREaXIsIG5vcm1hbCksIDAuMCwgMS4wKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIGxpZ2h0LmRpZmZ1c2VDb2xvciAqIGxpZ2h0QW10OyAgIFxyXG59XHJcblxyXG52b2lkIG1haW4oKSB7XHJcbiAgICAvLyBnbF9GcmFnQ29sb3IgaXMgdGhlIG91dHBvdXQgb2YgdGhlIGZyYWdtZW50XHJcbiAgICBnbF9GcmFnQ29sb3IgPSBsaWdodC5hbWJpZW50Q29sb3IgKyBnZXRMaWdodENvbG9yKGxpZ2h0LCB2Tm9ybWFsKTtcclxufWBcclxufTtcclxuY29uc3Qgc2hhZGVyQ29uZmlnID0ge1xyXG4gICAgJzNkLXZlcnRleC1zaGFkZXInOiB7XHJcbiAgICAgICAgaWQ6ICczZC12ZXJ0ZXgtc2hhZGVyJyxcclxuICAgICAgICBzcmM6IGVtYmVkZGVkU2hhZGVycy52ZXJ0ZXhTaGFkZXIzZCxcclxuICAgICAgICB0eXBlOiBzaGFkZXJfMS5TaGFkZXJUeXBlLlZFUlRFWF9TSEFERVIsXHJcbiAgICAgICAgc3BlYzoge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdhX3Bvc2l0aW9uJywgc2l6ZTogMywgdHlwZTogc2hhZGVyXzEuR0xEYXRhVHlwZS5GTE9BVCB9LFxyXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYV9ub3JtYWwnLCBzaXplOiAzLCB0eXBlOiBzaGFkZXJfMS5HTERhdGFUeXBlLkZMT0FULCBub3JtYWxpemU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2FfY29sb3InLCBzaXplOiAzLCB0eXBlOiBzaGFkZXJfMS5HTERhdGFUeXBlLkZMT0FUIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgdW5pZm9ybXM6IHtcclxuICAgICAgICAgICAgICAgIHZpZXc6IHNoYWRlcl8xLkdMVW5pZm9ybVR5cGUudW5pZm9ybU1hdHJpeDRmdixcclxuICAgICAgICAgICAgICAgIHByb2plY3Rpb246IHNoYWRlcl8xLkdMVW5pZm9ybVR5cGUudW5pZm9ybU1hdHJpeDRmdixcclxuICAgICAgICAgICAgICAgIHdvcmxkOiBzaGFkZXJfMS5HTFVuaWZvcm1UeXBlLnVuaWZvcm1NYXRyaXg0ZnYsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICAnZnJhZ21lbnQtc2hhZGVyJzoge1xyXG4gICAgICAgIGlkOiAnZnJhZ21lbnQtc2hhZGVyJyxcclxuICAgICAgICBzcmM6IGVtYmVkZGVkU2hhZGVycy5mcmFnbWVudFNoYWRlcixcclxuICAgICAgICB0eXBlOiBzaGFkZXJfMS5TaGFkZXJUeXBlLkZSQUdNRU5UX1NIQURFUixcclxuICAgICAgICBzcGVjOiB7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zOiB7XHJcbiAgICAgICAgICAgICAgICBsaWdodDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFtYmllbnRDb2xvcjogc2hhZGVyXzEuR0xVbmlmb3JtVHlwZS51bmlmb3JtNGYsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlmZnVzZUNvbG9yOiBzaGFkZXJfMS5HTFVuaWZvcm1UeXBlLnVuaWZvcm00ZixcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IHNoYWRlcl8xLkdMVW5pZm9ybVR5cGUudW5pZm9ybTNmLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufTtcclxuY29uc3QgbWVzaGVzID0geyBjdWJlOiB7XHJcbiAgICAgICAgY29sb3JzOiBbXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygxLjAsIDAuMCwgMC4wKSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKDAuMCwgMS4wLCAwLjApLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoMC4wLCAwLjAsIDEuMCksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygxLjAsIDEuMCwgMC4wKSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKDAuMCwgMS4wLCAxLjApLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoMS4wLCAwLjAsIDEuMCksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygwLjAsIDAuMCwgMC4wKSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKDEuMCwgMS4wLCAxLjApLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgaW5kaWNlczogW1xyXG4gICAgICAgICAgICAwLCAyLCAxLCAwLCAzLCAyLFxyXG4gICAgICAgICAgICAyLCAzLCA2LCAzLCA3LCA2LFxyXG4gICAgICAgICAgICAxLCA2LCA1LCAxLCAyLCA2LFxyXG4gICAgICAgICAgICA0LCA1LCA2LCA0LCA2LCA3LFxyXG4gICAgICAgICAgICAwLCAxLCA1LCAwLCA1LCA0LFxyXG4gICAgICAgICAgICAwLCA3LCAzLCAwLCA0LCA3LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgcG9zaXRpb25zOiBbXHJcbiAgICAgICAgICAgIC8qICAgNSAgKy0tLSsgNlxyXG4gICAgICAgICAgICAgKiAgICAvICAgLyB8XHJcbiAgICAgICAgICAgICAqIDEgKy0tLSsyICsgN1xyXG4gICAgICAgICAgICAgKiAgIHwgICB8IC9cclxuICAgICAgICAgICAgICogMCArLS0tKyAzXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoLTAuNSwgLTAuNSwgKzAuNSksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygtMC41LCArMC41LCArMC41KSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKCswLjUsICswLjUsICswLjUpLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoKzAuNSwgLTAuNSwgKzAuNSksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygtMC41LCAtMC41LCAtMC41KSxcclxuICAgICAgICAgICAgdmVjMy5mcm9tVmFsdWVzKC0wLjUsICswLjUsIC0wLjUpLFxyXG4gICAgICAgICAgICB2ZWMzLmZyb21WYWx1ZXMoKzAuNSwgKzAuNSwgLTAuNSksXHJcbiAgICAgICAgICAgIHZlYzMuZnJvbVZhbHVlcygrMC41LCAtMC41LCAtMC41KVxyXG4gICAgICAgIF0sXHJcbiAgICB9IH07XHJcbmxldCBXZWJHTExpYnJhcnlDb25maWcgPSBjbGFzcyBXZWJHTExpYnJhcnlDb25maWcge1xyXG4gICAgY29uc3RydWN0b3IobGlicmFyeVByb3ZpZGVyKSB7XHJcbiAgICAgICAgbGlicmFyeVByb3ZpZGVyLmFkZExpYnJhcnkoc2hhZGVyXzEuU2hhZGVyRFRPLCBbbmV3IGxpYnJhcnlfcHJvdmlkZXJfMS5TdGF0aWNTb3VyY2Uoc2hhZGVyQ29uZmlnKV0pO1xyXG4gICAgICAgIGxpYnJhcnlQcm92aWRlci5hZGRMaWJyYXJ5KG1lc2hfMS5NZXNoLCBbbmV3IGxpYnJhcnlfcHJvdmlkZXJfMS5TdGF0aWNTb3VyY2UobWVzaGVzKV0pO1xyXG4gICAgfVxyXG59O1xyXG5XZWJHTExpYnJhcnlDb25maWcgPSBfX2RlY29yYXRlKFtcclxuICAgIF9fcGFyYW0oMCwgaW5qZWN0b3JfcGx1c18xLmluamVjdC5wcm92aWRlcihtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuTGlicmFyeSkpLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtsaWJyYXJ5X3Byb3ZpZGVyXzEuTGlicmFyeVByb3ZpZGVyXSlcclxuXSwgV2ViR0xMaWJyYXJ5Q29uZmlnKTtcclxuZXhwb3J0cy5XZWJHTExpYnJhcnlDb25maWcgPSBXZWJHTExpYnJhcnlDb25maWc7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdlYmdsLmxpYnJhcnkuY29uZmlnLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IG1hbGxldF9tb2R1bGVfMSA9IHJlcXVpcmUoXCIuLi9tYWxsZXQubW9kdWxlXCIpO1xyXG5jb25zdCBhbmd1bGFyID0gcmVxdWlyZShcImFuZ3VsYXJcIik7XHJcbmNvbnN0IG1hbGxldF9kZXBlZGVuY3lfdHJlZV8xID0gcmVxdWlyZShcIi4uL21hbGxldC5kZXBlZGVuY3ktdHJlZVwiKTtcclxuY29uc3Qgd2ViZ2xfc3RhZ2VfY29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi93ZWJnbC1zdGFnZS5jb21wb25lbnRcIik7XHJcbmNvbnN0IHdlYmdsX3N0YWdlXzEgPSByZXF1aXJlKFwiLi93ZWJnbC1zdGFnZVwiKTtcclxuY29uc3QgaW5qZWN0b3JfcGx1c18xID0gcmVxdWlyZShcIi4uL2xpYi9pbmplY3Rvci1wbHVzXCIpO1xyXG5jb25zdCBnZW9tZXRyeV9tb2R1bGVfMSA9IHJlcXVpcmUoXCIuLi9nZW9tZXRyeS9nZW9tZXRyeS5tb2R1bGVcIik7XHJcbmNvbnN0IHdlYmdsX2xpYnJhcnlfY29uZmlnXzEgPSByZXF1aXJlKFwiLi93ZWJnbC5saWJyYXJ5LmNvbmZpZ1wiKTtcclxuZXhwb3J0cy5tYWxsZXRXZWJHTCA9IGFuZ3VsYXIubW9kdWxlKCdtYWxsZXQud2ViZ2wnLCBbXHJcbiAgICBtYWxsZXRfbW9kdWxlXzEubWFsbGV0Lm5hbWUsXHJcbiAgICBnZW9tZXRyeV9tb2R1bGVfMS5tYWxsZXRHZW9tZXRyeS5uYW1lXHJcbl0pLmNvbmZpZyhpbmplY3Rvcl9wbHVzXzEubmdBbm5vdGF0ZSh3ZWJnbF9saWJyYXJ5X2NvbmZpZ18xLldlYkdMTGlicmFyeUNvbmZpZykpO1xyXG5leHBvcnRzLm1hbGxldFdlYkdMLnNlcnZpY2UobWFsbGV0X2RlcGVkZW5jeV90cmVlXzEuTURULndlYmdsLldlYkdMU3RhZ2UsIGluamVjdG9yX3BsdXNfMS5uZ0Fubm90YXRlKHdlYmdsX3N0YWdlXzEuV2ViR0xTdGFnZSkpO1xyXG5leHBvcnRzLm1hbGxldFdlYkdMLmNvbXBvbmVudChtYWxsZXRfZGVwZWRlbmN5X3RyZWVfMS5NRFQuY29tcG9uZW50LndlYkdMU3RhZ2UsIHdlYmdsX3N0YWdlX2NvbXBvbmVudF8xLndlYkdMU3RhZ2VPcHRpb25zKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2ViZ2wubW9kdWxlLmpzLm1hcCJdfQ==
