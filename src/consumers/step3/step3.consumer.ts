import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";

@Processor('step3')
export class Step3Consumer extends WorkerHost {

    constructor(@Inject("REDIS_CLIENT") private redisClient) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {
        console.log("JOB STEP 3");

        await job.updateProgress(100/STEPS.TOTAL);
        
        return Promise.resolve();
    }

}