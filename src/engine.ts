import { clean as removeDiacritic } from 'diacritic';

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
        '(?<a>[аАaA@ª]+)',
        `(?<postfix>[${punct}]*)`,
        '$',
    ].join(''),
    'u',
);

export function getResponse(message: string): string | undefined {
    message = message.trim();
    const normalizedMessage = removeDiacritic(message);
    const match = normalizedMessage.match(daRegExp);
    if (!match) {
        return;
    }

    // @ts-ignore they are exists, trust me
    const { prefix, d, delimiter, a, postfix } = match.groups;

    let letters = ['п', 'и', 'з', 'д', 'а'];
    letters[4] = a;

    // Diacritics detected
    if (message !== normalizedMessage) {
        letters[4] = message.substr(prefix.length + d.length + delimiter.length, a.length);
    }

    if (d[0].toLowerCase() === 'd') {
        letters[3] = 'd';
    }

    if (letters[3] === 'd' && letters[4] === 'a') {
        letters = ['p', 'i', 'z', 'd', 'a'];
    }

    let result = '';

    result += repeatCase(d, letters[0]);
    result += letters.slice(1, -1).join('');
    result += letters[4];

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
