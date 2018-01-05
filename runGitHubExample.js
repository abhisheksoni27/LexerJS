const fs = require('fs-extra')
const process = require('process');
const async = require('async');
const spawn = require('child_process').spawn;
const l = console.log;
const https = require('https');
const utility = require('./src/utility');
const tempDir = '.lexerJSTemp';

const ownerName = process.argv[2] ? process.argv[2] : 'prettier';
const repoName = process.argv[3] ? process.argv[3] : 'prettier';
let fileList = [];

// GitHub's endpoint:
// URL: https://api.github.com/repos/:owner/:repo/git/trees/:branch?recursive=1

const path = `https://api.github.com/repos/${ownerName}/${repoName}/git/trees/master?recursive=1`;

// Get files list
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

let commits = [];

// https.get(options, (res) => {

//     let error;

//     if (res.statusCode !== 200) {
//         error = new Error('Request Failed.\n' +
//             `Status Code: ${res.statusCode}`);
//     }

//     if (error) {
//         console.error(error.message);
//         res.resume();
//         return;
//     }

//     let data = "";
//     res.on("data", (chunk => {
//         data += chunk;
//     }));
//     res.on("end", () => {
//         console.log("ENDS");
//         selectJSFiles(data);
//         console.log(fileList);
//         async.detectLimit(fileList, 10, (file, callback) => {
//             checkCommitLength(file, callback);
//         }, (err, results) => {
//             console.log(results);
//         });
//         // downloadFile(fileName);
//     });
// });

let data = "";

fs.readFile("githubResults.json")
    .then((res) => {

        data = JSON.parse(res.toString());

        selectJSFiles(data);

        fileList = fileList.filter(el => el.startsWith("index.js"));
    })
    .then(() => {
        return fs.stat(tempDir)
    })
    .catch((err) => {
        // Create it
        return fs.mkdir(tempDir)
    })
    .then(() => {
        let file = fileList[0];
        // const commitPath = `https://api.github.com/repos/${ownerName}/${repoName}/commits?path=${file}`;
        // return utility.requestPromise(commitPath, (d) => commits.push(d));

        return fs.readFile('repoResults.json')
    })
    .catch(err => console.log(err))
    .then((res) => {
        // Now we have all the commits
        commits = JSON.parse(res);

        // async.each(commits, downloadFile, function (err) {
        //     if (err) throw err;
        // });

        // let testFileList = utility.findJSFiles(tempDir + '/');
        // return fs.writeFile('g-examples.json', JSON.stringify({ files: testFileList }));
    })
    .then(() => {
        // Config file saved
        const startTime = new Date();
        const lexerJS = spawn('lexerJS', ['g-examples.json', '-s']);

        lexerJS.stderr.on("data", (data) => console.log(data.toString()))
        lexerJS.stdout.on("data", (data) => console.log(data.toString()))
        lexerJS.on("close", () => {
            const endTime = new Date();
            console.log(`Total time taken: ${endTime - startTime}ms`);
        })

    })
    .catch(err => console.log(err));


// async.detectLimit(fileList, 10, (file, callback) => {
//     checkCommitLength(file, callback);
// }, (err, results) => {
//     fs.writeFileSync("repoResults.json", JSON.stringify(results));
// });



// function checkCommitLength(fileName, callback) {

//     console.log(`Processing ${fileName}`);
//     // GitHub's endpoint:
//     // https://api.github.com/repos/abhisheksoni27/codespell/commits?path=README.md
//     // URL: https://api.github.com/repos/:owner/:repo/commits?path=:path

//     const path = `https://api.github.com/repos/${ownerName}/${repoName}/commits?path=${fileName}`;

//     const iOpts = Object.assign({}, options, {
//         path: path
//     });

//     https.get(iOpts, (res) => {

//         if (res.statusCode !== 200) throw new Error(res.error);

//         let data = "";
//         res.on("data", (chunk => {
//             data += chunk;
//         }));
//         res.on("end", () => {
//             const commitLength = JSON.parse(data).length;
//             if (commitLength >= 20) {
//                 console.log(commitLength);
//                 callback(null, true)
//             } else {
//                 console.log(commitLength);
//                 callback(null, false);
//             }
//         });

//     });
// }


// Check if directory exists


function downloadFile(sha) {

    const path = `https://api.github.com/repos/${ownerName}/${repoName}/contents/${fileList[0]}?ref=${sha}`;

    const iOpts = Object.assign({}, options, {
        path: path,
        headers: Object.assign({}, options.headers, {
            Accept: "application/vnd.github.v3.raw",
        })
    });

    https.get(iOpts, (res) => {

        if (res.statusCode !== 200) throw (res.error);

        let data = "";
        res.on("data", (chunk => {
            data += chunk;
        }));

        res.on("end", () => {
            // Complete
            fs.writeFile(`${tempDir}/${fileList[0]}--${sha.slice(0, 7)}.js`, data)
                .catch(err => { throw err });
        });

    });
}

function selectJSFiles(data) {

    // const tree = JSON.parse(data).tree;
    const tree = data.tree;

    tree.forEach((element) => {
        let path = element.path;
        if (path.endsWith(".js") &&
            !(path.includes("dist")
                || path.includes("test")
                || path.includes("bin")
                || path.includes("build"))) {

            fileList.push(element.path);
        }
    });

    return;
}