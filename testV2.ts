const transcription = require("./fixtures/Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).json");
const clips = require('./fixtures/completion.json');


// Pre processing
preProcessingTranscription(transcription);



for ( let clipName in clips ) {

    // TODO debug
    if ( clipName !== "clip_0") continue;
    // TODO debug

    let clipData = clips[clipName];
    const {startAt, endAt} = getClipDurationInterval(clipData);

    console.log("CLIP => ", clipName, startAt, endAt);

    let sentences: Array<Record<string, any>> = [];

    clipData.forEach( (cData, idx) => {
        const { id, start:clipStart, end:clipEnd, text:clipText } = cData

        // TODO : count char by char ( ignore punctuation ) to have exact timestamp end/start per word in sentence (not just weird word)

        const clipTextAsList: string[] = clipText.split(" ").filter(c => c.trim() !== "")
        console.log(clipStart, clipEnd, " | ", clipText, " | " , clipTextAsList);


        let wordsDetailMap: Map<string, Array<any>> = new Map();
        transcription.words.forEach( (word, i) => {
            const { start:wordStart, end:wordEnd, word:wordText } = word;
            if ( wordStart >= clipStart && wordEnd <= clipEnd ) {      
                const entries = wordsDetailMap.get(wordText);
                if ( entries ) {
                    entries.push({ wordStart, wordEnd });
                } else {
                    wordsDetailMap.set(wordText, [{ wordStart, wordEnd }]);
                }

            }
        })

        console.log("WORDS DETAIL" ,wordsDetailMap);


        const wordsFullWithDetail = [];
        clipText.split("").forEach( (c, i) => {


            console.log(c);

            // if ( c === " " && i !== 0 ) {
            //     console.log("CUT");
            // } 
            
            // if ( c !== " " && wordsDetailMap.get(c) ) {
            //     console.log("WORD", c);
            //     // TODO shift 
            // }
        })

        console.log("   ");
    });

}


function getClipDurationInterval (clipData:Array<Record<string, any>>) : Record<string, any> {
    return {
        "startAt": clipData[0].start,
        "endAt": clipData[clipData.length - 1].end
    }
}

function keepWords(sentence:string):string {
    return sentence.replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
}

function preProcessingTranscription(transcription:Record<string, any>) {
    // round to decimal
    transcription.segments.forEach( segment => {
        segment.start = Math.round(segment.start * 100) / 100;
        segment.end = Math.round(segment.end * 100) / 100;    
    });
    
    transcription.words.forEach( word => {
        word.start = Math.round(word.start * 100) / 100;
        word.end = Math.round(word.end * 100) / 100;    
    });

    return transcription;
}


/*

let partitions: Array<Array<string>> = [];
let tmp: string[] = [];
clipTextNoPunctuation.split(" ").forEach((word, index) => {
    tmp.push(word); // Ajoute le mot au groupe actuel
    
    if (index % 3 === 2 || index === clipTextNoPunctuation.length - 1) {
        partitions.push(tmp); // Ajoute tmp à partitions
        tmp = []; // Réinitialise tmp pour un nouveau groupe
    }
});

console.log(partitions); 
 */