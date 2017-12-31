const expect = require('expect.js');
const Lexer = require('../lexer.js');
const spawn = require('child_process').spawn;
const fs = require('fs');

// Download an github project
const tempDir = './zips';
const fileName = "chalk-2.3.0";
const folderLocation = tempDir + '/' + fileName + '/';
const downloadedFile = `${tempDir}/${fileName}.zip`;

// try {
//     if (!fs.statSync(tempDir)) fs.mkdir(tempDir);
// } catch (IOError) {
//     fs.mkdir(tempDir);
// }

// try {
//     if (fs.statSync(downloadedFile)) {
//         unzip(downloadedFile);
//     }

// } catch (IOError) {

//     try {
//         if (fs.statSync(folderLocation)) {
//             findJSFiles(folderLocation);
//         }

//     } catch (error) {
//         const downloadURL = "https://github.com/chalk/chalk/archive/v2.3.0.zip";

//         const wget = spawn('wget', [`-O`, downloadedFile, `${downloadURL}`]);

//         wget.stderr.on("data", (data) => {
//             console.log(data.toString());
//         })

//         wget.on('close', (code) => {
//             // File Downloaded
//             // Unzip
//             unzip(downloadedFile)

//         });
//     }
// }


// function unzip(fileName) {
//     const unzip = spawn('unzip', ['-o', fileName, "-d", tempDir]);

//     unzip.stderr.on("data", (data) => {
//         console.log(data.toString());
//     });

//     unzip.on("close", () => {
//         fs.unlinkSync(downloadedFile);
//     })
// }

/**
 * Credits: https://gist.github.com/kethinov/6658166
 */

// const fileList = (function findJSFiles(dir, fileList) {

//     let files = fs.readdirSync(dir);
//     fileList = fileList ? fileList : [];

//     files.forEach((file) => {

//         if (fs.statSync(dir + file).isDirectory()) {
//             fileList = findJSFiles(dir + file + '/', fileList);
//         }
//         else {
//             if (file.split(".").pop() === "js") fileList.push(dir + file);
//         }
//     });
//     return fileList;
// })(folderLocation);

// Copy files to a separate folder, and delete cloned project

// Test
// const LexerJS = new Lexer(fileList, {saveTokens:true});


console.log(LexerJS.longestCommonSequences())
describe('LexerJS - Tokenizer Check', () => {
})