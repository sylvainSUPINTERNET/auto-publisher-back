const transcription = require("./fixtures/Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).json");
const clips = require('./fixtures/completion.json');


// Pre processing
preProcessingTranscription(transcription);




let clipDetails = {};
for ( let clipName in clips ) {

    // TODO debug
    if ( clipName !== "clip_0") continue;
    // TODO debug

    clipDetails[clipName] = [];

    let clipData = clips[clipName];
    const {startAt, endAt} = getClipDurationInterval(clipData);

    console.log("CLIP => ", clipName, startAt, endAt);

    clipData.forEach( (cData, idx) => {

        // TODO debug
        if ( idx !== 0 ) return;
        // TODO debug

        const { id, start:clipStart, end:clipEnd, text:clipText } = cData


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
                
        let tmpFull: string[] = [];
        let tmp: string[]= [];
        let tmpTimers: Record<string, any>[] = [];
        clipText.split("").forEach( (c:string, i) => {
                        
            console.log("tmp ", tmp, " | tmpFull : ", tmpFull);
            if ( tmp.length !== 0 ) {
                let word = tmp.join("");

                if ( wordsDetailMap.has(word) ) {
                    const f = wordsDetailMap.get(word)?.shift(); // don't forget to remove the element proceed due to potential duplicated word
                    tmpTimers.push({ start: f?.wordStart, end:f?.wordEnd, word });
                    tmp = [];
                    console.log(tmpTimers);
                }
            }
            

            
            // TODO : read value with shift()
            if ( c === " " && i !== 0 ) {
                // cut 
                // use "tmpFull" to get the full word and use tmpTimers to get exact end and exact start

                if ( tmpTimers.length !== 0 ) { 
                    let fullWord = tmpFull.join("")
                    if ( clipTextAsList.filter(c => c === fullWord).length !== 0 ) {
                        console.log(fullWord); // TODO delete full word ?
                        console.log("OK ", tmpTimers, fullWord);
                        const { end, start} = mapFullWordWithExactTime(tmpTimers);
                        clipDetails[clipName].push({
                            start,
                            end, 
                            fullWord
                        })
                    }    
                }

                tmpFull = [];
                tmpTimers = [];
                console.log("---------")
            } else {


                if ( !wordsDetailMap.has(c) && c !== " " && isNotComposeChar(c)) {
                    tmp.push(c);
                }

                if ( wordsDetailMap.has(c) && c !== " " ) {
                    tmp.push(c);
                }

                if ( !wordsDetailMap.has(c) && c !== " ") {
                    tmpFull.push(c);
                }

                console.log("================> : ", c)
            }


        })

        console.log("   ");
    });

    console.log("CLIP DETAILS => ", clipDetails);

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

function isNotComposeChar(sentence:string): boolean {
    return !/['-]/.test(sentence);
}

function mapFullWordWithExactTime(tmpTimers:Record<string, any>[]): Record<string, any> {
    return {
        start: tmpTimers[0].start,
        end: tmpTimers[tmpTimers.length - 1].end,    
    }
}