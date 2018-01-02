const exec = require('child_process').execSync;
const spawn = require('child_process').spawnSync;

const tempDir = '.lexerJSTemp';
const script = `cd ${tempDir}`;
const ownerName = 'hyperapp';
const repoName = 'hyperapp';

// Clone project and git reset to a previous stage (commit)
try {
    if (!fs.stat(tempDir)) {
        exec(`mkdir ${tempDir}`);
        exec(`cd ${tempDir}`);
    }
} catch (error) {
    // Directory Exists. Go on. Maybe, folder does too?

    try {
        if (fs.stat(`${tempDir}/${repoName}`)) {
            // Clone
            process.chdir(tempDir);
            console.log(`Cloning ${repoName}...`);
            exec(`git clone https://github.com/${ownerName}/${repoName}.git`);
            
            // Copy (for detached state)
            exec(`cp -R ${dirName} ${dirName}-copied`);
            
            // Detach
            process.chdir(`${repoName}`);
            exec(`git reset --hard HEAD~${backstep}`);
            checkOutCommit(repoName, 15);
        }
    } catch (error) {
        // Ignore
    }

}