import * as fs from 'fs';

const buildVersionFile = 'src/mallet/buildVersion.json';

if (fs.existsSync(buildVersionFile)) {
    const file = fs.readFileSync(buildVersionFile).toString();
    const versionContents = JSON.parse(file);
    versionContents.version++;
    fs.writeFileSync(buildVersionFile, JSON.stringify(versionContents));
} else {
    fs.writeFileSync(buildVersionFile, '{"version": 0}');
}
