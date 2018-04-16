import {inject} from '../lib/injector-plus';
import {MDT} from '../mallet.dependency-tree';
import {DTO, LibraryProvider, StaticSource} from '../core/library.provider';

export interface IStylesheetOptions {
    id: string;
    src: string;
}

export enum EmbeddedStyle {
    MalletBase = 'mallet-base',
    Debugger = 'debugger',
}

export class StylesheetDTO extends DTO<StylesheetDTO> implements IStylesheetOptions {
    public id: string;
    public src: string;
}

const styleSheets = {
    [EmbeddedStyle.MalletBase]: {
        id: 'mallet-base',
        // language=CSS
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
    [EmbeddedStyle.Debugger]: {
        id: 'debugger',
        // language=CSS
        src: `
.debugger {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vw;
    font-family: 'Courier New', monospace;
}
        
`,
    },
};

export class MalletLibraryConfig {
    constructor(@inject.provider(MDT.Library) libraryProvider: LibraryProvider) {
        libraryProvider.addSources(StylesheetDTO, [new StaticSource(styleSheets)]);
    }
}
