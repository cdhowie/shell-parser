'use strict';

function StringReader(str) {
    if (!(this instanceof StringReader)) {
        throw new Error('StringReader is a constructor');
    }

    this.str = str;
    this.pos = -1;
}

StringReader.prototype.next = function next() {
    if (this.pos < this.str.length) {
        this.current = this.str[++this.pos];
    }

    return this.current;
};

function isWhitespace(c) {
    return c === ' ';
}

function consumeWhitespace(r) {
    while (r.current !== undefined && isWhitespace(r.current)) {
        r.next();
    }
}

function escaped(r) {
    const n = r.next();
    if (n === undefined) {
        throw new Error('Unterminated escape sequence');
    }

    return n;
}

function quoted(r) {
    let s = '';

    const q = r.current;
    const e = q === '"';

    for (let c = r.next(); c !== q; c = r.next()) {
        if (c === undefined) {
            throw new Error(`Unterminated quote: ${q}`);
        }

        if (e && c === '\\') {
            s += escaped(r);
        } else {
            s += c;
        }
    }

    return s;
}

module.exports = function shellParser(line) {
    let args = [];
    let s = '';

    if (typeof line !== 'string') {
        throw new Error('line: Expected string');
    }

    const r = new StringReader(line);
    r.next();
    consumeWhitespace(r);

    // Indicates if we saw a quote in the current argument. This is necessary
    // to allow empty arguments ('' or ""), otherwise we have no way to
    // distinguish this case from nothing.
    let sawQuote = false;

    while (r.current !== undefined) {
        if (isWhitespace(r.current)) {
            args.push(s);
            sawQuote = false;
            s = '';

            consumeWhitespace(r);
        } else if (r.current == '\\') {
            s += escaped(r);
            r.next();
        } else if (r.current === "'" || r.current === '"') {
            s += quoted(r);
            sawQuote = true;
            r.next();
        } else {
            s += r.current;
            r.next();
        }
    }

    if (sawQuote || s.length) {
        args.push(s);
    }

    return args;
};
