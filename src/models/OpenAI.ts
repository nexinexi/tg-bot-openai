import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import { ChatCompletionRequestMessage } from 'openai/api';
import axios from 'axios';

export class OpenAI {
  private readonly openapi: OpenAIApi;
  
  constructor(private token: string) {
    const configuration = new Configuration({
      apiKey: token,
    });
    
    this.openapi = new OpenAIApi(configuration);
  }
  
  public async createTranscription(audio: string) {
    try {
      const response = await this.openapi.createTranscription(
        // @ts-ignore
        fs.createReadStream(audio),
        'whisper-1'
      );
  
      return response.data.text;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
  
  public async createChatCompletion(messages: ChatCompletionRequestMessage[]) {
    try {
      const response = await this.openapi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      });
      
      return response.data.choices[0].message;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
  
  public async getUsage() {
    const url = 'https://api.openai.com/v1/usage';
    
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        params: {
          date: '2023-04-30',
        }
      });
      
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
}
