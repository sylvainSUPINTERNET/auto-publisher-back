import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";

@Processor('step1')
export class Step1Consumer extends WorkerHost {
    private readonly logger = new Logger(Step1Consumer.name);
    private readonly STEP1 = STEPS["1"];

    constructor(@Inject("REDIS_CLIENT") private redisClient) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {
        this.logger.log(`${this.STEP1.LOG_PREFIX} (jobId :${job.id}) - started`);
        // TODO ( video download with python etc .. 
        const ytbVideoName:string = "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm";
        //TODO
        
        try {
            await this.redisClient.set(this.STEP1.REDIS_KEY_RESULT, "Se lever tôt ne te rendra pas meilleur (et c'est tant mieux).webm");
            this.logger.log(`${this.STEP1.LOG_PREFIX} (jobId :${job.id}) - ${ytbVideoName} - redis ${this.STEP1.REDIS_KEY_RESULT} key created - Download OK`);
            await job.updateProgress(100/STEPS.TOTAL);
            return Promise.resolve();
        } catch ( error ) {
            this.logger.log(`${this.STEP1.LOG_PREFIX} (jobId :${job.id}) - ${ytbVideoName} Donwload KO`);
            return Promise.reject(error);
        }

    }

}