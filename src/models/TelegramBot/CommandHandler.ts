import { Context, Telegraf } from 'telegraf';
import { OpenAI } from '../OpenAI';

export class CommandHandler {
  private readonly openAI: OpenAI;

  constructor(private bot: Telegraf<Context>) {
    this.openAI = new OpenAI(process.env.OPENAI_TOKEN!);
  }

  public registerCommands() {
    this.start();
    this.info();
    this.resetContext();
    // this.usage();

    this.bot.telegram.setMyCommands([
      { command: 'info', description: 'Info about bot' },
      { command: 'reset', description: 'reset' },
      // { command: 'usage', description: 'Usage for current period'},
    ]);
  }

  private start() {
    this.bot.start(async (ctx) => ctx.reply('Welcome!'));
  }

  private info() {
    this.bot.command('info', async (ctx) => ctx.reply('Info.'));
  }

  private async usage() {
    try {
      // const usage = await this.openAI.getUsage();
    } catch (err) {
      console.log(err);
    }
  }

  private resetContext() {
    this.bot.command('reset', async (ctx) => {
      (ctx as any).session.messages = [];

      return ctx.reply('Текущий контекст сброшен.');
    });
  }
}
