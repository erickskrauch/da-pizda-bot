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
            // If there are topics in the group, write a reply to it.
            // Otherwise, it's a comment under a post in the linked group
            if (message.sender_chat?.is_forum) {
                threadId = message.message_thread_id;
            } else {
                replyToMessageId = message.message_thread_id;
            }
        }

        telegram.sendMessage(message.chat.id, response, {
            reply_to_message_id: replyToMessageId,
            message_thread_id: threadId,
        });
    });

    return () => telegram.stopPolling({ cancel: true });
}
