# LexerJS

A lexical analyzer and longest common shared sequence finder between a list of JS files.

[![Build Status](https://travis-ci.com/abhisheksoni27/LexerJS.svg?token=cwN7xqik6Nx9bbtysewG&branch=master)](https://travis-ci.com/abhisheksoni27/LexerJS)

# What it does

Suppose, you have two files with the same function but different function calls:

**`test1.js`**

```js
function add(a, b){
    return a + b;
}

const sum = add(11 + 11);
```

**`test2.js`**

```js
function add(a, b){
    return a + b;
}

let sum = add(11 + 11);
```

The longest common shared sequence between these two files is the *entire function definition.*

**LCSS**

```js
function add(a, b){
    return a + b;
}
```

As you can see below, that's what this program finds.

![Test file 1](https://raw.githubusercontent.com/abhisheksoni27/LexerJS/master/src/assets/test1.png)

![Test file 2](https://raw.githubusercontent.com/abhisheksoni27/LexerJS/master/src/assets/test2.png)

![Results](https://raw.githubusercontent.com/abhisheksoni27/LexerJS/master/src/assets/results.png)

# Installation

You can download the module via ***npm***. (To install npm, which ships with node.js, you can download node from ![nodejs.org](nodejs.org) for your OS.)

```bash
$ npm i -g lexerJS
```

Or, if you prefer ***yarn***

```bash
$ yarn global add lexerJS
```

That's it. 🎉

# Running

To run it on your own set of files, you can either provide the files in CSV/JSON, or as command line arguments like this:

```bash
lexerJS test1.js test2.js
```

### JSON configuration
The JSON must have a key named `files` and it's value should be an array of the *paths* of files you want to test on.

```json
{
    "files": [
        "./example/test1.js",
        "./example/test2.js",
    ]
}
```

### CSV configuration

The **CSV** config file only has one header (or column) and is called `filename`. Each new line should contain the path of a source code file.

```csv
filename,
./example/test1.js,
./example/test2.js,
```

## Options

### **`-o`** `[default: json]`

lexerJS supports **JSON** as well as **CSV** output. JSON is the defualt output format if you do not specify any during invocation.

```bash
lexerJS test.json -o csv
```
> Output would now be a `CSV` file. To know what that file would contain, check out [result](#result).

### **`-s`** `[default: false]`

This is a boolean option, which when set, saves the tokens for each test file.

```bash
lexerJS test.json -s
```

> It will generate a tokens folder, and save individual tokens for each file in that directory.

# Test GitHub project

