// re-export the logger utility to maintain consistent pathing in the module definition
import {inject, Level, Logger} from '../';
import {MDT} from '../mallet.dependency-tree';

export * from '../lib/logger';

export class MalletLogger extends Logger {
    constructor(@inject(MDT.const.LoggingLevel) level: Level) {
        super();
        this.config({level, tag: 'main'});
    }
}
