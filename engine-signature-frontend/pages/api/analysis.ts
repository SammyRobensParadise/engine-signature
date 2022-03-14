import { Server } from 'socket.io';
import * as osc from 'osc';

let threshold = 0.5;
const udpPort = new osc.UDPPort({
  localAddress: 'localhost',
  localPort: 12000,
  metadata: true,
});

const getIPAddresses = function () {
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

const Analysis = (_req: unknown, res: any) => {
  if (res.socket.server.io) {
    console.log('Analysis Socket is already running');
  } else {
    console.log('Analysis Socket is initializing...');

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      udpPort.open();
      console.log('connected');
      udpPort.on('ready', () => {
        var ipAddresses = getIPAddresses();
        console.log('Listening for OSC over UDP.');
        ipAddresses.forEach(function (address) {
          console.log(' Host:', address + ', Port:', udpPort.options.localPort);
        });
      });
      udpPort.on('message', function (oscMessage: any) {
        console.log(oscMessage);
      });

      udpPort.on('error', function (err: any) {
        console.log(err);
      });
      socket.on('end', () => {
        socket.disconnect();
      });

      socket.on('threshold', (args: number) => {
        threshold = args / 100;
      });
    });
  }
  res.end();
};

export default Analysis;
