import {
    QueueEventsListener,
    QueueEventsHost,
    OnQueueEvent,
  } from '@nestjs/bullmq';
  
  @QueueEventsListener('step3')
  export class Step3EventListener extends QueueEventsHost {

    @OnQueueEvent('progress')
    onProgress({ jobId, }: { jobId: string; }) {
      console.log("STEP 3 LISTENER PROGRESS", jobId);
    }


    @OnQueueEvent('waiting')
    onWaiting({ jobId, }: { jobId: string; }) {
      console.log("STEP 3 LISTENER WAITING", jobId);
    }

    @OnQueueEvent('completed')
    onCompleted({jobId,}: {jobId: string;returnvalue: string;prev?: string;}) {
      console.log("STEP 3 LISTENER COMPLETED", jobId);
    }
  }