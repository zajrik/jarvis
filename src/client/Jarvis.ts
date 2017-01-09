import { Bot, BotOptions } from 'yamdbf';
import { ClientOptions, TextChannel, Message, RichEmbed } from 'discord.js';
import MentionListener from '../listeners/MentionListener';
import TodoListener from '../listeners/TodoListener';
import EmojiListener from '../listeners/EmojiListener';
import BangListener from '../listeners/BangListener';

/**
 * Extend Bot class to allow for extra properties and
 * necessary method extensions 
 */
export default class Jarvis extends Bot
{
	private mentionListener: MentionListener;
	private todoListener: TodoListener;
	private emojiListener: EmojiListener;
	private bangListener: BangListener;

	public jarvisIcon: string;

	public constructor(botOptions: BotOptions, clientOptions?: ClientOptions)
	{
		super(botOptions, clientOptions);
		const wh: any = (<any> botOptions.config).wh;
		this.mentionListener = new MentionListener(wh.mention.id, wh.mention.token);
		this.todoListener = new TodoListener(wh.todo.id, wh.todo.token);
		this.emojiListener = new EmojiListener();
		this.bangListener = new BangListener();

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
			this.bangListener.process(this, message);
		});
	}

	/**
	 * Send message as Jarvis, utilizing an embed for formatting
	 */
	public async say(channel: TextChannel, text: string): Promise<Message>
	{
		const embed: RichEmbed = new RichEmbed()
			.setAuthor('Jarvis', this.jarvisIcon)
			.setColor('#00a4f0')
			.setDescription(text);

		return <Message> await channel.sendEmbed(embed);
	}
}
