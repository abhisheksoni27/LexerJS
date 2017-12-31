const fs = require('fs');
const path = require('path');

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

    tokenizer(sourceCode, fileName) {
        let pos = 0;

        // For Simplicity. Will expand this alter. TODO
        const buffer = sourceCode;

        let tokens = [];
        let previousPos = pos;
        while (pos < buffer.length) {

            for (let i = 0; i < this.rules.length; i++) {
                const rule = this.rules[i];
                const match = rule.pattern.exec(buffer.substr(pos));

                if (match) {
                    //Ignore WhiteSpace and Comments
                    if (rule.name === "Comments" || rule.name === "WhiteSpace") {
                        pos += match[0].length;
                        previousPos = pos;
                        break;
                    }
                    pos += match[0].length;
                    previousPos = pos;
                    tokens.push(match[0]);
                    break;
                }

                if (i === (this.rules.length - 1) && previousPos === pos) {
                    console.log(`
Cannot find this lexeme in the language:

FileName: ${fileName} at ${pos}

buffer: ----> ${buffer.substr(pos, pos + 20)}

`);
                    process.exit(-1);
                }
            }

        }

        return tokens;
    }

    longestCommonSequences(files) {

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

        let iterator = this.maxTokenLength;
        //TODO: Try to separate some of the logic into private methods
        while (iterator > 0) {
            for (let i = 0; i < this.totalFiles; i++) {
                let fileA = this.TokensOfFiles[i];
                for (let j = 0; j < this.totalFiles; j++) {

                    //Same File
                    if (i == j) break;

                    let fileB = this.TokensOfFiles[j];
                    for (let k = 0; k < fileA.tokens.length || k < fileB.tokens.length; k++) {
                        let seqA = fileA.tokens.slice(k, iterator);

                        // Because score will be zero, anyway
                        if (seqA.length < 2) break;

                        let seqB = fileB.tokens;
                        let match = compareSequences(seqA, seqB);

                        if (match) {
                            let iFlag = false;
                            // Check if exists in Result
                            for (let m = 0; m < this.result.length; m++) {

                                let item = this.result[m];
                                if (item.seq.join("") === match) {
                                    item.count++;
                                    iFlag = true;
                                    break;
                                }

                            }

                            if (!iFlag) {
                                this.result.push({ seq: seqA, count: 1, total: seqA.length });
                            }
                        }
                    }
                }

            }
            iterator--;

        }

        // We only need the longest Sequence, 
        // but the result contains all the sequences, 
        // which can be further used in other applications.
        this.result = getMaxLengthSequence(this.result);

        return this.result;

    }
}

/**
 * Functions defined outside the scope of the class mimic private properties/methods
 * in JavaScript, as there is no first-hand support for access modifiers.
 */

function compareSequences(seqA, seqB) {

    let seqAJoined = addSlashes(seqA);
    let seqBJoined = addSlashes(seqB);

    let match = new RegExp(seqAJoined, 'gm').exec(seqBJoined);
    // return first match if exists
    if (match) return match[0];

    return;
}

/**
 * Takes an array of sequences, and returns the sequence 
 * with maximum length. 
 * 
 * Also adds score to each max-length sequence.
 */
function getMaxLengthSequence(sequences) {
    try {
        let maxLength = sequences[0].total;

        sequences.forEach((item) => {
            if (item.total > maxLength) maxLength = item.total;
        });
        // Filter the results where the sequence length is, indeed, maximum
        sequences = sequences.filter((item) => {
            // return true;
            return item.total === maxLength;
        });

        // Calculate the score for each sequence
        sequences.forEach((item) => {
            item.score = score(item); // for two decimal places 
        });

        return sequences;

    } catch (error) {
        console.log(error);
        return;
    }
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

function addSlashes(string) {
    // To escape characters required by RegExp
    return string.slice(0).join("").replace(/[.*+?^${}`~()|[\]\\]/g, "\\$&");
}

function str(obj) {
    return JSON.stringify(obj);
}

const defaultRules = [
    { pattern: /^\s/, name: "WhiteSpace" },
    { pattern: /(^\/\*(.|\n)+\*\/)|(^\/\/.+)/, name: "Comments" },
    { pattern: /^\'(.+)?\'/, name: "SingleQuotes" },
    { pattern: /^\"(.+)?\"/, name: "DoubleQuotes" },
    { pattern: /^[a-zA-Z_]\w*/, name: "Keywords|Identifiers" },
    { pattern: /^[=]/, name: "Assign" },
    { pattern: /^\d+/, name: "Digits" },
    { pattern: /^[\/\\]/, name: "Slashes" },
    { pattern: /^\=\>/, name: "FatArrow" },
    { pattern: /^[[]/, name: "OpenBracket" },
    { pattern: /^[\]]/, name: "CloseBracket" },
    { pattern: /^[(]/, name: "OpenParen" },
    { pattern: /^[)]/, name: "CloseParen" },
    { pattern: /^[{]/, name: "OpenBraces" },
    { pattern: /^[}]/, name: "CloseBraces" },
    { pattern: /^[;]/, name: "SemiColon" },
    { pattern: /^[!]/, name: "ExclamationMark" },
    { pattern: /^[^]/, name: "C" },
    { pattern: /^\<\<|\>\>|[<>]|\+=|\-=|\*=/, name: "Other Operators" },
    { pattern: /^\$/, name: "Dollar" },
    { pattern: /^[,]/, name: "Comma" },
    { pattern: /^[`]/, name: "TempalateLiteral" },
    { pattern: /^[#]/, name: "OtherCharacters" },
    { pattern: /^[?]/, name: "QuestionMark" },
    { pattern: /^[:]/, name: "Colon" },
    { pattern: /^\+\+|--/, name: "PlusPlusMinusMinus" },
    { pattern: /^[+\-*\/]/, name: "Operators" },
    { pattern: /^[>]/, name: "GreaterThan" },
    { pattern: /^[<]/, name: "LessThan" },
    { pattern: /^\.(?=\w+)/, name: "Dot" },
    { pattern: /^[..]/, name: "DoubleDot" },
];

module.exports = Lexer;