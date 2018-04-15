import * as angular from 'angular';
import {StylesheetFactory} from '../lib/dynamic-stylesheet';
import {MDT} from '../mallet.depedency-tree';
import {inject, InjectableMethod, ngAnnotate} from '../lib/injector-plus';
import {ILibraryService} from '../core/library.provider';
import {MalletLibraryConfig, StylesheetDTO} from './utilty-styles.library.config';
import {Runnable} from '../lib/create-factory';
import {malletCore} from '../core';

/**
 * Embed basic utility styles in the app so client apps can just use them
 * @type {angular.IModule}
 */
export const utilityStyles = angular.module('utility-styles', [
    malletCore.name,
]);

utilityStyles.factory(MDT.DynamicStylesheet, ngAnnotate(StylesheetFactory));
utilityStyles.config(ngAnnotate(MalletLibraryConfig));

class Runner implements InjectableMethod {
    public exec(
        @inject(MDT.Library) library: ILibraryService,
        @inject(MDT.DynamicStylesheet) stylesheetFactory: Runnable<StylesheetFactory>): any {
        library.get(StylesheetDTO, 'mallet-base').then((stylesheetDto) => {
            // Create and attach the stylesheet to the document
            stylesheetFactory(stylesheetDto).attach();
        });
    }
}

utilityStyles.run(ngAnnotate(Runner));
