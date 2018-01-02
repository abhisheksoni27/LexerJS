const fs = require('fs');

const exec = require('child_process').execSync;
const spawn = require('child_process').spawn;
const utility = require('./src/utility');
const tempDir = '.lexerJSTemp';
const script = `cd ${tempDir}`;
const ownerName = 'prettier ';
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

    }
} catch (error) {
    // Clone
    process.chdir(tempDir);
    console.log(`Cloning ${repoName}...`);
    exec(`git clone https://github.com/${ownerName}/${repoName}.git`);
}

const cwd = process.cwd();
process.chdir(`${tempDir}/${repoName}`);

let fileList = utility.findJSFiles(process.cwd() + '/');

// Ignore file inside node_modules and also test files
fileList = fileList.filter((file) => {
    return !(file.indexOf("node_modules") > -1 || file.indexOf("tests") > -1 || file.indexOf("build") > -1);
});

// git show only works with relative paths
let name = new RegExp(`(.*\/.*)*\/${tempDir}\/${repoName}\/`);

// Pick a random file
let file = fileList[utility.randomValue(0, fileList.length)];
let index = name.exec(file)[0].length;
file = file.slice(index);

// Save two different versions of the file
let files = [...fileList];

process.chdir(cwd);
fs.writeFileSync('g-examples.json', JSON.stringify({ files:files.splice(0) }));

const lx = spawn('lexerJS', ['g-examples.json', /*'-s'*/]);

lx.stdout.pipe(process.stdout);