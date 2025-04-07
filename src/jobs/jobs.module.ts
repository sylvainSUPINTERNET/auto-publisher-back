import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';
import { JobService } from './JobService';

@Module({
    imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
    controllers: [],
    providers: [JobService],
    exports: [JobService],
  })
export class JobsModule {}