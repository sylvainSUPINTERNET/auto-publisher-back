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


const dataWords =  [
            {
                "word": "«",
                "start": 0.47999998927116394,
                "end": 0.9399999976158142
            },
            {
                "word": "Est",
                "start": 0.9399999976158142,
                "end": 0.9599999785423279
            },
            {
                "word": "ce",
                "start": 0.9599999785423279,
                "end": 0.9599999785423279
            },
            {
                "word": "qu",
                "start": 0.9599999785423279,
                "end": 1.1399999856948853
            },
            {
                "word": "il",
                "start": 1.1399999856948853,
                "end": 1.1399999856948853
            },
            {
                "word": "faut",
                "start": 1.1399999856948853,
                "end": 1.2599999904632568
            },
            {
                "word": "se",
                "start": 1.2599999904632568,
                "end": 1.5
            },
            {
                "word": "lever",
                "start": 1.5,
                "end": 1.6399999856948853
            },
            {
                "word": "tôt",
                "start": 1.6399999856948853,
                "end": 1.7999999523162842
            },
            {
                "word": "pour",
                "start": 1.7999999523162842,
                "end": 2.0399999618530273
            },
            {
                "word": "être",
                "start": 2.0399999618530273,
                "end": 2.1600000858306885
            },
            {
                "word": "productif",
                "start": 2.1600000858306885,
                "end": 2.740000009536743
            },
            {
                "word": "",
                "start": 2.740000009536743,
                "end": 3.180000066757202
            },
            {
                "word": "»",
                "start": 3.180000066757202,
                "end": 4
            }
];



/**
 * Note : 3 levels interpretation : shell + node + ffmpeg so to escape ' => \\\\\\'
 * @param text 
 * @returns 
 */
function escapeFFmpegText(text:string):string {
    return text
        .replace(/\\/g, "\\\\\\")
        .replace(/'/g, "\\\\\\'")
        .replace(/"/g, '\\\\\\"')
        .replace(/%/g, "\\\\\\%")
        .replace(/:/g, "\\\\\\:");
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
    
    // TODO real call0
    .complexFilter(complexFilter)

    // TODO test
    // .complexFilter(
    //     [
    //         {
    //             filter: 'crop',
    //             options: {
    //               out_w: 'ih*9/16',
    //               out_h: 'ih',
    //               x: '(iw - out_w) / 2',
    //               y: 0
    //             },
    //             outputs: 'filter1' // [0:v] => filter1
    //           },
    //     {
    //         inputs: 'filter1',
    //       filter: 'drawtext',
    //       options: {
    //         fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/anton.ttf",
    //         //text: "nb \\\\\\'xd xx",//escapeFFmpegText("qu'il faut se  ?"),
    //         text: escapeFFmpegText(`xxxx 'xd "/ ne xx  ?`),
    //         fontsize: 80,
    //         fontcolor: 'white',
    //         x: '(w-text_w)/2',
    //         y: 'h-text_h-200',
    //         enable: 'between(t,0,1.1733333333333333)',
    //         box: 1,
    //         boxcolor: 'black@1',
    //         boxborderw: 10
    //       },
    //     //   outputs: 'filter1' // [0:v] => filter1
    //     }
    // ])
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