import { Message, Collection } from 'discord.js';
import { IListener } from '../interfaces/Listener';
import Jarvis from '../client/Jarvis';

export default class BangListener implements IListener
{
	public constructor() {}

	/**
	 * Listen for bash-like bang commands for re-sending
	 * previous messages, ideally commands
	 */
	public async process(jarvis: Jarvis, message: Message): Promise<any>
	{
		if (message.author.id !== jarvis.user.id) return;
		const bangRegex: RegExp = /^!(?:!|\-(\d+))$/;
		if (!bangRegex.test(message.content.trim())) return;
		message.delete();
		let select: number;
		if (message.content.trim() === '!!') select = 1;
		else select = parseInt(message.content.trim().match(bangRegex)[1]);
		const messages: Message[] = (await message.channel.fetchMessages({ limit: 100 }))
			.filter((m: Message) => m.author.id === jarvis.user.id && m.id !== message.id)
			.array()
			.reverse();
		const selected: Message = messages[Math.max(0, Math.min(messages.length, messages.length - select))];
		message.channel.send(selected.content);
	}
}
