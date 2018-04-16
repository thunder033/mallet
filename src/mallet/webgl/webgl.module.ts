
import {mallet} from '../mallet.module';
import angular = require('angular');
import {MDT} from '../mallet.dependency-tree';
import {webGLStageOptions} from './webgl-stage.component';
import {WebGLStage} from './webgl-stage';
import {ngAnnotate} from '../lib/injector-plus';
import {malletGeometry} from '../geometry/geometry.module';
import {WebGLLibraryConfig} from './webgl.library.config';

export const malletWebGL = angular.module('mallet.webgl', [
    mallet.name,
    malletGeometry.name]).config(ngAnnotate(WebGLLibraryConfig));

malletWebGL.service(MDT.webgl.WebGLStage, ngAnnotate(WebGLStage));
malletWebGL.component(MDT.component.webGLStage, webGLStageOptions);
