import * as fs from 'fs';
import * as readline from 'readline';

const malletDeclaration = 'mallet-typings.d.ts';
const indexDeclartion = 'index.d.ts';
const distPath = './dist/';

const indexOut: string[] = [];

const reader = readline.createInterface({
    input: fs.createReadStream(`${distPath}${malletDeclaration}`),
});

const moduleDeclaration = /^declare module/;
const malletImport = /(import|export).+from 'mallet/;
const namespaceDeclaration = /export namespace/;
const blockTermination = /^[\s}]+$/;
const blockStart = /{$/;

function isExcluded(line: string) {
    return moduleDeclaration.exec(line) || malletImport.exec(line) || line === '}';
}

const identifiers = [];
const importLine = /import {(.*)} (.*)/;
const importRequire = /import (.*) = (.*)/;
function stripDuplicateDeclarations(line) {
    let importResult;
    if ((importResult = importLine.exec(line))) { // tslint:disable-line:no-conditional-assignment
        const imports = importResult[1].replace(/\s/g, '').split(',');
        const newImports = imports.filter((variable) => identifiers.indexOf(variable) === -1);
        Array.prototype.push.apply(identifiers, newImports);
        const importString = newImports.join(', ');
        return line.replace(importLine, `import {${importString}} $2`);
    } else if ((importResult = importRequire.exec(line))) { // tslint:disable-line:no-conditional-assignment
        const importName = importResult[1];
        if (identifiers.indexOf(importName) === -1) {
            identifiers.push(importName);
            return line;
        }

        return ''; // return an empty line if the import exists
    }

    return line;
}

/**
 * Since were stripping the module declarations, we have to "declare" constant in the global space
 * @param {string} line
 * @param {boolean} isAmbient
 * @returns {string}
 */
function declareConst(line: string, isAmbient: boolean) {
    const constLine = /^[\s}]+(const\s).+:/;
    if (!isAmbient && constLine.exec(line) !== null) {
        return line.replace(/const\s/, 'declare const ');
    }

    return line;
}

let blockLevel = 0;

/**
 * Determine if were inside of namespace declaration (in a super basic way)
 * @param line
 * @returns {boolean}
 */
function getIsAmbientContext(line): boolean {
    if (namespaceDeclaration.exec(line) || blockLevel > 0 && blockStart.exec(line)) {
        blockLevel++;
    }

    if (blockLevel > 0 && blockTermination.exec(line)) {
        blockLevel--;
    }

    return blockLevel > 0;
}

reader.on('line', (line) => {
    if (!isExcluded(line)) {
        const isAmbient: boolean = getIsAmbientContext(line);
        const finalLine = ([stripDuplicateDeclarations, declareConst] as Function[])
            .reduce((processedLine, processor) => processor(processedLine, isAmbient), line);
        indexOut.push(finalLine);
    }
});

reader.on('close', () => {
    const indexContext = indexOut.join('\n');
    fs.writeFileSync(`${distPath}${indexDeclartion}`, indexContext, {encoding: 'utf-8'});
});
