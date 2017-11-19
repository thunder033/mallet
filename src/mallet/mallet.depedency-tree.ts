import {buildTree} from './lib/injector-plus';

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

buildTree(MDT, 'mallet');

export {MDT};
