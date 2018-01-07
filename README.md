# LexerJS

A lexical analyzer and longest common shared sequence finder between a list of JS files.

[![Build Status](https://travis-ci.com/abhisheksoni27/LexerJS.svg?token=cwN7xqik6Nx9bbtysewG&branch=master)](https://travis-ci.com/abhisheksoni27/LexerJS)

# Table of Contents

* [What It Does](#what-it-does)
* [Installation](#installation)
* [Running lexerJS](#running-lexerjs)
    - [JSON configruation](#json-configuration)
    - [CSV configruation](#csv-configuration)
* [Result](#result)
* [Options](#options)
* [Running Examples](#running-examples)
    - [Test Github Project](#test-github-project)
* [Tests](#tests)

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
![Results](https://raw.githubusercontent.com/abhisheksoni27/LexerJS/master/src/assets/result.png)

# Installation

You can download the module via ***npm***. (To install npm, which ships with node.js, you can download node from [nodejs.org](https://nodejs.org) for your OS.)

```bash
$ npm i -g lexerJS
```

Or, if you prefer ***yarn***

```bash
$ yarn global add lexerJS
```

That's it. 🎉

# Running lexerJS

To run it on your own set of files, you can either provide the files in CSV/JSON, or as command line arguments like this:

```bash
lexerJS test1.js test2.js
```

### JSON configuration
The **JSON** must have a key named `files` and it's value should be an array of the *paths* of files you want to test on.

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
./example/test2.js
```

# Result

The result contains the **longest common `shared` sequence** found between the set of files. The default format is JSON, but can be configured. (See options below.)

It also asssigns a score to each subsequnce using the following formula:

```js
score = log2(count) * log2(total)
```

**count**: Total number of occurences of the subsequence

**total**: Total number of tokens in the subsequence

## Options

#### **`-o`** `[default: json]`

lexerJS supports **JSON** as well as **CSV** output. JSON is the defualt output format if you do not specify any during invocation.

```bash
lexerJS test.json -o csv
```
> Output would now be a `CSV` file. To know what that file would contain, check out [result](#result).

#### **`-s`** `[default: false]`

This is a boolean option, which when set, saves the tokens for each test file.

```bash
lexerJS test.json -s
```

> It will generate a tokens folder, and save individual `tokens` for each file in that directory.

# Running Examples

The [examples](https://) directory contains a minimal example set that you can run lexerJS on. To do so, clone the repo, fire a terminal, and run:

```bash
npm install
```

This will downdload the dependencies. Then, run:

```bash
lexerJS test.json
```

This assumes that you already have lexerJS installed. If you don't, you can directly invoke the node script as follows:

```bash
node index.js test.json
```

As always, you must have `node` installed.

## Test GitHub project

The repo also contains a script to test lexerJS on any GitHub project. The script does the following:

1. Find all JS files in a project.
2. Select a file which has more than **n** commits. n is configurable.
3. Downloads the file at that point in time (when that commit was made).
4. Generates a configuration file for lexerJS.
5. Run lexerJS with that config file.

To run it, fire a terminal and run (assuming you are inside the project directory):

```bash
node runGitHubExamples.js --owner OWNERNAME --repo REPONAME -n 20
```

**`OWNERNAME`**: Owner of the repo `[default: prettier]`

**`REPONAME`**: Name of the repo `[default: prettier]`

**`n`**: Minimum commits the selected file must have `[default: 10]`

The results are saved in `result.json`. The command line [options](#options) for **lexerJS** can also be passed.

# Tests

To run tests, clone the repo (That green button above the repo contents) and run the following command:

```bash
npm install && npm run test
```

This will first download the dependencies, and then run the tests (using `mocha`) and output the result.
