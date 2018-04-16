import {buildTree} from './lib/injector-plus';

const MDT = {
    component: {
        webGLStage: 'malletWebglStage',
        renderTarget: 'malletRenderTarget',
    },
    config: {
        mallet: '',
        EmbeddedStyles: '',
        Path: '',
    },
    ['const']: {
        Keys: '',
        MaxFrameRate: '',
        SampleCount: '',
        ScaleFactor: '',
    },
    ng: {
        $element: '$element',
        $location: '$location',
        $window: '$window',
        $document: '$document',
        $http: '$http',
        $locationProvider: '$locationProvider',
        $q: '$q',
        $rootScope: '$rootScope',
        $scope: '$scope',
        $socket: 'socketFactory',
        $state: '$state',
        $stateParams: '$stateParams',
        $stateProvider: '$stateProvider',
        $timeout: '$timeout',
        $urlService: '$urlService',
    },
    AsyncRequest: '',
    Camera: '',
    Color: '',
    DynamicStylesheet: '',
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
    Library: '',
    webgl: {
        ShaderSource: '',
        WebGLStage: '',
    },
};

buildTree(MDT, 'mallet');

export {MDT};
