import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
export class SoundConverter {
  protected readonly inputFile: string;
  protected readonly outputFile?: string;
  
  constructor(inputFile: string, outputFile?: string) {
    this.inputFile = inputFile;
    this.outputFile = outputFile;
  }
}

export class OgaConverter extends SoundConverter {
  constructor(inputFile: string, outputFile?: string) {
    super(inputFile, outputFile);
  }
  
  toMp3() {
    try {
      const savePath = this.outputFile ?? (() => {
        const [path] = this.inputFile.split('.');
        return path + '.mp3';
      })();
      
      return new Promise<string>((resolve) => {
        ffmpeg(this.inputFile)
          .toFormat('mp3')
          .on('end', () => resolve(savePath))
          .save(savePath);
      })
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
}
