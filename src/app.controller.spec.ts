// import { Test, TestingModule } from '@nestjs/testing';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
const nlp = require('compromise');



function generateClip(complexFilter:Array<Record<any, any>>, clipName:string, start:string, end:string): Promise<any> {
  // TODO : 
  // Manage extension ! for input/output
  return new Promise((resolve, reject) => {
    ffmpeg(path.resolve(process.cwd(), "fixtures", "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm"))
    .setStartTime(`${start}`)
    .setDuration( `${end}`)
    .complexFilter(complexFilter)

    // .complexFilter([
    //     {
    //       filter: 'drawtext',
    //       options: {
    //         fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/the_bold_font.ttf",
    //         text: "SUPER",
    //         fontsize: 80,
    //         fontcolor: 'white',
    //         x: '(w-text_w)/2',
    //         y: 'h-text_h-200',
    //         enable: 'between(t,0.9399999976158142, 2.939999997615814)',
    //         box: 1,
    //         boxcolor: 'black@1',
    //         boxborderw: 10
    //       },
    //       outputs: 'filter1' // [0:v] => filter1
    //     },
    //     {
    //       inputs: 'filter1',
    //       filter: 'drawtext',
    //       options: {
    //         fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/the_bold_font.ttf",
    //         text: "OKAY",
    //         fontsize: 80,
    //         fontcolor: 'white',
    //         x: '(w-text_w)/2',
    //         y: 'h-text_h-200',
    //         enable: 'between(t,3,4)',
    //         box: 1,
    //         boxcolor: 'black@1',
    //         boxborderw: 10
    //       },
    //       outputs: "filter2"
    //     },
    //     {
    //       inputs: 'filter2',
    //       filter: 'drawtext',
    //       options: {
    //         fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/the_bold_font.ttf",
    //         text: "OKAY 232",
    //         fontsize: 140,
    //         fontcolor: 'white',
    //         x: '(w-text_w)/2',
    //         y: 'h-text_h-200',
    //         enable: 'between(t,5,7)',
    //         box: 1,
    //         boxcolor: 'black@1',
    //         boxborderw: 10
    //       }
    //   }
    // ])

    // .on('progress', function(progress) {
    //   console.log('Processing: ' + progress.percent);
    // })
    .on('end', function() {
      console.log('Finished processing');
      resolve(true);
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
      reject(err);
    })
    .output(path.resolve(process.cwd(), "fixtures", `${clipName}.webm`))
    .run();
  })
}


describe('AppController', () => {


  it("step4.consumer.v2", async () => {
    
    const translationSegmentsAndWords = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "fixtures", "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).json"), 'utf8'));
    const fixtureCompletion = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "fixtures", "completion.json"), 'utf8'));

    // Remove useless punctuation and clean up words and segments
    translationSegmentsAndWords.words = translationSegmentsAndWords.words.map((word) => {
      word = word.word.replace(/[«»“”„]/g, '').trim()
      if ( word !== "" ) {
        return word
      }
    }).filter((word) => word !== undefined);

    translationSegmentsAndWords.segments = translationSegmentsAndWords.segments.map((segment) => {
      segment.text = segment.text.replace(/[«»“”„]/g, '').trim()
      let s = new Set(["text", "start", "end", "id"]);
      if ( segment.text !== "" ) {
        Object.keys(segment).forEach((key) => {
          if ( !s.has(key) ) {
            delete segment[key];
          }
        }); 
        return segment
      }
    }).filter(segment => segment !== undefined && segment.text !== undefined);

    // cleanup completion
    fixtureCompletion.forEach((el) => {
      el.clips = el.
      clips.map((clip) => {
        clip.text = clip.text.replace(/[«»“”„]/g, '').trim()
        return clip
      }).filter(clip => clip!== undefined && clip.text !== undefined && clip.text !== "");
    });


    console.log("ok");
    
  }) 


  it('xd', async() => {
    let text = "Est-ce qu'il faut se lever tôt pour être productif ? Oui, mais cela dépend de chacun.";
    let doc = nlp(text)
    doc.sentences().out('array').map((sentence) => {
      let words = sentence.split(" ");
      for (let i = 0; i < words.length; i += 4) {
        let segment = words.slice(i, i + 4).join(" ");
        console.log(segment);
      }
    })
  })

  it.skip('step4.consumer', async() => {
    const translationSegments = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "fixtures", "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).json"), 'utf8'));
    const fixtureCompletion = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "fixtures", "completion.json"), 'utf8'));

    let clipsAsWords = {};
    let ptr = 0;
    let c = 0;
    for ( let clipObj of fixtureCompletion ) {
      const { clips } = clipObj;
      
      const startClip = clips[0]['start'];
      const endClip = clips[clips.length-1]['end'];

      for ( let i = ptr; i < translationSegments.words.length; i++ ) {

        if ( c !== 0 ) {
          if ( translationSegments.words[i].end > endClip ) {
            ptr = i;
            c+=1;
            break;
          }
        }

        
        if ( translationSegments.words[i].start >= startClip) {
          if ( !clipsAsWords[`clip${c}`] ) {
            clipsAsWords[`clip${c}`] = [];
          }
          clipsAsWords[`clip${c}`].push({
            word: translationSegments.words[i].word,
            start: translationSegments.words[i].start,
            end: translationSegments.words[i].end
          });
        }

        if ( c === 0 ) {
          if ( translationSegments.words[i].end > endClip ) {
            ptr = i;
            c+=1;
            break;
          }
        }

      }

    }
    
    let complexFilter:Array<Record<any,any>> = [];
    for ( let clip in clipsAsWords ) {
      let words = clipsAsWords[clip];
      
      let i = 0;
      for ( let word in words ) {
        let wordObj = words[word];
      
        let filter = {
          filter: 'drawtext',
        }
        if ( i === 0 ) {
          filter["outputs"] = `filter${i}`;
        } else if ( i === words.length-1 ) {
          filter["inputs"] = `filter${i-1}`;
        } else {
          filter["inputs"] = `filter${i-1}`;
          filter["outputs"] = `filter${i}`;
        }

        let options = {
            fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/the_bold_font.ttf",
            text: wordObj.word,
            fontsize: 80,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: 'h-text_h-200',
            enable: `between(t,${wordObj.start},${wordObj.end})`,
            box: 1,
            boxcolor: 'black@1',
            boxborderw: 10
        }
        filter["options"] = options;


        complexFilter = [...complexFilter, filter];

        i+=1;
      }
      
      if ( clip === "clip0" ) { // TOXO
        await generateClip(complexFilter, clip, clipsAsWords[clip][0].start, clipsAsWords[clip][clipsAsWords[clip].length-1].end);
        console.log("Clip generated for : ", clip)
      }

    }
  }, 300000);
  



});