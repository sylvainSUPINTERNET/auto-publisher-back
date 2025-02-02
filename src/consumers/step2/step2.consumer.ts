import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";
const path = require('node:path');
const fs = require('node:fs/promises');

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
            this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id}) Transcribe OK for video : ${videoName}`);
            await job.updateProgress(100/STEPS.TOTAL);
            return Promise.resolve();
        } catch ( error ) {
            this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id}) Transcribe KO`);
            return Promise.reject(error);
        }
    }

}