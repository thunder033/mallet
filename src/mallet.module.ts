
import {MDT} from './mallet.depedency-tree';
import {ngAnnotate} from 'lib/injector-plus';
import {renderTargetFactory} from 'lib/mallet/render-target.factory';

const mallet = require('angular').module('mallet', [
    require('./mallet.constants'),
]);

mallet.service(MDT.Scheduler, require('./scheduler.service'));
mallet.service(MDT.AppState, require('app-state.service'));

mallet.factory(MDT.RenderTarget, ngAnnotate(renderTargetFactory));

mallet.component(MDT.component.renderTarget, '');
