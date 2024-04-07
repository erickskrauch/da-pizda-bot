import TelegramBot from 'node-telegram-bot-api';
import { config as configureDotenv } from 'dotenv';
import Graceful from 'node-graceful';
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
    // Don't react to the old messages
    if (message.date < (Date.now() / 1000) - 5) {
        return;
    }

    const text = message.text || message.caption;
    if (!text) {
        return;
    }

    const response = getResponse(text);
    if (!response) {
        return;
    }

    let replyToMessageId: number|undefined = undefined;
    let threadId: number|undefined = undefined;
    // React to a post on the channel that showed up in the linked group
    if (message.is_automatic_forward) {
        replyToMessageId = message.message_id;
    }

    if (message.message_thread_id) {
        // If there are topics in the group, write a reply to it.
        // Otherwise, it's a comment under a post in the linked group
        if (message.sender_chat?.is_forum) {
            threadId = message.message_thread_id;
        } else {
            replyToMessageId = message.message_thread_id;
        }
    }

    bot.sendMessage(message.chat.id, response, {
        reply_to_message_id: replyToMessageId,
        message_thread_id: threadId,
    });
});

Graceful.captureExceptions = true;
Graceful.on('exit', async () => {
    await bot.stopPolling({ cancel: true });
    process.exit();
});
