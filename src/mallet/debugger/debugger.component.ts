
import {IComponentOptions, IController} from 'angular';
import {MDT} from '../mallet.dependency-tree';
import {inject, ngAnnotate} from '..';
import {AppState} from '../core/app-state.service';

class DebuggerCtrl implements IController {
    constructor(
        @inject(MDT.const.BuildVersion) private buildVersion: number,
        @inject(MDT.AppState) private appState: AppState) {
        appState.addState(AppState.Debug);
    }

    public $postLink() {

    }

    public getState(): string {
        // get reverse-look up state name
        return this.appState.toString();
    }

    public getBuildVersion(): string {
        return `Mallet build #${this.buildVersion}`;
    }
}

export const debuggerOptions: IComponentOptions = {
    controller: ngAnnotate(DebuggerCtrl),
    template: `
<div class="debugger">
    <span ng-bind="$ctrl.getState()"></span><br>
    <span ng-bind="$ctrl.getBuildVersion()"></span>
</div>`,
};
