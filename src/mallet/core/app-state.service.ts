import {inject, Logger} from '../';
import {MDT} from '../mallet.dependency-tree';
import {ILocationService} from 'angular';
import {state, StateMachine} from '../lib/state-machine';

export class AppState extends StateMachine {
    @state public static Running;
    @state public static Loading;
    @state public static Debug;
    @state public static Suspended;

    constructor(
        @inject(MDT.ng.$location) private $location: ILocationService,
        @inject(MDT.Logger) private logger: Logger) {
        super();
        this.clearState();
    }

    /**
     * Adds exclusivity rules for app states to basic state-machine functionality
     * @param {number} newState
     */
    public addState(newState: number) {
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
        this.logger.verbose(`Add ${newState} to AppState: ${this.getState()}`);
    }

    public clearState(): any {
        this.logger.verbose(`Clear AppState`);
        const debug = this.$location.search().debug === '1' ? AppState.Debug : 0;
        this.setState(AppState.Loading | debug);
        this.removeStateListeners();
    }
}
