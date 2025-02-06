import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";

@Processor('step4')
export class Step4Consumer extends WorkerHost {
    private readonly logger = new Logger(Step4Consumer.name);
    
    private readonly STEP2 = STEPS["3"];
    private readonly STEP3 = STEPS["4"];

    constructor(@Inject("REDIS_CLIENT") private redisClient) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {

        try {
            const rawCompletion = JSON.parse(await this.redisClient.getdel(`${job.data.jobUUID}-${this.STEP2.REDIS_KEY_RESULT}`));
            
            console.log(JSON.stringify(rawCompletion));

            await job.updateProgress(100/STEPS.TOTAL);
            return Promise.resolve();
        } catch ( error ) {
            this.logger.error(`${this.STEP3.LOG_PREFIX} (jobId :${job.id} - jobUUID:${job.data.jobUUID}) - ${error}`);
            //await job.moveToFailed({ message: e.message }, true);
            return Promise.reject();
        }


    }

}