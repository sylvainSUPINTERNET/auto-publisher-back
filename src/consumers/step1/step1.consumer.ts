import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";
import { YtbService } from "src/services/YtbService";
import { GcpService } from "src/services/GcpService";
const fs = require('fs');

@Processor('step1')
export class Step1Consumer extends WorkerHost {
    private readonly logger = new Logger(Step1Consumer.name);
    private readonly STEP1 = STEPS["1"];
    private readonly MAX_DOWNLOAD_DURATION_MINS:string = "00:05:00";

    constructor(@Inject("REDIS_CLIENT") private redisClient,
        private ytbService: YtbService,
        private gcpService: GcpService ) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {
        const {newJob: jobRecord} = job.data;
        this.logger.log(`${this.STEP1.LOG_PREFIX} - ${job.id} started : ${JSON.stringify(jobRecord)}`);

        const downloadObj:{filePath:string, fileName:string} = {filePath:"", fileName:""};

        try {

            const { filePath, fileName } = await this.ytbService.downloadAudio(jobRecord.youtubeUrl, "00:00:00", `${this.MAX_DOWNLOAD_DURATION_MINS}`)
            downloadObj.filePath = filePath;
            downloadObj.fileName = fileName;
            this.logger.log(`${this.STEP1.LOG_PREFIX} - ${job.id} download OK : ${JSON.stringify(downloadObj)}`);

        } catch ( e ) {

            this.logger.error(`${this.STEP1.LOG_PREFIX} - ${job.id} download error : ${e}`);

            return Promise.reject(e);
        }


        try {

            await this.gcpService.uploadFileAndRemoveTmp(downloadObj.filePath, downloadObj.fileName);

            await this.redisClient.set(`${job.id}-${this.STEP1.REDIS_KEY_RESULT}`, `${downloadObj.fileName}`);

            this.logger.log(`${this.STEP1.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobRecord.jobId}) - ${jobRecord.youtubeUrl} - redis ${this.STEP1.REDIS_KEY_RESULT} key created - Download and Upload OK`);
            await job.updateProgress(100/STEPS.TOTAL);

            return Promise.resolve();

        } catch ( e ) {

            this.logger.error(`${this.STEP1.LOG_PREFIX} - ${job.id} gs upload error : ${e}`);
            return Promise.reject(e);

        } finally {

            // remove file locally
            fs.unlink(downloadObj.filePath, err => {
                if (err) {
                    this.logger.error(`Error while removing file ${downloadObj.filePath} : ${err}`);
                } else {
                    this.logger.log(`File ${downloadObj.filePath} has been successfully removed.`);
                }
              });
           
        }

    }


    // async process(job: Job, token?: string): Promise<any> {

    //     const {newJob: jobRecord} = job.data;
    //     const jobUUID = jobRecord.jobId;

    //     console.log("Start with newJob : ", jobRecord);

    //     // yt-dlp -x --audio-format opus "https://www.youtube.com/watch?v=dZs5WljIOEg" --postprocessor-args "-ss 00:01:00 -to 00:03:00"

    //     // TODO => download just audio 5mins for the moment MAX.
    //     // TODO => upload to GCP bucket
     
    //     this.logger.log(`${this.STEP1.LOG_PREFIX} (jobUUID:${jobUUID} - queue jobId ${job.id}) - started`);
    //     // TODO ( video download with python etc .. 
    //     const ytbVideoName:string = "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm";
    //     //TODO
    
    //     try {
    //         await this.redisClient.set(`${jobUUID}-${this.STEP1.REDIS_KEY_RESULT}`, "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm");
    //         this.logger.log(`${this.STEP1.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobUUID}) - ${ytbVideoName} - redis ${this.STEP1.REDIS_KEY_RESULT} key created - Download OK`);
    //         await job.updateProgress(100/STEPS.TOTAL);
    //         return Promise.resolve();
    //     } catch ( error ) {
    //         this.logger.log(`${this.STEP1.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobUUID}) - ${ytbVideoName} Donwload KO : ${error}`);
    //         return Promise.reject(error);
    //     }

    // }

}