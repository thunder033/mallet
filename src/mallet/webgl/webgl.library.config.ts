import {LibraryProvider, StaticSource} from '../core/library.provider';
import {MDT} from '../mallet.dependency-tree';
import {inject} from '../lib/injector-plus';
import {GLDataType, GLUniformType, IShaderOptions, ShaderDTO, ShaderType} from './shader';
import {IMeshOptions, Mesh} from '../geometry/mesh';
import glMatrix = require('gl-matrix');

const {vec3} = glMatrix;

// this kinda sucks but it's the only way to reasonably have access to this data without
// a server or build process to package it
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
}`};

const shaderConfig: {[id: string]: IShaderOptions} = {
    '3d-vertex-shader': {
        id: '3d-vertex-shader',
        src: embeddedShaders.vertexShader3d,
        type: ShaderType.VERTEX_SHADER,
        spec: {
            attributes: [
                {name: 'a_position', size: 3, type: GLDataType.FLOAT},
                {name: 'a_normal', size: 3, type: GLDataType.FLOAT, normalize: true},
                {name: 'a_color', size: 3, type: GLDataType.FLOAT}],
            uniforms: {
                view: GLUniformType.uniformMatrix4fv,
                projection: GLUniformType.uniformMatrix4fv,
                world: GLUniformType.uniformMatrix4fv,
            },
        },
    },
    'fragment-shader': {
        id: 'fragment-shader',
        src: embeddedShaders.fragmentShader,
        type: ShaderType.FRAGMENT_SHADER,
        spec: {
            uniforms: {
                light: {
                    ambientColor: GLUniformType.uniform4f,
                    diffuseColor: GLUniformType.uniform4f,
                    direction: GLUniformType.uniform3f,
                },
            },
        },
    },
};

const meshes: {[id: string]: IMeshOptions} = {cube: {
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
        0, 2, 1,  0, 3, 2, // F
        2, 3, 6,  3, 7, 6, // R
        1, 6, 5,  1, 2, 6, // T

        4, 5, 6,  4, 6, 7, // Back
        0, 1, 5,  0, 5, 4, // L
        0, 7, 3,  0, 4, 7, // Bottom
    ],
    positions: [
    /*   5  +---+ 6
     *    /   / |
     * 1 +---+2 + 7
     *   |   | /
     * 0 +---+ 3
     */
    vec3.fromValues(-0.5, -0.5, +0.5), // LBF 0
    vec3.fromValues(-0.5, +0.5, +0.5), // LTF 1
    vec3.fromValues(+0.5, +0.5, +0.5), // RTF 2
    vec3.fromValues(+0.5, -0.5, +0.5), // RBF 3

    vec3.fromValues(-0.5, -0.5, -0.5), // LBB 4
    vec3.fromValues(-0.5, +0.5, -0.5), // LTB 5
    vec3.fromValues(+0.5, +0.5, -0.5), // RTB 6
    vec3.fromValues(+0.5, -0.5, -0.5)], // RBB 7
    }};

export class WebGLLibraryConfig {
    constructor(@inject.provider(MDT.Library) libraryProvider: LibraryProvider) {
        libraryProvider.addSources(ShaderDTO, [new StaticSource(shaderConfig)]);
        libraryProvider.addSources(Mesh, [new StaticSource(meshes)]);
    }
}
