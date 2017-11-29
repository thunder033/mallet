"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mallet_module_1 = require("../mallet.module");
const angular = require("angular");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const webgl_stage_component_1 = require("./webgl-stage.component");
const webgl_stage_1 = require("./webgl-stage");
const injector_plus_1 = require("../lib/injector-plus");
// import {ShaderSourceProvider} from './shader-source.provider';
const geometry_module_1 = require("../geometry/geometry.module");
const webgl_library_config_1 = require("./webgl.library.config");
exports.malletWebGL = angular.module('mallet.webgl', [
    mallet_module_1.mallet.name,
    geometry_module_1.malletGeometry.name
]).config(injector_plus_1.ngAnnotate(webgl_library_config_1.WebGLLibraryConfig));
// malletWebGL.provider(MDT.webgl.ShaderSource, ShaderSourceProvider);
exports.malletWebGL.service(mallet_depedency_tree_1.MDT.webgl.WebGLStage, injector_plus_1.ngAnnotate(webgl_stage_1.WebGLStage));
exports.malletWebGL.component(mallet_depedency_tree_1.MDT.component.webGLStage, webgl_stage_component_1.webGLStageOptions);
//# sourceMappingURL=webgl.module.js.map