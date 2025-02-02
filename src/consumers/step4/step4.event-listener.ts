import {
    QueueEventsListener,
    QueueEventsHost,
    OnQueueEvent,
  } from '@nestjs/bullmq';
  
  @QueueEventsListener('step4')
  export class Step4EventListener extends QueueEventsHost {

    @OnQueueEvent('progress')
    onProgress({ jobId, }: { jobId: string; }) {
      console.log("STEP 4 LISTENER PROGRESS", jobId);
    }


    @OnQueueEvent('waiting')
    onWaiting({ jobId, }: { jobId: string; }) {
      console.log("STEP 4 LISTENER WAITING", jobId);
    }

    @OnQueueEvent('completed')
    onCompleted({jobId,}: {jobId: string;returnvalue: string;prev?: string;}) {
      console.log("STEP 4 LISTENER COMPLETED", jobId);
    }
  }