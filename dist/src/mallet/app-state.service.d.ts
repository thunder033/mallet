/// <reference types="angular" />
import { ILocationService } from 'angular';
import { Logger } from './logger.service';
import { StateMachine } from './lib/state-machine';
export declare class AppState extends StateMachine {
    private $location;
    private logger;
    static Running: any;
    static Loading: any;
    static Debug: any;
    static Suspended: any;
    constructor($location: ILocationService, logger: Logger);
    /**
     * Adds exclusivity rules for app states to basic state-machine functionality
     * @param {number} newState
     */
    addState(newState: number): void;
    clearState(): any;
}
