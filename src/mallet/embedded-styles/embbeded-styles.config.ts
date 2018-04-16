import {IServiceProvider} from 'angular';
import {EmbeddedStyle} from './embedded-styles.library.config';
import bind from 'bind-decorator';

export interface IEmbeddedStylesConfig {
    getStyles(): string[];
}

export class EmbeddedStylesConfigProvider implements IServiceProvider {
    private readonly configuredStyles: string[];

    constructor() {
        this.configuredStyles = [];
    }

    public useStyle(id: EmbeddedStyle) {
        this.configuredStyles.push(id);
    }

    public $get(): IEmbeddedStylesConfig {
        return { getStyles: this.getConfiguredStyles };
    }

    @bind private getConfiguredStyles(): string[] {
        return this.configuredStyles;
    }
}
