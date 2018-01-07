const fs = require("fs-extra")
const process = require("process");
const async = require("async");
const spawn = require("child_process").spawn;
const https = require("https");

const utility = require("./src/utility");

const chalk = require('chalk');
const meow = require("meow");
const usageString = `
${chalk.yellow("Usage")};
$ node runGitHubExample.js --token TOKEN [options]

Options
${chalk.red("--owner")},  Owner of the repo (default: prettier)
${chalk.red("--repo")},  Name of the repo (default: prettier)
${chalk.red("--min-commit")}, -n Minimum commits the selected file must have (default: 10)
${chalk.red("--token")}, -t GitHub OAuth token
`;

const cli = meow(usageString, {
    flags: {
        owner: {
            type: "string",
            default: "prettier"
        },
        repo: {
            type: "string",
            default: "prettier"
        },
        "min-commit": {
            type: "string",
            alias: "n",
            default: 10
        },
        token: {
            type: "string",
            alias: "t"
        },
        help: {
            alias: 'h'
        },
        version: {
            alias: 'v'
        }
    },
    autoHelp: true,
    autoVersion: true,
    description: chalk.cyan("Run lexer.js on a GitHub project")
});

const ownerName = cli.flags.owner;
const repoName = cli.flags.repo;
const minCommits = cli.flags.n;
const token = cli.flags.t;

if (!token) {
    let error = new Error("Please supply an OAuth token for accessing GitHub's API");
    throw error;
}

const log = console.log;
const tempDir = ".lexerJSTemp";
let fileList = [];
let commits = [];

// GitHub's endpoint for getting contents of a repo:
// URL: https://api.github.com/repos/:owner/:repo/git/trees/:branch?recursive=1

const path = `https://api.github.com/repos/${ownerName}/${repoName}/git/trees/master?recursive=1`;

// Default Options
let options = {
    host: "api.github.com",
    path: "",
    method: "GET",
    headers: {
        Accept: "application/vnd.github.v3.json",
        Authorization: `token ${token}`,
        "user-agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
    },
};

log("Getting File List");
utility.requestPromise(path, token)
    .then((data) => {

        log(`File list has been received. Processing,`);
        selectJSFiles(data);

        log(`Total JS Files: ${fileList.length}`);

        // Shuffle the file list so that differnt (and random) files are selected on every run.
        fileList = utility.shuffle(fileList);
        // This finds a file we can test. (based on maxCommits required)
        // The processing terminates as soon a file is found

        log("Checking commit length for each file.");
        return new Promise((resolve, reject) => {
            async.detectSeries(fileList, (file, callback) => {
                checkCommitLength(file, callback);
            }, (err, results) => {
                if (err) reject();
                fileList = [results];
                log(`Processing done. File Selected: ${fileList}`)
                resolve();
            });
        })
    })
    .then(() => {
        log(`Making directory: ${__dirname}'/'${tempDir}`);

        return fs.stat(tempDir);
    })
    .catch((err) => {
        // Create it

        return fs.mkdir(tempDir)
    })
    .then(() => {
        log("Directory made");

        let file = fileList[0];

        const commitPath = `https://api.github.com/repos/${ownerName}/${repoName}/commits?path=${file}`;

        log("Processing Commits");

        return utility.requestPromise(commitPath, token);
    })
    .catch(err => console.log(err))
    .then((res) => {
        // Now we have all the commits
        let response = JSON.parse(res);
        response.forEach((elem) => {

            commits.push(elem.sha);
        });

        log(`Commits processed. Total commits: ${commits.length}`);

        return new Promise((resolve, reject) => {
            async.each(commits, downloadFile, function (err) {
                if (err) reject(err);
            });

            resolve();
        });
    })
    .then(() => {
        let testFileList = utility.findJSFiles(tempDir + "/");

        log(`Saving config file`);
        // Save config file
        return fs.writeFile("g-examples.json", JSON.stringify({ files: testFileList }));
    })
    .then(() => {
        const startTime = new Date();
        log("Processing g-examples.json");

        const lexerJS = spawn("lexerJS", ["g-examples.json", "-s"]);

        lexerJS.stderr.on("data", (data) => console.log(data.toString()))
        lexerJS.stdout.on("data", (data) => console.log(data.toString()))
        lexerJS.on("close", () => {
            const endTime = new Date();
            console.log(`Total time taken: ${endTime - startTime}ms`);
        })

    })
    .catch(err => console.log(err));


function checkCommitLength(fileName, callback) {

    // GitHub's endpoint for file contents:
    // URL: https://api.github.com/repos/:owner/:repo/commits?path=:path

    const path = `https://api.github.com/repos/${ownerName}/${repoName}/commits?path=${fileName}`;

    console.log(`Processing ${fileName}`);

    const iOpts = Object.assign({}, options, {
        path: path
    });

    https.get(iOpts, (res) => {

        if (res.statusCode !== 200) throw new Error(res.error);

        let data = "";
        res.on("data", (chunk => {
            data += chunk;
        }));
        res.on("end", () => {
            const commitLength = JSON.parse(data).length;
            if (commitLength >= minCommits) {
                callback(null, true)
            } else {
                callback(null, false);
            }

        });
    });
}

function downloadFile(sha) {
    log(`Downloading file for commit hash: ${sha.slice(0, 7)}`);

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

    const tree = JSON.parse(data).tree;

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