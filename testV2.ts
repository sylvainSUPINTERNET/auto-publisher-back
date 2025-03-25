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
    
    for ( let cData of clipData ) {
        const { id, start:clipStart, end:clipEnd, text:clipText } = cData
        const noPunctuation = keepWords(clipText);
    
        console.log(clipStart, clipEnd, " | ", clipText, " | " ,noPunctuation);

        transcription.words.forEach( (word, i) => {
            const { start:wordStart, end:wordEnd, text:wordText } = word;

            if ( wordStart >= clipStart && wordEnd <= clipEnd ) {
                console.log(word);
            }

        })

        console.log("   ");
    }


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


// "text": " « Est-ce qu'il faut se lever tôt pour être productif ? »"

// Est-ce qu'il