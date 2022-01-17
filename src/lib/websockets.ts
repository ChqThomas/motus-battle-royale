import type { Server, Socket as IoSocket } from 'socket.io';
import _ from 'lodash';
import words from './words';
import Player from './game/Player';
import type { RoomState } from '../global';

type Socket = IoSocket & {
	player: Player;
	joined: Room;
};

type PlayerWord = {
	player: string;
	word: string;
};

type Room = {
	state: RoomState;
	name: string;
	word?: string;
	players: Socket[];
	words: PlayerWord[];
	winner?: Player;
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
				state: 'waiting',
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

		// On ne peut pas rejoindre une partie lancée, ni rejoindre deux fois la même room
		if (room.state !== 'waiting' || _.find(room.players, socket)) {
			return false;
		}

		// Le premier joueur devient le propriétaire de la room
		if (room.players.length === 0) {
			socket.player.owner = true;
		}

		room.players.push(socket);
		socket.join(name);
		socket.joined = room;
		console.log('join', socket.id, name);
		console.log('room players', name, room.players.length);

		this.io.to(room.name).emit('update-game-state', {
			players: room.players.map((socket) => socket.player),
		});

		return true;
	}

	public disconnect(socket: Socket) {
		const room = socket.joined;
		if (room) {
			_.remove(room.players, { id: socket.id });
			console.log('removed from room', socket.id, room.name);
			if (room.players.length === 0) {
				this.removeRoom(room.name);
			} else {
				// On transfert le statut de propriétaire à un autre joueur
				if (socket.player.owner === true) {
					room.players[0].player.owner = true;
				}
				this.io.to(room.name).emit('update-game-state', {
					players: room.players.map((socket) => socket.player),
				});
			}
		}
	}

	public async startGame(room: Room) {
		console.log('start game', room.name);
		room.state = 'starting';
		this.io.to(room.name).emit('update-game-state', {
			state: room.state,
		});
		await new Promise((r) => setTimeout(r, 3000));
		room.word = this.getRandomWord();
		room.state = 'started';
		console.log(room.word);
		this.io.to(room.name).emit('update-game-state', {
			state: room.state,
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
			opponentWords: socket.joined.words,
		});

		if (word === socket.joined.word) {
			socket.joined.winner = socket.player;
			this.io.to(socket.joined.name).emit('update-game-state', {
				state: 'finished',
				winner: socket.player.username,
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

		socket.on('start-game', () => {
			manager.startGame(socket.joined);
		});
	});
	setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
}
