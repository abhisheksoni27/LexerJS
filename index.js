#!/usr/bin/env node
const Lexer = require('./lexer.js');
const fs = require('fs') // For reading files
const meow = require('meow');

const cli = meow(`
    Usage
      $ lexerJS <Input: CSV or JSON file>
 
    Options
      --saveTokens, -s  Include a rainbow
      --output, -o  JSON or CSV output
 
    Examples
      $ foo input.csv --tokens
      🌈 unicorns 🌈
`, {
        flags: {
            saveTokens: {
                type: 'boolean',
                alias: 's'
            },
            output:{
                type:'string',
                alias: 'o'
            }
        }
    });

const TokensOfFiles = [];

if (args.length == 0) throw Error("Please provide CSV/JSON file, or a list of JS files.")

// Pre-Processing
if (args.length > 1) {

    // JS Files
    for (let i = 0; i < args.length; i++) {

        TokensOfFiles.push({
            name: `args${i}`,
            tokens: []
        });
    }

} else {

    // CSV file
    let fileString = fs.readFileSync(args[0]).toLocaleString(); // File Contents
    fileString = fileString.split("\n").slice(1)

    fileString.forEach((fileName) => {
        cleanedName = fileName.substr(0, fileName.length - 1); // To remove the delimiter
        TokensOfFiles.push({
            name: cleanedName, tokens: []
        })
    });
}

const JSLexer = new Lexer(TokensOfFiles);

result = JSLexer.longestCommonSequences()

console.log(result)