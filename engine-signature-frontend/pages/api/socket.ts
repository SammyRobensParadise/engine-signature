import { Server } from 'socket.io';

const SocketHandler = (_req: unknown, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('osc', (msg) => {
        socket.broadcast.emit('osc', msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;
