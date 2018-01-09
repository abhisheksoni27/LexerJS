const fs = require("fs-extra");
const process = require("process");
const async = require("async");
const spawn = require("child_process").spawn;
const https = require("https");
const path = require("path");

const LCSFinder = require("./src/main");
const utility = require("./src/utility");

const chalk = require("chalk");

/**
 *  CLI Setup
 */

const meow = require("meow");
const usageString = `
${chalk.yellow("Usage")};
$ node runGitHubExample.js --token TOKEN [options]

Options
${chalk.red("--owner")},  Owner of the repo (default: prettier)
${chalk.red("--repo")},  Name of the repo (default: prettier)
${chalk.red(
    "--min-commit"
  )}, -n Minimum commits the selected file must have (default: 10)
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
    saveTokens: {
      type: "boolean",
      alias: "s",
      default: false
    },
    output: {
      type: "string",
      alias: "o",
      default: "json"
    },
    "output-file": {
      type: "string",
      alias: "f",
      default: "result"
    },
    help: {
      alias: "h"
    },
    version: {
      alias: "v"
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
const saveTokens = cli.flags.s;
const output = cli.flags.o;

const tokenDir = path.join(process.cwd(), "tokens");
if (saveTokens) {
  fs.ensureDir(tokenDir);
}

if (!token) {
  let error = new Error(
    "Please supply an OAuth token for accessing GitHub's API"
  );
  throw error;
}

const log = console.log;
const tempDir = ".lexerJSTemp";
let fileList = [];
let commits = [];

// GitHub's endpoint for getting contents of a repo:
// URL: https://api.github.com/repos/:owner/:repo/git/trees/:branch?recursive=1

const gitHubPath = `https://api.github.com/repos/${ownerName}/${repoName}/git/trees/master?recursive=1`;

// Default Options
let options = {
  host: "api.github.com",
  path: "",
  method: "GET",
  headers: {
    Accept: "application/vnd.github.v3.json",
    Authorization: `token ${token}`,
    "user-agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)"
  }
};

fs
  .emptyDir(tempDir)
  .then(() => {
    log("Getting File List");
    return utility.requestPromise(gitHubPath, token);
  })
  .then(data => {
    log(`File list has been received. Processing,`);
    selectJSFiles(data);

    log(`Total JS Files: ${fileList.length}`);

    fileList = utility.shuffle(fileList);
    // Shuffle the file list so that differnt (and random) files are selected on every run.
    // This finds a file we can test. (based on maxCommits required)
    // The processing terminates as soon a file is found

    log("Checking commit length for each file.");
    return new Promise((resolve, reject) => {
      async.detectSeries(
        fileList,
        (file, callback) => {
          checkCommitLength(file, callback);
        },
        (err, results) => {
          if (err) reject();
          fileList = [results];
          log(`Processing done. File Selected: ${fileList}`);
          resolve();
        }
      );
    });
  })
  .then(() => {
    let file = fileList[0];

    const commitPath = `https://api.github.com/repos/${ownerName}/${repoName}/commits?path=${file}`;

    log("Processing Commits");

    return utility.requestPromise(commitPath, token);
  })
  .catch(err => console.log(err))
  .then(res => {
    // Now we have all the commits
    let response = JSON.parse(res);

    response.forEach(elem => {
      commits.push(elem.sha);
    });

    log(`Commits processed. Total commits: ${commits.length}`);

    return new Promise((resolve, reject) => {
      async.every(commits, downloadFile, function (err, result) {
        if (err) reject();
        resolve();
      });
    });
  })
  .then(() => {
    let testFileList = utility.findJSFiles(tempDir + "/");
    const startTime = new Date();
    log(`Processing files...`);
    const result = LCSFinder(testFileList, cli.flags);
    utility.saveResult(result, cli.flags.f, cli.flags.output);
    const endTime = new Date();
    console.log(`Total time taken: ${endTime - startTime}ms`);
  })
  .catch(err => console.log(err));

function checkCommitLength(fileName, callback) {
  // GitHub's endpoint for file contents:
  // URL: https://api.github.com/repos/:owner/:repo/commits?path=:path

  const path = `https://api.github.com/repos/${ownerName}/${repoName}/commits?path=${fileName}`;

  console.log(`Processing ${fileName}`);
  return utility.requestPromise(path, token).then(data => {
    const commitLength = JSON.parse(data).length;
    if (commitLength >= minCommits) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
}

function downloadFile(sha, callback) {
  log(`Downloading file for commit hash: ${sha.slice(0, 7)}`);
  const path = `https://api.github.com/repos/${ownerName}/${repoName}/contents/${
    fileList[0]
    }?ref=${sha}`;
  const extra = "application/vnd.github.v3.raw";

  return utility.requestPromise(path, token, { extra }).then(data => {
    fs
      .outputFile(`${tempDir}/${fileList[0]}--${sha.slice(0, 7)}.js`, data)
      .then(() => {
        callback(null, true);
      })
      .catch(() => {
        callback(null, false);
      });
  });
}

function selectJSFiles(data) {
  const tree = JSON.parse(data).tree;

  tree.forEach(element => {
    let path = element.path;
    if (
      path.endsWith(".js") &&
      !(
        path.includes("dist") ||
        path.includes("test") ||
        path.includes("bin") ||
        path.includes("build")
      )
    ) {
      fileList.push(element.path);
    }
  });

  return;
}
