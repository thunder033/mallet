import angular = require('angular');
import {StylesheetFactory} from '../lib/dynamic-stylesheet';
import {MDT} from '../mallet.dependency-tree';
import {inject, InjectableMethod, ngAnnotate, Run} from '../';
import {ILibraryService} from '../core/library.provider';
import {MalletLibraryConfig, StylesheetDTO} from './embedded-styles.library.config';
import {Runnable} from '../lib/create-factory';
import {malletCore} from '../core';
import {EmbeddedStylesConfigProvider, IEmbeddedStylesConfig} from './embbeded-styles.config';

/**
 * Embed basic utility styles in the app so client apps can just use them
 * @type {angular.IModule}
 */
export const embeddedStyles = angular.module('embedded-styles', [
    malletCore.name,
]);

embeddedStyles.factory(MDT.DynamicStylesheet, ngAnnotate(StylesheetFactory));
embeddedStyles.config(ngAnnotate(MalletLibraryConfig));
embeddedStyles.provider(MDT.config.EmbeddedStyles, ngAnnotate(EmbeddedStylesConfigProvider));

@Run(embeddedStyles) class Runner implements InjectableMethod {
    public exec(
        @inject(MDT.config.EmbeddedStyles) config: IEmbeddedStylesConfig,
        @inject(MDT.Library) library: ILibraryService,
        @inject(MDT.DynamicStylesheet) stylesheetFactory: Runnable<StylesheetFactory>): any {
        return config.getStyles().map((styleId) => library.get(StylesheetDTO, styleId)
            .then((dto) => stylesheetFactory(dto).attach()));
    }
}
