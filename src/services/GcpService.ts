import { SpeechClient } from "@google-cloud/speech";
import { google } from "@google-cloud/speech/build/protos/protos";
import { Injectable, Logger } from "@nestjs/common";
const {Storage} = require('@google-cloud/storage');
const path = require('node:path');
const speech = require('@google-cloud/speech');
const fs = require('node:fs');


@Injectable()
export class GcpService {

    private readonly logger = new Logger(GcpService.name);
    
    private readonly bucketName:string = `${process.env.GCP_BUCKET_NAME}`;
    
    private readonly bucketKey:string = "transcripts"

    private readonly storage:Storage = new Storage({keyFilename: path.resolve(process.cwd(), process.env.GCP_KEY_FILE as string)});

    private readonly clientSpeech:SpeechClient = new speech.SpeechClient({keyFilename: path.resolve(process.cwd(), process.env.GCP_KEY_FILE as string)});


    constructor( ) { }


    /**
     * Use in step1 :
     * Upload to gs bucket and remove the tmp file locally
     * @param filePath 
     * @param destFileName 
     * @returns 
     */
    public async uploadFileAndRemoveTmp(filePath:string, destFileName:string,) {
        const uploadOptions = {
            destination: `${this.bucketKey}/${destFileName}`,
            // // Optional:
            // // Set a generation-match precondition to avoid potential race conditions
            // // and data corruptions. The request to upload is aborted if the object's
            // // generation number does not match your precondition. For a destination
            // // object that does not yet exist, set the ifGenerationMatch precondition to 0
            // // If the destination object already exists in your bucket, set instead a
            // // generation-match precondition using its generation number.

            // preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
          };
        try {
            await this.storage.bucket(this.bucketName).upload(filePath, uploadOptions);
            this.logger.log(`GCP upload success : ${filePath} to ${this.bucketName}/${uploadOptions.destination}`);
            return Promise.resolve();
        } catch (e) {
            this.logger.error(`GCP upload error : ${e}`);
            return Promise.reject(e);
        }   
    }

    public async transcribeAudio(fileName:string, jobRecord) {
        
        const request: google.cloud.speech.v1.IRecognizeRequest = {
            audio: {
                uri: `gs://${this.bucketName}/${this.bucketKey}/${fileName}`,
            },
            config: {
                useEnhanced: true,
                model: 'default',
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 48000,
                languageCode: `${jobRecord.languageCode}`,
                enableWordTimeOffsets: true,
                enableAutomaticPunctuation: false,
                alternativeLanguageCodes: ['en-US'],
                speechContexts: [
                    {
                        phrases: ['ChatGPT', 'GPT', 'OpenAI','chat gpt'],
                        boost: 20.0,
                    }
                ]
            }
        };


        const [operation] = await this.clientSpeech.longRunningRecognize(request);
        const [response] = await operation.promise();

        //const transcription = response.results?.map(result => result.alternatives?.[0].transcript).join('\n');

        // save to JSON
        // TODO essayer d'autre traanslation + pour les words aussi
        // TODO en gros avoir le même résultat que output-mono.json
        let j = path.resolve(process.cwd(), 'fixtures', "gcp_transcription.json");
        fs.writeFileSync(j, JSON.stringify(response.results, null, 2), 'utf8');



        // const data:[LROperation<google.cloud.speech.v1.ILongRunningRecognizeResponse, google.cloud.speech.v1.ILongRunningRecognizeMetadata>, google.longrunning.IOperation | undefined, {} | undefined] = await this.clientSpeech.longRunningRecognize(request);

        // if (data.length > 0) {
        //     // const transcription = data[0]!.results
        //     //     .map(result => result.alternatives[0].transcript)
        //     //     .join('\n');
        //     // this.logger.log(`Transcription: ${transcription}`);

        //     const response:google.cloud.speech.v1.IRecognizeResponse = data[0] as google.cloud.speech.v1.IRecognizeResponse;
        //     const transcription = response.results?.map(result => result.alternatives![0].transcript).join('\n');
        //     console.log(`Transcription: ${JSON.stringify(transcription, null, 2)}`);
    
        // } else {
        //     throw new Error("Transcription failed, no data received");
        // }

        // const transcription = data[0]!.results
        //   .map(result => result.alternatives[0].transcript)
        //   .join('\n');
        // console.log(`Transcription: ${transcription}`);

    }
    
}