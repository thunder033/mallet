// tslint:disable:no-var-requires
import {MDT} from './mallet.dependency-tree';
import {ngAnnotate} from './lib/injector-plus';
import {MalletConfigProvider} from './mallet.config';

export const mallet = require('angular').module('mallet', [
    require('./core').malletCore.name,
    require('./embedded-styles').embeddedStyles.name,
    require('./debugger').malletDebugger.name,
]);

mallet.provider(MDT.config.mallet, ngAnnotate(MalletConfigProvider));
