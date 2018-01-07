#!/usr/bin/env node
const fs = require('fs-extra') // For reading files
const path = require('path');
const LCSfinder = require('./src/main');
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
--output-file, -f Output file name
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
        },
        "output-file": {
            type: 'string',
            alias: 'f',
            default: 'result'
        },
        help: {
            alias: 'h'
        },
        version: {
            alias: 'v'
        }
    },
    autoHelp: true,
    autoVersion: true,
});

// Exit if no input is provied
if (cli.input.length == 0) {
    let error = Error(chalk.red("Please provide a CSV/JSON file, or a list of JS files."));
    throw error;
}

// Check if unsupported output extension type is given
if (cli.flags.output !== "json" && cli.flags.output !== "csv") {
    let error = Error(chalk.red("Unsupported output extension. Only JSON/CSV is supported."));
    throw error;
}

const saveTokens = cli.flags.saveTokens;

const tokenDir = path.join(process.cwd(), "tokens");
if (saveTokens) {
    fs.stat(tokenDir)
        .catch((err) => {
            // It means directory doesn't exist.
            fs.mkdir(tokenDir)
        });
}

const fileList = [];

if (cli.input.length > 1) {

    // JS Files
    for (let i = 0; i < cli.input.length; i++) {
        fileList.push(cli.input[i]);
    }

} else {

    const fileString = fs.readFileSync(cli.input[0]).toLocaleString(); // CSV File Contents
    const ext = cli.input[0].split('.').pop();

    // Need to check if the input file is a single JS file.
    if (ext === "js") {
        let error = "Please provide 2 or more JS files. Exiting!";
        throw error;
    }

    const csv = ext === "csv" ? true : false;
    let filePaths;

    // CSV file
    filePaths = csv ? fileString.split("\n").slice(1) : JSON.parse(fileString).files;

    filePaths.forEach((filePath) => {
        let cleanedPath = filePath;
        // To remove the delimiter

        if (filePath.endsWith(",")) {
            cleanedPath = filePath.substr(0, filePath.length - 1);
        }

        fileList.push(cleanedPath);
    });
}

LCSfinder(fileList, cli.flags);