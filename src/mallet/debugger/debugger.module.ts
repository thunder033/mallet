import angular = require('angular');
import {MDT} from '../mallet.dependency-tree';
import {debuggerOptions} from './debugger.component';
import {Config, inject, InjectableMethod, Run} from '../lib/injector-plus';
import {EmbeddedStylesConfigProvider} from '../embedded-styles/embbeded-styles.config';
import {EmbeddedStyle} from '../embedded-styles/embedded-styles.library.config';
import {Debugger} from './debugger.service';

// tslint:disable:no-var-requires
export const malletDebugger = angular.module('mallet-debugger', [
    require('../core/').malletCore.name,
]);

malletDebugger.component(MDT.component.debugger, debuggerOptions);

// Make the static debugger available to clients
export {Debugger} from './debugger.service';

@Config(malletDebugger) class Configure implements InjectableMethod {
    public exec(@inject.provider(MDT.config.EmbeddedStyles) embeddedStylesConfig: EmbeddedStylesConfigProvider): any {
        embeddedStylesConfig.useStyle(EmbeddedStyle.Debugger);
    }
}
