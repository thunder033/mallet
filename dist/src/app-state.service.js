"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const injector_plus_1 = require("./lib/injector-plus");
const mallet_depedency_tree_1 = require("./mallet.depedency-tree");
const logger_factory_1 = require("./logger.factory");
const state_machine_1 = require("./lib/state-machine");
let AppState = class AppState extends state_machine_1.StateMachine {
    constructor($location, logger) {
        super();
        this.$location = $location;
        this.logger = logger;
        this.clearState();
    }
    /**
     * Adds exclusivity rules for app states to basic state-machine functionality
     * @param {number} newState
     */
    addState(newState) {
        switch (newState) {
            case AppState.Suspended:
                this.removeState(AppState.Running | AppState.Loading);
                break;
            case AppState.Running:
                this.removeState(AppState.Suspended | AppState.Loading);
                break;
            default:
                break;
        }
        super.addState(newState);
    }
    clearState() {
        const debug = this.$location.search().debug === '1' ? AppState.Debug : 0;
        this.setState(AppState.Loading | debug);
        this.removeStateListeners();
    }
};
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], AppState, "Running", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], AppState, "Loading", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], AppState, "Debug", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], AppState, "Suspended", void 0);
AppState = __decorate([
    __param(0, injector_plus_1.inject(mallet_depedency_tree_1.MDT.ng.$location)),
    __param(1, injector_plus_1.inject(mallet_depedency_tree_1.MDT.Logger)),
    __metadata("design:paramtypes", [Object, logger_factory_1.Logger])
], AppState);
exports.AppState = AppState;
//# sourceMappingURL=app-state.service.js.map