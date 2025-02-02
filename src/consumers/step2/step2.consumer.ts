import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";

@Processor('step2')
export class Step2Consumer extends WorkerHost {

    constructor(@Inject("REDIS_CLIENT") private redisClient) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {

        const getDelResult = await this.redisClient.getdel("step1");
        console.log("GET DEL RESULT", getDelResult);

        // let values = await job.getChildrenValues();
        console.log("JOB STEP 2");

        await job.updateProgress(100/STEPS.TOTAL);



        

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