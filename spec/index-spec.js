'use strict';

describe('shell-parser', function () {
    const parse = require('..');

    // These tests are all basically the same thing, so here's a handy template
    // to reduce the boilerplate.
    function test(line, args) {
        it(`parses: [${line}]`, function () {
            expect(parse(line)).toEqual(args);
        });
    }

    function testFail(line) {
        it(`throws while parsing: ${line}`, function () {
            expect(() => parse(line)).toThrow();
        });
    }

    test('ab cd ef', ['ab', 'cd', 'ef']);
    test('ab cd ef ', ['ab', 'cd', 'ef']);
    test('  ab  cd  ef  ', ['ab', 'cd', 'ef']);
    test('ab "cd ef"', ['ab', 'cd ef']);
    test('ab cd\\ ef', ['ab', 'cd ef']);
    test('ab\\ncd', ['abncd']);
    test('a "doin\' a test" b', ['a', "doin' a test", 'b']);
    test('a "" b ""', ['a', '', 'b', '']);
    test("'a'\\''b'", ["a'b"]);
    test("'foo '\" bar\"", ['foo  bar']);
    test('', []);
    test(' ', []);
    test(' \\  ', [' ']);

    testFail('ab\\');
    testFail('a "bc');
    testFail("a 'bc");
});
