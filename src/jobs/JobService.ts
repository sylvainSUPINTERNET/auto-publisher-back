import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Job } from "./schemas/job.schema";
import { v4 as uuidv4 } from 'uuid';
import { createJobDto } from "./dto/createJobDto";
import { STEPS } from "src/consumers/constant";


@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

    constructor(
      @InjectConnection() private readonly connection: Connection,
      @InjectModel(Job.name) private jobModel: Model<Job>,
    ) { }

    public async create(job: createJobDto): Promise<Job> {
      const jobId:string = uuidv4();

      const session = await this.connection.startSession();
      session.startTransaction();
  
      try {
        const newJob = new this.jobModel({
          jobId,
          sub: job.sub,
          status: STEPS["0"].REDIS_KEY_RESULT,
          youtubeUrl: job.youtubeUrl,
          gcpBucketKey: job.gcpBucketKey,
        });
  
        const resp = await newJob.save({ session });
        await session.commitTransaction();
        this.logger.log(`Success creating job ${jobId}`);
        
        return resp.toObject();
      } catch (error) {
        this.logger.error(`Error creating job: ${error}`);
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }

    public async updateStatus(jobId: string, step:number) {
      try {
        const stepStatus:string = STEPS[step].REDIS_KEY_RESULT;
        this.jobModel.updateOne(
          { jobId },
          { $set: { status: stepStatus } }
        )
        this.logger.log(`Update job ${jobId} status to ${stepStatus}`);
      } catch ( e ) {
        this.logger.error(`Error updating job status: ${e}`);        
      }
    }

}