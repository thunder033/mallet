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
//# sourceMappingURL=mallet.constants.js.map