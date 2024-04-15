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
});
