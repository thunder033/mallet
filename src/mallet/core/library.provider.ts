
import bind from 'bind-decorator';
import {IHttpResponse, IServiceProvider} from 'angular';
import angular = require('angular');

export interface ILibrary<T, P> {
    get(id: string | number): Promise<T>;
    addSources(sources: Array<ISource<P>>): void;
    getAllItems(): Promise<T[]>;
}

export interface ISource<T> {
    get(id: string | number): Promise<T | string>;
    getAll(): Promise<Array<T | string>>;
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

/**
 * The DTO class provides a type-safe wrapper for raw data structures. In the context of
 * the Library module, it enables importing sources
 */
export class DTO<T> {
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

    public getAll(): Promise<Array<string | T>> {
        return Promise.resolve(Object.keys(this.entries).map((key) => this.entries[key]));
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

    public getAll(): Promise<Array<string | T>> {
        console.warn('Source Adapter does not support getAll functionality');
        // throw new Error('Source Adapter does not support getAll functionality');
        return Promise.resolve([]);
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
class Library<T, P> implements ILibrary<T, P> {
    private sourceIndex: number;
    private id: string | number;
    private returnDTO: boolean;

    constructor(
        private ctor: IEntityCtor<T, P>,
        private sources: Array<ISource<P>>) {
        this.returnDTO = !this.ctor; // return DTO instead of constructing an entity
    }

    public addSources(sources: Array<ISource<P>>): void {
        Array.prototype.push(this.sources, sources);
    }

    public get(id: string): Promise<T> {
        const result = null;
        this.sources.sort((a, b) => a.getOrder() - b.getOrder());

        this.sourceIndex = 0;
        this.id = id;
        return this.fallbackGet(null).then(this.processResult);
    }

    /**
     * Retrieve all items from each source, and aggregate items to a single array
     * @returns {Promise<T[]>}
     */
    public getAllItems(): Promise<T[]> {
        return Promise.all(this.sources.map((source) => source.getAll()))
            .then((results) => {
                return Array.prototype.concat.apply([], results);
            });
    }

    /**
     * Transform the DTO or string into an entity
     * @param {Object | string} result
     * @returns {T}
     */
    @bind protected processResult(result: object | string): T {
        if (result === null || result === '') {
            return null;
        } else if (typeof result === 'string') {
            result = JSON.parse(result);
        }

        return this.returnDTO ? result as T : new this.ctor(result as P);
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
}

/**
 * Library with dynamically built entries that are prepared during application setup
 */
class PreparedLibrary<T> extends Library<T, void> {
    constructor(ctor: {new (...args): T}, sources: Array<ISource<void>>) {
        super(ctor, sources);
    }

    protected processResult(result: Object | string): T {
        return result as T;
    }
}

export interface IEntityCtor<T, P> {
    new(params: P): T;
}

export interface ILibraryService {
    get<T, P>(type: IEntityCtor<T, P> | {new (...args): T}, id: string | number): Promise<T>;
    getAll<T, P>(type: IEntityCtor<T, P> | {new (...args): T}): Promise<T[]>;
    addSources<T, P>(ctor: {new (...args): T}, sources: Array<ISource<P>>): void;
}

export class LibraryProvider implements IServiceProvider {
    private libaries: Map<Function, ILibrary<any, any>>;

    constructor() {
        this.libaries = new Map();
    }

    /**
     * Add source entries for the given type
     * @param {IEntityCtor<T, P>} ctor
     * @param {Array<ISource<T>>} sources
     */
    public addSources<T, P>(ctor: IEntityCtor<T, P>, sources: Array<ISource<P>>) {
        if (this.libaries.has(ctor)) {
            this.libaries.get(ctor).addSources(sources);
        } else {
            this.libaries.set(ctor, new Library(ctor, sources));
        }
    }

    /**
     * Add a library with sources configured after application setup
     * @param {any} ctor
     * @param {Array<ISource<any>>} sources
     */
    public addPreparedSources<T>(ctor: {new (...args): T}, sources: Array<ISource<any>>) {
        if (this.libaries.has(ctor)) {
            this.libaries.get(ctor).addSources(sources);
        } else {
            this.libaries.set(ctor, new PreparedLibrary(ctor, sources));
        }
    }

    /**
     * Retrieve entity of the given type and id
     * @param {Function} type
     * @param {string | number} id
     * @returns {Promise<T>}
     */
    @bind public get<T>(type: Function, id: string | number): Promise<T> {
        if (!this.libaries.has(type)) {
            throw new ReferenceError(`No sources are configured for ${type.name}`);
        }

        return this.libaries.get(type).get(id);
    }

    @bind public getAll<T>(type: Function): Promise<T[]> {
        if (!this.libaries.has(type)) {
            throw new ReferenceError(`No sources are configured for ${type.name}`);
        }

        return this.libaries.get(type).getAllItems();
    }

    @bind
    public $get(): ILibraryService {
        return {get: this.get, getAll: this.getAll, addSources: this.addPreparedSources};
    }
}
