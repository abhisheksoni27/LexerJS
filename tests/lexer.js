const expect = require('expect.js');
const Lexer = require('../lexer.js');

const LexerJS = new Lexer();

describe('LexerJS - Tokenizer Check', () => {
    it('should find all tokens', () => {
        expect(LexerJS.tokenizer("a += c;").length).equal(5);        
        expect(LexerJS.tokenizer("for int i = 0;").length).equal(6);
        expect(LexerJS.tokenizer("const i = 0; i++;").length).equal(8);
        expect(LexerJS.tokenizer("for int > i = 0;").length).equal(7);
        expect(LexerJS.tokenizer("for int i = 0; \n i--;").length).equal(9);
    });

    it('should ignore single-line comments', () => {
        const tokens = LexerJS.tokenizer("//AWSOME\n\n for int i = 0; \n i--;");
        expect(tokens.length).equal(9);
    });

    it('should ignore multi-line comments', () => {
        const tokens = LexerJS.tokenizer(`/**
         * AWESOME
         * This is ignored
        */

        const a = 1;
        const b = 2;

        for(int i = 0;)
        `);

        expect(tokens.length).equal(18);
    });
})