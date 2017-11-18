"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const injectableMethodName = 'exec';
const annotationKey = Symbol('dependencies');
/**
 * Define the injection annotation for a given angular provider
 * @param {string} identifier
 * @returns {ParameterDecorator}
 */
function inject(identifier) {
    // tslint:disable-next-line:callable-types
    return function annotation(target, key, index) {
        if (key && key !== injectableMethodName) {
            throw new TypeError('Dependencies can only be injected on constructor or injectable method executor');
        }
        else if (key) {
            target = target.constructor;
        }
        const annotations = Reflect.getOwnMetadata(annotationKey, target) || new Array(target.length);
        annotations[index] = identifier;
        Reflect.defineMetadata(annotationKey, annotations, target);
    };
}
exports.inject = inject;
/**
 * Construct an angular annotation array from dependency metadata
 * @param {Function} provider
 * @returns {Array<string | Function>}
 */
function ngAnnotate(provider) {
    const annotations = Reflect.getOwnMetadata(annotationKey, provider) || [];
    let method = provider;
    let methodName = provider.name;
    if (provider.length === 0 && provider.prototype.hasOwnProperty(injectableMethodName)) {
        method = provider.prototype[injectableMethodName];
        methodName += `.${injectableMethodName}`;
    }
    if (annotations.length !== method.length) {
        throw new Error(`Annotations are not defined for all dependencies of ${methodName}: 
            expected ${method.length} annotations and found ${annotations.length}`);
    }
    return [...annotations, method];
}
exports.ngAnnotate = ngAnnotate;
function buildTree(tree, module) {
    try {
        JSON.stringify(tree);
    }
    catch (e) {
        throw new TypeError('Tree object must be serializable to build a valid tree');
    }
    function traverseNode(node, prop, identifier) {
        const value = node[prop];
        if (typeof value === 'string' && !value) {
            node[prop] = [...identifier, prop].join('.');
        }
        else if (typeof value === 'object' && value !== null) {
            Object.keys(value).forEach((key) => {
                traverseNode(value, key, [...identifier, prop]);
            });
        }
    }
    Object.keys(tree).forEach((key) => {
        traverseNode(tree, key, [module]);
    });
}
exports.buildTree = buildTree;
//# sourceMappingURL=injector-plus.js.map