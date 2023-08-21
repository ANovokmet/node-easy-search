#! /usr/bin/env node
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const cli = {
    '-glob': 'glob',
    '-r': 'regex',
    '-s': 'search',
    '-html': 'html',
}

const parameters = {
    glob: './**/*',
    regex: null,
    search: null,
    html: null,
}

for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (cli[arg]) {
        parameters[cli[arg]] = process.argv[i + 1];
    }
}

console.log(`Running with parameters: ${JSON.stringify(parameters)}`);

const fileNameRegex = parameters.regex && new RegExp(parameters.regex, 'g');
const searchRegex = parameters.search && new RegExp(parameters.search, 'g');

function countMatches(str) {
    return ((str || '').match(searchRegex) || []).length;
}
let fileCount = 0;
let searchCount = 0;
const files = [];
for(const f of glob.globIterateSync(parameters.glob, { dot: true })) {
    if (fileNameRegex) {
        if (!fileNameRegex.test(f)) {
            continue;
        }
    }

    if (searchRegex) {
        if (fs.statSync(f).isDirectory()) {
            continue;
        }

        try {
            const file = fs.readFileSync(f);
            const count = countMatches(file.toString());
            if (count) {
                console.log(`${f} (${count} matches)`);
                searchCount++;
                files.push({ 
                    path: path.resolve(f), 
                    name: f
                });
            }
        } catch(e) {
            console.error(`Error reading ${f}`);
        }
    } else {
        console.log(f);
        files.push({ 
            path: path.resolve(f), 
            name: f
        });
    }
    fileCount++;
}
console.log(`${fileCount} files searched`);

if (parameters.html) {
    fs.writeFileSync('results/results.html', `
        <html>
        <body>
        ${
            files.map(file => `<div><a href="file://${file.path}">${file.name}</a></div>`).join('\n')
        }
        </body>
        </html>
    `);

    require('child_process').exec('start results/results.html');
}

