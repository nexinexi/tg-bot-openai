import TelegramBot from './models/TelegramBot';

const bot = new TelegramBot(process.env.BOT_TOKEN!);

bot.start();
