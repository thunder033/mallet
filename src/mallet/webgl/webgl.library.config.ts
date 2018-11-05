import {LibraryProvider, StaticSource} from '../core/library.provider';
import {MDT} from '../mallet.dependency-tree';
import {inject} from '../lib/injector-plus';
import {GLDataType, GLUniformType, IShaderOptions, ShaderDTO, ShaderType} from './shader';
import {IMeshOptions, Mesh} from '../geometry/mesh';
import glMatrix = require('gl-matrix');
import {Material} from './material';

const {vec3, vec2} = glMatrix;

// this kinda sucks but it's the only way to reasonably have access to this data without
// a server or build process to package it
const embeddedShaders = {
    // language=GLSL
    vertexShader3d: `#version 100
//an attribute will receive data from a buffer
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uv;

uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;

varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;
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
    
    vNormal = vec3(world * view * vec4(a_normal, 1));
    vTextureCoord = a_uv;
}`,
    // language=GLSL
    fragmentShader: `#version 100
// fragment shaders don't hvae default precision, so define
// as mediump, "medium precision"
precision mediump float;

varying highp vec3 vNormal;
varying highp vec2 vTextureCoord;

struct Light {
    vec4 ambientColor;
    vec4 diffuseColor;
    vec3 direction;
};

// uniform int numLights;
uniform Light light;

uniform sampler2D uSampler;

vec4 getLightColor(Light light, vec3 normal) {
    vec3 lightDir = normalize(-light.direction);
    float lightAmt = clamp(dot(lightDir, normal), 0.0, 1.0);
    
    return light.diffuseColor * lightAmt;   
}

void main() {
    vec4 textureColor =  texture2D(uSampler, vTextureCoord);
    // gl_FragColor is the outpout of the fragment
    gl_FragColor = light.ambientColor * textureColor + getLightColor(light, vNormal) * textureColor;
}`,
    // language=GLSL
    testVertexShader3d: `#version 100
attribute vec3 a_position;

void main() {
    gl_Position = vec4(a_position, 1);
}`,
    // Test shader verify WebGL rendering has been setup correctly
    // language=GLSL
    testFragmentShader: `#version 100
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}`,
};

const shaderConfig: {[id: string]: IShaderOptions} = {
    '3d-vertex-shader': {
        id: '3d-vertex-shader',
        src: embeddedShaders.vertexShader3d,
        type: ShaderType.VERTEX_SHADER,
        spec: {
            attributes: [
                {name: 'a_position', size: 3, type: GLDataType.FLOAT},
                {name: 'a_normal', size: 3, type: GLDataType.FLOAT, normalize: true},
                {name: 'a_uv', size: 2, type: GLDataType.FLOAT}],
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
    'test-3d-vertex-shader': {
        id: 'test-3d-vertex-shader',
        src: embeddedShaders.testVertexShader3d,
        type: ShaderType.VERTEX_SHADER,
        spec: {
            attributes: [
                {name: 'a_position', size: 3, type: GLDataType.FLOAT},
            ],
        },
    },
    'test-fragment-shader': {
        id: 'test-fragment-shader',
        src: embeddedShaders.testFragmentShader,
        type: ShaderType.FRAGMENT_SHADER,
        spec: {},
    },
};

// data is formatted to roughly follow .obj structure
const meshes: {[id: string]: IMeshOptions} = {cube: {
    uvs: [ // make every side of the cube show the whole texture
        [0.0, 0.0],
        [1.0, 0.0],
        [0.0, 1.0],
        [1.0, 1.0],
    ].map((uv) => vec2.fromValues.apply(void 0, uv)),
    faces: [
        // F
        [0, 2, 2, 1, 1, 0], // face: pos uv | pos uv | pos uv
        [0, 2, 3, 3, 2, 1],
        // R
        [2, 0, 3, 2, 6, 1],
        [3, 2, 7, 3, 6, 1],
        // T
        [1, 2, 6, 1, 5, 0],
        [1, 2, 2, 3, 6, 1],

        // Back
        [4, 3, 5, 1, 6, 0],
        [4, 3, 6, 0, 7, 2],
        // L
        [0, 3, 1, 1, 5, 0],
        [0, 3, 5, 0, 4, 2],
        // Bottom
        [0, 0, 7, 3, 3, 1],
        [0, 0, 4, 2, 7, 3],
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

const materials = {
    white: {diffuse: '#ffcc00ff'},
};

export class WebGLLibraryConfig {
    constructor(@inject.provider(MDT.Library) libraryProvider: LibraryProvider) {
        libraryProvider.addSources(ShaderDTO, [new StaticSource(shaderConfig)]);
        libraryProvider.addSources(Mesh, [new StaticSource(meshes)]);
        libraryProvider.addSources(Material, [new StaticSource(materials)]);
    }
}
