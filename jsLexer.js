const rules = [
    { pattern: "/\S/g", name: "whitespace" },
    { pattern: /^\d+/, name: "digits" },
    { pattern: /^[a-zA-Z_]\w*/, name: "identifier" },
    { pattern: /^\+|\*|\/|\-/, name: "operator" },
    { pattern: /^\(/, name: "openbrace" },
    { pattern: /^\)/, name: "closebrace" },
    { pattern: /^=/, name: "equal" },
]

let pos = 0;
const buf = "for ( const i = 0; ) ";
const tokens = [];

while (pos < buf.length) {
    for (let i = 0; i < rules.length; i++){
        
    }
}
