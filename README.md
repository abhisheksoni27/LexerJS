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

As you can see below, that's what this program finds.

![Test file 1](https://raw.githubusercontent.com/abhisheksoni27/LexerJS/master/src/assets/test1.png)

![Test file 2](https://raw.githubusercontent.com/abhisheksoni27/LexerJS/master/src/assets/test2.png)

![Results](https://raw.githubusercontent.com/abhisheksoni27/LexerJS/master/src/assets/results.png)

# Installation

# Options

# Copyright
