const LCS = require('./longestCommonSequences');
const utility = require('./utility');
const tokenizer = require('./tokenizer');

const fs = require('fs-extra');
const chalk = require('chalk');

// For details, see index.js
const defaultOptions = {
    output: "json",
    saveTokens: false,
    fileName: "result"
}

function LCSFinder(files, options) {
    const TokensOfFiles = [];

    options = Object.assign({}, defaultOptions, options);

    files.forEach(file => {
        TokensOfFiles.push({
            name: file,
            tokens: []
        });
    });

    // Find tokens for each file
    TokensOfFiles.forEach((file, i) => {

        let fileString = fs.readFileSync(file.name).toString();
        console.log(`Processing ${chalk.red(file.name)}.js, File ${chalk.green(i + 1)} out of ${chalk.blue(TokensOfFiles.length)}`)
        file.tokens = tokenizer(fileString, false);

        if (options.saveTokens) {
            fs.writeFile(`${tokenDir}/${file.name.split('/').pop()}.json`, JSON.stringify(file.tokens)).catch(err => console.log(err));
        }
    });

    const result = LCS(TokensOfFiles);
    return result;

}

module.exports = LCSFinder;