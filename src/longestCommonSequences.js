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
        for (let j = 1; j < totalFiles; j++) {

            //Same File
            if (i == j) break;
            let fileB = TokensOfFiles[j];
            console.log(`Comparing File ${chalk.red(fileA.name)} and ${chalk.blue(fileB.name)}`);
            let commonSequence = lcsbase.lcsOptimised(fileA.tokens, fileB.tokens);
            for (let k = 0; k < commonSequence.length; k++) {

                //Check if exists
                let iFlag = utility.checkIfExists(result, commonSequence[k]);
                // console.log(iFlag)
                if (iFlag.exists) {
                    let item = result[iFlag.loc];
                    item.count++;
                    item.loc.add(fileB.name);
                    item.loc.add(fileA.name);
                } else {
                    result.push({ seq: commonSequence[k], count: 2, total: commonSequence[k].length, loc: new Set([fileB.name, fileA.name]) });
                }
            }
        }

    }

    result = utility.assignScore(result);


    return result;

}

module.exports = longestCommonSequences;