
import {IWebGLResource, IWebGLResourceCtor} from './webgl-resource';
import {ILibraryService} from '../library.provider';
import {WebGLMesh} from './webgl-mesh';
import {Mesh} from '../geometry/mesh';
import bind from 'bind-decorator';

export interface IWebGLResourceFactory {
    create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options?: O): R;
}

export class WebGLResourceFactory implements IWebGLResourceFactory {
    private resourceCache: {[name: string]: IWebGLResource};

    constructor(
        private library: ILibraryService) {
        this.resourceCache = {};
    }

    public init(meshNames: string[]): Promise<any> {
        return Promise.all(meshNames.map(this.registerMesh));
            // .then(() => this.library.addSources(WebGLMesh, [new StaticSource(this.resourceCache)]));
    }

    public create<R extends IWebGLResource, O>(ctor: IWebGLResourceCtor<R, O>, options: O = null): R {
        const res = new ctor(options);
        res.init(this.resourceCache);
        return res;
    }

    @bind private registerMesh(name: string): Promise<WebGLMesh> {
        return this.library.get(Mesh, name)
            .then((mesh) => this.create(WebGLMesh, {mesh}))
            .then((glMesh) => this.resourceCache[name] = glMesh);
    }
}
