import { Ctx, Start, Update, On } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.botService.start(ctx);
  }

//   @Help()
//   async help(@Ctx() ctx: TelegrafContext) {
//     await ctx.reply('Send me a sticker');
//   }

//   @On('sticker')
//   async on(@Ctx() ctx: TelegrafContext) {
//     await ctx.reply('👍');
//   }

//   @Hears('hi')
//   async hears(@Ctx() ctx: TelegrafContext) {
//     await ctx.reply('Hey there');
//   }

  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    return this.botService.onContact(ctx);
  }
}
