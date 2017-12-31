#!/usr/bin/env node
const Lexer = require('./lexer.js');
const fs = require('fs') // For reading files
const meow = require('meow');
const usageString = `
Usage
  $ lexerJS <Input: CSV or JSON file> [options]

Options
  --saveTokens, -s  Save found tokens in a JSON file
  --output, -o  JSON or CSV output

Examples
  $ foo input.csv --tokens
  TODO // ADD EXAMPLES
`;

const cli = meow(usageString, {
    flags: {
        saveTokens: {
            type: 'boolean',
            alias: 's',
            default: false
        },
        output: {
            type: 'string',
            alias: 'o',
            default: 'json'
        }
    }
});

// To show help when -h, or --help is passed
if (cli.flags.h) cli.showHelp([code = 0]);

// To show version number when -v, or --version is passed
if (cli.flags.v) cli.showVersion();

const fileList = [];

// Pre-Processing
if (cli.input.length == 0) {
    throw Error("Please provide CSV/JSON file, or a list of JS files.");
    process.exit(0);
}

if (cli.input.length > 1) {

    // JS Files
    for (let i = 0; i < cli.input.length; i++) {

        TokensOfFiles.push({
            name: cli.input[i],
            tokens: []
        });
    }

} else {

    const fileString = fs.readFileSync(cli.input[0]).toLocaleString(); // CSV File Contents
    const ext = cli.input[0].split('.').pop();
    // Need to check if the input file is a single JS file.
    if (ext === "js") {
        console.error("Please provide 2 or more JS files. Exiting!");
        process.exit(0)
    }
    const csv = ext === "csv" ? true : false;
    let files;

    // CSV file
    files = csv ? fileString.split("\n").slice(1) : JSON.parse(fileString).files;

    files.forEach((fileName) => {
        // To remove the delimiter
        cleanedName = csv ? fileName.substr(0, fileName.length - 1) : fileName;
        fileList.push(cleanedName);
    });
}

const options = {
    saveTokens: cli.flags.s,
}

const JSLexer = new Lexer(fileList, options);

result = JSLexer.longestCommonSequences()

console.log(result)