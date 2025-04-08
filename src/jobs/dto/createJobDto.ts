export type createJobDto = {
    jobId: string;
    sub: string;
    status: string;
    youtubeUrl: string | null;
    gcpBucketKey: string | null;
}