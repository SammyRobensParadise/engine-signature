import { Server } from 'socket.io';
import * as osc from 'osc';
import { average2D } from '../../utils/utils';
import { Message } from '../../local';

let threshold = 0.5;

let samplingSize = 10;

let average: number[][] = [];

let recordData = false;

const udpPort = new osc.UDPPort({
  localAddress: 'localhost',
  localPort: 12000,
  metadata: true,
});

const getIPAddresses = (): string[] => {
  var os = require('os'),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

  for (var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for (var i = 0; i < addresses.length; i++) {
      var addressInfo = addresses[i];
      if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }
  return ipAddresses;
};

const SocketHandler = (_req: unknown, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on('connection', (socket) => {
      console.log('connected');
      udpPort.on('ready', () => {
        const ipAddresses = getIPAddresses();
        console.log('Listening for OSC over UDP.');
        ipAddresses.forEach(function (address) {
          console.log(' Host:', address + ', Port:', udpPort.options.localPort);
        });
      });

      udpPort.on('message', function (oscMessage: Message) {
        socket.emit('osc', { message: oscMessage });
        if (recordData) {
          console.log('record Data...');
        }
      });

      udpPort.on('error', function (err: Error) {
        console.log(err);
      });

      socket.on('end', () => {
        socket.disconnect();
      });

      socket.on('threshold', (args: number) => {
        threshold = args / 100;
      });

      socket.on('size', (args: number) => {
        samplingSize = args;
      });

      socket.on('listen', () => {
        udpPort.open();
      });

      socket.on('record', () => {
        recordData = true;
      });
      socket.on('stop-recording', () => {
        recordData = false;
      });
      socket.on('stop', () => {
        udpPort.close();
      });
    });
  }
  res.end();
};

export default SocketHandler;
