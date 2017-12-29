// Take a union of Rules later. For Testing! TODO
// const rules = [
// { pattern: /^\s/, name: "WhiteSpace" },
// { pattern: /^\[/, name: "OpenBracket" },
// { pattern: /^\]/, name: "CloseBracket" },
// { pattern: /^\(/, name: "OpenParen" },
// { pattern: /^\)/, name: "CloseParen" },
// { pattern: /^\{/, name: "OpenBraces" },
// { pattern: /^\}/, name: "CloseBraces" },
// { pattern: /^\;/, name: "SemiColon" },
// { pattern: /^\=/, name: "Assign" },
// { pattern: /^\?/, name: "QuestionMark" },
// { pattern: /^\:/, name: "Colon" },
// { pattern: /^((\+\+)|(\-\-))/, name: "PlusPlusMinusMinus" },
// { pattern: /^\+|\-|\*|\//, name: "Operators" },
// { pattern: /^\>/, name: "digits" },
// { pattern: /^\</, name: "digits" },
// { pattern: /^\.(?=\w+)/, name: "Dot" },
// { pattern: /^\d+/, name: "Digits" },
// { pattern: /^[a-zA-Z_]\w*/, name: "Identifiers" },
// { pattern: /^[']/, name: "SingleQuotes" },
// { pattern: /^["]/, name: "DoubleQuotes" },
// { pattern: /^<|>|<<|>>|\+=|\-=|\*=/, name: "Other Operators" },
// { pattern: /^\=\>/, name: "FatArrow" },];

// Combined Pattern!

const rule = /(^\s+)|(^((\+\+)|(^\-\-)))|(^\+|\-|\*|\/)|(^\[)|(^\])|(^\?)|(^\=)|(^\()|(^\))|(^\\)|(^\})|(^\{)|(^\;)|(^\:)|(^\<)|(^[a-zA-Z_]\w*)|(^\d+)|(^\.(?=\w+))|(^["])|(^['])|(^\<|\>|\<\<|\>\>|\+\=|\-\=|\*\=)|(^\=\>)/;

function Lexer(sourceCode) {

    let pos = 0;

    // For Simplicity. Will expand this alter. TODO
    const buffer = sourceCode;

    let tokens = [];

    while (pos < buffer.length) {

        const match = rule.exec(buffer.substr(pos));

        if (match) {
            // Increment Postion
            pos += match[0].length;
            tokens.push(match[0]);
        }
    }

    // To remove WhiteSpace

    tokens = tokens.filter((token) => {
        const match = new RegExp(/\s+/).exec(token);
        if (match) {
            return false;
        }
        return true;
    });

    return tokens;

}


console.log(Lexer("for(let i = 0; i<1; i++){}"));

module.exports = {
    Lexer
}