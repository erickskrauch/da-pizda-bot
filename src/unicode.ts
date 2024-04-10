import { UtfString } from 'utfstring';

const normalizationMap = new Map<string, string>();
// Please note that this dictionary is adjusted to needs of this project and doesn't match Unicode confusion dictionary
const normalizationDictionary: Record<string, string> = {
    'D': '🄓Ꭰ🄳𝔡𝖉𝔻𝗗𝘋𝙳𝐷𝓓𝐃𝑫𝕯𝖣𝔇𝘿ꭰⅅ𝒟ꓓ🅳🅓ⒹＤƉᗪƊÐԺᴅᴰↁḊĐÞⅮᗞᑯĎḌḐḒḎᗫᗬᗟᗠᶛᴆ🇩',
    'd': 'Ꮷ𝔡𝖉ᑯꓒ𝓭ᵭ₫ԃⓓｄḋďḍḑḓḏđƌɖɗᵈ⒟ԁⅾᶁԀᑺᑻᑼᑽᒄᑰᑱᶑ𝕕𝖽𝑑𝘥𝒅𝙙𝐝𝗱𝚍ⅆ𝒹ʠժ',
    'A': '𝑨𝔄ᗄ𝖠𝗔ꓯ𝞐🄐🄰Ꭿ𐊠𝕬𝜜𝐴ꓮᎪ𝚨ꭺ𝝖🅐Å∀Ɐ🇦₳🅰𝒜𝘈𝐀𝔸ǺᗅⒶＡΑᾋᗩĂÃÅǍȀȂĀȺĄʌΛλƛᴀᴬልÄₐᕱǞӒΆẠẢẦẨẬẮẰẲẴẶᾸᾹᾺΆᾼᾈᾉᾊᾌᾍᾎᾏἈἉἊἋἌἍἎἏḀȦǠӐÀÁÂẤẪ𝛢𝓐𝙰𝘼ᗩÆ',
    'a': '∂⍺@ⓐձǟªᵃᶏ⒜ɒａαȃȁคǎმäɑāɐąᾄẚạảǡầẵḁȧӑӓãåάὰάăẩằẳặᾀᾁᾂᾃᾅᾆᾰᾱᾲᾳᾴᶐᾶᾷἀἁἂἃἄἅἆἇᾇậắàáâấẫǻⱥ𝐚𝑎𝒂𝒶𝓪𝔞𝕒𝖆𝖺𝗮𝘢𝙖𝚊𝛂𝛼𝜶𝝰𝞪⍶æ',
};
for (const normalLetter in normalizationDictionary) {
    const utfDict = new UtfString(normalizationDictionary[normalLetter]);
    for (const confusingChar of utfDict) {
        normalizationMap.set(confusingChar.toString(), normalLetter);
    }
}

export function normalizeString(str: string): string {
    const utfString = new UtfString(str);
    let result = '';
    for (const char of utfString) {
        result += normalizationMap.get(char.toString()) || char;
    }

    return result;
}
