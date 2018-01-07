const expect = require('expect.js');
const LCSFinder = require('../src/main');

const files = [
    "./example/test1.js",
    "./example/test2.js",
    "./example/test3.js",
    "./example/test4.js"
];

describe('lexer.js - LCSFinder Check', () => {
    it('should find correct sequences', () => {
        const result = LCSFinder(files);
        expect(result.length).to.be(2);

        result.forEach((item) => {
            if (item.total === 14) {
                expect(item.count).to.be(3)
            } else {
                expect(item.count).to.be(4)
            }
        })
    });
});