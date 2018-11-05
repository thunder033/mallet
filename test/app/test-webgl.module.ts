import * as angular from 'angular';
import {IController} from 'angular';
import {
    Camera,
    Entity,
    ICamera,
    IRenderer,
    IShaderOptions,
    IWebGLResourceContext,
    Level,
    malletWebGL,
    ngAnnotate,
    Renderer,
    ShaderDTO,
    WebGLApp,
} from 'mallet-dev';

class ColorCube extends Entity {
    private cubeZ: number;
    private cubeDelta: number;
    private cubeRot: number;

    constructor() {
        super({meshName: 'cube', materialName: 'white'});
        this.cubeZ = -1;
        this.cubeDelta = 1 / 500;
        this.cubeRot = 0;
    }

    public update(dt: number, tt: number): void {
        this.cubeZ += dt * this.cubeDelta;
        this.cubeRot += dt * this.cubeDelta * 50;

        const min = -10;
        const max = -0.1 - 0.5;
        if (this.cubeZ < min || this.cubeZ > max) {
            this.cubeZ = Math.min(min, Math.max(this.cubeZ, max));
            this.cubeDelta *= -1;
        }

        this.transform.setPosition(.25, -.15, this.cubeZ);
        this.transform.setRotation(this.cubeRot, this.cubeRot, this.cubeRot);
    }
}

const testApp = angular.module('mallet-test', [malletWebGL.name]);

/**
 * Test Harness to demonstrate basic functionality of the Mallet engine
 */
class TestApp extends WebGLApp implements IController {
    protected camera: ICamera;
    protected renderer: IRenderer;

    public config() {
        this.logger.config({level: Level.Debug});
        this.logger.info('Running Test Controller');
    }

    public onError() {
        // error
    }

    public init({renderTarget}: IWebGLResourceContext): any {
        return Promise.all([ // load resources
            this.library.get(ShaderDTO, '3d-vertex-shader'),
            this.library.get(ShaderDTO, 'fragment-shader'),
        ]).then(([vertex, fragment]: IShaderOptions[]) => {
            const program = this.stage.addProgram({shaders: {vertex, fragment}, name: '3d'});
            const glFactory = this.stage.getFactory();

            this.camera = new Camera(renderTarget.getAspectRatio());
            this.renderer = glFactory.create(Renderer, {camera: this.camera, program});
            this.postUpdate = this.camera.update; // cut out some overhead by just assigning it for now

            // setup lighting
            program.getUniformSetter('light.ambientColor')(0.1, 0.1, 0.1, 1.0);
            program.getUniformSetter('light.diffuseColor')(0.8, 0.8, 0.8, 1.0);
            program.getUniformSetter('light.direction')(-1, 0, 0);

            glFactory.create(ColorCube);
        });
    }
}

testApp.component('testHarness', {
    controller: ngAnnotate(TestApp, WebGLApp),
    template: '<mallet-webgl-stage></mallet-webgl-stage>',
});
