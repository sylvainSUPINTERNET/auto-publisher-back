import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { STEPS } from "../constant";
// import Groq from 'groq-sdk';


@Processor('step3')
export class Step3Consumer extends WorkerHost {
    private readonly logger = new Logger(Step3Consumer.name);
    
    private readonly STEP2 = STEPS["2"];
    private readonly STEP3 = STEPS["3"];

    constructor(@Inject("REDIS_CLIENT") private redisClient) {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {


        try {
            
            // const client = new Groq({
            //     apiKey: process.env['GROQ_TOKEN']
            // });

            const {segments, words}:Record<string, any> = JSON.parse(await this.redisClient.getdel(`${job.data.jobUUID}-${this.STEP2.REDIS_KEY_RESULT}`));
            
            if ( process.env.WITH_COMPLETION as string === "false" ) {
                this.logger.log(`${this.STEP2.LOG_PREFIX} (jobId :${job.id} - jobUUID:${job.data.jobUUID}) Completion simulated used ( NO GROQ )`);

                const path = require('path');
                const completionJson = require(path.resolve(process.cwd(), "fixtures", "completion.json"));
                await this.redisClient.set(`${job.data.jobUUID}-${this.STEP3.REDIS_KEY_RESULT}`, JSON.stringify(completionJson));
                await job.updateProgress(100/STEPS.TOTAL);
                return Promise.resolve();
            }


            // Remove useless field 
            const uselessFields = ["tokens", "seek","temperature","avg_logprob","compression_ratio","no_speech_prob" ];
            segments.forEach((segment:Record<string, any>) => {
                uselessFields.forEach((field) => {
                    delete segment[field];
                });
            });

            const prompt = `
            Tu es un éditeur vidéo spécialisé dans la création de clips courts optimisés pour YouTube Shorts et TikTok.  

            Ton objectif est de regrouper les segments d’une transcription pour former des clips de 30 à 60 secondes, en maximisant leur potentiel viral.  

            ---

            Données d’entrée : 
            Tu reçois un tableau JSON contenant des objets avec la structure suivante :  

            \`\`\`json
            [
                {
                    "id": <id>,
                    "start": <start>,
                    "end": <end>,
                    "text": <text>
                }
            ]
            \`\`\`

            - Chaque segment a un \`start\` (début en secondes) et un \`end\` (fin en secondes).  
            - La durée d’un segment est calculée comme :  
            duration = end - start;

            ---

            Règles de sélection des clips : 
            1. **Assembler uniquement des segments adjacents** pour former des clips cohérents.  
            2. **Chaque clip doit avoir une durée totale comprise entre 30 et 60 secondes.**  
            3. **Prioriser les clips dont la durée est la plus proche de 60 secondes.**  
            4. **Ignorer les clips de moins de 30 secondes.**  
            5. **Ne retourner que les 3 clips les plus pertinents**, selon :  
            - La durée (proche de 60s).  
            - La fluidité et la cohérence du texte.  
            - La présence de contenu engageant (émotions, punchlines, moments forts).  

            ---

            Format de sortie JSON attendu : 
            La sortie doit être une **liste JSON propre**, contenant au maximum **3 clips**, avec le format suivant :  
            \`\`\`json
            [
                {
                    "clips": [
                        { "id": 1, "start": 0, "end": 10, "text": "..." },
                        { "id": 2, "start": 10, "end": 25, "text": "..." }
                    ]
                },
                {
                    "clips": [
                        { "id": 3, "start": 30, "end": 45, "text": "..." },
                        { "id": 4, "start": 45, "end": 60, "text": "..." }
                    ]
                }

                ...
            ]
            \`\`\`

            ---

            **Instructions finales :**  
            - **Ne renvoie que le resultat au format JSON en "brut", pas besoin de formatter dans une balise JSON**  
            - **Ne génère pas de texte superflu.**  
            - **Ne retourne aucun message autre le JSON, pas de think, debogage ou autre.**
            - **Tu peux <think> mais de ne retourne pas la balise dans le resultat de <think>

            **Input JSON :** \`${JSON.stringify(segments)}\`
            `;

            const completionResult = await fetch(`${process.env.GROQ_API_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_TOKEN}`
                },
                body: JSON.stringify({
                    model: process.env.GROQ_CHAT_COMPLETION_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: prompt
                        }
                    ]
                })
            });

            if ( completionResult.status !== 200 ) {
                throw new Error(`Error code: ${completionResult.status} - ${await completionResult.text()}`);
            }

            const completionResultJSON = await completionResult.json();            
            console.log(completionResultJSON.choices[0].message.content);
            await this.redisClient.set(`${job.data.jobUUID}-${this.STEP3.REDIS_KEY_RESULT}`, JSON.stringify(completionResultJSON.choices[0].message.content));

            await job.updateProgress(100/STEPS.TOTAL);
            return Promise.resolve();

        } catch ( error ) {
            this.logger.error(`${this.STEP3.LOG_PREFIX} (jobId :${job.id} - jobUUID:${job.data.jobUUID}) - ${error}`);
            return Promise.reject(error);
        }
        
    }

}
