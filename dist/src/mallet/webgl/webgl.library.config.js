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
}`,
    // language=GLSL
    fragmentShader: `#version 100
// fragment shaders don't hvae default precision, so define
// as mediump, "medium precision"
precision mediump float;

varying highp vec4 vColor;

void main() {
// gl_FragColor is the outpout of the fragment
//gl_FragColor = vec4(1, 0, 0.5, 1); //return magenta
gl_FragColor = vColor;
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
        spec: {},
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
//# sourceMappingURL=webgl.library.config.js.map