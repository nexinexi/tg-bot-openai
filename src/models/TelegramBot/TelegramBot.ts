import { Context, Telegraf } from 'telegraf';
import { CommandHandler } from './CommandHandler';
import { EventHandler } from './EventHandler';
import { SessionMiddleware } from './SessionMiddleware';

class TelegramBot {
  private readonly bot: Telegraf<Context>;
  
  constructor(private token: string) {
    const sessionMiddleware = new SessionMiddleware();
    
    this.bot = new Telegraf(token);
    this.bot.use(sessionMiddleware.register())
    
    const commandHandler = new CommandHandler(this.bot);
    const eventHandler = new EventHandler(this.bot);
    
    commandHandler.registerCommands();
    eventHandler.registerEvents();
  }
  
  async start() {
    return this.bot.launch();
  }
}

export default TelegramBot;
