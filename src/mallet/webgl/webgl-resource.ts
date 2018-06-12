import {IWebGLResourceContext} from './webgl-resource-context';

export interface IWebGLResourceCtor<Resource extends IWebGLResource, Options> {
    new(options: Options): Resource;
}

export interface IWebGLSimpleResourceCtor<Resource extends IWebGLResource> {
    new(): Resource;
}

type ClassMethod<T, R> =  {[M in keyof T]: (context: IWebGLResourceContext) => R};

export interface IWebGLResource {
    release(): void;
    init(resourceCache: {[name: string]: IWebGLResource}): void;
}

/**
 * Allows application components to inherit the ability to arbitrarily access
 * to/of WebGL resources without manually passing context
 */
export abstract class WebGLResource implements IWebGLResource {

    private static currentGuid = 0; // move to factory possibly?
    private static contexts: Map<string, IWebGLResourceContext> = new Map<string, IWebGLResourceContext>();

    protected context: Readonly<IWebGLResourceContext>;

    private guid: number; // uniquely identifies the WebGL resource instance

    /**
     * Retrieve an indexed WebGL resource context, if it is found
     * @param {string} name
     * @returns {IWebGLResourceContext}
     */
    public static getContext(name: string = 'default'): IWebGLResourceContext {
        return WebGLResource.contexts.get(name);
    }

    /**
     * Create and index a new WebGL resource context
     * @param {IWebGLResourceContext} properties
     * @param {string} name - unique identifier for the new context
     * @returns {IWebGLResourceContext} - the new created context
     */
    public static buildContext(properties: IWebGLResourceContext, name: string = 'default'): IWebGLResourceContext {
        if (WebGLResource.contexts.has(name)) {
            throw new Error(`Cannot create WebGLResourceContext "${name}", context with name already exists`);
        }

        const newContext: IWebGLResourceContext = {...properties};
        WebGLResource.contexts.set(name, newContext);

        return newContext;
    }

    constructor(contextName = 'default') {
        this.guid = WebGLResource.currentGuid++;
        this.context = Object.freeze(WebGLResource.getContext(contextName));
    }

    public abstract release(): void;

    public init(resourceCache: {[name: string]: IWebGLResource}): void {
        // no-op
    }

    // protected contextExecute<T extends WebGLResource>(method: keyof T): any {
    //     return this[method as string](this.context);
    // }
}
