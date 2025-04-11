import { Injectable, Logger } from "@nestjs/common";
const {Storage} = require('@google-cloud/storage');
const path = require('node:path');


@Injectable()
export class GcpService {

    private readonly logger = new Logger(GcpService.name);
    
    private readonly bucketName:string = `${process.env.GCP_BUCKET_NAME}`;
    
    private readonly bucketKey:string = "transcripts"

    private readonly storage:Storage = new Storage({keyFilename: path.resolve(process.cwd(), process.env.GCP_KEY_FILE as string)});


    constructor( ) { }

    public async uploadFileAndRemoveTmp(filePath:string, destFileName:string,) {

        const uploadOptions = {
            destination: `${this.bucketKey}/${destFileName}`,
            // // Optional:
            // // Set a generation-match precondition to avoid potential race conditions
            // // and data corruptions. The request to upload is aborted if the object's
            // // generation number does not match your precondition. For a destination
            // // object that does not yet exist, set the ifGenerationMatch precondition to 0
            // // If the destination object already exists in your bucket, set instead a
            // // generation-match precondition using its generation number.

            // preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
          };
        try {
            console.log(this.bucketName)
            await this.storage.bucket(this.bucketName).upload(filePath, uploadOptions);
            this.logger.log(`GCP upload success : ${filePath} to ${this.bucketName}/${uploadOptions.destination}`);
            return Promise.resolve();
        } catch (e) {
            this.logger.error(`GCP upload error : ${e}`);
            return Promise.reject(e);
        }
        
    }
}