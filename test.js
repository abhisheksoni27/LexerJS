const fs = require('fs');

function findJSFiles(dir, fileList) {

    let files = fs.readdirSync(dir);
    fileList = fileList ? fileList : [];

    files.forEach((file) => {
        
        if (fs.statSync(dir + file).isDirectory()) {
            console.log(fileList);
            fileList = findJSFiles(dir + file + '/', fileList);
        }
        else {
            fileList.push(file);
        }
    });
    return fileList;
}

console.log(findJSFiles('./.zips/'))