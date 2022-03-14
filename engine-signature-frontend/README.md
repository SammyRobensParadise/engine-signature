# Frontend

## Version 0.1.0

## How It Works

This Application is build with `Next.js` and `React`. It includes both a server component and a frontend component. The Interface is server rendered. The application is simple at its core.

When the application is started up, you are given the open to toggle a connection. This creates an HTTP connection to the server via `api/socket`. When the server accepts the connection, the HTTP connection is upgraded to a webSocket via the `ws://` protocol. Now that the frontend has a connection open to the server, it is time for the server (written in express.js) to start collecting data from Wekinator. This is done via [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) protocol. An OSC protocol UDP connection is opened on port 12000, which is the default OSC output port for Wekinator

```ts
const udpPort = new osc.UDPPort({
  localAddress: 'localhost',
  localPort: 12000,
  metadata: true,
});
```

The server finds all the available IP addresses, and starts drawing OSC data over them. When a connection is established the following message will be displayed on the server console.

```bash
Listening for OSC over UDP.
Host: 192.168.0.25, Port: 12000
```

Once the [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) connection is established then the server subscribes to the port and begins listening to OSC packets from Wekinator. When a message is received, it is emitted over the WebSocket [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) protocol. This is received on the frontend in `index.tsx` and is then distributed to various components for display to the user.

## Known bugs

1. There is no localStorage enabled yet, so settings are not saved.
2. There is a significant performance penalty when a low averaging window is chosen because it means that `setState` is being automatically throttled by react. While this does not result in data loss, it means that the UI can become unresponsive after a long time of running the application.

## Usage

1. install Node.js 14 or greater. If you are using `nvm` (node version manager) Then you can just type `nvm use` into your terminal.
   using NPM 6 or greater:
2. Change directories

```bash
cd engine-signature-frontend
```

3. Install dependencies

```bash
npm install
```

4. Start the server and the Frontend. If you are using visual studio code. then you can navigate to the `Run and Debug` Tab and click on the Arrow called `Next.js debug full stack`. The vs code config is configured under `.vscode/launch.json`. Otherwise run:

```bash
npm run dev-alone
```

This should output the following to your console:

```bash
npm run dev
➜  engine-signature-frontend git:(srp/frontend) ✗ npm run dev
Debugger attached.

> engine-signature-frontend@0.1.0 dev /Users/sammyrobens-paradise/projects/engine-signature/engine-signature-frontend
> next dev

Debugger attached.
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully in 2.8s (124 modules)
wait  - compiling / (client and server)...
event - compiled client and server successfully in 1078 ms (771 modules)
wait  - compiling /_error (client and server)...
event - compiled client and server successfully in 280 ms (772 modules)
```

If you are having trouble, refer to the [Next.js documentation](https://nextjs.org/docs/advanced-features/debugging) on debugging.

Once it is started then you should see the application open up at `https://localhost:3000`. If the browser does not automatically open up, then type the address into your browsers search bar.

_Happy Coding!_
