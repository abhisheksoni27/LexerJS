const rules = [
    { pattern: "^ +|\t|\n/g", name: "whitespace" },
    { pattern: /^\d+/, name: "digits" },
    { pattern: /^[a-zA-Z_]\w*/, name: "identifier" },
    { pattern: /^\+|\*|\/|\-/, name: "operator" },
    { pattern: /^\(/, name: "openbrace" },
    { pattern: /^\)/, name: "closebrace" },
    { pattern: /^=/, name: "equal" },
    { pattern: /^;/, name: "semicolon" }
]

let pos = 0;

// For Simplicity. Will expand this alter. TODO
const buffer = "for(const i=0;)";

const tokens = [];

let rule = new RegExp(rules[i].pattern);

while (pos < buffer.length) {
    for (let i = 0; i < rules.length; i++) {
        const match = rule.exec(buffer.substr(pos))
        if (match) {

            // Ignore WhiteSpace
            if (i == 0) {
                pos += match[0].length;
                continue;
            }

            // Testing
            console.log(match[0])
            
            // Increment Postion
            pos += match[0].length;
        }
    }
}