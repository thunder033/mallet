import {MDT} from './mallet.depedency-tree';
import angular = require('angular');

const constants = angular.module('mallet-constants', [])
// Rendering
    .constant(MDT.const.ScaleFactor, (() => window.devicePixelRatio || 1)())
    .constant(MDT.const.SampleCount, 1024)
    .constant(MDT.const.MaxFrameRate, 60)
    .constant(MDT.const.Keys, Object.freeze({
        Down: 40,
        Up: 38,
        Right: 39,
        Left: 37,
        Space: 32,
        Escape: 27,
    }));

module.exports = constants.name;
