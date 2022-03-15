import { Server } from 'socket.io';
import * as osc from 'osc';
import { average2D } from '../../utils/utils';
import { Message } from '../../local';

let threshold = 0.5;

let samplingSize = 10;

let average: number[][] = [];

let recordData = false;

let listen = false;

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
        ipAddresses.forEach((address) => {
          console.log(' Host:', address + ', Port:', udpPort.options.localPort);
        });
      });

      udpPort.on('message', function (oscMessage: Message) {
        /**
         * only do the following if we should be listening to the UDP Socket
         */
        if (listen) {
          /**
           * get the moving average values and send them to the frontend
           * via the websocket
           */
          const { args } = oscMessage;
          const e: number[] = new Array(args.length);
          args.forEach((arg, index) => {
            e[index] = arg.value;
          });
          average.push(e);
          if (average.length >= samplingSize) {
            const averages = average2D(average);
            socket.emit('osc', { message: averages });
            average = [];
          }
          /**
           * record each data point
           */
          if (recordData) {
          }
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
        listen = true;
        udpPort.open();
      });

      socket.on('record', () => {
        recordData = true;
      });
      socket.on('stop-recording', () => {
        recordData = false;
      });
      socket.on('close', () => {
        listen = false;
      });
    });
  }
  res.end();
};

export default SocketHandler;
