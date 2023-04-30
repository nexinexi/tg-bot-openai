import { Telegram } from 'telegraf';
import axios from 'axios';
import { DownloadError } from './Error';
import * as fs from 'fs';

export class TelegramClient {
  protected readonly client: Telegram;
  static API_URL = 'https://api.telegram.org';
  
  constructor(client: Telegram) {
    this.client = client;
  }
  
  async downloadFile(fileId: string, outputDir: string) {
    try {
      const { file_path } = await this.client.getFile(fileId);
      const url = `${TelegramClient.API_URL}/file/bot${this.client.token}/${file_path}`;
      const response = await axios.get(url, { responseType: 'stream' });
      const fileName = response.data.responseUrl.split('/').pop();
      const localFilePath = `${outputDir}/${fileName}`;
      const writeStream = fs.createWriteStream(localFilePath);
      
      response.data.pipe(writeStream);
      
      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => {
          resolve();
        });
        writeStream.on('error', (error) => {
          try {
            fs.unlinkSync(localFilePath);
            reject(error);
          } catch (e) {
            reject(e);
          }
        });
      });
      
      return localFilePath;
    } catch (err) {
      throw new DownloadError('Failed to download file');
    }
  }
}
