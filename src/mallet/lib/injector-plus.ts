import 'reflect-metadata';
import {Level, Logger} from './logger';
import {IController, IServiceProvider} from 'angular';

const logger = new Logger();
logger.config({level: Level.Verbose});

export interface InjectableMethodCtor {
    new(): InjectableMethod;
}

export interface InjectableMethod {
    exec(...args): any;
}

const injectableMethodName = 'exec';
const providerGet = '$get';
const annotationKey = Symbol('dependencies');

/**
 * Define the injection annotation for a given angular provider
 * @param {string} identifier
 * @returns {ParameterDecorator}
 */
export function inject(identifier: string): ParameterDecorator {
    // tslint:disable-next-line:callable-types
    return function annotation(target: {(...args): any} | Function, key: string, index: number) {
        if (key && key !== injectableMethodName && key !== providerGet) {
            throw new TypeError('Dependencies can only be injected on constructor, injectable method executor, or provider');
        } else if (key) {
            target = target.constructor;
        }

        const annotations: string[] = Reflect.getOwnMetadata(annotationKey, target) || new Array(target.length);
        annotations[index] = identifier;
        logger.verbose(`Add injection ${identifier} to ${target.name}`);
        Reflect.defineMetadata(annotationKey, annotations, target);
    };
}

// tslint:disable-next-line:no-namespace
export namespace inject {
    export const provider = (identifier: string) => inject(`${identifier}Provider`);
}

/**
 * Annotate an Angular provider definition (ex. with module.provider instead of service, controller, etc.)
 * @param {{new(...args): angular.IServiceProvider}} constructor
 */
export function ngAnnotateProvider(constructor: {new(...args): IServiceProvider}) {
    const provider: IServiceProvider = constructor.prototype;
    const annotations: string[] = Reflect.getOwnMetadata(annotationKey, constructor) || [];
    const method = provider.$get;

    if (annotations.length !== method.length) {
        throw new Error(
            `Annotations are not defined for all dependencies of ${method.name}: 
            expected ${method.length} annotations and found ${annotations.length}`);
    }

    logger.verbose(`Annotated ${annotations.length} provider dependencies for ${constructor.name}`);

    provider.$get = [...annotations, method];
}

export type AnnotatedProvider = Array<string | Function>;
export type AnnotatedController = Array<string |  (new (...args: any[]) => IController) | ((...args: any[]) => void | IController)>;
/**
 * Construct an angular annotation array from dependency metadata
 * @param {Function} provider: A class (or subclass) with @inject decorators defining dependencies
 * @param {Function} baseClass: For a subclass with no injections, a class in the prototype chain that has dependencies
 * @returns {Array<string | Function>}
 */
export function ngAnnotate(provider: IController, baseClass?: Function): AnnotatedController;
export function ngAnnotate(provider: Function | InjectableMethodCtor, baseClass: Function = null): AnnotatedProvider {
    let clazz = baseClass || provider;
    let annotations: string[] = Reflect.getMetadata(annotationKey, clazz) || [];

    // if we didn't find any annotations on the class, look in it's prototype chain
    if (annotations.length === 0) {
        do {
            clazz = Object.getPrototypeOf(clazz);
            annotations = Reflect.getMetadata(annotationKey, clazz) || [];
            logger.verbose(`Checking ${clazz.name} for annotations. Found ${annotations.length}`);
        } while (annotations.length === 0 && clazz.name !== '');

        // reset the class reference to the provider if we didn't find any annotations
        if (clazz.name === '') {
            clazz = provider;
        }
    }

    let method = provider;
    let methodName = provider.name;

    if (provider.length === 0 && provider.prototype.hasOwnProperty(injectableMethodName)) {
        method = provider.prototype[injectableMethodName];
        methodName += `.${injectableMethodName}`;
    }

    // the number annotations should match either the method length or the base class ctor length
    if (annotations.length !== method.length && clazz.length !== annotations.length) {
        throw new Error(
            `Annotations are not defined for all dependencies of ${methodName}: 
            expected ${method.length} annotations and found ${annotations.length}`);
    }

    logger.verbose(`Annotated ${annotations.length} dependencies for ${provider.name}`);
    return [...annotations, method];
}

export interface DepTree {
    [key: string]: string | DepTree;
}

export function buildTree(tree: DepTree, module: string) {
    try {
        JSON.stringify(tree);
    } catch (e) {
        throw new TypeError('Tree object must be serializable to build a valid tree');
    }

    function traverseNode(node: any, prop: string, identifier: string[]) {
        const value = node[prop];
        if (typeof value === 'string' && !value) {
            node[prop] = [ ...identifier, prop].join('.');
        } else if (typeof value === 'object' && value !== null) {
            Object.keys(value).forEach((key) => {
                traverseNode(value, key, [...identifier, prop]);
            });
        }
    }

    Object.keys(tree).forEach((key) => {
        traverseNode(tree, key, [module]);
    });
}
