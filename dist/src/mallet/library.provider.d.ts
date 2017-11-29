/// <reference types="angular" />
import { IServiceProvider } from 'angular';
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
export declare abstract class DTO<T> {
    constructor(params: {
        [K in keyof T]: any;
    });
}
export declare class StaticSource<T> implements ISource<T> {
    private entries;
    private order;
    constructor(entries: {
        [id: string]: T;
    }, order?: number);
    get(id: string | number): Promise<string | T>;
    getOrder(): number;
}
/**
 *
 */
export declare class SourceAdapter<T> implements ISource<T> {
    private source;
    private method;
    private order;
    private callback;
    private successMethod;
    private modules;
    private inputTransform;
    private outputTransform;
    constructor(params: IAdapterParameters<T>);
    get(id: string | number): Promise<T | string>;
    getOrder(): number;
}
/**
 * Basic $http adapter
 */
export declare class HttpAdapter<T> extends SourceAdapter<T> {
    constructor(path: string);
}
export interface IEntityCtor<T, P> {
    new (params: P): T;
}
export interface ILibraryService {
    get<T, P>(type: IEntityCtor<T, P>, id: string | number): Promise<T>;
}
export declare class LibraryProvider implements IServiceProvider {
    private libaries;
    constructor();
    /**
     * Add a new library for the type with provided sources
     * @param {IEntityCtor<T, P>} ctor
     * @param {Array<ISource<T>>} sources
     */
    addLibrary<T, P>(ctor: IEntityCtor<T, P>, sources: Array<ISource<P>>): void;
    /**
     * Retrieve entity of the given type and id
     * @param {Function} type
     * @param {string | number} id
     * @returns {Promise<T>}
     */
    get<T>(type: Function, id: string | number): Promise<T>;
    $get(): ILibraryService;
}
