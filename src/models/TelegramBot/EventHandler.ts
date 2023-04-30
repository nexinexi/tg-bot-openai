import { Context, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import path from 'path';
import { createDirIfDoesntExists } from '../../utils/createDirIfDoesntExists';
import { OgaConverter } from '../SoundConverter';
import { TelegramClient } from '../TelegramClient';
import { OpenAI } from '../OpenAI';
import * as process from 'process';
import { code } from 'telegraf/format';

export class EventHandler {
  private readonly telegramClient: TelegramClient;
  private readonly openAI: OpenAI;
  
  constructor(private bot: Telegraf<Context>) {
    this.telegramClient = new TelegramClient(bot.telegram);
    this.openAI = new OpenAI(process.env.OPENAI_TOKEN!);
  }
  
  registerEvents() {
    this.onTextMessage();
    this.onVoiceMessage();
  }
  
  onTextMessage() {
    this.bot.on(message('text'), async (ctx) => {
      try {
        await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  
        (ctx as any).session.messages.push({
          role: 'user',
          content: ctx.message.text,
        });
  
        const response = await this.openAI.createChatCompletion((ctx as any).session.messages);
  
        if (response) {
          (ctx as any).session.messages.push(response);
    
          return ctx.reply(response.content)
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
  
  onVoiceMessage() {
    this.bot.on(message('voice'), async (ctx) => {
      await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
      
      const { file_id } = ctx.message.voice;
  
      try {
        const userVoicesDir = path.resolve(__dirname, `../../../voices/${ctx.message.from.id}`);
    
        createDirIfDoesntExists(userVoicesDir);
    
        const filePath = await this.telegramClient.downloadFile(file_id, userVoicesDir);
        const ogaConverter = new OgaConverter(filePath);
        const convertedAudioPath = await ogaConverter.toMp3();
        const text = await this.openAI.createTranscription(convertedAudioPath);
        
        await ctx.reply(code(`${text.endsWith('?') ? 'Ваш вопрос:' : 'Ваше сообщение:'} ${text}`));
        await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
        
        (ctx as any).session.messages.push({
          role: 'user',
          content: text,
        });
        
        const response = await this.openAI.createChatCompletion((ctx as any).session.messages);
        
        if (response) {
          (ctx as any).session.messages.push(response);
  
          return ctx.reply(response.content)
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
}
