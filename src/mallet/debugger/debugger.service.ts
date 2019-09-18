import {ICamera, inject, IRenderer, IWebGLApp, IWebGLStage, Logger, WebGLApp} from '..';

export interface IValueReader {
    key: string;
    type: Function;
    tag: string;
    identifier: string;
    description?: string;
    getValue(): any;
}

export interface WatcherReadout {
    [type: string]: string[];
}

export class Debugger {

    private static propertyWatchers: IValueReader[];
    private static logger = new Logger({tag: 'debugger'});

    /**
     * Generate a collection with read outs from all watchers that have been created
     * @returns {WatcherReadout}
     */
    public static getWatchedValues(): WatcherReadout {
        return Debugger.propertyWatchers.reduce((readout, reader) => {
            const type = reader.type.name;
            if (!readout[type]) {
                readout[type] = [];
            }

            const value = reader.getValue();
            const display = value ? value.toString() : String(value);
            const description = reader.description || Debugger.getDescription(reader);
            readout[type].push(`${description}: ${display}`);
            return readout;
        }, {});
    }

    /**
     * Create a property observer that transparently allows access to simple object properties (getter/setters not
     * supported)
     * @param {string} [tag] - tag to group all value reads under
     * @param {string} [identifierKey] - property on target that can be used to identify the instance
     * @returns {PropertyDecorator}
     */
    public static watch(tag: string = '', identifierKey = 'guid'): PropertyDecorator {
        if (!Debugger.propertyWatchers) {
            Debugger.propertyWatchers = [];
        }

        return function watchProperty(target: any, key: string) {
            // create a simple field unless the property is already described differently
            const descriptor: PropertyDescriptor = {
                configurable: true,
                enumerable: true,
                ...Object.getOwnPropertyDescriptor(target, key)};

            // wrapping getter/setter could get kind of messy, we'll just handle simple fields for now
            if (descriptor.get || descriptor.set) {
                Debugger.logger.warn(`Watcher cannot be added to ${target.constructor.name}:${key} with getter/setter`);
                return;
            }

            let value = descriptor.value;
            descriptor.get = () => value;
            descriptor.set = (newValue) => {
                value = newValue;
            };
            delete target[key]; // remove the property that may already exist
            delete descriptor.value; // remove any initialized value (can't have value and get/set)
            delete descriptor.writable; // can't have writable and accessor methods
            Object.defineProperty(target, key, descriptor);

            const identifier = identifierKey && Debugger.isIdentifier(target[identifierKey]) ?
                target[identifierKey] + '' : undefined;
            const watcher = {
                identifier,
                key,
                tag,
                type: target.constructor,
                getValue() { return value; },
            };

            Debugger.logger.debug(`Watching ${key} on ${watcher.type.name}:${watcher.identifier}`);
            Debugger.propertyWatchers.push(watcher);
        };
    }

    /**
     * Create a description to identify a value in the read out
     * @param {IValueReader} reader
     * @returns {string}
     */
    private static getDescription(reader: IValueReader): string {
        // either value may not be defined
        const text = [reader.identifier, reader.tag].filter((v) => !!v).join('-');
        return `[${text}]`;
    }

    private static isIdentifier(value) {
        return ['string', 'number', 'symbol'].includes(typeof value);
    }
}
