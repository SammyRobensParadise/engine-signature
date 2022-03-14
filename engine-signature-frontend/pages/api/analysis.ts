import { Server } from 'socket.io';
import * as osc from 'osc';

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

  udpPort.open();

  res.end();
};

export default Analysis;
