export type AnswerProvider = (input: string) => string|undefined;
export type ShutdownFunction = () => Promise<void>;
export interface Message {
    text: string;
    sender: string;
    chat: string;
    sentAt: Date;
}
export type MessageHandler = (message: Message) => string|undefined;
export type BotLauncher = (messageHandler: MessageHandler) => Promise<ShutdownFunction>;

export default class Engine {

    #botsShutdowns: Array<ShutdownFunction> = [];

    constructor(
        private answerProvider: AnswerProvider,
        private botsLaunchers: ReadonlyArray<BotLauncher>,
    ) {
    }

    async start(): Promise<void> {
        this.#botsShutdowns = await Promise.all(this.botsLaunchers.map((launch) => launch(this.onMessage)));
    }

    onMessage: MessageHandler = (message) => {
        // Don't react to the old messages
        if (message.sentAt.getTime() < Date.now() - 5_000) {
            return;
        }

        return this.answerProvider(message.text);
    }

    async shutdown(): Promise<void> {
        await Promise.all(this.#botsShutdowns.map((shutdownFn) => shutdownFn()));
    }

}
