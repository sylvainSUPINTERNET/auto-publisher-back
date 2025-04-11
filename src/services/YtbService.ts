import { Injectable, Logger } from "@nestjs/common";
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const path = require('node:path');
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class YtbService {
  private readonly logger = new Logger(YtbService.name);

  constructor( ) { }

    /**
     * 
     * @param youtubeUrl 
     * @param startTime string 00:00:00 format
     * @param endTime  string 00:00:00 format
     * @returns 
     */
    public async downloadAudio(youtubeUrl:string, startTime:string, endTime:string): Promise<Record<string, string>> {
      //const output:string = path.resolve(process.cwd(), "downloads", `${uuidv4()}_%(title)s.%(ext)s`);

      let uid = uuidv4();
      let extension = "opus";

      const output:string = path.resolve(process.cwd(), "downloads", `${uid}.%(ext)s`);
      const cmd = `yt-dlp -x --audio-format opus "${youtubeUrl}" --postprocessor-args "-ss ${startTime} -to ${endTime}" -o "${output}"`;
      const { stdout, stderr } = await exec(cmd);
  
      this.logger.log(`yt-dlp stdout: ${stdout}`);

      // Becareful becasue stderr contains also WARN messages !!!
      return {
        filePath: path.resolve(process.cwd(), "downloads",`${uid}.${extension}`),
        fileName: `${uid}.${extension}`
      };
    }
}