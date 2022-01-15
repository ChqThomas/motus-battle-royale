import { handler } from './build/handler.js';
import http from 'http';
import { Server } from 'socket.io';
import initWebsockets from './dist/websockets.js';

const port = process.env.PORT || 3000;

const app = http.createServer(handler);

initWebsockets(new Server(app));

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
