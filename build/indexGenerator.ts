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

const constLine = /^\s{2}const .+:/;
function declareConst(line) {
    if (constLine.exec(line) !== null) {
        return (`declare${line}`).replace(/\s+/, ' ');
    }

    return line;
}

reader.on('line', (line) => {
    if (!isExcluded(line)) {
        const finalLine = [stripDuplicateDeclarations, declareConst]
            .reduce((processedLine, processor) => processor(processedLine), line);
        indexOut.push(finalLine);
    }
});

reader.on('close', () => {
    const indexContext = indexOut.join('\n');
    fs.writeFileSync(`${distPath}${indexDeclartion}`, indexContext, {encoding: 'utf-8'});
});
