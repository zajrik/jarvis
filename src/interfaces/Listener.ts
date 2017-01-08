import { Message } from 'discord.js';
import Jarvis from '../client/Jarvis';

/**
 * Interface to implement for processing messages
 * with the intent of listening for certain conditions
 */
export interface IListener
{
	/**
	 * Method where message handling will be done. All messages
	 * are to be passed to this method on child listeners for
	 * processing
	 */
	process(jarvis: Jarvis, message: Message): Promise<void>;
}
