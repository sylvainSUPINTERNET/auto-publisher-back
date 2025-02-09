// import { Test, TestingModule } from '@nestjs/testing';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');



function generateClip(complexFilter:Array<Record<any, any>>, clipName:string): Promise<any> {
  // TODO : 
  // Manage extension ! for input/output
  return new Promise((resolve, reject) => {
    ffmpeg(path.resolve(process.cwd(), "fixtures", "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm"))
    .setStartTime("00:00:00") // TODO => pas bon il faut utiliser complex filter
    .setDuration("00:00:10")
    // .complexFilter(complexFilter)
    .complexFilter([
        {
          filter: 'drawtext',
          options: {
            fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/the_bold_font.ttf",
            text: "SUPER",
            fontsize: 80,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: 'h-text_h-200',
            enable: 'between(t,1,3)',
            box: 1,
            boxcolor: 'black@1',
            boxborderw: 10
          },
          outputs: 'filter1' // [0:v] => filter1
        },
        {
          inputs: 'filter1',
          filter: 'drawtext',
          options: {
            fontfile: "D\\\\:/Dev/workspace/autopublisher-backend/assets/the_bold_font.ttf",
            text: "OKAY",
            fontsize: 80,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: 'h-text_h-200',
            enable: 'between(t,3,4)',
            box: 1,
            boxcolor: 'black@1',
            boxborderw: 10
          }
        }
    ])
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

  it('step4.consumer', async() => {
    
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
      
      for ( let word in words ) {
        let wordObj = words[word];
        complexFilter = [...complexFilter, {
          filter: 'drawtext',
          options: {
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
        }];
      }
      
      if ( clip === "clip0" ) { // TOXO
        await generateClip(complexFilter, clip);
        console.log("Clip generated for : ", clip)
      }

    }

  
  
  }, 30000);
  
});