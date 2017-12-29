const rules = [
    { pattern: /^ +|\t|\n/g, name: "whitespace" },
    { pattern: /^\d+/, name: "digits" },
    { pattern: /^[a-zA-Z_]\w*/, name: "Identifiers" },
    { pattern: /^\+|\*|\/|\-/, name: "Operators" },
    { pattern: /^\(/, name: "openBracket" },
    { pattern: /^\)/, name: "closeBracket" },
    { pattern: /^\{/, name: "openBraces" },
    { pattern: /^\}/, name: "closeBraces" },
    { pattern: /^\{/, name: "openSquare" },
    { pattern: /^\}/, name: "closeSquare" },
    { pattern: /^=/, name: "equal" },
    { pattern: /^;/, name: "semicolon" }
]

let pos = 0;

// For Simplicity. Will expand this alter. TODO
const buffer = "for(const i=0;)";

const tokens = [];


while (pos < buffer.length) {
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i].pattern;
        const match = rule.exec(buffer.substr(pos))
        if (match) {

            // Ignore WhiteSpace
            if (i == 0) {
                pos += match[0].length;
                continue;
            }

            // Increment Postion
            pos += match[0].length;

            tokens.push(match[0])
        }
    }
}

console.log(tokens)