
import {MDT} from './mallet.depedency-tree';
import {ngAnnotate} from './lib/injector-plus';
import {renderTargetFactory} from './render-target.factory';
import {AppState} from './app-state.service';
import {Scheduler} from './scheduler.service';
import {Logger} from './logger.service';
import {options as renderTargetOptions} from './render-target.component';

// tslint:disable:no-var-requires
export const mallet = require('angular').module('mallet', [
    require('./mallet.constants'),
]);

mallet.service(MDT.Scheduler, ngAnnotate(Scheduler));
mallet.service(MDT.AppState, ngAnnotate(AppState));
mallet.service(MDT.Logger, ngAnnotate(Logger));

mallet.factory(MDT.RenderTarget, ngAnnotate(renderTargetFactory));

mallet.component(MDT.component.renderTarget, renderTargetOptions);
