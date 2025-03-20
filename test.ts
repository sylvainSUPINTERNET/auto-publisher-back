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

function escapeFFmpegText(text) {
    return text
        .replace(/\\/g, "\\\\")  // \ becomes \\\\ (4 backslashes to deliver \\ to FFmpeg)
        .replace(/"/g, '""')        // " becomes "" to escape double quotes
        .replace(/'/g, "''")        // ' becomes '' to escape single quotes
        .replace(/%/g, "\\%")     // % becomes \% to escape percent sign
        .replace(/:/g, "\\:");    // : becomes \: to escape colon
}

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
let total = data[0].end - data[0].start
const wordWeight = total / punctuationWithoutSpaceText.length

console.log(punctuationWithoutSpaceText)
console.log(wordWeight)
console.log(total)

let partitions: Array<Array<string>> = [];
let tmp: string[] = [];
punctuationWithoutSpaceText.forEach((word, index) => {
    tmp.push(word); // Ajoute le mot au groupe actuel
    
    if (index % 3 === 2 || index === punctuationWithoutSpaceText.length - 1) {
        partitions.push(tmp); // Ajoute tmp à partitions
        tmp = []; // Réinitialise tmp pour un nouveau groupe
    }
});


let duration = 0;
let complexFilter:Record<string,any>[] = partitions.map(( partition, index) => {
    const text:string = partition.join(" ");
    let partitionWeight = partition.length * wordWeight;

    let endDuration = duration + partitionWeight;
    
    let options = {
        fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/anton.ttf",
        text: escapeFFmpegText(text),
        fontsize: 80,
        fontcolor: 'white',
        x: '(w-text_w)/2',
        y: 'h-text_h-200',
        enable: `between(t,${duration},${endDuration})`, // TODO
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

    duration = endDuration;

    return filter;
})
console.log(complexFilter);



ffmpeg(path.resolve(process.cwd(),"fixtures", "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm"))
    .setStartTime(0)
    .setDuration(duration)
    
    // TODO real call
    // .complexFilter(complexFilter)

    // TODO test
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
            fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/anton.ttf",
            text: "qu\\\\\''il faut se  ?",//escapeFFmpegText("qu'il faut se  ?"),
            fontsize: 80,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: 'h-text_h-200',
            enable: 'between(t,0,1.1733333333333333)',
            box: 1,
            boxcolor: 'black@1',
            boxborderw: 10
          },
        //   outputs: 'filter1' // [0:v] => filter1
        }
    ])
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