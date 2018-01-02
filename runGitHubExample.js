const fs = require('fs');

const exec = require('child_process').execSync;
const spawn = require('child_process').spawnSync;
const utility = require('./src/utility');
const tempDir = '.lexerJSTemp';
const script = `cd ${tempDir}`;
const ownerName = 'prettier';
const repoName = 'prettier';

// Clone project and git reset to a previous stage (commit)
try {
    if (!fs.statSync(tempDir)) {
        // Proceed
    }
} catch (error) {
    exec(`mkdir ${tempDir}`);
}

try {
    if (!fs.statSync(`${tempDir}/${repoName}`)) {
        // Clone

        // // Copy (for detached state)
        // exec(`cp -R ${dirName} ${dirName}-copied`);

        // // Detach
        // process.chdir(`${repoName}`);
        // exec(`git reset --hard HEAD~${backstep}`);
        // checkOutCommit(repoName, 15);
    }
} catch (error) {
    process.chdir(tempDir);
    console.log(`Cloning ${repoName}...`);
    exec(`git clone https://github.com/${ownerName}/${repoName}.git`);
    // Ignore
}

const cwd = process.cwd();
process.chdir(`${tempDir}/${repoName}`);

let files = utility.findJSFiles(process.cwd() + '/');

// Ignore file inside node_modules and also test files
files = files.filter((file) => {
    return !(file.indexOf("node_modules") > -1 || file.indexOf("tests") > -1);
});

// Pick a random file
let file  = files[utility.randomValue(0, files.length)];

// process.chdir(cwd);

// fs.writeFileSync('g-examples.json', JSON.stringify({files}));

// exec('lexerJS g-examples.json');

