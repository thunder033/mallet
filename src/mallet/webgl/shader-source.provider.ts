import {IPromise, IQService, IServiceProvider} from 'angular';
import {Logger} from '../lib/logger';
import {inject, ngAnnotateProvider} from '../lib/injector-plus';
import {MDT} from '../mallet.depedency-tree';

export interface IShaderSource {
    load(name: string): IPromise<string>;
}

// this kinda sucks but it's the only way to some reasonably have access to this data...
const embeddedShaders = {
    // language=GLSL
    '2d-vertex-shader': `#version 100
//an attribute will receive data from a buffer
attribute vec2 a_position;

//starting point
void main() {
gl_Position = vec4(a_position, 0, 1);
}`,
    // language=GLSL
    'fragment-shader': `#version 100
// fragment shaders don't hvae default precision, so define
// as mediump, "medium precision"
precision mediump float;

void main() {
// gl_FragColor is the outpout of the fragment
gl_FragColor = vec4(1, 0, 0.5, 1); //return magenta
}`};

export class ShaderSource implements IShaderSource {
    constructor(
        private logger: Logger,
        private $q: IQService,
        private sourceAugmenter: IShaderSource = null) {
    }

    public load(name: string): IPromise<string> {
        if (this.sourceAugmenter !== null) {
            return this.sourceAugmenter.load(name).then((source) => {
                if (source) {
                    return source;
                }

                this.embeddedGet(name, true);
            }).catch((e) => {
                this.logger.error('Failed to load shader: ', e);
                return this.embeddedGet(name, true);
            });
        }

        return this.$q.when(this.embeddedGet(name));
    }

    private embeddedGet(name: string, fallback: boolean = false) {
        if (fallback === true) {
            this.logger.info(`Failed to load shader ${name} from augment source, falling back to embedded.`);
        }

        return embeddedShaders[name];
    }
}

@ngAnnotateProvider
export class ShaderSourceProvider implements IServiceProvider {
    private shaderSourceService: IShaderSource = null;

    public augmentShaderSource(service: IShaderSource) {
        this.shaderSourceService = service;
    }

    public $get(@inject(MDT.Logger) logger: Logger, @inject(MDT.ng.$q) $q: IQService) {
        return new ShaderSource(logger, $q, this.shaderSourceService);
    }
}
