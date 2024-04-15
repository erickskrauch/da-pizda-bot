import { ChannelType, Client as DiscordClient, Events, GatewayIntentBits, Partials } from 'discord.js';
import { escapeMarkdown } from '@discordjs/formatters';
import { BotLauncher, MessageHandler, ShutdownFunction } from './Engine';
import UnconfiguredException from './UnconfiguredException';
import { markdownToTxt } from './markdown';

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
                GatewayIntentBits.DirectMessages,
            ],
            partials: [
                Partials.Channel,
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

            const text = message.content;
            if (!text) {
                return;
            }

            const response = handler({
                text: markdownToTxt(text),
                chat: message.channelId,
                sender: message.author.id,
                sentAt: message.createdAt,
            });
            if (!response) {
                return;
            }

            if (message.channel.type === ChannelType.DM) {
                message.author.send(escapeMarkdown(response)).catch(console.error);
            } else {
                message.channel.send(escapeMarkdown(response)).catch(console.error);
            }
        });

        discord.on(Events.Error, console.error);
    });
}
