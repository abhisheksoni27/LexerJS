const fs = require('fs');
const path = require('path');
const lcs = require('./lcs');

class Lexer {
    constructor(files, options, rules) {

        //TODO: Will need type of lexeme for parser, so bring back the Types
        this.rules = rules ? rules : defaultRules;

        this.TokensOfFiles = [];

        this.files = files;

        this.totalFiles = 0;
        this.maxTokenLength = 0;
        this.tokenLengthForFiles = [];
        this.result = [];
        this.saveTokens = options ? options.saveTokens : false;

        if (this.saveTokens) {
            const tokenDir = __dirname + path.sep + "tokens";
            try {
                if (!fs.statSync(tokenDir)) {
                    fs.mkdirSync(tokenDir);
                }
            } catch (IOError) {
                fs.mkdirSync(tokenDir);
            }
        }
    }

    longestCommonSequences(files) {

        this._preProcess(files);

        //TODO: Try to separate some of the logic into private methods
        for (let i = 0; i < this.totalFiles; i++) {
            let fileA = this.TokensOfFiles[i];
            for (let j = 0; j < this.totalFiles; j++) {

                //Same File
                if (i == j) break;
                let fileB = this.TokensOfFiles[j];

                let commonSequence = lcs(fileA.tokens, fileB.tokens);
                for (let k = 0; k < commonSequence.length; k++) {

                    //Check if exists
                    let iFlag = checkIfExists(this.result, commonSequence[k]);
                    // console.log(iFlag)
                    if (iFlag.exists) {
                        let item = this.result[iFlag.loc];
                        item.count++;
                    } else {
                        this.result.push({ seq: commonSequence[k], count: 1, total: commonSequence[k].length });
                    }
                }
            }

        }

        // We only need the longest Sequence, 
        // but the result contains all the sequences, 
        // which can be further used in other applications.
        this.result = assignScore(this.result);

        return this.result;

    }

    _preProcess(files) {
        this.files = files ? files : this.files;
        if (!this.files) throw new Error('No File List Provided');

        this.files.forEach((file) => {
            this.TokensOfFiles.push({
                name: file, tokens: []
            });
        });

        this.totalFiles = this.TokensOfFiles.length;

        this.TokensOfFiles.forEach((file) => {
            let fileString = fs.readFileSync(file.name).toString();
            file.tokens = this.tokenizer(fileString, file.name);
            if (this.saveTokens) {
                try {
                    fs.writeFileSync(`tokens/${file.name.split('/').pop()}.json`, JSON.stringify(file.tokens));
                } catch (e) {
                    console.error(e);
                    process.exit(0);
                }
            }
        });

        this.TokensOfFiles.forEach((file) => {
            this.tokenLengthForFiles.push(file.tokens.length);
        });

        this.maxTokenLength = Math.max(...this.tokenLengthForFiles);
    }
}

/**
 * Functions defined outside the scope of the class mimic private properties/methods
 * in JavaScript, as there is no first-hand support for access modifiers.
 */

function checkIfExists(source, target) {
    let flag = false;
    for (let i = 0; i < source.length; i++) {
        let item = source[i];
        if (item.seq.join("") == target.join("")) return { exists: true, loc: i };
    }
    return { exists: false, loc: null };
}

function assignScore(sequences) {
    sequences.forEach((item) => {
        item.score = score(item); // for two decimal places 
    });
    return sequences;
}


/**
 * Calculate score for each sub-sequence
 * score = log2(count) * log2(tokens)
 */
function score(item) {
    return (Math.log2(item.count) * Math.log2(item.total)).toFixed(2);
}

/**
 * Utility Functions
 */

// For Logging, because console.log is too long to type
function cl(...messages) {
    messages.forEach((message) => {
        console.log(message + "\n");
    })
}

module.exports = Lexer;