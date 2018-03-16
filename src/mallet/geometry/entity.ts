
import {ITransform, Transform} from './transform';
import {IWebGLMesh, WebGLMesh} from '../webgl/webgl-mesh';
import {quat, vec3} from 'gl-matrix';
import {IWebGLResource, WebGLResource} from '../webgl/webgl-resource';
import {FastTransform} from './fast-transform';
import bind from 'bind-decorator';
import {IWebGLResourceContext} from '../webgl/webgl-resource-context';

export interface IEntity {
    getTransform(): ITransform;
    update?(dt: number, tt: number): void;
    getMesh(): IWebGLMesh;

    getPosition(): vec3;
    getRotation(): quat;

    rotate(rotation: vec3): void;
    translate(translation: vec3): void;
    scale(scalar: number): void;

    rotateTo(orientation: vec3 | quat): void;
    destroy(): void;
}

export type EntityCollection<T> = T[];

export abstract class Entity extends WebGLResource implements IEntity, IWebGLResource {

    private static curId = 0;
    private static index: EntityCollection<IEntity> = [];
    private static updateMethods: EntityCollection<(dt: number, tt: number) => void> = [];

    public getPosition: () => vec3;
    public getRotation: () => quat;
    public rotate: (rotation: vec3) => void;
    public translate: (translation: vec3) => void;
    public rotateTo: (orientation: vec3 | quat) => void;

    protected transform: ITransform;
    private id: number;
    private mesh: WebGLMesh;

    public static getIndex(): EntityCollection<IEntity> {
        return Entity.index;
    }

    public static getUpdateIndex(): EntityCollection<(dt: number, tt: number) => void> {
        return Entity.updateMethods;
    }

    constructor(private meshName: string) {
        super();
        // register entity in the index
        this.id = Entity.curId++;
        Entity.index[this.id] = this;

        if (this.update !== Entity.prototype.update) {
            this.context.logger.debug(`Add entity update method for entity with mesh ${meshName}`);
            Entity.updateMethods.push(this.update.bind(this));
        }

        this.mesh = null;
        // since the id is implemented as an incrementing integer, it works as offset base
        const offset = this.id * FastTransform.BUFFER_LENGTH;
        this.transform = this.context.transformBuffer !== null
            ? new FastTransform(this.context.transformBuffer, offset)
            : this.transform = new Transform();

        this.getPosition = this.transform.getPosition.bind(this.transform);
        this.getRotation = this.transform.getRotation.bind(this.transform);

        this.rotate = this.transform.vRotateBy.bind(this.transform);
        this.translate = this.transform.vTranslate.bind(this.transform);
        this.rotateTo = this.transform.vSetRotation.bind(this.transform);
    }

    public init(resources: {[name: string]: IWebGLResource}): void {
        this.mesh = resources[this.meshName] as WebGLMesh;
    }

    @bind public scale(scalar: number): void {
        this.transform.scaleBy(scalar, scalar, scalar);
    }

    public update(dt: number, tt: number): void {
        // void
    }

    public getTransform() {
        return this.transform;
    }

    public getMesh() {
        return this.mesh;
    }

    public destroy(): void {
        throw new Error('destroying entities is not supported in current implementation');
    }

    public release(): void {
        // no-op
    }
}
