import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Job } from "./schemas/job.schema";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

    constructor(@InjectModel(Job.name) private jobModel: Model<Job>) { }

    public async test() {
      const resp = await new this.jobModel({
          jobId: uuidv4(),
          sub: "1234567890",
          status: "STEP0",
          youtubeUrl: null,
          gcpBucketKey: null
        }).save();
  
        this.logger.log(`Job created -> ${resp}`);
    }

}