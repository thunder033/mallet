import {element, IDocumentService} from 'angular';
import {MDT} from '../mallet.dependency-tree';
import {Logger} from './logger';
import {CreateFactory} from './create-factory';

export interface IDynamicStylesheet {
    attach(): void;
}

/**
 * Attaches stylesheet created from dynamically loaded sources to the document
 */
export class DynamicStylesheet implements IDynamicStylesheet {
    constructor(
        private src: string,
        private $document: IDocumentService,
        private logger: Logger) {
    }

    /**
     * Attach the stylesheet to the document head
     */
    public attach() {
        this.logger.verbose('Attach stylesheet to document head');
        const style = element('<style type="text/css">').text(this.src);
        this.$document.find('head').append(style);
    }
}

/**
 * Some basic utility style classes need to be built in to streamline
 * bootstrapping a multi-media app, but we don't want make clients include an extra
 * link or add more build steps, so we'll just inject them into the document
 */
export class StylesheetFactory extends CreateFactory({
    $document: MDT.ng.$document,
    logger: MDT.Logger,
}, ({logger, $document}, {src}: {src: string}) => {
    return new DynamicStylesheet(src, $document, logger);
}) {}
