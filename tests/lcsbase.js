const expect = require('expect.js');
const lcs = require("../src/lcsbase");

describe('LexerJS - LCS Check', () => {
    it('should work with array sequences', () => {
        expect(lcs.lcs(["const", "a", "=", "11", "+", "33", ";"], ["const", "b", "=", "11", "+", "33", ";"])[0].join("")).equal("=11+33;");
    });

    it('should work with strings', () => {
        expect(lcs.lcs("ABCDA", "FBCDF")[0]).equal("BCD");
    });
})

describe('LexerJS - Opimised LCS Check', () => {
    it('should work with array sequences', () => {
        expect(lcs.lcsOptimised(["const", "a", "=", "11", "+", "33", ";"], ["const", "b", "=", "11", "+", "33", ";"])[0].join("")).equal("=11+33;");
    });

    it('should work with strings', () => {
        expect(lcs.lcsOptimised("ABCDA", "FBCDF")[0].join("")).equal("BCD");
    });
})