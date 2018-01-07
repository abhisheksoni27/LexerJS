# lexer.js

A lexical analyzer and longest common shared sequence finder between a list of JS files.

[![Build Status](https://travis-ci.com/abhisheksoni27/lexer.js.svg?token=cwN7xqik6Nx9bbtysewG&branch=master)](https://travis-ci.com/abhisheksoni27/lexer.js)

# Table of Contents

* [What It Does](#what-it-does)
* [Installation](#installation)
* [Running lexer.js](#running-lexer.js)
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

<img alt="Test File 1" align="right" src ="https://raw.githubusercontent.com/abhisheksoni27/lexer.js/master/src/assets/test1.png">

```js
function add(a, b){
    return a + b;
}

const sum = add(11 + 11);
```

**`test2.js`**

<img alt="Test File 2" align="right" src ="https://raw.githubusercontent.com/abhisheksoni27/lexer.js/master/src/assets/test2.png">

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

![Results](https://raw.githubusercontent.com/abhisheksoni27/lexer.js/master/src/assets/result.png)

# Installation

You can download the module via ***npm***. (To install npm, which ships with node.js, you can download node from [nodejs.org](https://nodejs.org) for your OS.)

```bash
$ npm i -g lexer.js
```

Or, if you prefer ***yarn***

```bash
$ yarn global add lexer.js
```

That's it. 🎉

# Running lexer.js

To run it on your own set of files, you can either provide the files in CSV/JSON, or as command line arguments like this:

```bash
lexer.js test1.js test2.js
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

lexer.js supports **JSON** as well as **CSV** output. JSON is the defualt output format if you do not specify any during invocation.

```bash
lexer.js test.json -o csv
```
> Output would now be a `CSV` file. To know what that file would contain, check out [result](#result).

#### **`-s`** `[default: false]`

This is a boolean option, which when set, saves the tokens for each test file.

```bash
lexer.js test.json -s
```

> It will generate a tokens folder, and save individual `tokens` for each file in that directory.

# Running Examples

The [examples](https://) directory contains a minimal example set that you can run lexer.js on. To do so, clone the repo, fire a terminal, and run:

```bash
npm install
```

This will downdload the dependencies. Then, run:

```bash
lexer.js test.json
```

This assumes that you already have lexer.js installed. If you don't, you can directly invoke the node script as follows:

```bash
node index.js test.json
```

As always, you must have `node` installed.

## Test GitHub project

The repo also contains a script to test lexer.js on any GitHub project. The script does the following:

1. Find all JS files in a project.
2. Select a file which has more than **n** commits. n is configurable.
3. Downloads the file at that point in time (when that commit was made).
4. Generates a configuration file for lexer.js.
5. Run lexer.js with that config file.

To run it, fire a terminal and run (assuming you are inside the project directory):

```bash
node runGitHubExamples.js --owner OWNERNAME --repo REPONAME -n 20
```

**`OWNERNAME`**: Owner of the repo `[default: prettier]`

**`REPONAME`**: Name of the repo `[default: prettier]`

**`n`**: Minimum commits the selected file must have `[default: 10]`

The results are saved in `result.json`. The command line [options](#options) for **lexer.js** can also be passed.

# Tests

To run tests, clone the repo (That green button above the repo contents) and run the following command:

```bash
npm install && npm run test
```

This will first download the dependencies, and then run the tests (using `mocha`) and output the result.
