import 'reflect-metadata';
import {Level, Logger} from './logger';
import {IController, IModule, IServiceProvider} from 'angular';

const logger = new Logger();
logger.config({level: Level.Verbose, tag: 'injector'});

export interface InjectableMethodCtor {
    new(): InjectableMethod;
}

export interface InjectableMethod {
    exec(...args): any;
}

const injectableFunctionName = 'exec';
const providerGet = '$get';
const annotationKey = Symbol('dependencies');
const isRestKey = Symbol('isKey');

/**
 * Define the injection annotation for a given angular provider
 * @param {string} identifier
 * @returns {ParameterDecorator}
 */
export function inject(identifier: string): ParameterDecorator {
    // tslint:disable-next-line:callable-types
    return function annotation(target: {(...args): any} | Function, key: string, index: number) {
        if (key && key !== injectableFunctionName && key !== providerGet) {
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
    // attach the derivations of inject decorator as properties
    /**
     * Inject a provider variation during configuration
     * @param {string} identifier
     * @returns {ParameterDecorator}
     */
    export const provider = (identifier: string) => inject(`${identifier}Provider`);
    /**
     * Inject a list of annotations for a method
     * @param {string[]} identifiers
     * @returns {MethodDecorator}
     */
    export const list = (identifiers: string[]): MethodDecorator => {
        return function listAnnotate(target: (...args) => any | Function, key: string) {
            logger.verbose(`Inject parameter list for ${target.name || target.constructor.name}`);
            identifiers.map(inject).forEach((injector, index) => {
                injector(target, key, index);
            });
        };
    };

    /**
     * Flag this method as using rest parameters (or arguments) to override function length check at
     * when annotations are processed
     * @returns {MethodDecorator}
     */
    export const isRest = (): MethodDecorator => {
        return function  listAnnotate(target: (...args) => any | Function, key: string) {
            logger.verbose(`Flag ${target.name || target.constructor.name}.${key} as rest function`);
            Reflect.defineMetadata(isRestKey, true, key ? target[key] : target);
        };
    };
}

/**
 * Annotate an Angular provider definition (ex. with module.provider instead of service, controller, etc.)
 * @param {{new(): angular.IServiceProvider}} constructor
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
    logger.verbose(`Annotate ${provider.name} (${baseClass ? baseClass.name : 'self'})`);
    let clazz = baseClass || provider;
    let annotations: string[] = Reflect.getMetadata(annotationKey, clazz) || [];

    // Search the prototype chain for annotations if we didn't find any on the class
    while (annotations.length === 0 && Object.getPrototypeOf(clazz)) {
        clazz = Object.getPrototypeOf(clazz); // walks up the prototype chain until it hits null
        annotations = Reflect.getMetadata(annotationKey, clazz) || [];
        logger.verbose(`Checking ${clazz.name} for annotations. Found ${annotations.length}`);
    }

    // reset the class reference to the provider if we didn't find any annotations
    if (!clazz && annotations.length === 0) {
        clazz = provider;
    }

    // in the default injection case (e.g. annotating a class), the function to annotate is
    // simply the constructor and it's name is the class name
    let method = provider;
    let methodName = provider.name;

    // Check if we're looking at an "injectable method" - typescript doesn't allow decorators
    // on plain functions, only classes and class methods. It must have a default constructor
    // and implemented the pre-defined method name
    if (provider.length === 0 && provider.prototype[injectableFunctionName]) {
        method = provider.prototype[injectableFunctionName]; // the method from the prototype
        methodName += `.${injectableFunctionName}`; // update the name for logging
    }

    // There's no way to know if rest parameters are being used, so the method must be flagged
    const isRest: boolean = Reflect.getMetadata(isRestKey, method);
    // the number annotations should match either the method length or the base class ctor length
    if (!isRest && annotations.length !== method.length && clazz.length !== annotations.length) {
        throw new Error(
            `Annotation mismatch match for dependencies of ${methodName}: 
            expected ${method.length} annotations and found ${annotations.length}`);
    }

    logger.verbose(`Annotated ${annotations.length} dependencies for ${methodName}`);
    // Return angular style annotated provider method
    return [...annotations, method];
}

/**
 * Execute the {@link InjectableMethod} as a configuration method for the module
 * @param {angular.IModule} module
 * @returns {ClassDecorator}
 * @constructor
 */
export function Config(module: IModule): ClassDecorator {
    return function configureModule(target: Function) {
        module.config(ngAnnotate(target));
    };
}

/**
 * Execute the {@link InjectableMethod} as a run method for the module
 * @param {angular.IModule} module
 * @returns {ClassDecorator}
 * @constructor
 */
export function Run(module: IModule): ClassDecorator {
    return function runModule(target: Function) {
        module.run(ngAnnotate(target));
    };
}

/**
 * The Dependency Tree pattern builds a system to minimize stringly-typing of dependency references
 */
export interface DepTree {
    [key: string]: string | DepTree;
}

/**
 * Traverse through a dependency tree and build descriptive, unique keys to each item in the tree
 * @param {DepTree} tree
 * @param {string} module
 */
export function buildTree(tree: DepTree, module: string) {
    try {
        JSON.stringify(tree); // a little slow, but easiest way to check if this function will work
    } catch (e) {
        throw new TypeError('Tree object must be serializable to build a valid tree');
    }

    /**
     * Recursively build and then assign keys to each leaf in the tree
     * @param node
     * @param {string} prop
     * @param {string[]} identifier
     */
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
