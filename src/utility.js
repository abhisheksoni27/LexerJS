/**
 * Utility Functions
 */

const fs = require('fs');
const tempDirName = '.lexerJStemp';
const https = require('https')
let options = {
    host: 'api.github.com',
    path: "",
    method: 'GET',
    headers: {
        Accept: "application/vnd.github.v3.json",
        Authorization: "token 07bebe6910646cac6448df4ed1faf13ca2d6b49c",
        'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    },
};

// Check if item exists in collection
function checkIfExists(collection, target) {
    let flag = false;
    for (let i = 0; i < collection.length; i++) {
        let item = collection[i];
        if (item.seq == target) return { exists: true, loc: i };
    }
    return { exists: false, loc: null };
}

function assignScore(sequences) {
    sequences.forEach((item) => {
        item.score = score(item); // for two decimal places 
    });

    sequence = sequences.sort((seqA, seqB) => {
        return seqA.total < seqB.total;
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

function saveJSON(data, name) {
    try {
        fs.writeFileSync(`${name}.json`, JSON.stringify(data));
    } catch (error) {
        return false;
    }

    return true;
}

function saveCSV(data, name) {

    const fileStream = fs.createWriteStream(`${name}.csv`);

    fileStream.once('open', function(fd) {

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

function findJSFiles(dir, fileList) {

    let files = fs.readdirSync(dir);
    fileList = fileList ? fileList : [];

    files.forEach((file) => {

        if (fs.statSync(dir + file).isDirectory()) {
            fileList = findJSFiles(dir + file + '/', fileList);
        } else {
            if (file.split(".").pop() === "js") fileList.push(dir + file);
        }
    });
    return fileList;
}

function randomValue(start, end) {
    return start + Math.round(Math.random() * end);
}

function getFileFromGithub(opts) {

    if (!opts.ownerName || !opts.repoName || !opts.fileName) return;

    return new Promise((resolve, reject) => {

        const https = require('https');
        let path = "";
        if (opts.sha) {
            path = `/repos/${opts.ownerName}/${opts.repoName}/contents/${opts.fileName}?ref=${opts.sha}`;
        } else {
            path = `/repos/${opts.ownerName}/${opts.repoName}/contents/${opts.fileName}`;
        }

        const options = {
            host: 'api.github.com',
            path: path,
            method: 'GET',
            headers: {
                Accept: " application/vnd.github.v3.raw",
                'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
            },
        };

        https.get(options, (res) => {
            if (res.statusCode !== 200) reject("HTTP ERROR - " + res.statusCode);
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on("end", () => {
                resolve(rawData);
            });
            res.on("error", (err) => { reject(err) });
        });
    });

}


function requestPromise(path, callback) {

    return new Promise((resolve, reject) => {

        if (!path) reject("Please provide a API path.");
        const iOpts = Object.assign({}, options, {
            path: path
        });

        https.get(iOpts, (res) => {

            if (res.statusCode !== 200) reject(err.error);

            let data = "";
            res.on("data", (chunk => {
                data += chunk;
            }));

            res.on("end", () => {
                data = JSON.parse(data);

                data.forEach((entry) => {
                    callback(entry.sha);
                });

                resolve();

            });

        });
    });
}

module.exports = {
    score,
    assignScore,
    checkIfExists,
    saveJSON,
    saveCSV,
    findJSFiles,
    randomValue,
    getFileFromGithub,
    requestPromise
}