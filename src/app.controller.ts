import { Body, Controller, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { createJobDto } from './jobs/dto/createJobDto';
import { JobService } from './jobs/JobService';
import { Job } from './jobs/schemas/job.schema';
import { Response } from 'express';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);
  
  constructor(
    private readonly appService: AppService,
    private readonly jobService:JobService
  ) {}


  @Post("/jobs")
  async create(@Body() createJobDto: createJobDto, @Res() res:Response): Promise<Record<string, any>> {

    if ( !createJobDto.gcpBucketKey ) {
        createJobDto["gcpBucketKey"] = null;
    }

    try {
      const job:Job = await this.jobService.create(createJobDto);

      this.logger.log(`Job created with ID: ${job.jobId}, adding to queue`);
      this.appService.produceJob(job); // do not await here ! ( we need to send a response and let the job run in the background )
      
      return res.status(HttpStatus.OK).json({
        jobId: job.jobId
      })

    } catch ( e ) {
      this.logger.error("Error creating job", e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: e.message
      })
    }

  }

}
