/**
 * LCS Problem: Solution Using Dynamic Programming, and Table Lookup
 * Finds the longest common substring between two sequences (Array or String)
 */

function lcs(seqA, seqB) {
    let longestCommonSequences = [];

    const lcsTable = new Array(seqA.length);
    const m = seqA.length, n = seqB.length;

    let maxLength = 0;

    for (let i = 0; i < m; i++) {
        lcsTable[i] = new Array(seqB.length).fill(0);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (seqA[i] === seqB[j]) {
                if (i === 0 || j === 0) {
                    lcsTable[i][j] = 1;
                }
                else {
                    lcsTable[i][j] = lcsTable[i - 1][j - 1] + 1;
                }

                if (lcsTable[i][j] > maxLength) {
                    maxLength = lcsTable[i][j];
                }

            }
        }
    }

    for (let i = 0; i < m; i++) {
        let str = "";
        for (let j = 0; j < n; j++) {
            if (lcsTable[i][j] === maxLength) {
                if (seqA instanceof String) {
                    str = seqA.substr(i - maxLength + 1, i + 1);

                } else {
                    str = seqA.slice(i - maxLength + 1, i + 1)
                }
                longestCommonSequences.push(str);
            }
        }
    }

    return longestCommonSequences;
}

module.exports = lcs;