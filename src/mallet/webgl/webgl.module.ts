
import {mallet} from '../mallet.module';
import angular = require('angular');
import {MDT} from '../mallet.depedency-tree';
import {webGLStageOptions} from './webgl-stage.component';
import {WebGLStage} from './webgl-stage';
import {ngAnnotate} from '../lib/injector-plus';
import {ShaderSourceProvider} from './shader-source.provider';

export const malletWebGL = angular.module('mallet.webgl', [mallet.name]);

malletWebGL.provider(MDT.webgl.ShaderSource, ShaderSourceProvider);
malletWebGL.service(MDT.webgl.WebGLStage, ngAnnotate(WebGLStage));
malletWebGL.component(MDT.component.webGLStage, webGLStageOptions);
