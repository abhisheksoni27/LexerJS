const fs = require('fs');
const process = require('process');
const async = require('async');

const l = console.log;
const https = require('https');
const utility = require('./src/utility');
const tempDir = '.lexerJSTemp';

const ownerName = process.argv[2] ? process.argv[2] : 'nodejs';
const repoName = process.argv[3] ? process.argv[3] : 'node';
const fileList = [];

// GitHub's endpoint:
// URL: https://api.github.com/repos/:owner/:repo/git/trees/:branch?recursive=1

const path = `https://api.github.com/repos/${ownerName}/${repoName}/git/trees/master?recursive=1`;

// Get files list
let options = {
    host: 'api.github.com',
    path: path,
    method: 'GET',
    headers: {
        Accept: "application/vnd.github.v3.json",
        Authorization: "token 07bebe6910646cac6448df4ed1faf13ca2d6b49c",
        'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    },
};

let usableFiles = [];

https.get(options, (res) => {

    let error;

    if (res.statusCode !== 200) {
        error = new Error('Request Failed.\n' +
            `Status Code: ${res.statusCode}`);
    }

    if (error) {
        console.error(error.message);
        res.resume();
        return;
    }

    let data = "";
    res.on("data", (chunk => { data += chunk; }));
    res.on("end", () => {

        selectJSFiles(data);
        console.log(fileList);
        async.detectLimit(fileList, 10, (file, callback) => {
            checkCommitLength(file, callback);
        }, (err, results) => {
            console.log(results);
        });
        // downloadFile(fileName);
    });
});

function selectUsableFile(data, file) {
    if (commitLength > 50) {
        usableFiles.push(file);
    }
}

function selectJSFiles(data) {

    const tree = JSON.parse(data).tree;

    tree.forEach((element) => {
        let path = element.path;
        if (path.endsWith(".js") &&
            !(path.includes("dist")
                || path.includes("test")
                || path.includes("build"))) {

            fileList.push(element.path);
        }
    });

    return;
}

function selectRandomFile() {
    const random = utility.randomValue(0, fileList.length);
    return fileList[random];
}

function checkCommitLength(fileName, callback) {

    console.log(`Processing ${fileName}`);
    // GitHub's endpoint:
    // https://api.github.com/repos/abhisheksoni27/codespell/commits?path=README.md
    // URL: https://api.github.com/repos/:owner/:repo/commits?path=:path

    const path = `https://api.github.com/repos/${ownerName}/${repoName}/commits?path=${fileName}`;
    const iOpts = Object.assign({}, options, {
        path: path
    });

    https.get(iOpts, (res) => {

        if (res.statusCode !== 200) throw new Error(res.error);

        let data = "";
        res.on("data", (chunk => { data += chunk; }));
        res.on("end", () => {
            const commitLength = JSON.parse(data).length;
            if (commitLength >= 20) {
                callback(null, true)
            } else {
                console.log(commitLength);
                callback(null, false);
            }
        });

    });
}

function downloadFile(fileName) {
    // Download File
}

// process.chdir(cwd);
// fs.writeFileSync('g-examples.json', JSON.stringify({ files: files.splice(0) }));

// const lx = spawn('lexerJS', ['g-examples.json', /*'-s'*/]);

// lx.stdout.pipe(process.stdou