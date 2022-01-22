import Player from './game/Player';
import type { GameState } from '$lib/types';
import type { Server as IoServer, Socket as IoSocket } from 'socket.io';
import type Room from '$lib/game/Room';
import Manager from '$lib/game/Manager';

export type Socket = IoSocket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type Server = IoServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export interface ServerToClientEvents {
	'set-user': (player: Player) => void;
	'update-game-state': (gameState: GameState) => void;
}

export interface ClientToServerEvents {
	'start-game': () => void;
	'reset-game': () => void;
	'new-word': ({ word: any }, callback: ({ valid: boolean }) => void) => void;
	'join-request': ({ room: string }) => void;
	'set-username': (username: string) => void;
}

export interface InterServerEvents {
	iCantBeEmpty: () => void;
}

export interface SocketData {
	player: Player;
	joined: Room;
}

export default async function initWebsockets(io: Server): Promise<void> {
	const manager = new Manager(io);

	io.on('connection', (socket: Socket) => {

		console.log(socket.handshake.query.username);

		socket.data = {
			player: new Player(socket.id, typeof socket.handshake.query.username === "string" ? socket.handshake.query.username : null),
		};

		console.log(socket.data);

		socket.emit('set-user', socket.data.player);

		socket.on('set-username', (username) => {
			socket.data.player.username = username;
			socket.data.joined.updateClientGameState();
			socket.emit("set-user", socket.data.player);
		});

		socket.on('disconnect', () => {
			manager.disconnect(socket);
			console.log('Client disconnected');
		});

		socket.on('join-request', ({ room }) => {
			manager.addToRoom(socket, room);
		});

		socket.on('new-word', ({ word }, callback) => {
			const valid = manager.checkWord(word);
			if (valid) {
				socket.data.joined.addWord(socket, word);
			}
			callback({
				valid,
			});
		});

		socket.on('start-game', () => {
			socket.data.joined.startGame();
		});

		socket.on('reset-game', () => {
			socket.data.joined.resetGame();
		});
	});
}
