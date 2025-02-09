export function delay(time): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, time));  
}