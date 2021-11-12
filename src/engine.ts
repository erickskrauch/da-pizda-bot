const punct = '!"#$%& \'()*+,\\-./:;<=>?@[\\\\\\]^_`{|}~';
const daRegExp = new RegExp(
    [
        '^',
        `(?<prefix>[${punct}}]*)`,
        '(?<d>[дД]+)',
        `(?<delimiter>[${punct}]*)`,
        '(?<a>[аА]+)',
        `(?<postfix>[${punct}]*)`,
        '$',
    ].join(''),
);

const letters: ReadonlyArray<string> = ['п', 'и', 'з', 'д', 'а'];

export function getResponse(message: string): string | undefined {
    message = message.trim();
    const match = message.match(daRegExp);
    if (!match) {
        return;
    }

    // @ts-ignore they are exists, trust me
    const { prefix, d, delimiter, a, postfix } = match.groups;

    let result = '';

    result += repeatCase(d, letters[0]);
    result += letters.slice(1, -1).join('');
    result += repeatCase(a, letters[letters.length - 1]); // TODO: replace with .at(-1) for Node.js 16.6

    if (isCapital(d) && isCapital(a)) {
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
    return char.toUpperCase() === char;
}
