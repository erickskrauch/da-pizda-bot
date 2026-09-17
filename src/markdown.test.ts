import { markdownToTxt } from './markdown';

describe('markdownToTxt', () => {
    describe('underline', () => {
        it('inline with space', () => expect(markdownToTxt('д __а__')).toBe('д а'));
        it('inline no space', () => expect(markdownToTxt('д__а__')).toBe('да'));
        it('underline space', () => expect(markdownToTxt('д __ __ а')).toBe('д   а'));
    });

    describe('quote', () => {
        it('simple quote', () => expect(markdownToTxt('> да')).toBe('да'));
    });

    describe('emoji', () => {
        it('does not throw on a standalone emoji', () => expect(markdownToTxt('😊')).toBe('😊'));
        it('does not throw on an emoji after text', () => expect(markdownToTxt('да 😊')).toBe('да 😊'));
        it('does not throw on a combined (ZWJ) emoji', () => expect(markdownToTxt('👩🏾‍🌾')).toBe('👩🏾‍🌾'));
        it('does not throw on an emoji with a variation selector', () => expect(markdownToTxt('❤️')).toBe('❤️'));
        it('does not throw on an enclosed-alphanumeric emoji letter', () => expect(markdownToTxt('🅰️')).toBe('🅰️'));
        it('does not throw on a regional indicator letter', () => expect(markdownToTxt('🇩')).toBe('🇩'));
    });

    describe('custom discord emoji', () => {
        it('drops a custom guild emoji', () => expect(markdownToTxt('да <:pepega:123456789012345678>')).toBe('да '));
    });

    describe('group mention', () => {
        it('reconstructs @everyone', () => expect(markdownToTxt('@everyone')).toBe('@everyone'));
        it('reconstructs @here', () => expect(markdownToTxt('@here')).toBe('@here'));
        it('drops a channel mention', () => expect(markdownToTxt('<#123456789012345678>')).toBe(''));
        it('drops a user mention', () => expect(markdownToTxt('<@123456789012345678>')).toBe(''));
        it('drops a role mention', () => expect(markdownToTxt('<@&123456789012345678>')).toBe(''));
    });

    it('drops a timestamp', () => expect(markdownToTxt('<t:1700000000:R>')).toBe(''));
});
