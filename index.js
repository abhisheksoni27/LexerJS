#!/usr/bin/env node
const LCSfinder = require('./src/longestCommonSequences');
const fs = require('fs') // For reading files
const path = require('path');

const utility = require('./src/utility')
const tokenizer = require('./src/tokenizer');
const spawn = require('child_process').exec;
const chalk = require('chalk');
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

const saveTokens = cli.flags.s;
if (saveTokens) {
    const tokenDir = __dirname + path.sep + "tokens";
    try {
        if (!fs.statSync(tokenDir)) {
            fs.mkdirSync(tokenDir);
        }
    } catch (IOError) {
        fs.mkdirSync(tokenDir);
    }
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
            console.log(ReadError);
            process.exit(1);
        }

        if (saveTokens) {
            try {
                fs.writeFileSync(`tokens/${file.name.split('/').pop()}.json`, JSON.stringify(file.tokens));
            } catch (e) {
                console.error(e);
                process.exit(0);
            }
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
console.log(result);


// Display Results
console.log('\x1Bc');
let resultString = `${chalk.red('LexerJS')} - Results \n`;

result.forEach((el, i) => {
    resultString += `Result ${chalk.cyan(`#${i + 1}`)}\n\n`;
    el.loc.forEach((item) => {
        resultString += `File ${chalk.blue(i + 1)}: ${item}\t`;
    });
    resultString += "\n";
    resultString += `${chalk.yellow(result[i].seq)}\n\n`;
})

if (result.length > 1) {
    resultString += `${result.length} results found.\n`;
} else {
    resultString += `1 result found.\n`;
}


console.log(resultString);
saveResult(result);