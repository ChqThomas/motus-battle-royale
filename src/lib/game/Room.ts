import type { Socket } from 'socket.io';

export default class Room {
	public name: string;
	public word: string;
	public players: Socket[];
}
