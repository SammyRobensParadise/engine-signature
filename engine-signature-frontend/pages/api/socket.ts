import { Server } from 'socket.io';
import * as osc from 'osc';

const udpReceive = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: 12000,
  metadata: true,
});

const SocketHandler = (_req: unknown, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on('connection', (socket) => {
      udpReceive.on('message', (oscMessage: any, time: number, info: any) => {
        socket.emit('osc', { message: oscMessage, time: time, info });
      });
    });
  }
  res.end();
};

export default SocketHandler;
