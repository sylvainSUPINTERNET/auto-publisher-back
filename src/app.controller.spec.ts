// import { Test, TestingModule } from '@nestjs/testing';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

const fs = require('fs');
const path = require('path');

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

      // console.log("Clip ", c, "start", startClip, "end", endClip);

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
          clipsAsWords[`clip${c}`].push(translationSegments.words[i].word);
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
  
  });
  
});