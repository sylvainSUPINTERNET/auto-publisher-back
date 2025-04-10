import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({
    collection: 'jobs',
})
export class Job {

    @Prop({required: true, unique: true})
    jobId: string;

    @Prop({required: true})
    sub: string; // oauth2 id  

    @Prop({required: true, default: "STEP0"})
    status: string;
    
    @Prop({required:true, type: String})
    youtubeUrl: string;

    @Prop({default: null, type: String})
    gcpBucketKey: string;

    @Prop({type: Date, default: Date.now})
    createdAt: Date;

    @Prop({type: Date, default: Date.now})
    updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
