"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const injector_plus_1 = require("./lib/injector-plus");
const render_target_factory_1 = require("./render-target.factory");
const app_state_service_1 = require("./app-state.service");
const scheduler_service_1 = require("./scheduler.service");
const logger_service_1 = require("./logger.service");
const render_target_component_1 = require("./render-target.component");
const library_provider_1 = require("./library.provider");
// tslint:disable:no-var-requires
exports.mallet = require('angular').module('mallet', [
    require('./mallet.constants'),
]);
exports.mallet.provider(mallet_depedency_tree_1.MDT.Library, injector_plus_1.ngAnnotate(library_provider_1.LibraryProvider));
exports.mallet.service(mallet_depedency_tree_1.MDT.Scheduler, injector_plus_1.ngAnnotate(scheduler_service_1.Scheduler));
exports.mallet.service(mallet_depedency_tree_1.MDT.AppState, injector_plus_1.ngAnnotate(app_state_service_1.AppState));
exports.mallet.service(mallet_depedency_tree_1.MDT.Logger, injector_plus_1.ngAnnotate(logger_service_1.Logger));
exports.mallet.factory(mallet_depedency_tree_1.MDT.RenderTarget, injector_plus_1.ngAnnotate(render_target_factory_1.renderTargetFactory));
exports.mallet.component(mallet_depedency_tree_1.MDT.component.renderTarget, render_target_component_1.options);
//# sourceMappingURL=mallet.module.js.map