export declare function state(target: Object, key: string): void;
export declare abstract class StateMachine {
    private state;
    private stateListeners;
    static all(machine: {
        new (): StateMachine;
    }): number;
    constructor();
    /**
     * Indicates if a given state is active
     * @param state
     * @returns {boolean}
     */
    is(state: any): boolean;
    getState(): any;
    /**
     * Creates an event listener for the given state
     * @param state
     * @param callback
     */
    onState(state: any, callback: any): void;
    /**
     * Clear all state listeners
     */
    removeStateListeners(): void;
    setState(state: any): void;
    addState(state: any): void;
    reset(): void;
    removeState(state: any): void;
    private invokeStateListeners(state, prevState);
}
