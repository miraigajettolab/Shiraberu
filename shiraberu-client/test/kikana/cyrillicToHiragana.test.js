import cyrillicToHiragana from '../../src/kikana-src/src/cyrillicToHiragana'
import pv from './polivanov'

test('That Kikana Supports Polivanov System', () => {
    pv.polivanov.forEach(mora => {
        expect(cyrillicToHiragana(mora.cyrillic)).toBe(mora.hiragana);
    })
})
