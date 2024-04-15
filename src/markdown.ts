import { parse as parseMarkdown } from 'discord-markdown-parser';

export function markdownToTxt(str: string): string {
    return parseMarkdown(str).map(recursiveFindText).join('');
}

// I can't introduce valid typings since they're seems to be invalid in first place.
// Use tests to know the possible node types
function recursiveFindText(node: any): string {
    if (typeof node.content === 'string') {
        return node.content;
    }

    if (node.content !== undefined) {
        return recursiveFindText(node.content);
    }

    return node.map(recursiveFindText).join('');
}
