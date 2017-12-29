// Take a union of Rules later. For Testing! TODO
const rules = [
    // {pattern:/\t+|\n+|\d+|([a-zA-Z_]\w*)|\;|\{|\}|\]|\[|\(|\)|\+|\-|\*|\/|( +)|\=|\'|\>|\<|\.(?=\w+)/g, name:'all'},
    { pattern: /^\s/, name: "WhiteSpace" },
    { pattern: /^\[/, name: "OpenBracket" },
    { pattern: /^\]/, name: "CloseBracket" },
    { pattern: /^\(/, name: "OpenParen" },
    { pattern: /^\)/, name: "CloseParen" },
    { pattern: /^\{/, name: "OpenBraces" },
    { pattern: /^\}/, name: "CloseBraces" },
    { pattern: /^\;/, name: "SemiColon" },
    { pattern: /^\=/, name: "Assign" },
    { pattern: /^\?/, name: "QuestionMark" },
    { pattern: /^\:/, name: "Colon" },
    { pattern: /^((\+\+)|(\-\-))/, name: "PlusPlusMinusMinus" },
    { pattern: /^\+|\-|\*|\//, name: "Operators" },
    { pattern: /^\>/, name: "digits" },
    { pattern: /^\</, name: "digits" },
    { pattern: /^\.(?=\w+)/, name: "Dot" },
    { pattern: /^\d+/, name: "Digits" },
    { pattern: /^[a-zA-Z_]\w*/, name: "Identifiers" },
    { pattern: /^[']/, name: "SingleQuotes" },
]

function Lexer(sourceCode) {

    let pos = 0;
    // skip_ws = new RegExp('\\S', 'g')

    // For Simplicity. Will expand this alter. TODO
    const buffer = sourceCode;

    const tokens = [];
    // console.log(buffer.substr(32))
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
                // Increment Postion
                pos += match[0].length;
                tokens.push(match[0]);
                console.log(match[0])
                // console.log(buffer.length, pos, buffer.substr(pos))
            }
        }
    }
    return tokens;

}

console.log(Lexer("for(const i.length = \t \n '0');"));

module.exports = {
    Lexer
}