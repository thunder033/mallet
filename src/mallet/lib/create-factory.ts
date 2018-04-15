import {inject, InjectableMethod} from './injector-plus';

export type InjectContext<C> = {[D in keyof C]: any};

export interface FactoryFields {
    klass: any;
    params: any;
    base: any;
}

/**
 * Generate an injected context wrapper for a factory method, to create class instances
 * with both injected and instance parameters
 * @param {{[string]: string}} annotations: map of injected dependency variable names to their keys
 * @param {(context: {[p: string]: any}>, params: P) => O} factory
 * @returns {InjectableMethod & FactoryFields} an {@link InjectableMethod} wrapping {@link factory} that is annotated with the dependencies
 *
 * @example
 * export WidgetFactory extends CreateFactory({
 *      gearService: 'module.gearService'
 * }, ({gearService}, widgetParams) => {
 *      return new Widget(gearService, widgetParams);
 * }) {}
 * 
 * @constructor
 */
export function CreateFactory<A extends {[a: string]: string}, P, O>(annotations: A, factory: (context: InjectContext<A>, params: P) => O) {
    const annotationKeys = Object.keys(annotations)
        .sort((a, b) => a.localeCompare(b));
    const annotationList = annotationKeys.map((key) => annotations[key]);
    const AnnotatedFactory = class implements InjectableMethod, FactoryFields {
        // these fields exist to store type info from the method; these values can't really be
        // retrieved later easily
        public klass: O;
        public params: P;
        public base = factory;

        /**
         * this is the meat of the factory, where we curry the factory base to be executed
         * with instance parameters and injected dependencies
         * @param {[]} dependencies
         * @returns {(params: P) => O}
         */
        public exec(...dependencies: any[]): (params: P) => O  {
            const dependencyKVPs = dependencies.map((dependency, index) =>
                ({[annotationKeys[index]]: dependency}));
            const context: InjectContext<A> = Object.assign.apply(null, [{}, ...dependencyKVPs]);
            return factory.bind(factory, context);
        }
    };

    // Apply annotation metadata since we can't use a decorator on an anonymous class and can't return a named class
    inject.list(annotationList)(AnnotatedFactory.prototype, 'exec', null);
    inject.isRest()(AnnotatedFactory.prototype, 'exec', null);

    return AnnotatedFactory;
}

export type Runnable<F extends FactoryFields> = (params: F['params']) => F['klass'];
