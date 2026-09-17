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

    if (Array.isArray(node)) {
        return node.map(recursiveFindText).join('');
    }

    if (node.type === 'twemoji') {
        return node.name;
    }

    switch (node.type) {
        case 'twemoji':
            return node.name;
        case 'everyone':
            return '@everyone';
        case 'here':
            return '@here';
        default: // custom guild emoji, channel/role/user mentions, timestamp, etc., that I have no idea how to deal at a time
            return '';
    }
}
