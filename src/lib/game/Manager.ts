import type { Socket } from '$lib/websockets';
import _ from 'lodash';
import words from '$lib/wordsClean';
import allWords from '$lib/words';
import Room from '$lib/game/Room';
import type { Server } from '$lib/websockets';

const dictionnary = {};

allWords.forEach((word) => {
	const letter = word[0];
	const length = word.length;
	if (!(letter in dictionnary)) {
		dictionnary[letter] = {};
	}
	if (!(length in dictionnary[letter])) {
		dictionnary[letter][length] = [];
	}
	dictionnary[letter][length].push(word);
});

const proposableWords = words.filter((w) => {
	return w.length >= 5 && w.length <= 9 && allWords.includes(w);
});

export default class Manager {
	public rooms: Room[] = [];
	public io: Server;

	constructor(io: Server) {
		this.io = io;
	}

	public getOrCreateRoom(name: string): Room {
		let room = this.getRoom(name);
		if (!room) {
			room = new Room(this, name);
			this.rooms.push(room);
		}
		return room;
	}

	public getRandomWord(): string {
		return _.sample(proposableWords);
	}

	public checkWord(word: string): boolean {
		return dictionnary[word[0]][word.length].includes(word);
	}

	public getRoom(name: string): Room {
		return _.find(this.rooms, { name });
	}

	public removeRoom(name: string): void {
		_.remove(this.rooms, { name });
		console.log('remove room', name);
	}

	public addToRoom(socket: Socket, name: string): boolean {
		const room = this.getOrCreateRoom(name);
		return room.addPlayer(socket);
	}

	public disconnect(socket: Socket): void {
		const room = socket.data.joined;
		if (room) {
			room.removePlayer(socket);
			if (room.players.length === 0) {
				this.removeRoom(room.name);
			}
		}
	}
}
