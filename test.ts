const data = [
    {
        "id": 0,
        "start": 0.48,
        "end": 4,
        "text": " « Est-ce qu'il faut se lever tôt pour être productif ? »"
    },
];

let cleanedText = data[0].text.replace(/[«»]/g, '').trim();
let wordsCount = cleanedText.split(' ').length
let durationTotal = data[0].end - data[0].start;
let weightPerWord = durationTotal / wordsCount;
let cleanedTextArray = cleanedText.split('');
for ( let c = 0; c < cleanedTextArray.length; c++ ) {
    if (  /[!?.;:]/.test(cleanedTextArray[c]) ) {
        if ( cleanedTextArray[c-1] && cleanedTextArray[c-1] === ' ' ) {
            cleanedTextArray[c-1] = '';
        }
    }
}
let punctuationWithoutSpaceText = cleanedTextArray.join('');
const total = data[0].end - data[0].start

