/* tslint:disable:object-literal-sort-keys */
import {buildTree} from './lib/injector-plus';

const MDT = {
    component: {
        debugger: 'malletDebugger',
        renderTarget: 'malletRenderTarget',
        webGLApp: 'malletWebglApp',
        webGLStage: 'malletWebglStage',
    },
    config: {
        EmbeddedStyles: '',
        Path: '',
        mallet: '',
    },
    ['const']: {
        BuildVersion: '',
        Keys: '',
        LoggingLevel: '',
        MaxFrameRate: '',
        SampleCount: '',
        ScaleFactor: '',
    },
    ng: {
        $document: '$document',
        $element: '$element',
        $http: '$http',
        $location: '$location',
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
        $window: '$window',
    },
    AppState: '',
    AsyncRequest: '',
    Camera: '',
    Color: '',
    DynamicStylesheet: '',
    Geometry: '',
    Keyboard: '',
    Library: '',
    Logger: '',
    Math: '',
    MouseUtils: '',
    ParticleEmitter: '',
    ParticleEmitter2D: '',
    RenderTarget: '',
    Scheduler: '',
    StateMachine: '',
    Thread: '',
    webgl: {
        ShaderSource: '',
        WebGLStage: '',
    },
};

buildTree(MDT, 'mallet');

export {MDT};
