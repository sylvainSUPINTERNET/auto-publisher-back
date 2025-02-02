const path = require('node:path');
const fs = require('node:fs');
const ffmpeg = require('fluent-ffmpeg');

import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";
import OpenAI from "openai";


const extractAudio = (pathDownload:string, videoName:string, audioName:string):Promise<boolean> => {
    return new Promise(
        (resolve, reject) => {
            ffmpeg(path.resolve(pathDownload, videoName))
                .output(path.resolve(pathDownload, audioName))
                .noVideo()
                .audioCodec('copy')
                .on('end', () => {
                    resolve(true);
                })
                .on('error', err => {
                    reject(err);
                })
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

    constructor(@Inject("REDIS_CLIENT") private redisClient) { 
        super(); 
    }

    async process(job: Job, token?: string): Promise<any> {
        this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id}) - started`);
        try {
            const videoName = await this.redisClient.getdel(this.STEP1.REDIS_KEY_RESULT);
            
            const openai = new OpenAI({
                apiKey: process.env.OPEN_AI_SECRET_KEY as string
            });

            const audioName = videoName.replace('.webm', '.oga');

            const isExtracted:boolean = await extractAudio(this.pathDownload, videoName, audioName);
            if (!isExtracted) {
                return Promise.reject("Audio extraction failed");
            }

            let transcription:string = "";
            if ( process.env.WITH_TRANSCRIPTION as string === "true" ) {
                const transcription = await openai.audio.transcriptions.create({
                    file: fs.createReadStream(path.resolve(this.pathDownload, `${audioName}`)),
                    model: "whisper-1",
                    response_format: "srt",
                });    
                this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id}) Transcription OK : ${transcription}`);
            } else {
                this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id}) Transcription simulated used ( NO OPENAI )`);
                transcription = fs.readFileSync(path.resolve(process.cwd(),"Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).srt"), 'utf8');
            }

            await job.updateProgress(100/STEPS.TOTAL);
        } catch ( error ) {
            this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id}) Transcribe KO ${error}`);
            return Promise.reject(error);
        }
    }

}