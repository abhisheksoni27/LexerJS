/**
 * Utility Functions
 */

 const fs = require('fs');

// Check if item exists in collection
function checkIfExists(collection, target) {
    let flag = false;
    for (let i = 0; i < collection.length; i++) {
        let item = collection[i];
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


// For Logging, because console.log is too long to type
function cl(...messages) {
    messages.forEach((message) => {
        console.log(message + "\n");
    })
}

function saveJSON(data, name) {
    fs.writeFileSync(`${name}.json`, JSON.stringify(data))
}

function saveCSV(data, name) {

    const fileStream = fs.createWriteStream(`${name}.csv`);

    fileStream.once('open', function (fd) {

        fileStream.write("score,tokens,count,“sourcecode”\n");
        data.forEach((item) => {
            let str = "";
            let del = ",";
            str += item.score + del;
            str += item.seq.length + del;
            str += item.count + del;
            str += JSON.stringify(item.seq);

            str += "\n";
            fileStream.write(str);
        });
        fileStream.end();
        return true;
    });

    return false;
}

module.exports = {
    score, cl, assignScore, checkIfExists, saveJSON, saveCSV
}