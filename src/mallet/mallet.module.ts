// tslint:disable:no-var-requires
export const mallet = require('angular').module('mallet', [
    require('./core').malletCore.name,
    require('./utility-styles').utilityStyles.name,
]);
