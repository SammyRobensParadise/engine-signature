import { Server } from 'socket.io';
import * as osc from 'osc';
import { average2D } from '../../utils/utils';
import { ErrorRecordings, ErrorValues, Message } from '../../local';
const {
  Parser,
  transforms: { unwind },
} = require('json2csv');

let threshold = 0.5;

let samplingSize = 10;

let average: number[][] = [];

let recordData = false;

let listen = false;

let initialTimestamp = 0;

let errorRecordings: ErrorRecordings = [];

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
          const samples: number[] = new Array(args.length);
          args.forEach((arg, index) => {
            samples[index] = arg.value;
          });
          average.push(samples);
          if (average.length >= samplingSize) {
            const averages = average2D(average);

            socket.emit('osc', { message: averages });
            /**
             * record each data point
             */
            if (recordData) {
              if (!errorRecordings.length) {
                initialTimestamp = Date.now();
              }
              const errorValues: ErrorValues[] = averages
                .map((sample, index): { name: string; value: number } => ({
                  name: `Feature-${index + 1}`,
                  value: sample,
                }))
                .filter((sample) => sample.value >= threshold);
              errorRecordings.push({
                samples: errorValues,
                timestamp: Date.now() - initialTimestamp,
              });
            }
            average = [];
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
      socket.on('clear-recordings', () => {
        errorRecordings = [];
      });

      socket.on('get-recordings', () => {
        const fields = ['timestamp', 'samples.name', 'samples.value'];
        const transforms = [unwind({ paths: ['samples', 'samples.samples'] })];
        const json2csvParser = new Parser({ fields, transforms });
        const csv = json2csvParser.parse(errorRecordings);
        socket.emit('recordings', { message: csv });
      });
    });
  }
  res.end();
};

export default SocketHandler;
