const lcsbase = require('./lcsbase');
const utility = require('./utility');

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
        for (let j = 0; j < totalFiles; j++) {
            
            //Same File
            if (i == j) break;
            let fileB = TokensOfFiles[j];

            let commonSequence = lcsbase.lcsOptimised(fileA.tokens, fileB.tokens);
            for (let k = 0; k < commonSequence.length; k++) {

                //Check if exists
                let iFlag = utility.checkIfExists(result, commonSequence[k]);
                // console.log(iFlag)
                if (iFlag.exists) {
                    let item = result[iFlag.loc];
                    item.count++;
                } else {
                    result.push({ seq: commonSequence[k], count: 2, total: commonSequence[k].length });
                }
            }
        }

    }

    result = utility.assignScore(result);

    return result;

}

module.exports = longestCommonSequences;