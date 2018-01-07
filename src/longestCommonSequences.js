const lcsbase = require('./lcsbase');
const utility = require('./utility');
const chalk = require('chalk');

function longestCommonSequences(TokensOfFiles) {

    const totalFiles = TokensOfFiles.length;
    const tokenLengthForFiles = [];

    TokensOfFiles.forEach((file) => {
        tokenLengthForFiles.push(file.tokens.length);
    });

    const maxTokenLength = Math.max(...tokenLengthForFiles);
    let result = [];
    for (let i = 0; i < totalFiles; i++) {
        let fileA = TokensOfFiles[i];
        for (let j = i + 1; j < totalFiles; j++) {

            //Same File
            if (i == j) continue;
            let fileB = TokensOfFiles[j];
            console.log(`Comparing File ${chalk.red(fileA.name)} and ${chalk.blue(fileB.name)}`);
            let commonSequence = lcsbase.lcsOptimised(fileA.tokens, fileB.tokens);

            for (let k = 0; k < commonSequence.length; k++) {

                //Check if exists
                let iFlag = utility.checkIfExists(result, commonSequence[k]);

                if (iFlag.exists) {
                    let item = result[iFlag.loc];
                    item.count++;
                    item.loc.add(fileA.name);
                    item.loc.add(fileB.name);
                } else if (!iFlag.loc) {
                    // Currently, if we have to reduce the second loop size 
                    // (and avoid redundant comparisons), we cannot set count to 2
                    // as it leads to incrementing it for already matched sequences.

                    result.push({ seq: commonSequence[k], total: commonSequence[k].length, loc: new Set([fileB.name, fileA.name]) });
                }
            }
        }

    }

    result = utility.assignScore(result);

    return result;

}

module.exports = longestCommonSequences;