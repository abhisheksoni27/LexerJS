const Lexer = require('./jsLexer');
const fs = require('fs') // For reading files

// To parse command line arguments
// 0: Shell command
// 1: file-name
// 2: Actual arguments
const args = process.argv.slice(2);

// This program only works if you provide one CSV file, 
// or many .js files. No other condition is checked.

const TokensOfFiles = [];

if (args.length == 0) throw Error("Please provide CSV file, or a list of JS files.")

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

TokensOfFiles.forEach((file) => {
    let fileString = fs.readFileSync(file.name).toString();
    file.tokens = Lexer.Lexer(fileString);
});

// In case you are interested to see the tokens.
// fs.writeFileSync('tokens.json', JSON.stringify(TokensOfFiles));

/**
 *  ######## Shared Sequence Algorithm #######
 */

const tokenLengthForFiles = [];

TokensOfFiles.forEach((file) => {
    tokenLengthForFiles.push(file.tokens.length);
});

function longestCommonSequences(tokenList) {

    const totalFiles = TokensOfFiles.length;
    const minTokenLength = Math.min(...tokenLengthForFiles);

    let iterator = minTokenLength;
    let result = [];
    const commonSequences = [];

    while (iterator > 0) {

        for (let i = 0; i < totalFiles; i++) {
            let currentFile = TokensOfFiles[i];
            for (let j = 0; j < totalFiles; j++) {

                //Same File
                if (i == j) break;

                let compareFile = TokensOfFiles[j];

                for (let k = 0; k < currentFile.tokens.length || k < compareFile.tokens.length; k++) {
                    let seqA = currentFile.tokens.slice(k, iterator);

                    // Because Score will be zero Anyway
                    if (seqA.join('').length == 0) break;

                    seqAJoined = addSlashes(seqA);
                    let seqB = compareFile.tokens.join("");
                    let match = new RegExp(seqAJoined, 'g').exec(seqB);
                    if (match) {
                        iFlag = false
                        // Check if exists in Result
                        for (let m = 0; m < result.length; m++) {

                            let item = result[m];

                            if (item.seq.join("") == match[0]) {
                                item.count++;
                                iFlag = true;
                                break;
                            }

                        }
                        if (!iFlag) result.push({ seq: seqA, count: 1, seqLength: seqA.length })
                    }

                }
            }

        }
        iterator--;

    }

    // We only need the longest Sequence, 
    // but the result contains all the sequences, 
    // which can be further used in other applications.
    let maxLength = result[0].seqLength;

    result.forEach((item) => {
        if (item.seqLength > maxLength) maxLength = item.seqLength;
    });

    // Filter the results where the sequence length is, indeed, maximum
    result = result.filter((item) => {
        return item.seqLength === maxLength;
    })

    // Calculate the Score as given in the Question:
    // score = log2(count) * log2(tokens)
    result.forEach((item) => {
        item.score = 0; 
    });

    return result;
}

const result = longestCommonSequences(TokensOfFiles);

fs.writeFileSync('results.json', JSON.stringify(result))


/**
 * Utility Functions
 */

// For Logging, because console.log is too long to type
function cl(...messages) {
    messages.forEach((message) => {
        console.log(message + "\n");
    })
}

function addSlashes(string) {
    // To escape characters required by RegExp
    return string.slice(0).join("")
        .replace(/\+/, /\+/)
        .replace(/\-/, /\-/)
        .replace(/\*/, /\\*/)
        .replace(/\(/, /\(/)
        .replace(/\)/, /\)/)
}