const path = require('node:path');
const fs = require('node:fs');
const ffmpeg = require('fluent-ffmpeg');

import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";
import OpenAI from "openai";
import { GcpService } from "src/services/GcpService";


const extractAudio = (pathDownload:string, videoName:string, audioName:string):Promise<boolean> => {
    return new Promise(
        (resolve, reject) => {
            ffmpeg(path.resolve(pathDownload, videoName))
                .output(path.resolve(pathDownload, audioName))
                .noVideo()
                .audioCodec('copy')
                .on('end', () => { resolve(true) })
                .on('error', err => { reject(err) })
                .run();
        }
    );
}

@Processor('step2')
export class Step2Consumer extends WorkerHost {
    private readonly logger = new Logger(Step2Consumer.name);
    
    private pathDownload: string = path.resolve(process.cwd(), 'downloads');
    private readonly STEP1 = STEPS["1"];
    private readonly STEP2 = STEPS["2"];

    constructor(@Inject("REDIS_CLIENT") private redisClient, private gcpService:GcpService) { 
        super(); 
    }

    async process(job: Job, token?: string): Promise<any> {

        const {newJob: jobRecord} = job.data;
        const jobUUID = jobRecord.jobId;

        this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobUUID}) - started`);

        try {  

            const fileName = await this.redisClient.getdel(`${jobUUID}-${this.STEP1.REDIS_KEY_RESULT}`);

            await this.gcpService.transcribeAudio(fileName, jobRecord);

            //await this.redisClient.set(`${jobUUID}-${this.STEP2.REDIS_KEY_RESULT}`, JSON.stringify(transcription));
            
            await job.updateProgress(100/STEPS.TOTAL);


            return Promise.resolve();

        } catch ( e ) {
            
            this.logger.error(`${this.STEP2.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobUUID}) KO ${e}`);

            return Promise.reject(e);
        }



    //     try {
    //         const videoName = await this.redisClient.getdel(`${jobUUID}-${this.STEP1.REDIS_KEY_RESULT}`);
            
    //         const openai = new OpenAI({
    //             apiKey: process.env.OPEN_AI_SECRET_KEY as string
    //         });

    //         const audioName = videoName.replace('.webm', '.oga');

    //         const isExtracted:boolean = await extractAudio(this.pathDownload, videoName, audioName);
    //         if (!isExtracted) {
    //             return Promise.reject("Audio extraction failed");
    //         }

    //         let transcription:any = ""; //srt format
    //         if ( process.env.WITH_TRANSCRIPTION as string === "true" ) {

    //             const transcription = await openai.audio.transcriptions.create({
    //                 file: fs.createReadStream(path.resolve(this.pathDownload, `${audioName}`)),
    //                 model: "whisper-1",
    //                 response_format: "verbose_json",
    //                 timestamp_granularities: ["word", "segment"]
    //             });    
    //             this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobUUID}) Transcription OK : ${transcription}`);
    //             //fs.writeFileSync(path.resolve(process.cwd(),"downloads", "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).json"), JSON.stringify(transcription), 'utf8');
    //         } else {
    //             this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobUUID}) Transcription simulated used ( NO OPENAI )`);
    //             transcription = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),"downloads","Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).json"), 'utf8'));
    //         }


    //         // TODO use RPUSH / LRANGE to split large transcription and store it in redis
    //         await this.redisClient.set(`${jobUUID}-${this.STEP2.REDIS_KEY_RESULT}`, JSON.stringify(transcription));
            
    //         await job.updateProgress(100/STEPS.TOTAL);
    //         return Promise.resolve();

    //     } catch ( error ) {
    //         this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobUUID}) Transcribe KO ${error}`);
    //         return Promise.reject(error);
    //     }

    }
}