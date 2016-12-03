'use strict';
import { ClientOptions, WebhookClient, Message, Collection } from 'discord.js';
import { IListener } from '../interfaces/Listener';
import Jarvis from '../client/Jarvis';

/**
 * Handle processing messages and logging anything
 * that involves a mention for me or includes my username
 */
export default class MentionListener extends WebhookClient implements IListener
{
	public constructor(id: string, token: string, options?: ClientOptions)
	{
		super(id, token, options);
	}

	/**
	 * Determine if the message concerns me via username or mention
	 */
	public async process(jarvis: Jarvis, message: Message): Promise<void>
	{
		if (!(message.isMentioned(jarvis.user.id)
			|| message.content.toLowerCase().includes(jarvis.user.username))
			|| message.author.bot) return;

		await new Promise(resolve => jarvis.setTimeout(() => resolve(), 30000));
		const messages: Collection<string, Message> = await message.channel.fetchMessages({limit: 20, around: message.id});

		this.sendSlackMessage({
			text: `Sir, you've been mentioned in **${message.guild.name}** ${message.channel}`,
			attachments: [{
				author_name: message.author.username,
				author_icon: message.author.avatarURL,
				text: message.content,
				color: '#00a4f0',
				ts: message.createdTimestamp / 1000
			},
			{
				title: 'I\'ve gathered some messages from around the mention for context:',
				text: messages
					.array()
					.sort((a: Message, b: Message) => a.createdTimestamp - b.createdTimestamp)
					.map(m => `**${m.author.username}**: ${m.content}`)
					.join('\n'),
				color: '#00a4f0'
			}]
		});
	}
}
