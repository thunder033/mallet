import {IServiceProvider} from 'angular';
import {inject} from './';
import {MDT} from './mallet.dependency-tree';
import {EmbeddedStylesConfigProvider} from './embedded-styles/embbeded-styles.config';
import {EmbeddedStyle} from './embedded-styles/embedded-styles.library.config';

// tslint:disable-next-line
export interface IMalletConfig {}

export class MalletConfigProvider implements IServiceProvider {
    constructor(
        @inject.provider(MDT.config.EmbeddedStyles) private embeddedStylesConfig: EmbeddedStylesConfigProvider) {
    }

    public useStyle(id: EmbeddedStyle) {
        this.embeddedStylesConfig.useStyle(id);
    }

    public $get(): IMalletConfig {
        return {};
    }
}
