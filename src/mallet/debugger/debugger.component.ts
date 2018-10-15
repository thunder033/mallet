
import {IComponentOptions, IController} from 'angular';
import {MDT} from '../mallet.dependency-tree';
import {inject, ngAnnotate} from '..';
import {AppState} from '../core/app-state.service';
import {Debugger} from './debugger.module';
import {IWebGLApp} from '../webgl/webgl-app';
import bind from 'bind-decorator';

class DebuggerCtrl implements IController {
    public watchedValues: Object;

    private app: IWebGLApp;

    constructor(
        @inject(MDT.const.BuildVersion) private buildVersion: number,
        @inject(MDT.AppState) private appState: AppState) {
        appState.addState(AppState.Debug);
        this.watchedValues = {};
    }

    public $postLink() {
        // TODO: clean this up; need a better way to add frame-cycle events
        this.app.postRender = this.getWatchers;
    }

    public getState(): string {
        // get reverse-look up state name
        return this.appState.toString();
    }

    public getBuildVersion(): string {
        return `Mallet build #${this.buildVersion}`;
    }

    @bind public getWatchers() {
        Object.assign(this.watchedValues, Debugger.getWatchedValues());
        return this.watchedValues;
    }
}

export const debuggerOptions: IComponentOptions = {
    controller: ngAnnotate(DebuggerCtrl),
    require: {app: `^${MDT.component.webGLApp}`},
    template: `
<div class="debugger">
    <span ng-bind="$ctrl.getState()"></span><br>
    <span ng-bind="$ctrl.getBuildVersion()"></span>
    <ul>
        <li ng-repeat="(name, list) in $ctrl.watchedValues">
            <span ng-bind="name"></span>
            <span ng-repeat="row in list" ng-bind="row"></span>
        </li>
    </ul>
</div>`,
};
