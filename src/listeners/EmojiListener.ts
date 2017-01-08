import { Message } from 'discord.js';
import { IListener } from '../interfaces/Listener';
import Jarvis from '../client/Jarvis';
import * as e from 'node-emoji';

export default class EmojiListener implements IListener
{
	public constructor() {}

	/**
	 * Listen for `+:emoji:` type messages to effectively
	 * implement the feature for mobile client use since
	 * I don't currently have that feature on android
	 */
	public async process(jarvis: Jarvis, message: Message): Promise<any>
	{
		if (message.author.id !== jarvis.user.id) return;
		if (!message.content.startsWith('+')) return;
		message.delete();
		const m: string = message.content.slice(1).trim();
		const parseCustom: RegExp = /\<:[^:]+:(\d+)\>/;
		const emoji: string = e.which(m) || parseCustom.test(m) ? m.match(parseCustom)[1] : null;
		const toReact: Message = (await message.channel
			.fetchMessages({ limit: 1, before: message.id })).first();
		if (!emoji || !toReact) return;
		return toReact.react(jarvis.emojis.get(emoji) || e.get(emoji));
	}
}
