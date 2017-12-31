const fs = require('fs');

exports.Lexer = class {
    constructor(TokensOfFiles, rule) {

        if (!TokensOfFiles) throw new Error('No File List Provided');

        this.rule = rule ? rule : /(^\s+)|(^((\+\+)|(^\-\-)))|(^\+|\-|\*|\/)|(^\[)|(^\])|(^\?)|(^\=)|(^\()|(^\))|(^\\)|(^\})|(^\{)|(^\;)|(^\:)|(^\<)|(^[a-zA-Z_]\w*)|(^\d+)|(^\.(?=\w+))|(^["])|(^['])|(^\<|\>|\<\<|\>\>|\+\=|\-\=|\*\=)|(^\=\>)/;
        ;

        this.TokensOfFiles = TokensOfFiles;
        this.totalFiles = this.TokensOfFiles.length;
        this.maxTokenLength = 0;
        this.tokenLengthForFiles = [];
        this.result = [];
    }

    tokenizer(sourceCode) {
        let pos = 0;

        // For Simplicity. Will expand this alter. TODO
        const buffer = sourceCode;

        let tokens = [];

        while (pos < buffer.length) {

            const match = this.rule.exec(buffer.substr(pos));

            if (match) {
                // Increment Postion
                pos += match[0].length;
                tokens.push(match[0]);
            }
        }

        // To remove WhiteSpace

        tokens = tokens.filter((token) => {
            const match = new RegExp(/\s+/).exec(token);
            if (match) {
                return false;
            }
            return true;
        });

        return tokens;
    }

    longestCommonSequences() {

        this.TokensOfFiles.forEach((file) => {
            let fileString = fs.readFileSync(file.name).toString();
            file.tokens = this.tokenizer(fileString);
        });

        this.TokensOfFiles.forEach((file) => {
            this.tokenLengthForFiles.push(file.tokens.length);
        });

        this.maxTokenLength = Math.max(...this.tokenLengthForFiles);

        let iterator = this.maxTokenLength;

        while (iterator > 0) {
            for (let i = 0; i < this.totalFiles; i++) {
                let currentFile = this.TokensOfFiles[i];
                for (let j = 0; j < this.totalFiles; j++) {
                    
                    //Same File
                    if (i == j) break;
                    
                    let compareFile = this.TokensOfFiles[j];
                    
                    for (let k = 0; k < currentFile.tokens.length || k < compareFile.tokens.length; k++) {
                        let seqA = currentFile.tokens.slice(k, iterator);
                        if (seqA.length < 2) break;
                        let seqB = compareFile.tokens;
                        this.result = compareFiles(seqA, seqB, iterator);
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


/**
 * 
 */

function compareFiles(seqA, seqB, iterator) {
    
    let seqAJoined = addSlashes(seqA);
    let seqBJoined = seqB.join("");
    let match = new RegExp(seqAJoined, 'g').exec(seqBJoined);
    
    // return first match
    return match[0];
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
    return string.slice(0).join("")
        .replace(/\+/, "\\+")
        .replace(/\+\+/, "\+\\+")
        .replace(/\-\-/, "\-\\-")
        .replace(/\*=/, "\*\\=")
        .replace(/\+=/, "\+\\=")
        .replace(/\-=/, "\-\\=")
        .replace(/\-/, "\\-")
        .replace(/\*/, "\\*")
        .replace(/\(/, "\\(")
        .replace(/\)/, "\\)")
        .replace(/\"/, "\\\"")
        .replace(/\'/, "\\\'")
}