# shell-parser

[![npm](https://img.shields.io/npm/v/shell-parser.svg?style=flat-square)](https://www.npmjs.com/package/shell-parser)

Parses a string similarly to how POSIX shells parse command lines into
arguments, and returns an array of strings that correspond to the parsed
arguments. Quoting and escaping are supported.

```js
const shellParser = require('shell-parser');
```

## Examples
```js
> shellParser('ab cd ef');
[ 'ab', 'cd', 'ef' ]
> shellParser('ab "cd ef"');
[ 'ab', 'cd ef' ]
> shellParser('a "" b');
[ 'a', '', 'b' ]
> shellParser("'a'\\''b'");
[ 'a\'b' ]
> shellParser('a "bc');
Thrown:
Error: Unterminated quote: "
    at quoted (/home/chris/dev/shell-parser/index.js:47:19)
    at shellParser (/home/chris/dev/shell-parser/index.js:88:18)
```
