import {MDT} from '../mallet.dependency-tree';
import {ngAnnotate} from '../lib/injector-plus';
import {renderTargetFactory} from './render-target.factory';
import {AppState} from './app-state.service';
import {Scheduler} from './scheduler.service';
import {MalletLogger} from './logger.service';
import {options as renderTargetOptions} from './render-target.component';
import {LibraryProvider} from './library.provider';

// tslint:disable:no-var-requires
export const malletCore = require('angular').module('mallet-core', [
    require('../mallet.constants'),
]);

malletCore.provider(MDT.Library, ngAnnotate(LibraryProvider));

malletCore.service(MDT.Scheduler, ngAnnotate(Scheduler));
malletCore.service(MDT.AppState, ngAnnotate(AppState));
malletCore.service(MDT.Logger, ngAnnotate(MalletLogger));

malletCore.factory(MDT.RenderTarget, ngAnnotate(renderTargetFactory));

malletCore.component(MDT.component.renderTarget, renderTargetOptions);