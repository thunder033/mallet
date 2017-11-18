"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("./lib/injector-plus");
const MDT = {
    component: {
        renderTarget: 'mallet-render-target',
    },
    config: {
        Path: '',
    },
    ['const']: {
        Keys: '',
        MaxFrameRate: '',
        SampleCount: '',
        ScaleFactor: '',
    },
    ng: {
        $element: '',
        $location: '',
        $q: '',
        $rootScope: '',
        $scope: '',
        $socket: '',
        $state: '',
        $window: '',
    },
    AsyncRequest: '',
    Camera: '',
    Color: '',
    Geometry: '',
    Keyboard: '',
    Logger: '',
    Math: '',
    MouseUtils: '',
    ParticleEmitter: '',
    ParticleEmitter2D: '',
    Scheduler: '',
    AppState: '',
    StateMachine: '',
    Thread: '',
    RenderTarget: '',
};
exports.MDT = MDT;
injector_plus_1.buildTree(MDT, 'mallet');
//# sourceMappingURL=mallet.depedency-tree.js.map