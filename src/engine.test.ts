import { getResponse } from './engine';

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

    describe('should handle some interesting cases', () => {
        it('should detect space between д and а letters', () => expect(getResponse('д а')).toBe('п и з д а'));
        it('should detect spaces between д and а letters', () => expect(getResponse('д  а')).toBe('п  и  з  д  а'));
        it('should detect not only spaces', () => expect(getResponse('д.а')).toBe('п.и.з.д.а'));
        it('should detect different characters', () => expect(getResponse('д.!?а')).toBe('п.!?и.!?з.!?д.!?а'));

        it('should detect repeating д letter', () => expect(getResponse('дда')).toBe('ппизда'));
        it('should detect repeating д letter and preserve case', () => expect(getResponse('дДдДа')).toBe('пПпПизда'));

        it('should detect repeating а letter', () => expect(getResponse('даа')).toBe('пиздаа'));
        it('should detect repeating а letter and preserve case', () => expect(getResponse('даАаА')).toBe('пиздаАаА'));
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

        it('should handle both English letters', () => expect(getResponse('Da')).toBe('Pizda'));
    });

    describe('should be forgiven if the answer is more detailed', () => {
        it('case 1', () => expect(getResponse('да, мы милосердны')).toBeUndefined());
        it('case 2', () => expect(getResponse('мы милосердны, да')).toBeUndefined());
        it('case 3', () => expect(getResponse('да!\nмы милосердны')).toBeUndefined());
    });
});
