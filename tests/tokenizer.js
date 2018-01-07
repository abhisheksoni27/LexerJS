const expect = require('expect.js');
const tokenizer = require('../src/tokenizer.js');

describe('lexer.js - Tokenizer Check', () => {
    it('should find all tokens', () => {
        expect(tokenizer("const a += c;").length).equal(5);
        expect(tokenizer("for int i = 0;").length).equal(6);
        expect(tokenizer("const i = 0; i++;").length).equal(8);
        expect(tokenizer("for int > i = 0;").length).equal(7);
        expect(tokenizer("for int i = 0; \n i--;").length).equal(9);
    });

    it('should ignore single-line comments', () => {
        const tokens = tokenizer("//AWSOME\n\n for int i = 0; \n i--;");
        expect(tokens.length).equal(9);
    });

    it('should ignore multi-line comments', () => {
        const tokens = tokenizer(`/**
        * AWESOME
        * This is ignored
        */
        
        const a = 1;
        const b = 2;
        
        for(int i = 0;)
        `);
        expect(tokens.length).equal(18);
    });

    it('should detect other characters such as $, #, ! etc.', () => {
        const tokens = tokenizer(`
        'use strict';
        const chalk = require('bleh');
        
        console.log(chalk.hex('#ff6159')('test'));        
        `);
        expect(tokens.length).equal(35);
    });

    it(`should ignore line breaks`, () => {

        const tokens = tokenizer(`
   
        var bleh = "?"
        var OPTIONS = [
            "printWidth",
            "tabWidth",
            "singleQuote",
            "trailingComma",
            "bracketSpacing",
            "jsxBracketSameLine",
            "parser",
            "semi",
            "useTabs",
            "insertPragma",
            "requirePragma",
            "proseWrap",
            "arrowParens",
            "doc",
            "ast",
            "output2"
        ];
        `);
        expect(tokens.length).equal(75);
    })
})