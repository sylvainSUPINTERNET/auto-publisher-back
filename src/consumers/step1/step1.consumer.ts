import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";

@Processor('step1')
export class Step1Consumer extends WorkerHost {

    constructor(@Inject("REDIS_CLIENT") private redisClient) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {

        await this.redisClient.set("step1", "YYY");
        // let values = await job.getChildrenValues();

        await job.updateProgress(50);
        console.log("JOB STEP 1");

        

        // get previous job data        
        // let values = await job.getChildrenValues();
        // const deps = await job.getDependencies()
        // console.log("DEPS => ", deps);
        // console.log(token);
        // console.log("val STEP 2 ", values);
        // if (values !== undefined && values["step1"]) {
        //     console.log("prev values => ", values["step1"].data);
        // }
        
        // console.log("JOB data => ", job.data, job.name);
        return Promise.resolve();
    }

}