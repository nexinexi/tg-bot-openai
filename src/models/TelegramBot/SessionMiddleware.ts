import { ChatCompletionRequestMessage } from 'openai/api';
import { Context } from 'telegraf';

export type StoredMessage = Omit<ChatCompletionRequestMessage, 'name'>;

export interface SessionData {
  messages: StoredMessage[];
}

export interface SessionStorage {
  [key: number]: SessionData;
}

export class SessionMiddleware {
  private readonly sessions: SessionStorage;

  constructor() {
    this.sessions = {}
  }

  register() {
    return (ctx: Context, next: () => Promise<void>) => {
      const userId = ctx.message?.from?.id;

      if (!userId) {
        return next();
      }
      
      (ctx as any).session = this.sessions[userId] || { messages: [] };
  
      return next().then(() => {
        this.sessions[userId] = (ctx as any).session;
      });
    }
  }
}
