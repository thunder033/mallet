"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../lib/logger");
const injector_plus_1 = require("../lib/injector-plus");
const mallet_depedency_tree_1 = require("../mallet.depedency-tree");
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
}`
};
class ShaderSource {
    constructor(logger, $q, sourceAugmenter = null) {
        this.logger = logger;
        this.$q = $q;
        this.sourceAugmenter = sourceAugmenter;
    }
    load(name) {
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
    embeddedGet(name, fallback = false) {
        if (fallback === true) {
            this.logger.info(`Failed to load shader ${name} from augment source, falling back to embedded.`);
        }
        return embeddedShaders[name];
    }
}
exports.ShaderSource = ShaderSource;
let ShaderSourceProvider = class ShaderSourceProvider {
    constructor() {
        this.shaderSourceService = null;
    }
    augmentShaderSource(service) {
        this.shaderSourceService = service;
    }
    $get(logger, $q) {
        return new ShaderSource(logger, $q, this.shaderSourceService);
    }
};
__decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)), __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$q)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logger_1.Logger, Function]),
    __metadata("design:returntype", void 0)
], ShaderSourceProvider.prototype, "$get", null);
ShaderSourceProvider = __decorate([
    injector_plus_1.ngAnnotateProvider
], ShaderSourceProvider);
exports.ShaderSourceProvider = ShaderSourceProvider;
//# sourceMappingURL=shader-source.provider.js.map