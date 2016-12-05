'use strict';
import { ClientOptions, WebhookClient, Message, TextChannel } from 'discord.js';
import { IListener } from '../interfaces/Listener';
import Jarvis from '../client/Jarvis';

/**
 * Handle processing messages and catching any todo
 * messages that need saving
 */
export default class TodoListener extends WebhookClient implements IListener
{
	public constructor(id: string, token: string, options?: ClientOptions)
	{
		super(id, token, options);
	}

	/**
	 * Determine if the message contains a todo item and
	 * handle it if it does
	 */
	public async process(jarvis: Jarvis, message: Message): Promise<void>
	{
		if (!(message.content.toLowerCase().includes('todo:')
			&& message.author === jarvis.user)
			|| message.content.startsWith('`')) return;

		const todo: string = this.prepareTodo(message.content);

		this.sendSlackMessage({
			attachments: [{
				title: 'Todo:',
				text: todo,
				color: '#00a4f0',
				ts: message.createdTimestamp / 1000
			}]
		});

		const channel: TextChannel = <TextChannel> message.channel;
		const output: string = `Sir, I've saved this todo for you:\n_${todo}_`;
		jarvis.say(channel, output).then((res: Message) => res.delete(30000));
	}

	/**
	 * Slice out the content of the todo, following a colon
	 * in the text. The colon is presumed to proceed `todo`
	 */
	private prepareTodo(content: string): string
	{
		return content.slice(content.indexOf(':') + 1, content.length).trim();
	}
}
