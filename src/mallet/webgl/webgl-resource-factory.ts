
import {IWebGLResource, IWebGLResourceCtor, IWebGLSimpleResourceCtor} from './webgl-resource';
import {ILibraryService} from '../core/library.provider';
import {WebGLMesh} from './webgl-mesh';
import {Mesh} from '../geometry/mesh';
import bind from 'bind-decorator';

export interface IWebGLResourceFactory {
    create<R extends IWebGLResource>(ctor: IWebGLSimpleResourceCtor<R>): R;
    create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O): R;
}

/**
 * Provides interface to create new {@link IWebGLResource} instances with access to the existing
 * (white-listed) cache of resources, including meshes
 */
export class WebGLResourceFactory implements IWebGLResourceFactory {
    private resourceCache: {[name: string]: IWebGLResource};

    constructor(
        private library: ILibraryService) {
        this.resourceCache = {};
    }

    /**
     * Cache pre-defined resources for instant access
     * @param {string[]} meshNames
     * @returns {Promise<any>}
     */
    public init(meshNames: string[]): Promise<any> {
        return Promise.all(meshNames.map(this.registerMesh));
            // .then(() => this.library.addSources(WebGLMesh, [new StaticSource(this.resourceCache)]));
    }

    /**
     * Create a new resource instance with no parameters (class must have default constructor)
     * @param {IWebGLSimpleResourceCtor<R extends IWebGLResource>} ctor
     * @returns {@link IWebGLResource} created resource instance
     */
    public create<R extends IWebGLResource>(ctor: IWebGLSimpleResourceCtor<R>): R;
    /**
     * Create a parameterized resource instance
     * @param {IWebGLResourceCtor<R extends IWebGLResource, O>} ctor
     * @param {O} options
     * @returns {@link IWebGLResource} create resource instance
     */
    public create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O): R;
    @bind public create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O = null): R {
        const res = new ctor(options);
        res.init(this.resourceCache);
        return res;
    }

    /**
     * Retrieve a mesh from the library and cache it for synchronous access
     * @param {string} name
     * @returns {Promise<WebGLMesh>}
     */
    @bind private registerMesh(name: string): Promise<WebGLMesh> {
        return this.library.get(Mesh, name)
            .then((mesh) => this.create(WebGLMesh, {mesh}))
            .then((glMesh) => this.resourceCache[name] = glMesh);
    }
}
