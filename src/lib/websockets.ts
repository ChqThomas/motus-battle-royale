import type { Server } from 'socket.io';

export default function initWebsockets(io: Server): void {
	io.on('connection', (socket) => {
		console.log('Client connected');
		socket.on('disconnect', () => console.log('Client disconnected'));

		socket.on('click', (data) => {
			console.log('click', data);
			socket.broadcast.emit('click');
		});
	});
	setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
}
