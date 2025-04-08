import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { createJobDto } from './jobs/dto/createJobDto';
import { JobService } from './jobs/JobService';
import { Job } from './jobs/schemas/job.schema';

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService
    private readonly jobService:JobService
  ) {}


  @Post()
  async create(@Body() createJobDto: createJobDto): Promise<Job> {
     return this.jobService.create(createJobDto);
  }

  // @Get()
  // getHello(): string {
  //   return "hello";
  // }


  // @Get("/hello")
  // getHello2(): string {
  //   this.appService.getHello();
  //   return "hello2"
  // }
}
