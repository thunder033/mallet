
import bind from 'bind-decorator';
import {IHttpResponse, IServiceProvider} from 'angular';
import angular = require('angular');

export interface ILibrary<T> {
    get(id: string | number): Promise<T>;
}

export interface ISource<T> {
    get(id: string | number): Promise<T | string>;
    getOrder(): number;
}

export interface IAdapterParameters<T> {
    source: any | string;
    method: string;
    successMethod?: string;
    modules?: string[];
    order?: number;
    callback?: boolean;
    inputTransform?: (id: string | number) => string | number;
    outputTransform?: (result: any) => string | T;
}

export abstract class DTO<T> {
    constructor(params: {[K in keyof T]: any}) {
        Object.assign(this, params);
    }
}

export class StaticSource<T> implements ISource<T> {
    constructor(private entries: {[id: string]: T}, private order = 0) {

    }

    public get(id: string | number): Promise<string | T> {
        return Promise.resolve(this.entries[id]);
    }

    public getOrder(): number {
        return this.order;
    }
}

/**
 *
 */
export class SourceAdapter<T> implements ISource<T> {
    private source: any | string;
    private method: string;
    private order: number;
    private callback: boolean;
    private successMethod: string;
    private modules: string[];

    private inputTransform: (id: string | number) => string | number;
    private outputTransform: (result: any) => string | T;

    constructor(params: IAdapterParameters<T>) {
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

    public get(id: string | number): Promise<T | string> {
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

    public getOrder(): number {
        return this.order;
    }
}

/**
 * Basic $http adapter
 */
export class HttpAdapter<T> extends SourceAdapter<T> {
    constructor(path: string) {
        super({
            source: '$http',
            method: 'get',
            inputTransform: (id: string) => `${path}/${id}`,
            outputTransform: (resp: IHttpResponse<any>) => resp.data,
        });
    }
}

/**
 * Falls back through provided sources to retrieve a DTO, building and returning an entity
 */
class Library<T, P> implements ILibrary<T> {
    private sourceIndex: number;
    private id: string | number;
    private returnDTO: boolean;

    constructor(
        private ctor: IEntityCtor<T, P>,
        private sources: Array<ISource<P>>) {
        this.returnDTO = !this.ctor; // return DTO instead of constructing an entity
    }

    public get(id: string): Promise<T> {
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
    @bind private fallbackGet(result): Promise<T | string> {
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
    @bind private processResult(result: object | string): T {
        if (result === null || result === '') {
            return null;
        } else if (typeof result === 'string') {
            result = JSON.parse(result);
        }

        return this.returnDTO ? result as T : new this.ctor(result as P);
    }
}

export interface IEntityCtor<T, P> {
    new(params: P): T;
}

export interface ILibraryService {
    get<T, P>(type: IEntityCtor<T, P>, id: string | number): Promise<T>;
}

export class LibraryProvider implements IServiceProvider {
    private libaries: Map<Function, ILibrary<any>>;

    constructor() {
        this.libaries = new Map();
    }

    /**
     * Add a new library for the type with provided sources
     * @param {IEntityCtor<T, P>} ctor
     * @param {Array<ISource<T>>} sources
     */
    public addLibrary<T, P>(ctor: IEntityCtor<T, P>, sources: Array<ISource<P>>) {
        this.libaries.set(ctor, new Library(ctor, sources));
    }

    /**
     * Retrieve entity of the given type and id
     * @param {Function} type
     * @param {string | number} id
     * @returns {Promise<T>}
     */
    @bind public get<T>(type: Function, id: string | number): Promise<T> {
        if (!this.libaries.has(type)) {
            throw new ReferenceError(`No Library is configured for ${type.name}`);
        }

        return this.libaries.get(type).get(id);
    }

    @bind
    public $get(): ILibraryService {
        return {get: this.get};
    }
}