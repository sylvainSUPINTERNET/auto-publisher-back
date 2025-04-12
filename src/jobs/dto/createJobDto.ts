export type createJobDto = {
    jobId: string;
    sub: string;
    youtubeUrl: string | null;
    gcpBucketKey: string | null;
    languageCode: string
}