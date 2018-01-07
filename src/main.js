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
    
    options = {
        ...defaultOptions,
        ...options
    };

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
    saveResult(result, options.output);

}

// Save Result
function saveResult(result, ext) {
    const name = 'result';
    const saveStatus = (ext === "csv")
        ? utility.saveCSV(result, name)
        : utility.saveJSON(result, name)

    if (saveStatus) console.log(`Results successfully saved at ${__dirname}/${name}.${ext}`);
}

module.exports = LCSFinder;