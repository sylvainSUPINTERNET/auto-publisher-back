export const STEPS = {
    TOTAL: 4,
    "0": { // INIT ( when we create a new job )
        LOG_PREFIX: "STEP 0",
        REDIS_KEY_RESULT : "step0-video",
    },
    "1" : {
        LOG_PREFIX: "STEP 1",
        REDIS_KEY_RESULT : "step1-video",
    },
    "2": {
        LOG_PREFIX: "STEP 2",
        REDIS_KEY_RESULT : "step2-video",
    },
    "3": {
        LOG_PREFIX: "STEP 3",
        REDIS_KEY_RESULT : "step3-video",
    },
    "4": {
        LOG_PREFIX: "STEP 4",
        REDIS_KEY_RESULT : "step4-video",
    }
}