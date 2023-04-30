import { Context } from 'telegraf';
import { SessionData } from './SessionMiddleware';

declare module 'telegraf' {
  interface Context {
    session: SessionData;
  }
}
