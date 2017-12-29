const bleh = require('bleh');

for (let i = 0; i < 17; i++) {
    console.log(awesome.time + i);
}


function Lexer(sourceCode) {

    const buffer = sourceCode;

    const tokens = [];
    while (pos < buffer.length) {

        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            const match = rule.pattern.exec(buffer.substr(pos));


            if (match) {
                if (rule.name == "WhiteSpace") {
                    console.log(' ')
                    pos += match[0].length;
                    continue;
                }
                pos += match[0].length;
                tokens.push(match[0]);
                console.log(match[0])
            }
        }
    }
    return tokens;

}

module.exports = {
    Lexer
}