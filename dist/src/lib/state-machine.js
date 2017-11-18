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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Greg on 3/24/2017.
 */
const decorators_1 = require("./decorators");
// tslint:disable:no-shadowed-variable
class StateListener {
    constructor(state, callback) {
        this.state = state;
        this.callback = callback;
    }
    getState() {
        return this.state;
    }
    invoke(prevState) {
        this.callback(this.state, prevState);
    }
}
function state(target, key) {
    if (delete target[key]) {
        Object.defineProperty(target, key, {
            enumerable: true,
            value: Math.pow(2, Object.keys(target).length),
        });
    }
}
exports.state = state;
/* tslint:disable:no-shadowed-variable */
class StateMachine {
    constructor() {
        this.state = 0;
        this.stateListeners = [];
    }
    static all(machine) {
        return Object.keys(machine).reduce((all, state) => {
            return all | machine[state];
        }, 0);
    }
    /**
     * Indicates if a given state is active
     * @param state
     * @returns {boolean}
     */
    is(state) {
        return (state | this.state) === this.state;
    }
    getState() {
        return this.state;
    }
    /**
     * Creates an event listener for the given state
     * @param state
     * @param callback
     */
    onState(state, callback) {
        this.stateListeners.push(new StateListener(state, callback));
    }
    /**
     * Clear all state listeners
     */
    removeStateListeners() {
        this.stateListeners.length = 0;
    }
    setState(state) {
        const prevState = this.state;
        this.state = state;
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }
    addState(state) {
        const prevState = this.state;
        this.state |= state;
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }
    reset() {
        this.state = 0;
    }
    removeState(state) {
        const prevState = this.state;
        this.state ^= state;
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }
    invokeStateListeners(state, prevState) {
        this.stateListeners.forEach((listener) => {
            if ((listener.getState() | state) === state) {
                listener.invoke(prevState);
            }
        });
    }
}
__decorate([
    decorators_1.enumerable(false),
    __metadata("design:type", Object)
], StateMachine.prototype, "state", void 0);
__decorate([
    decorators_1.enumerable(false),
    __metadata("design:type", Array)
], StateMachine.prototype, "stateListeners", void 0);
exports.StateMachine = StateMachine;
//# sourceMappingURL=state-machine.js.map