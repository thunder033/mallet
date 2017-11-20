/// <reference types="angular" />
import 'reflect-metadata';
import { IServiceProvider } from 'angular';
export interface InjectableMethodCtor {
    new (): InjectableMethod;
}
export interface InjectableMethod {
    exec(...args: any[]): any;
}
/**
 * Define the injection annotation for a given angular provider
 * @param {string} identifier
 * @returns {ParameterDecorator}
 */
export declare function inject(identifier: string): ParameterDecorator;
export declare function ngAnnotateProvider(constructor: {
    new (...args): IServiceProvider;
}): void;
/**
 * Construct an angular annotation array from dependency metadata
 * @param {Function} provider
 * @returns {Array<string | Function>}
 */
export declare function ngAnnotate(provider: Function | InjectableMethodCtor): Array<string | Function>;
export interface DepTree {
    [key: string]: string | DepTree;
}
export declare function buildTree(tree: DepTree, module: string): void;
