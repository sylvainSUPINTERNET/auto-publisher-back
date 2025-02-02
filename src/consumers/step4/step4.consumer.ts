import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";

@Processor('step4')
export class Step4Consumer extends WorkerHost {

    constructor(@Inject("REDIS_CLIENT") private redisClient) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {
        console.log("JOB STEP 4");

        await job.updateProgress(100/STEPS.TOTAL);
        return Promise.resolve();
    }

}