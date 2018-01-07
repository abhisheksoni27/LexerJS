const expect = require('expect.js');
const lcs = require("../src/lcsbase");

describe('lexer.js - LCS Check', () => {
    it('should work with array sequences', () => {
        expect(lcs.lcs(["const", "a", "=", "11", "+", "33", ";"], ["const", "b", "=", "11", "+", "33", ";"])[0].join("")).equal("=11+33;");
    });

    it('should work with strings', () => {
        expect(lcs.lcs("ABCDALMN", "FBCDFLMN").length).equal(2);
        expect(lcs.lcs("ABCDALMN", "FBCDFLMN")[0].length).equal(3);
        expect(lcs.lcs("ABCDALMN", "FBCDFLMN")[1].length).equal(3);
    });

})

describe('lexer.js - Opimised LCS Check', () => {
    it('should work with array sequences', () => {
        expect(lcs.lcsOptimised(["const", "a", "=", "11", "+", "33", ";"], ["const", "b", "=", "11", "+", "33", ";"])[0].join("")).equal("=11+33;");
    });

    it('should work with strings', () => {
        expect(lcs.lcsOptimised("ABCDALMN", "FBCDFLMN").length).equal(2);
        expect(lcs.lcsOptimised("ABCDALMN", "FBCDFLMN")[0].length).equal(3);
        expect(lcs.lcsOptimised("ABCDALMN", "FBCDFLMN")[1].length).equal(3);
    });

})