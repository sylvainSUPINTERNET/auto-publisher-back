import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Job } from "./schemas/job.schema";
import { v4 as uuidv4 } from 'uuid';
import { createJobDto } from "./dto/createJobDto";

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

    constructor(@InjectModel(Job.name) private jobModel: Model<Job>) { }

    public async create(job:createJobDto): Promise<Job> {
      const resp = await new this.jobModel({
          jobId: uuidv4(),
          sub: job.sub,
          status: job.status,
          youtubeUrl: job.youtubeUrl,
          gcpBucketKey: job.youtubeUrl
        })
        .save();

        return resp;
    }

}