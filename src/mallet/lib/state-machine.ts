/**
 * Created by Greg on 3/24/2017.
 */
import {enumerable} from './decorators';

// tslint:disable:no-shadowed-variable
class StateListener {
    private readonly state: number;
    private readonly callback: Function;

    constructor(state: number, callback: Function) {
        this.state = state;
        this.callback = callback;
    }

    public getState(): number {
        return this.state;
    }

    public invoke(prevState: number) {
        this.callback(this.state, prevState);
    }
}

/**
 * Property decorator to define a state-machine state. Defines both forward and revers lookup properties
 * @param {StateMachine} target
 * @param {string} key
 */
export function state(target: Object, key: string) {
    // ensure the property can be defined on the target
    if (delete target[key]) {
        const value = Math.pow(2, Object.keys(target).length);
        // define regular lookup value
        Object.defineProperty(target, key, {
            enumerable: true,
            value,
        });
        // define non-enumerable reverse-lookup
        Object.defineProperty(target, value, {value: key});
    }
}

/* tslint:disable:no-shadowed-variable */
/**
 * State machine implementation that with compound-state functionality
 */
export abstract class StateMachine {

    @enumerable(false)
    private state: number;

    @enumerable(false)
    private stateListeners: StateListener[];

    /**
     * Get value that represents all possible states for the machine
     * @param {{new(): StateMachine}} machine
     * @returns {number}
     */
    public static all(machine: {new(): StateMachine}): number {
        return Object.keys(machine).reduce((all: number, state: string) => {
            return all | machine[state];
        }, 0);
    }

    constructor() {
        this.state = 0;
        this.stateListeners = [];
    }

    /**
     * Indicates if a given state is active
     * @param state
     * @returns {boolean}
     */
    public is(state): boolean {
        return (state | this.state) === this.state;
    }

    /**
     * Get the current state value
     * @returns {number}
     */
    public getState() {
        return this.state;
    }

    /**
     * Creates an event listener for the given state
     * @param state
     * @param callback
     */
    public onState(state, callback) {
        this.stateListeners.push(new StateListener(state, callback));
    }

    /**
     * Clear all state listeners
     */
    public removeStateListeners() {
        this.stateListeners.length = 0;
    }

    /**
     * Set the state to the new value (does not add compound state)
     * @param state
     */
    public setState(state: number) {
        const prevState = this.state;
        this.state = state;
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }

    /**
     * Add a state value to the current compound state
     * @param {number} state
     */
    public addState(state): void {
        const prevState = this.state;
        this.state |= state;
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }

    /**
     * Remove all values from the compound state
     */
    public reset(): void {
        this.state = 0;
    }

    /**
     * Remove a state from the current compound state
     * @param {number} state
     */
    public removeState(state: number) {
        const prevState = this.state;
        this.state ^= (this.state & state);
        if (prevState !== this.state) {
            this.invokeStateListeners(this.state, prevState);
        }
    }

    /**
     * Override the to string method to output the current state value (with full state name)
     * @returns {string}
     */
    public toString() {
        const states = this.state.toString(2)
            .split('')
            // the @state decorator assigned lookup values to the class
            .map((value, place) => parseInt(value, 10) > 0 ? this.constructor[2 ** place] : '')
            .filter((stateName) => stateName)
            .join(', ');
        return `[${this.constructor.name}: ${this.state} = ${states}]`;
    }

    /**
     * Invoke listeners listening for the given state
     * @param {number} state
     * @param {number} prevState
     */
    private invokeStateListeners(state: number, prevState: number) {
        this.stateListeners.forEach((listener) => {
            if ((listener.getState() | state) === state) {
                listener.invoke(prevState);
            }
        });
    }
}
