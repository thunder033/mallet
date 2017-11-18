
import {MDT} from './mallet.depedency-tree';
import {ngAnnotate} from './lib/injector-plus';
import {renderTargetFactory} from './render-target.factory';
import {AppState} from './app-state.service';
import {Scheduler} from './scheduler.service';

// tslint:disable:no-var-requires
const mallet = require('angular').module('mallet', [
    require('./mallet.constants'),
]);

mallet.service(MDT.Scheduler, ngAnnotate(Scheduler));
mallet.service(MDT.AppState, ngAnnotate(AppState));

mallet.factory(MDT.RenderTarget, ngAnnotate(renderTargetFactory));

mallet.component(MDT.component.renderTarget, '');
