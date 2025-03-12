import TelegramBot from 'node-telegram-bot-api';
import type { BotLauncher, MessageHandler, ShutdownFunction } from './Engine';
import UnconfiguredException from './UnconfiguredException';

export function getLauncherFromEnv(): BotLauncher {
    let botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        botToken = process.env.BOT_TOKEN;
        if (!botToken) {
            throw new UnconfiguredException('Please specify the TELEGRAM_BOT_TOKEN env variable');
        }

        console.warn('BOT_TOKEN environment variable is deprecated. Use TELEGRAM_BOT_TOKEN instead');
    }

    return (handler) => launch(botToken, handler);
}

export async function launch(token: string, handler: MessageHandler): Promise<ShutdownFunction> {
    const telegram = new TelegramBot(token, {
        polling: true,
    });

    telegram.on('message', (message) => {
        const text = message.text || message.caption;
        if (!text) {
            return;
        }

        const response = handler({
            text,
            chat: message.chat.id.toString(),
            sender: message.from?.id.toString() || 'unknown', // TODO: handle that case
            sentAt: new Date(message.date * 1000),
        });
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
            if (message.sender_chat?.is_forum) {
                // If there are topics in the group, write to the correct one
                threadId = message.message_thread_id;
            } else if (message.reply_to_message?.sender_chat?.type === 'channel') {
                // This is the comment under the post
                replyToMessageId = message.message_thread_id;
            } else {
                // This is the reply to some comment under the post
                // TODO: This is not a perfect solution, as there is no way to distinguish between a reply to a comment
                //       under a post and a simple reply in a supergroup chat.
                //       But if I don't do this, the bot will post a response to a comment with a reply just
                //       to the group bound to the channel.
                //       This solution fixes comments under posts, but leads to the creation of unwanted quotes on
                //       messages with replies in supergroups.
                replyToMessageId = message.message_id;
            }
        }

        telegram.sendMessage(message.chat.id, response, {
            reply_to_message_id: replyToMessageId,
            message_thread_id: threadId,
        });
    });

    return () => telegram.stopPolling({ cancel: true });
}
