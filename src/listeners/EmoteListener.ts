import { Message } from 'discord.js';
import { IListener } from '../interfaces/Listener';
import Jarvis from '../client/Jarvis';

export default class Emote implements IListener
{
	public constructor() {}

	/**
	 * Handle storage and recollection of emote-style tags. Replace
	 * any tags in a message with the actual stored tag
	 */
	public async process(jarvis: Jarvis, message: Message): Promise<any>
	{
		if (message.author.id !== jarvis.user.id) return;
		const parseEmoteAssignment: RegExp = /^\[([^\]]+)\] ?= ?(.+)$/;
		const parseAllEmotes: RegExp = /\[[^\]]+\]/g;
		const parseEmote: RegExp = /\[([^\]]+)\]/;
		let m: string = message.content;
		if (!parseEmote.test(m)) return;

		const assign: RegExpMatchArray = m.match(parseEmoteAssignment);
		if (assign)
		{
			jarvis.storage.setItem(assign[1], assign[2]);
			return message.edit(`Saved emote [${assign[1]}]: ${assign[2]}`);
		}

		const foundEmotes: RegExpMatchArray = m.match(parseAllEmotes)
			.map(a => a.match(parseEmote)[1]);

		for (let emote of foundEmotes)
			if (jarvis.storage.exists(emote))
				m = m.replace(`[${emote}]`, jarvis.storage.getItem(emote));

		if (m !== message.content) return message.edit(m);
	}
}
