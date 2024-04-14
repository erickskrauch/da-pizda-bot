import { splitByGlyph, normalizeString } from './unicode';

const P = 0;
const I = 1;
const Z = 2;
const D = 3;
const A = 4;

// https://www.regular-expressions.info/unicode.html#category
const punct = [
    '\\n', // New line
    '\\p{P}', // All and every possible punctuation characters
    '\\p{S}', // All math symbols, currency signs, dingbats, box-drawing characters, etc.
    '\\p{Z}', // All (almost) and every possible whitespace characters
    '\\p{ExtPict}', // All pictographic and all base emojis
    '\\p{EMod}', // All emoji modifiers (like skin tone)
    '\\u200d', // Emoji Zero Width Joiner (ZWJ)
    '\\u2060', // Word-Joiner zero width whitespace
].join();

const daRegExp = new RegExp(
    [
        '^',
        `(?<prefix>[${punct}}]*)`,
        '(?<d>[дДdD]+)',
        `(?<delimiter>[${punct}]*)`,
        '(?<a>[аАaA]+)',
        `(?<postfix>[${punct}]*)`,
        '$',
    ].join(''),
    'u',
);

export function getResponse(message: string): string | undefined {
    message = message.trim();
    const normalizedMessage = normalizeString(message);
    const match = normalizedMessage.match(daRegExp);
    if (!match) {
        return;
    }

    // @ts-ignore they are exists, trust me
    const { prefix, d, delimiter, a, postfix } = match.groups;

    let letters = ['п', 'и', 'з', 'д', 'а'];
    letters[D] = splitByGlyph(message.substring(prefix.length))[0].toLowerCase();
    letters[A] = splitByGlyph(message.substring(0, message.length - postfix.length)).slice(-a.length).join('');

    if (isLatin(d[0]) && isLatin(a[0])) {
        letters[P] = 'p';
        letters[I] = 'i';
        letters[Z] = 'z';
    }

    let result = '';

    result += repeatCase(d, letters[P]);
    result += letters.slice(1, -1).join('');
    result += letters[A];

    if (isCapital(d[0]) && isCapital(a[0])) {
        result = result.toUpperCase();
    }

    if (delimiter) {
        result = result.split('').join(delimiter);
    }

    if (prefix) {
        result = prefix + result;
    }

    if (postfix) {
        if (postfix === '!') {
            result += '?';
        } else if (postfix === '?') {
            result += '!';
        } else {
            result += postfix;
        }
    }

    return result;
}

function repeatCase(source: string, char: string): string {
    let result = '';
    for (let i = 0; i < source.length; i++) {
        if (isCapital(source[i])) {
            result += char.toUpperCase();
        } else {
            result += char.toLowerCase();
        }
    }

    return result;
}

function isCapital(char: string): boolean {
    return char.toLowerCase() !== char;
}

function isLatin(char: string): boolean {
    return !['д', 'Д', 'а', 'А'].includes(char);
}
