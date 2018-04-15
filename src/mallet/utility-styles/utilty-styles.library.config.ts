import {inject} from '../lib/injector-plus';
import {MDT} from '../mallet.depedency-tree';
import {DTO, LibraryProvider, StaticSource} from '../core/library.provider';

export interface IStylesheetOptions {
    id: string;
    src: string;
}

export class StylesheetDTO extends DTO<StylesheetDTO> implements IStylesheetOptions {
    public id: string;
    public src: string;
}

const styleSheets = {
    'mallet-base': {
        id: 'mallet-base',
        src: `
    html, body, canvas {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
    }
    html, body {
        overflow: hidden;
    }
    .viewport-container {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        display: block;
    }`,
    },
};

export class MalletLibraryConfig {
    constructor(@inject.provider(MDT.Library) libraryProvider: LibraryProvider) {
        libraryProvider.addSources(StylesheetDTO, [new StaticSource(styleSheets)]);
    }
}
