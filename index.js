#!/usr/bin/env node
const LCSfinder = require('./src/longestCommonSequences');
const fs = require('fs-extra') // For reading files
const path = require('path');

const utility = require('./src/utility')
const tokenizer = require('./src/tokenizer');
const spawn = require('child_process').exec;
const chalk = require('chalk');
const meow = require('meow');
const usageString = `
Usage
$ lexer.js <Input: CSV or JSON file> [options]

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

const saveTokens = cli.flags.s;

const tokenDir = process.cwd() + path.sep + "tokens";
if (saveTokens) {
    fs.stat(tokenDir).catch((err) => { fs.mkdir(tokenDir) });
}

/**
 * TODO : Add Description
 */


// Pre-Processing
function preProcessFiles() {
    if (cli.input.length == 0) {
        throw Error("Please provide a CSV/JSON file, or a list of JS files.");
        process.exit(0);
    }

    const fileList = [];
    const TokensOfFiles = [];

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
            TokensOfFiles.push({
                name: cleanedName, tokens: []
            });
        });
    }

    // Find tokens for each file
    TokensOfFiles.forEach((file, i) => {

        try {
            let fileString = fs.readFileSync(file.name).toString();
            console.log(`Processing ${chalk.red(file.name)}.js, File ${chalk.green(i + 1)} out of ${chalk.blue(TokensOfFiles.length)}`)
            file.tokens = tokenizer(fileString, false);
        } catch (ReadError) {
            // console.log(ReadError);
            process.exit(1);
        }

        if (saveTokens) {
            console.log(`${tokenDir}/${file.name.split('/').pop()}.json`)
            fs.writeFile(`${tokenDir}/${file.name.split('/').pop()}.json`, JSON.stringify(file.tokens)).catch(err=>console.log();
        }
    });

    return TokensOfFiles;

}

function run() {
    const TokensOfFiles = preProcessFiles();
    // Find Longest Common Sequence
    const result = LCSfinder(TokensOfFiles);
    return result;
}

// Save Result
function saveResult(resutlt) {
    const outputFileExt = cli.flags.o;
    const name = 'result';
    const saveStatus = (outputFileExt === "csv")
        ? utility.saveCSV(result, name)
        : utility.saveJSON(result, name)

    if (saveStatus) console.log(`Results successfully saved at ${__dirname}/${name}.${outputFileExt}`);
}

const result = run();
saveResult(result);