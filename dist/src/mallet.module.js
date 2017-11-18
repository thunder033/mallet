"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const injector_plus_1 = require("lib/injector-plus");
const render_target_factory_1 = require("./render-target.factory");
const app_state_service_1 = require("./app-state.service");
const scheduler_service_1 = require("./scheduler.service");
const mallet = require('angular').module('mallet', [
    require('./mallet.constants'),
]);
mallet.service(mallet_depedency_tree_1.MDT.Scheduler, injector_plus_1.ngAnnotate(scheduler_service_1.Scheduler));
mallet.service(mallet_depedency_tree_1.MDT.AppState, injector_plus_1.ngAnnotate(app_state_service_1.AppState));
mallet.factory(mallet_depedency_tree_1.MDT.RenderTarget, injector_plus_1.ngAnnotate(render_target_factory_1.renderTargetFactory));
mallet.component(mallet_depedency_tree_1.MDT.component.renderTarget, '');
//# sourceMappingURL=mallet.module.js.map