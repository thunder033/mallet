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

export abstract class WebGLResource implements IWebGLResource {

    private static contexts: Map<string, IWebGLResourceContext> = new Map<string, IWebGLResourceContext>();

    protected context: Readonly<IWebGLResourceContext>;

    public static getContext(name: string = 'default'): IWebGLResourceContext {
        return WebGLResource.contexts.get(name);
    }

    public static buildContext(properties: IWebGLResourceContext, name: string = 'default'): IWebGLResourceContext {
        if (WebGLResource.contexts.has(name)) {
            throw new Error(`Cannot create WebGLResourceContext "${name}", context with name already exists`);
        }

        const newContext: IWebGLResourceContext = {...properties};
        WebGLResource.contexts.set(name, newContext);

        return newContext;
    }

    constructor(contextName = 'default') {
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
