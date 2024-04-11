import { config as configureDotenv } from 'dotenv';
import Graceful from 'node-graceful';
import * as process from 'node:process';
import { getResponse } from './answerProvider';
import Engine, { BotLauncher } from './Engine';

import { getLauncherFromEnv as getTelegramLauncherFromEnv } from './telegram';
import { getLauncherFromEnv as getDiscordLauncherFromEnv } from './discord';
import UnconfiguredException from './UnconfiguredException';

configureDotenv();

const bots: Array<BotLauncher> = [];
try {
    bots.push(getTelegramLauncherFromEnv());
} catch (err) {
    if (err instanceof UnconfiguredException) {
        console.info(err.message);
    } else {
        console.error(err);
    }
}

try {
    bots.push(getDiscordLauncherFromEnv());
} catch (err) {
    if (err instanceof UnconfiguredException) {
        console.info(err.message);
    } else {
        console.error(err);
    }
}

if (bots.length === 0) {
    console.error('No configured bots found. Exiting.');
    process.exit(1);
}

const engine = new Engine(getResponse, bots);
engine.start().then(() => console.log('Successfully started'));

Graceful.captureExceptions = true;
Graceful.on('exit', async () => {
    await engine.shutdown();
    process.exit();
});
