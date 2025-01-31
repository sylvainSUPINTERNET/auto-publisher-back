import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('step2')
export class Step2Consumer extends WorkerHost {

    constructor() {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {


        let values = await job.getChildrenValues();
        console.log("JOB STEP 2");

        

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