const rules = [
    { pattern: /^\s/, name: "WhiteSpace" },
    { pattern: /(^\/\*(.|\n)+\*\/)|(^\/\/.+)/, name: "Comments" },
    { pattern: /^[a-zA-Z_]\w*/, name: "Keywords|Identifiers" },
    { pattern: /^\d+/, name: "Digits" },
    { pattern: /^[']/, name: "SingleQuotes" },
    { pattern: /^["]/, name: "DoubleQuotes" },
    { pattern: /^[=]/, name: "Assign" },
    { pattern: /^[\/\\]/, name: "Slashes" },
    { pattern: /^\=\>/, name: "FatArrow" },
    { pattern: /^[;]/, name: "SemiColon" },
    { pattern: /^\.(?=\w+)/, name: "Dot" },
    { pattern: /^[\.\.]/, name: "DoubleDot" },
    { pattern: /^(\+\+)|(\-\-)/, name: "PlusPlusMinusMinus" },
    { pattern: /^\<\<|\>\>|[<>]|(\+\=)|(\-\=)|(\*\=)/, name: "Other Operators" },
    { pattern: /^[+\-*\/]/, name: "Operators" },
    { pattern: /^[[]/, name: "OpenBracket" },
    { pattern: /^[\]]/, name: "CloseBracket" },
    { pattern: /^[(]/, name: "OpenParen" },
    { pattern: /^[)]/, name: "CloseParen" },
    { pattern: /^[{]/, name: "OpenBraces" },
    { pattern: /^[}]/, name: "CloseBraces" },
    { pattern: /^[!]/, name: "ExclamationMark" },
    { pattern: /^[^]/, name: "C" },
    { pattern: /^\$/, name: "Dollar" },
    { pattern: /^[,]/, name: "Comma" },
    { pattern: /^[`]/, name: "TempalateLiteral" },
    { pattern: /^[#]/, name: "OtherCharacters" },
    { pattern: /^[?]/, name: "QuestionMark" },
    { pattern: /^\&\&/, name: "AND" },
    { pattern: /^[&]/, name: "Bit-AND" },
    { pattern: /^\|\|/, name: "OR" },
    { pattern: /^[|]/, name: "Bit-OR" },
    { pattern: /^[:]/, name: "Colon" },
    { pattern: /^[>]/, name: "GreaterThan" },
    { pattern: /^[<]/, name: "LessThan" },
];

function tokenizer(sourceCode, fileName) {
    let pos = 0;

    // For Simplicity. Will expand this alter. TODO
    const buffer = sourceCode;

    const tokens = [];
    let previousPos = pos;
    while (pos < buffer.length) {

        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            const match = rule.pattern.exec(buffer.substr(pos));

            if (match) {
                //Ignore WhiteSpace and Comments
                if (rule.name === "Comments" || rule.name === "WhiteSpace") {
                    pos += match[0].length;
                    previousPos = pos;
                    break;
                }
                pos += match[0].length;
                previousPos = pos;
                tokens.push(match[0]);
                break;
            }

            if (i === (rules.length - 1) && previousPos === pos) {
                console.log(`
Cannot find this lexeme in the language:

FileName: ${fileName} at ${pos}

buffer: ----> ${buffer.substr(pos, pos + 20)}

`);
                process.exit(-1);
            }
        }

    }

    return tokens;
}

module.exports = tokenizer;