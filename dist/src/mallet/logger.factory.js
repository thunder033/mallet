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
const state_machine_1 = require("./lib/state-machine");
// eventual source mapping stuff
// const convert = require('convert-source-map');
// const currentScript = document.currentScript.src;
class Level extends state_machine_1.StateMachine {
}
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "None", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Error", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Warn", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Info", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Debug", void 0);
__decorate([
    state_machine_1.state,
    __metadata("design:type", Object)
], Level, "Verbose", void 0);
exports.Level = Level;
/**
 * Browser-friendly logging utility with multiple loggers and level switches
 * @author Greg Rozmarynowycz<greg@thunderlab.net>
 */
class Logger {
    /**
     * @param {string} stack
     * @param {number} [calls=0]
     */
    static getTrace(stack, calls = 0) {
        const call = stack
            .split('\n')[calls + 3]
            .split(' at ').pop();
        // we have to trace back to 2 calls because of calls from the logger
        const file = call.split('/').pop();
        const method = call.split(' (').shift();
        return `(${method}:${file}`;
    }
    constructor() {
        this.state = new Level();
        this.state.setState(Level.Info);
        // add console logger by default
        this.loggers = [{ level: Level.Debug, api: console }];
    }
    addLogger(logger, loggerLevel) {
        this.loggers.push({ api: logger, level: loggerLevel });
    }
    config(params) {
        this.state.setState(typeof (params.level) !== 'undefined' ? params.level : (this.state.getState() || Level.Error));
    }
    error(...args) {
        if (this.state.getState() < Level.Error) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Error, 'error');
    }
    warn(...args) {
        if (this.state.getState() < Level.Warn) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Warn, 'warn');
    }
    info(...args) {
        if (this.state.getState() < Level.Info) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Info, 'info');
    }
    debug(...args) {
        if (this.state.getState() < Level.Debug) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Debug, 'debug');
    }
    verbose(...args) {
        if (this.state.getState() < Level.Verbose) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Verbose, 'debug');
    }
    logOut(args, msgLevel, func) {
        const stack = Error().stack;
        const trace = Logger.getTrace(stack);
        const level = this.state.getState();
        if (msgLevel > level) {
            return;
        }
        // args[0] = `${trace} ${args[0]}`;
        args.unshift(trace);
        for (let i = 0, l = this.loggers.length; i < l; i++) {
            const loggerLevel = Number.isInteger(this.loggers[i].level) ? this.loggers[i].level : level;
            if (msgLevel <= loggerLevel) {
                this.loggers[i].api[func](...args);
            }
        }
    }
}
exports.Logger = Logger;
function loggerFactory() { return new Logger(); }
exports.loggerFactory = loggerFactory;
//# sourceMappingURL=logger.factory.js.map