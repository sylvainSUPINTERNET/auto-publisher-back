import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";
import { YtbService } from "src/services/YtbService";
import { GcpService } from "src/services/GcpService";
const fs = require('fs');


// TODO check for the time for yt-dlp ( for the moment using 5mins default )
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

        if ( process.env.SKIP_STEP_1 && process.env.SKIP_STEP_1 === "true" ) {

            this.logger.log("SKIP_STEP_1 is set to true, simulate step 1 processing using be2c87f4-6c47-4089-b963-555d4ab023b8.opus transcription");
            
            const fixtureOpus: string = "be2c87f4-6c47-4089-b963-555d4ab023b8.opus";
            await this.redisClient.set(`${jobRecord.jobId}-${this.STEP1.REDIS_KEY_RESULT}`, `${fixtureOpus}`);

            this.logger.log(`${this.STEP1.LOG_PREFIX} (jobId :${job.id} - jobUUID:${jobRecord.jobId}) - ${jobRecord.youtubeUrl} - redis ${this.STEP1.REDIS_KEY_RESULT} key created - Download and Upload OK`);
            await job.updateProgress(100/STEPS.TOTAL);

            return Promise.resolve();

        } else {
            
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
        
    }

}