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
Object.defineProperty(exports, "__esModule", { value: true });
const bind_decorator_1 = require("bind-decorator");
const angular = require("angular");
class DTO {
    constructor(params) {
        Object.assign(this, params);
    }
}
exports.DTO = DTO;
class StaticSource {
    constructor(entries, order = 0) {
        this.entries = entries;
        this.order = order;
    }
    get(id) {
        return Promise.resolve(this.entries[id]);
    }
    getOrder() {
        return this.order;
    }
}
exports.StaticSource = StaticSource;
/**
 *
 */
class SourceAdapter {
    constructor(params) {
        this.source = params.source;
        this.method = params.method;
        this.successMethod = params.successMethod || 'then';
        this.modules = ['ng', ...params.modules || []];
        this.order = typeof params.order === 'number' ? params.order : 0;
        this.callback = params.callback || false;
        // make logic simpler by defaulting to a no-op; we don't care about overhead here
        const noop = (input) => input;
        this.inputTransform = params.inputTransform || noop;
        this.outputTransform = params.outputTransform || noop;
    }
    get(id) {
        if (typeof this.source === 'string') {
            this.source = angular.injector(this.modules).get(this.source);
        }
        if (this.callback) {
            return new Promise((resolve) => {
                this.source[this.method](this.inputTransform(id), resolve);
            }).then(this.outputTransform);
        }
        return this.source[this.method](this.inputTransform(id))[this.successMethod](this.outputTransform);
    }
    getOrder() {
        return this.order;
    }
}
exports.SourceAdapter = SourceAdapter;
/**
 * Basic $http adapter
 */
class HttpAdapter extends SourceAdapter {
    constructor(path) {
        super({
            source: '$http',
            method: 'get',
            inputTransform: (id) => `${path}/${id}`,
            outputTransform: (resp) => resp.data,
        });
    }
}
exports.HttpAdapter = HttpAdapter;
/**
 * Falls back through provided sources to retrieve a DTO, building and returning an entity
 */
class Library {
    constructor(ctor, sources) {
        this.ctor = ctor;
        this.sources = sources;
        this.returnDTO = !this.ctor; // return DTO instead of constructing an entity
    }
    get(id) {
        const result = null;
        this.sources.sort((a, b) => a.getOrder() - b.getOrder());
        this.sourceIndex = 0;
        this.id = id;
        return this.fallbackGet(null).then(this.processResult);
    }
    /**
     * Recurse through each source, only calling a source if the previous return no result or failed
     * @param result
     * @returns {Promise<string | T>}
     */
    fallbackGet(result) {
        if (!result) {
            if (this.sourceIndex >= this.sources.length) {
                return Promise.resolve(null);
            }
            return this.sources[this.sourceIndex++].get(this.id)
                .then(this.fallbackGet)
                .catch((e) => {
                console.log(`Source get failed for ${this.ctor.name}`, e);
                return this.fallbackGet(null);
            });
        }
        return result;
    }
    /**
     * Transform the DTO or string into an entity
     * @param {Object | string} result
     * @returns {T}
     */
    processResult(result) {
        if (result === null || result === '') {
            return null;
        }
        else if (typeof result === 'string') {
            result = JSON.parse(result);
        }
        return this.returnDTO ? result : new this.ctor(result);
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Library.prototype, "fallbackGet", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], Library.prototype, "processResult", null);
class LibraryProvider {
    constructor() {
        this.libaries = new Map();
    }
    /**
     * Add a new library for the type with provided sources
     * @param {IEntityCtor<T, P>} ctor
     * @param {Array<ISource<T>>} sources
     */
    addLibrary(ctor, sources) {
        this.libaries.set(ctor, new Library(ctor, sources));
    }
    /**
     * Retrieve entity of the given type and id
     * @param {Function} type
     * @param {string | number} id
     * @returns {Promise<T>}
     */
    get(type, id) {
        if (!this.libaries.has(type)) {
            throw new ReferenceError(`No Library is configured for ${type.name}`);
        }
        return this.libaries.get(type).get(id);
    }
    $get() {
        return { get: this.get };
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], LibraryProvider.prototype, "get", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], LibraryProvider.prototype, "$get", null);
exports.LibraryProvider = LibraryProvider;
//# sourceMappingURL=library.provider.js.map