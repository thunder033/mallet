import {state, StateMachine} from './state-machine';

// eventual source mapping stuff
// const convert = require('convert-source-map');
// const currentScript = document.currentScript.src;

export class Level extends StateMachine {
    @state public static None;
    @state public static Error;
    @state public static Warn;
    @state public static Info;
    @state public static Debug;
    @state public static Verbose;
}

/**
 * Browser-friendly logging utility with multiple loggers and level switches
 * @author Greg Rozmarynowycz<greg@thunderlab.net>
 */
export class Logger {
    private loggers: any[];
    private state: Level;
    private tag: string;

    /**
     * @param {string} stack
     * @param {number} [calls=0]
     */
    private static getTrace(stack: string, calls: number = 0) {
        const call = stack
            .split('\n')[calls + 3]
            .split(' at ').pop();
        // we have to trace back to 2 calls because of calls from the logger
        const file = call.split('/').pop();
        const method = call.split(' (').shift();

        return `(${method}:${file}`;
    }

    constructor(params: {level?: Level, tag?: string} = {}) {
        this.state = new Level();
        this.state.setState(Level.Info);
        // add console logger by default
        this.loggers = [{level: Level.Verbose, api: console}];
        this.config(params);
    }

    public addLogger(logger, loggerLevel) {
        this.loggers.push({api: logger, level: loggerLevel});
    }

    public config(params: {level?: Level, tag?: string}) {
        if (typeof params.tag !== 'undefined') {
            this.tag = params.tag;
        }

        if (typeof params.level !== 'undefined') {
            this.info(`Set logging level to ${Level[params.level as any]}`);
            this.state.setState(typeof (params.level) !== 'undefined' ? params.level : (this.state.getState() || Level.Error));
        }
    }

    public error(message: string);
    public error(...args);
    public error(...args) {
        if (this.state.getState() < Level.Error) {
            return;
        }

        this.logOut(Array.prototype.slice.call(args), Level.Error, 'error');
    }

    public warn(message: string);
    public warn(...args);
    public warn(...args) {
        if (this.state.getState() < Level.Warn) {
            return;
        }

        this.logOut(Array.prototype.slice.call(args), Level.Warn, 'warn');
    }

    public info(message: string);
    public info(...args);
    public info(...args) {
        if (this.state.getState() < Level.Info) {
            return;
        }
        this.logOut(Array.prototype.slice.call(args), Level.Info, 'info');
    }

    /**
     * Output debug level logging message
     * @param {string} message
     */
    public debug(message: string);
    public debug(...args);
    public debug(...args) {
        if (this.state.getState() < Level.Debug) {
            return;
        }

        this.logOut(Array.prototype.slice.call(args), Level.Debug, 'debug');
    }

    public verbose(message: string);
    public verbose(...args);
    public verbose(...args) {
        if (this.state.getState() < Level.Verbose) {
            return;
        }

        this.logOut(Array.prototype.slice.call(args), Level.Verbose, 'debug');
    }

    private logOut(args, msgLevel, func) {
        const stack = Error().stack;
        let trace = Logger.getTrace(stack);
        const level = this.state.getState();

        if (this.tag) {
            trace = `[${this.tag}] ${trace}`;
        }

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
