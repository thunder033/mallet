import { StateMachine } from './state-machine';
export declare class Level extends StateMachine {
    static None: any;
    static Error: any;
    static Warn: any;
    static Info: any;
    static Debug: any;
    static Verbose: any;
}
/**
 * Browser-friendly logging utility with multiple loggers and level switches
 * @author Greg Rozmarynowycz<greg@thunderlab.net>
 */
export declare class Logger {
    private loggers;
    private state;
    /**
     * @param {string} stack
     * @param {number} [calls=0]
     */
    private static getTrace(stack, calls?);
    constructor();
    addLogger(logger: any, loggerLevel: any): void;
    config(params: {
        level: Level;
    }): void;
    error(message: string): any;
    error(...args: any[]): any;
    warn(message: string): any;
    warn(...args: any[]): any;
    info(message: string): any;
    info(...args: any[]): any;
    /**
     * Output debug level logging message
     * @param {string} message
     */
    debug(message: string): any;
    debug(...args: any[]): any;
    verbose(message: string): any;
    verbose(...args: any[]): any;
    private logOut(args, msgLevel, func);
}
