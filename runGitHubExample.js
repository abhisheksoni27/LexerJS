const fs = require('fs');

const exec = require('child_process').execSync;
const spawn = require('child_process').spawn;
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
let files = [];
for (let i = 0; i <= 1; i++) {
    let path = `${tempDir}/test${i + 1}.js`;
    files.push(path);
    fs.writeFileSync(`../test${i + 1}.js`, exec(`git show HEAD~${parseInt(i)*20}:${file}`).toString());
}

process.chdir(cwd);

fs.writeFileSync('g-examples.json', JSON.stringify({files}));

const lx = spawn('lexerJS', ['g-examples.json', '-s']);

lx.stdout.pipe(process.stdout);

// process.chdir(cwd);

// fs.writeFileSync('g-examples.json', JSON.stringify({files}));

// exec('lexerJS g-examples.json');

