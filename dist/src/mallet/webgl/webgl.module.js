"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mallet_module_1 = require("../mallet.module");
const angular = require("angular");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
const webgl_stage_component_1 = require("./webgl-stage.component");
const webgl_stage_1 = require("./webgl-stage");
const injector_plus_1 = require("../lib/injector-plus");
const shader_source_provider_1 = require("./shader-source.provider");
exports.malletWebGL = angular.module('mallet.webgl', [mallet_module_1.mallet.name]);
exports.malletWebGL.provider(mallet_depedency_tree_1.MDT.webgl.ShaderSource, shader_source_provider_1.ShaderSourceProvider);
exports.malletWebGL.service(mallet_depedency_tree_1.MDT.webgl.WebGLStage, injector_plus_1.ngAnnotate(webgl_stage_1.WebGLStage));
exports.malletWebGL.component(mallet_depedency_tree_1.MDT.component.webGLStage, webgl_stage_component_1.webGLStageOptions);
//# sourceMappingURL=webgl.module.js.map