
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

export function delay(time): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, time));  
}

/**
 * Make sure `yt-dlp` is installed and available in the PATH.
 */
export const checkSetup = async (): Promise<boolean> => {

    const { stdout, stderr } = await exec('yt-dlp --version');

    if ( stderr ) {
        throw new Error(`yt-dlp not found in PATH: ${stderr}`);
    } else {
        console.log('yt-dlp detected with version:', stdout);
        return true;
    }
}