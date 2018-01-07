/**
 * Utility Functions
 */

const fs = require('fs');
const tempDirName = '.lexerJStemp';
const https = require('https');
const log = console.log;
let options = {
    host: 'api.github.com',
    path: "",
    method: 'GET',
    headers: {
        Accept: "application/vnd.github.v3.json",
        'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    },
};

// Check if item exists in collection
function checkIfExists(collection, target, files) {
    let foundLoc = 0;
    for (let i = 0; i < collection.length; i++) {
        let item = collection[i];
        if (item.seq.join("") == target.join("")) {
            // let locLength = item.loc.size;
            // files.forEach(file => item.loc.add(file));

            // if (locLength < item.loc.size) {
            // new Location
            // Increment
            foundLoc = i;
            return { exists: true, loc: foundLoc };
            // }

        }
    }
    return { exists: false, loc: foundLoc };
}

function setCount(item) {
    item.loc = [...item.loc];
    item.count = item.loc.length;
}

function assignScore(sequences) {

    sequences.forEach(setCount);

    sequences.forEach((item) => {
        item.score = score(item); // for two decimal places
    });

    sequences = sequences.filter(seq => seq.score > 0);

    sequences.forEach(seq => [...seq.loc]);

    sequences = sequences.sort((seqA, seqB) => {
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
        fs.writeFileSync(`${name}.json`, JSON.stringify(data, null, 4));
    } catch (error) {
        return false;
    }

    return true;
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
    });

    return true;
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

function requestPromise(path, token, extraOptions) {

    return new Promise((resolve, reject) => {
        if (!path) reject("Please provide a API path.");

        const iOpts = {
            ...options,
            path: path,
            headers: {
                ...options.headers,
                Authorization: `token ${token}`,
                Accept: extraOptions ? extraOptions.extra : "application/vnd.github.v3.json"
            }
        };

        https.get(iOpts, (res) => {

            if (res.statusCode !== 200) reject(err.error);

            let data = "";
            res.on("data", (chunk => {
                data += chunk;
            }));

            res.on("end", () => {
                resolve(data);
            });

        });
    });
}

// Save Result
function saveResult(result, outputFileName, ext) {
    const name = outputFileName;
    const nameExt = name.split(".").pop();

    // To check if the user provided a barebone name, or with exetension
    if (nameExt === "js" || nameExt === "csv") {
        ext = nameExt;
    }

    const saveStatus = (ext === "csv")
        ? saveCSV(result, name)
        : saveJSON(result, name)

    if (saveStatus) console.log(`Results successfully saved at ${__dirname}/${name}.${ext}`);
}

/**
 * A function to shuffle an array
 * Credits for the optimised version: https://stackoverflow.com/a/12646864/2231031
 */
function shuffle(collection) {
    for (let i = collection.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [collection[i], collection[j]] = [collection[j], collection[i]];
    }
    return collection;
}

module.exports = {
    score,
    assignScore,
    checkIfExists,
    saveJSON,
    saveCSV,
    findJSFiles,
    randomValue,
    requestPromise,
    saveResult,
    shuffle
}