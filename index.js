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
fs.writeFileSync('results.json', JSON.stringify(TokensOfFiles));

/**
 *  ######## Shared Sequence Algorithm #######
 */

const tokenLengthForFiles = [];

TokensOfFiles.forEach((file) => {
    tokenLengthForFiles.push(file.tokens.length);
});

const totalFiles = TokensOfFiles.length;
const minTokenLength = Math.min(...tokenLengthForFiles);

let iterator = minTokenLength;

const result = [];

while (iterator > 0) {

    for (let i = 0; i < TokensOfFiles[0].tokens.length; i++) {
        
        let flag = false;
        let foundCount = 0;
        
        if (i + iterator <= TokensOfFiles[0].tokens.length) {
            
            let seqI = TokensOfFiles[0].tokens.slice(i, iterator);
            
            // File Loop
            for (let j = 1; j < totalFiles; j++) {
                let currentFile = TokensOfFiles[j];
                
                // Current File Tokens
                for (let k = 0; k < currentFile.tokens.length; k++) {
                    let seqK = currentFile.tokens.slice(k, minTokenLength);
                    
                    // Match Found
                    if (seqI.join("") == seqK.join("")) {
                        cl("here")
                        flag = true;
                        foundCount++;
                    } else {
                        flag = false;
                    }
                }
                // End of current file

            }

            if(flag){
                // Exists across all files
                result.push({seq: seqI, count:foundCount})
            }

        }

    }
    iterator--;

}

console.log(result);


// For Logging, because console.log is too long to type
function cl(...messages) {
    messages.forEach((message) => {
        console.log(message + "\n");
    })
}