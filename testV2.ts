const transcription = require("./fixtures/Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).json");
const clips = require('./fixtures/completion.json');

buildWordTimeMap(transcription);


for ( let clipName in clips ) {

    // TODO debug
    if ( clipName !== "clip_0") continue;
    // TODO debug

    let clipData = clips[clipName];
    const {startAt, endAt} = getClipDurationInterval(clipData);
    
    for ( let cData of clipData ) {
        let { id, start, end, text } = cData
        const textNoPunctuation = keepWords(text);
        textNoPunctuation.split(" ").forEach( word => {
            console.log(word);
        })
        
    }

}


function buildWordTimeMap (transcription: Record<any, any>) {
    // TODO 
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


// "text": " « Est-ce qu'il faut se lever tôt pour être productif ? »"

// Est-ce qu'il