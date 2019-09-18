import {MDT} from './mallet.dependency-tree';
import angular = require('angular');
import * as build from './buildVersion.json';
import {Level} from './lib/logger';

const constants = angular.module('mallet-constants', [])
    .constant(MDT.const.BuildVersion, (build as any).version)
    .constant(MDT.const.LoggingLevel, Level.Verbose)
// Rendering
    .constant(MDT.const.ScaleFactor, (() => window.devicePixelRatio || 1)())
    .constant(MDT.const.SampleCount, 1024)
    .constant(MDT.const.MaxFrameRate, 60)
    .constant(MDT.const.Keys, Object.freeze({
        Down: 40,
        Escape: 27,
        Left: 37,
        Right: 39,
        Space: 32,
        Up: 38,
    }));

module.exports = constants.name;
