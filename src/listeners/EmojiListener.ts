import { Message } from 'discord.js';
import { IListener } from '../interfaces/Listener';
import Jarvis from '../client/Jarvis';
import * as e from 'node-emoji';
import * as runes from 'runes';

export default class EmojiListener implements IListener
{
	public constructor() {}

	/**
	 * Listen for `+:emoji:` messages and recursively react with
	 * all the given emojis and custom emojis to the most recent
	 * message before the command
	 */
	public async process(jarvis: Jarvis, message: Message, id?: string): Promise<any>
	{
		if (message.author.id !== jarvis.user.id) return;
		if (!message.content.startsWith('+')) return;
		if (!id) message.delete();
		let m: string = message.content.slice(1).trim();
		const findCustom: RegExp = /\<:[^:]+:\d+\>/g;
		const parseCustom: RegExp = /\<:[^:]+:(\d+)\>/;
		const customEmojis: string[] = m.match(findCustom);
		m = m.replace(findCustom, '');

		let emojis: string[] = runes(m).map((a: string) => a.trim()).filter((a: string) => a !== '');
		let emoji: string;

		if (emojis && emojis.length > 0) emoji = e.which(emojis.shift());
		else if (customEmojis && customEmojis.length > 0) emoji = customEmojis.shift().match(parseCustom)[1];

		const toReact: Message = id ? await message.channel.fetchMessage(id)
			: (await message.channel.fetchMessages({ limit: 1, before: message.id })).first();
		if (!emoji || !toReact) return;

		toReact.react(jarvis.emojis.get(emoji) || e.get(emoji));
		emojis = emojis.concat(customEmojis);
		if (emojis && emojis.length > 0)
		{
			message.content = `+${emojis.join('')}`;
			this.process(jarvis, message, toReact.id);
		}
	}
}
