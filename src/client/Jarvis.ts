import { Bot, BotOptions } from 'yamdbf';
import { ClientOptions, TextChannel, Message } from 'discord.js';
import MentionListener from '../listeners/MentionListener';
import TodoListener from '../listeners/TodoListener';
import EmojiListener from '../listeners/EmojiListener';

/**
 * Extend Bot class to allow for extra properties and
 * necessary method extensions 
 */
export default class Jarvis extends Bot
{
	private mentionListener: MentionListener;
	private todoListener: TodoListener;
	private emojiListener: EmojiListener;

	public jarvisIcon: string;

	public constructor(botOptions: BotOptions, clientOptions?: ClientOptions)
	{
		super(botOptions, clientOptions);
		const wh: any = (<any> botOptions.config).wh;
		this.mentionListener = new MentionListener(wh.mention.id, wh.mention.token);
		this.todoListener = new TodoListener(wh.todo.id, wh.todo.token);
		this.emojiListener = new EmojiListener();

		this.jarvisIcon = (<any> botOptions.config).icon;
		this.once('ready', this.ready);
	}

	/**
	 * Register the message listener for sending messages
	 * to all listeners for processing
	 */
	private ready(): void
	{
		this.on('message', message =>
		{
			this.emojiListener.process(this, message);
			this.mentionListener.process(this, message);
			this.todoListener.process(this, message);
		});
	}

	/**
	 * Send message as Jarvis, utilizing an embed for formatting
	 */
	public async say(channel: TextChannel, text: string): Promise<Message>
	{
		const embed: any = {
			author: {
				name: 'Jarvis',
				icon_url: this.jarvisIcon
			},
			color: parseInt('00a4f0', 16),
			description: text
		};

		return <Message> await channel.sendMessage('', <any> { embed: embed });
	}
}
