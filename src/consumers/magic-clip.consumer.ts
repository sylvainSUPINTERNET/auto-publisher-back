import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('magic-clip')
export class ConsumerMagicClip extends WorkerHost {

    process(job: Job, token?: string): Promise<any> {
        console.log("JOB => ", job.data, job.name);
        console.log("TOKEN => ", token);
        return Promise.resolve();
    }

}