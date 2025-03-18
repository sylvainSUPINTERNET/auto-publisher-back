import { partition } from "rxjs";

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');

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
let punctuationWithoutSpaceText = cleanedTextArray.join('').split(" ");
const total = data[0].end - data[0].start
const wordWeight = total / punctuationWithoutSpaceText.length

console.log(punctuationWithoutSpaceText)
console.log(wordWeight)

let partitions: Array<Array<string>> = [];
let tmp: string[] =  [];
punctuationWithoutSpaceText.forEach((word, index) => {
    if ( index !== 0 && index % 3 === 0 || index === punctuationWithoutSpaceText.length - 1 ) {
        partitions = [...partitions, tmp];
        tmp = [];
    }
    tmp = [...tmp, word];
});

let complexFilter:Record<string,any>[] = partitions.map(( partition, index) => {
    const text:string = partition.join(" ");
    let options = {
        fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/the_bold_font.ttf",
        text,
        fontsize: 80,
        fontcolor: 'white',
        x: '(w-text_w)/2',
        y: 'h-text_h-200',
        enable: 'between(t,0.9399999976158142, 2.939999997615814)', // TODO
        box: 1,
        boxcolor: 'black@1',
        boxborderw: 10
    }

    let filter = {
        filter: "drawtext",
        options
    };

    if ( index === 0 ) {
        filter["outputs"] = `outputs${index}`;
    }

    if ( index !== 0 && index !== partitions.length - 1 ) {
        filter["inputs"] = `outputs${index - 1}`;
        filter["outputs"] = `outputs${index}`;
    }

    if ( index === partitions.length - 1 ) {
        filter["inputs"] = `outputs${index - 1}`;
    }

    return filter;
})
console.log(complexFilter);


ffmpeg(path.resolve(process.cwd(),"fixtures", "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm"))
    .setStartTime(0)
    .setDuration(4)
    .complexFilter(
        [
            {
                filter: 'crop',
                options: {
                  out_w: 'ih*9/16',
                  out_h: 'ih',
                  x: '(iw - out_w) / 2',
                  y: 0
                },
                outputs: 'filter1' // [0:v] => filter1
              },
        {
            inputs: 'filter1',
          filter: 'drawtext',
          options: {
            fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/the_bold_font.ttf",
            text: "SUPER",
            fontsize: 80,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: 'h-text_h-200',
            enable: 'between(t,0.9399999976158142, 2.939999997615814)',
            box: 1,
            boxcolor: 'black@1',
            boxborderw: 10
          },
        //   outputs: 'filter1' // [0:v] => filter1
        }
    ]


)
    .on('end', function() {
        console.log('Finished processing');
        // resolve(true);
    })
    .on('error', function(err) {
        console.log('an error happened: ' + err.message);
        // reject(err);
    })
    .output(path.resolve(process.cwd(), "fixtures", `TEST.webm`))
    .run();

//  npx tsx .\test.ts