import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { BOT_NAME } from '../app.constants';
import {
  InjectBot,
  Update,
  Ctx,
  Start,
  Help,
  On,
  Hears,
} from 'nestjs-telegraf';
import { Context, Telegraf, Markup } from 'telegraf';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private botRepo: typeof Bot,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
  ) {}

  async start(ctx: Context) {
    const user_id = ctx.from.id;
    const user = await this.botRepo.findOne({ where: { user_id } });
    if (!user) {
      await this.botRepo.create({
        user_id: user_id,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        username: ctx.from.username,
      });
      await ctx.reply(
        `Iltimos, <b> "Telefon raqamni yuborish"</b> tugmasini bosing!`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('Telefon raqamni yuborish')],
          ])
            .oneTime()
            .resize(),
        },
      );
    } else if (!user.dataValues.status) {
      await ctx.reply(
        `Iltimos, <b> "Telefon raqamni yuborish"</b> tugmasini bosing!`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('Telefon raqamni yuborish')],
          ])
            .oneTime()
            .resize(),
        },
      );
    } else {
      await this.bot.telegram.sendChatAction(user_id, 'typing');
      await ctx.reply(
        "Bu bot orqali Stadium dasturi bilan muloqot o'rnatiladi",
        {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        },
      );
    }
  }

  async onContact(ctx: Context) {
    if ('contact' in ctx.message) {
      const user_id = ctx.from.id;
      const user = await this.botRepo.findOne({ where: { user_id } });
      if (!user) {
        ctx.reply(`Iltimos, <b>Start</b> tugmasini bosing!`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .oneTime()
            .resize(),
        });
      } else if (ctx.message.contact.user_id != user_id) {
        await ctx.reply("Iltimos, o'zingizni telefon raqamingizni kiriting!", {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('Telefon raqamni yuborish')],
          ])
            .oneTime()
            .resize(),
        });
      } else {
        let phone: string;
        ctx.message.contact.phone_number[0] == '+'
          ? (phone = ctx.message.contact.phone_number)
          : (phone = '+' + ctx.message.contact.phone_number);
        await this.botRepo.update(
          { phone_number: phone, status: true },
          { where: { user_id } },
        );
        await ctx.reply(`124545`, {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        });
      }
    }
  }

  async onStop(ctx: Context) {}

  async sendOTP(phone_number: string, OTP: string): Promise<boolean> {
    const user = await this.botRepo.findOne({ where: { phone_number } });
    if (!user) return false;
    await this.bot.telegram.sendChatAction(user.user_id, 'typing');
    await this.bot.telegram.sendMessage(user.user_id, 'Verify code:' + OTP);
    return true;
  }
}
