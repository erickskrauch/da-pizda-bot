import { getResponse } from './answerProvider';

describe('getResponse', () => {
    describe('should trim input', () => expect(getResponse('  да \n')).toBe('пизда'));

    describe('should correctly handle case', () => {
        it('should handle lower case', () => expect(getResponse('да')).toBe('пизда'));
        it('should handle upper case', () => expect(getResponse('ДА')).toBe('ПИЗДА'));

        it('should handle upper case of the first letter', () => expect(getResponse('Да')).toBe('Пизда'));
        it('should handle upper case of the last letter', () => expect(getResponse('дА')).toBe('пиздА'));
    });

    describe('should correctly handle characters around', () => {
        it('should handle single character at the beginning', () => expect(getResponse(',Да')).toBe(',Пизда'));
        it('should handle multiple characters at the beginning', () => expect(getResponse('???Да')).toBe('???Пизда'));

        it('should handle single character at the end', () => expect(getResponse('Да.')).toBe('Пизда.'));
        it('should handle multiple characters at the end', () => expect(getResponse('Да!!!')).toBe('Пизда!!!'));

        it('should correctly inverse single ?', () => expect(getResponse('Да?')).toBe('Пизда!'));
        it('should correctly inverse single !', () => expect(getResponse('Да!')).toBe('Пизда?'));
    });

    describe('should skip when contains numeric characters around', () => {
        it('should skip numerics after', () => expect(getResponse('Да, 12')).toBeUndefined());
        it('should skip numerics before', () => expect(getResponse('12, да')).toBeUndefined());
    });

    describe('should handle whitespaces', () => {
        it('should detect single space between д and а letters', () => expect(getResponse('д а')).toBe('п и з д а'));
        it('should detect multiple spaces between д and а letters', () => expect(getResponse('д  а')).toBe('п  и  з  д  а'));
        it('should detect new line between д and а letters', () => expect(getResponse('д\nа')).toBe('п\nи\nз\nд\nа'));
        it('should detect multiple new lines between д and а letters', () => expect(getResponse('д\n\nа')).toBe('п\n\nи\n\nз\n\nд\n\nа'));
        // https://en.wikipedia.org/wiki/Non-breaking_space
        it('should detect word-joiner between д and а letters', () => expect(getResponse('д\u2060а')).toBe('п\u2060и\u2060з\u2060д\u2060а'));
        it('should detect figure-space space between д and а letters', () => expect(getResponse('д\u2007а')).toBe('п\u2007и\u2007з\u2007д\u2007а'));
        it('should detect narrow non-breaking space between д and а letters', () => expect(getResponse('д\u202fа')).toBe('п\u202fи\u202fз\u202fд\u202fа'));
    });

    describe('should handle some interesting cases', () => {
        it('should detect not only spaces', () => expect(getResponse('д.а')).toBe('п.и.з.д.а'));
        it('should detect punctuation characters', () => expect(getResponse('д.!?а')).toBe('п.!?и.!?з.!?д.!?а'));
        it('should detect math characters', () => expect(getResponse('д+а')).toBe('п+и+з+д+а'));
        it('should detect ☆ character', () => expect(getResponse('д☆а')).toBe('п☆и☆з☆д☆а'));

        it('should detect repeating д letter', () => expect(getResponse('дда')).toBe('ппизда'));
        it('should detect repeating д letter and preserve case', () => expect(getResponse('дДдДа')).toBe('пПпПизда'));

        it('should detect repeating а letter', () => expect(getResponse('даа')).toBe('пиздаа'));
        it('should detect repeating а letter and preserve case', () => expect(getResponse('даАаА')).toBe('пиздаАаА'));

        it('should detect english o', () => expect(getResponse('дo')).toBe('пиздo'));
        it('should detect russian o', () => expect(getResponse('до")).toBe('пиздо'));
    
        it('should detect double english o', () => expect(getResponse('дoo')).toBe('пиздoo'));
        it('should detect double russian o', () => expect(getResponse('доо")).toBe('пиздоо'));

        it('should detect russian & english o', () => expect(getResponse('доo")).toBe('пиздоо'));
        it('should detect english & russian o', () => expect(getResponse('дoо")).toBe('пиздоо'));
    });

    describe('should handle attempts to use english characters', () => {
        it('should handle English d instead of д', () => expect(getResponse('Dа')).toBe('Пизdа'));
        it('should handle mix of d and д', () => expect(getResponse('DдdДа')).toBe('ПппПизdа'));

        it('should handle English a instead of а', () => expect(getResponse('Дa')).toBe('Пиздa'));
        it('should handle mix of a and а', () => expect(getResponse('ДaАAа')).toBe('ПиздaАAа'));

        it('should handle @', () => expect(getResponse('Д@')).toBe('Пизд@'));
        it('should handle ą', () => expect(getResponse('Дą')).toBe('Пиздą'));
        it('should handle Ą', () => expect(getResponse('ДĄ')).toBe('ПИЗДĄ'));
        it('should handle ª', () => expect(getResponse('Дª')).toBe('Пиздª'));
        it('should handle á', () => expect(getResponse('Дá')).toBe('Пиздá'));
        it('should handle Á', () => expect(getResponse('ДÁ')).toBe('ПИЗДÁ'));
        it('should handle Ð', () => expect(getResponse('Ðä')).toBe('Pizðä'));
        it('should handle Ɖ', () => expect(getResponse('Ɖª')).toBe('Pizɖª'));
        it('should handle enclosed characters 🅳🅰', () => expect(getResponse('🅳🅰')).toBe('PIZ🅳🅰'));
        it('should handle æ as a', () => expect(getResponse('дæ')).toBe('пиздæ'));
        it('should handle lf as да', () => expect(getResponse('lf')).toBe('gbplf'));
        it('should handle both English letters', () => expect(getResponse('Da')).toBe('Pizda'));
    });

    describe('should handle pictographic', () => {
        it('should handle emoji after text', () => expect(getResponse('Да 😊')).toBe('Пизда 😊'));
        it('should handle emoji after text', () => expect(getResponse('😊 Да')).toBe('😊 Пизда'));
        it('should handle combined emojis', () => expect(getResponse('Да 👩🏾‍🌾')).toBe('Пизда 👩🏾‍🌾'));
        it('should handle pictographic after text', () => expect(getResponse('Да ♡')).toBe('Пизда ♡'));
        it('should handle pictographic before text', () => expect(getResponse('♡ Да')).toBe('♡ Пизда'));
    });

    describe('just random cases reported by users', () => {
        it('ДⱯ!', () => expect(getResponse('ДⱯ!')).toBe('ПИЗДⱯ?'));
        it('ДÆ?', () => expect(getResponse('ДÆ?')).toBe('ПИЗДÆ!'));
        it('ДǢ', () => expect(getResponse('ДǢ')).toBe('ПИЗДǢ'));
        it('ΔΑ', () => expect(getResponse('ΔΑ')).toBe('PIZΔΑ'));
        it('δα', () => expect(getResponse('δα')).toBe('pizδα'));
        it('Да́', () => expect(getResponse('Да́')).toBe('Пизда́'));
        it('ДА̀', () => expect(getResponse('ДА̀')).toBe('ПИЗДА̀'));
        it('Д𐌀', () => expect(getResponse('Д𐌀')).toBe('ПИЗД𐌀'));
        it('д̌ӓ̄', () => expect(getResponse('д̌ӓ̄')).toBe('пизд̌ӓ̄')); // https://github.com/erickskrauch/da-pizda-bot/issues/18
    });

    describe('should be forgiven if the answer is more detailed', () => {
        it('case 1', () => expect(getResponse('да, мы милосердны')).toBeUndefined());
        it('case 2', () => expect(getResponse('мы милосердны, да')).toBeUndefined());
        it('case 3', () => expect(getResponse('да!\nмы милосердны')).toBeUndefined());
    });
});
