import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";

@Processor('step3')
export class Step3Consumer extends WorkerHost {
    private readonly logger = new Logger(Step3Consumer.name);
    
    private readonly STEP2 = STEPS["2"];
    private readonly STEP3 = STEPS["3"];

    constructor(@Inject("REDIS_CLIENT") private redisClient) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {

        try {
            const transcription = JSON.parse(await this.redisClient.getdel(`${job.data.jobUUID}-${this.STEP2.REDIS_KEY_RESULT}`));
            await job.updateProgress(100/STEPS.TOTAL);
            return Promise.resolve();

        } catch ( error ) {
            this.logger.error(`${this.STEP3.LOG_PREFIX} (jobId :${job.id} - jobUUID:${job.data.jobUUID}) - ${error}`);
            return Promise.reject(error);
        }
        
    }

}