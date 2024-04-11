import { Client as DiscordClient, Events, GatewayIntentBits } from 'discord.js';
import { BotLauncher, MessageHandler, ShutdownFunction } from './Engine';
import UnconfiguredException from './UnconfiguredException';

export function getLauncherFromEnv(): BotLauncher {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
        throw new UnconfiguredException('Please specify the DISCORD_BOT_TOKEN env variable');
    }

    return (handler) => launch(token, handler);
}

export function launch(token: string, handler: MessageHandler): Promise<ShutdownFunction> {
    return new Promise((resolve, reject) => {
        const discord = new DiscordClient({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
        discord.login(token).then(() => {
            resolve(discord.destroy);
        }).catch(reject);

        discord.on(Events.MessageCreate, (message) => {
            // Don't react to other bots messages
            if (message.author.bot) {
                return;
            }

            // Don't react to the old messages
            if (message.createdTimestamp < (Date.now() / 1000) - 5) {
                return;
            }

            const text = message.content;
            if (!text) {
                return;
            }

            const response = handler({
                text,
                chat: message.channelId,
                sender: message.author.id,
                sentAt: message.createdAt,
            });
            if (!response) {
                return;
            }

            message.channel.send(response).catch(console.error);
        });

        discord.on(Events.Error, console.error);
    });
}
