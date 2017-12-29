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

module.exports = {
    Lexer
}