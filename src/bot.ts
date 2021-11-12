import TelegramBot from 'node-telegram-bot-api';
import { config as configureDotenv } from 'dotenv';
import { getResponse } from './engine';

configureDotenv();

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
    throw new Error('Please specify the BOT_TOKEN env variable');
}

const bot = new TelegramBot(botToken, {
    polling: true,
});

bot.on('message', (message) => {
    const chatId = message.chat.id;
    const text = message.text || message.caption;
    if (!text) {
        return;
    }

    const response = getResponse(text);
    if (!response) {
        return;
    }

    bot.sendMessage(chatId, response);
});
