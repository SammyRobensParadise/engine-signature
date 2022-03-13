import type { NextPage } from 'next';
import Head from 'next/head';
import io from 'Socket.IO-client';
import { useCallback, useEffect, useState } from 'react';
import { ConnnectionStates, SocketMessage } from '../local';
import ConnectionStatus from '../components/connection-status';
import { Switch, Card } from 'ui-neumorphism';
import 'ui-neumorphism/dist/index.css';

const average = (arr: number[][]) =>
  arr.reduce((a, b) => {
    debugger;
    return a + b;
  }, 0) / arr.length;

/**
 * declare a websocket instance on server rendered code
 */
let socket;
const Home: NextPage = () => {
  const [latestValues, setLatestValues] = useState();
  const [socketStatus, updateSocketStatus] = useState<ConnnectionStates>('CLOSED');
  const [socketOpen, setSocketOpen] = useState(false);
  const [sensitivity, setSensitivity] = useState<number>(100);

  /**
   * Initializes the websocket to the server
   */
  const initiSocket = useCallback(async () => {
    let average: number[][] = [];

    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      updateSocketStatus('LISTENING');
    });
    socket.on('disconnect', () => {
      updateSocketStatus('CLOSED');
    });

    socket.on('osc', (message: SocketMessage) => {
      if (socketStatus !== 'CLOSED' && socketStatus !== 'ERROR') {
        const { args } = message.message;
        const e: number[] = new Array(args.length);
        args.forEach((arg, index) => {
          e[index] = arg.value;
        });
        average.push(e);
        if (average.length > sensitivity) {
          console.log('clear');
          average = [];
        }
        console.log(average);
      }
    });
  }, [socketStatus, sensitivity]);

  /**
   * Side Effect Hook to handle the websocket connection
   */
  useEffect(() => {
    if (socketOpen) {
      initiSocket();
    } else {
      updateSocketStatus('CLOSING');
      socket = io();
      socket.emit('end');
      updateSocketStatus('CLOSED');
    }
  }, [socketOpen, initiSocket]);

  /**
   * toggles whether the websocket to the server is open
   */
  function togggleSocket() {
    if (socketOpen) {
      setSocketOpen(false);
    } else {
      setSocketOpen(true);
    }
  }

  return (
    <div>
      <Head>
        <title>Engine Signature</title>
        <meta name='description' content='Engine Signature Detection' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h1 className='font-sans text-center text-2xl p-4'>Engine Signature Detection</h1>
        <div className='grid grid-cols-2 gap-4 p-8'>
          <div className='p-4 space-y-4'>
            <h2 className='font-sans text-left text-xl'>Control Panel</h2>
            <Card className='px-4'>
              <div className='flex space-x-4'>
                <p className='pt-2'>Connection:</p>
                <span className='pt-2'>Off</span>{' '}
                <Switch checked={socketOpen} onChange={togggleSocket} label='On' />
              </div>
            </Card>
          </div>
          <div className='p-4 space-y-4'>
            <h2 className='font-sans text-left text-xl'>Output</h2>
            <div className='flex space-x-4'>
              <p>Connection Status:</p>
              <ConnectionStatus status={socketStatus} />
            </div>
            <div className='flex space-x-4'>
              <p className='pt-2'>Outputs</p>
              <span>{JSON.stringify(latestValues)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
