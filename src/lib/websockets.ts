import type { Server, Socket as IoSocket } from 'socket.io';
import _ from 'lodash';
import words from './words';
import Player from './game/Player';

type Socket = IoSocket & {
	player: Player;
	joined: Room;
};

type PlayerWord = {
	player: string;
	word: string;
};

type Room = {
	name: string;
	word?: string;
	players: Socket[];
	words: PlayerWord[];
};

class RoomManager {
	public rooms: Room[] = [];
	public io: Server;

	constructor(io: Server) {
		this.io = io;
	}

	public getOrCreateRoom(name: string) {
		let room = this.getRoom(name);
		if (!room) {
			room = {
				name,
				players: [],
				words: [],
			};
			this.rooms.push(room);
		}
		return room;
	}

	public getRandomWord() {
		return _.sample(words);
	}

	public getRoom(name: string): Room {
		return _.find(this.rooms, { name });
	}

	public removeRoom(name: string): void {
		_.remove(this.rooms, { name });
		console.log('remove room', name);
	}

	public addToRoom(socket: Socket, name: string) {
		const room = this.getOrCreateRoom(name);

		if (room.players.length >= 2) {
			return false;
		}

		room.players.push(socket);
		socket.join(name);
		socket.joined = room;
		console.log('join', socket.id, name);
		console.log('room players', name, room.players.length);

		this.io.to(room.name).emit('update-game-state', {
			players: room.players.map((socket) => socket.player.username),
		});

		if (room.players.length === 2) {
			this.startGame(room);
		}

		return true;
	}

	public disconnect(socket: Socket) {
		const room = socket.joined;
		if (room) {
			_.remove(room.players, { id: socket.id });
			console.log('removed from room', socket.id, room.name);
			if (room.players.length === 0) {
				this.removeRoom(room.name);
			}
		}
	}

	public async startGame(room: Room) {
		console.log('start game', room.name);
		this.io.to(room.name).emit('update-game-state', {
			state: 'starting',
		});
		await new Promise((r) => setTimeout(r, 3000));
		room.word = this.getRandomWord();
		console.log(room.word);
		this.io.to(room.name).emit('update-game-state', {
			state: 'started',
			word: room.word,
		});
	}

	public addWord(socket: Socket, word: string) {
		console.log('new word', socket.id, word);
		socket.joined.words.push({
			player: socket.player.username,
			word,
		});
		socket.to(socket.joined.name).emit('update-game-state', {
			state: 'started',
			opponentWords: _.map(
				socket.joined.words.filter((w) => w.player === socket.player.username),
				'word',
			),
		});

		if (word === socket.joined.word) {
			this.io.to(socket.joined.name).emit('update-game-state', {
				state: 'finished',
				winner: socket.id,
			});
		}
	}
}

export default async function initWebsockets(io: Server): Promise<void> {
	const manager = new RoomManager(io);

	io.on('connection', (socket: Socket) => {
		socket.player = new Player();

		console.log('Client connected');

		socket.emit('set-user', socket.player);

		socket.on('disconnect', () => {
			manager.disconnect(socket);
			console.log('Client disconnected');
		});

		socket.on('join-request', ({ room }) => {
			manager.addToRoom(socket, room);
		});

		socket.on('new-word', ({ word }) => {
			manager.addWord(socket, word);
		});
	});
	setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
}
