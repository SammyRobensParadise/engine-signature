import type { NextPage } from 'next';
import Head from 'next/head';
import io, { Socket } from 'Socket.IO-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConnnectionStates, SocketMessage } from '../local';
import ConnectionStatus from '../components/connection-status';
import { Switch, Card, Alert, Button, Chip } from 'ui-neumorphism';
import Slider from 'react-input-slider';
import 'ui-neumorphism/dist/index.css';
import SoundBars from '../components/soundbars';
import Detection from '../components/detections';
import ErrorCountPieChart from '../components/error-count-pie-chart';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { average2D } from '../utils/utils';
/**
 * declare a websocket instance on server rendered code
 */
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const Home: NextPage = () => {
  const [latestValues, setLatestValues] = useState<number[]>([]);
  const [socketStatus, updateSocketStatus] = useState<ConnnectionStates>('CLOSED');
  const [socketOpen, setSocketOpen] = useState(false);
  const [listen, setListen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [samplingSize, setSamplingSize] = useState<{ x: number; y: number }>({ x: 10, y: 0 });
  const [errorThreshold, setErrorThreshold] = useState<{ x: number; y: number }>({ x: 50, y: 0 });
  const [showPerformaceWarning, setShowPerformanceWarning] = useState<boolean>(false);
  const startTime = useRef(Date.now());

  /**
   * Initializes the websocket to the server
   */
  const initiSocket = useCallback(async () => {
    let average: number[][] = [];

    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      updateSocketStatus('OPEN');
      startTime.current = Date.now();
    });
    socket.on('disconnect', () => {
      updateSocketStatus('CLOSED');
    });

    socket.on('error', () => {
      updateSocketStatus('ERROR');
    });

    socket.on('osc', (message: SocketMessage) => {
      if (socketStatus !== 'CLOSED' && socketStatus !== 'ERROR') {
        const { args } = message.message;
        const e: number[] = new Array(args.length);
        args.forEach((arg, index) => {
          e[index] = arg.value;
        });
        average.push(e);
        if (average.length >= samplingSize.x) {
          const averages = average2D(average);
          setLatestValues(averages);
          average = [];
        }
      }
    });
  }, [socketStatus, samplingSize]);

  /**
   * Side Effect Hook to handle the websocket connection
   */
  useEffect(() => {
    if (socketOpen) {
      initiSocket();
    } else {
      updateSocketStatus('CLOSING');
      if (socket) {
        socket.emit('end', true);
      }
      updateSocketStatus('CLOSED');
    }
  }, [socketOpen, initiSocket]);

  useEffect(() => {
    if (samplingSize.x < 10) {
      setShowPerformanceWarning(true);
    } else {
      setShowPerformanceWarning(false);
    }
  }, [samplingSize.x]);
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

  function toggleListen() {
    if (listen) {
      setListen(false);
    } else {
      setListen(true);
    }
  }

  function toggleRecording() {
    if (recording) {
      setRecording(false);
    } else {
      setRecording(true);
    }
  }

  useEffect(() => {
    if (socket) {
      socket.emit('threshold', errorThreshold);
    }
  }, [errorThreshold]);

  useEffect(() => {
    if (samplingSize.x && socket) {
      socket.emit('size', samplingSize.x);
    }
  }, [samplingSize.x]);

  useEffect(() => {
    if (socket) {
      if (listen) {
        socket.emit('listen', true);
      } else {
        socket.emit('close', true);
      }
    }
  }, [listen]);

  useEffect(() => {
    if (socket) {
      if (recording) {
        socket.emit('record', true);
      } else {
        socket.emit('stop-recording', true);
      }
    }
  }, [recording]);

  return (
    <div>
      <Head>
        <title>Engine Signature Version</title>
        <meta name='description' content='Engine Signature Detection' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className=' bg-slate-100 h-screen'>
        <h1 className='font-sans text-center text-2xl p-4'>
          Engine Signature Detection Version 0.1.0
        </h1>
        <div className='grid grid-cols-2 gap-4 p-8'>
          <div className='p-4 space-y-4'>
            <h2 className='font-sans text-left text-xl'>Control Panel</h2>
            <Card className='px-4'>
              <div className='flex space-x-4'>
                <p className='pt-2 pr-4'>Connection:</p>
                <span className='pt-2'>Off</span>{' '}
                <Switch checked={socketOpen} onChange={togggleSocket} label='On' />
                <div className='pt-2'>
                  <Chip type='info'>
                    <div className='w-44'>
                      Socket Uptime:{' '}
                      <span className='w-24 font-semibold'>
                        {(Date.now() - startTime.current) / 1000}
                      </span>{' '}
                      sec.
                    </div>
                  </Chip>
                </div>
              </div>
              <div className='flex space-x-4'>
                <p className='pt-2 pr-14'>Listen:</p>
                <span className='pt-2'>Off</span>{' '}
                <Switch checked={listen} onChange={toggleListen} label='On' />
              </div>
              <div className='flex space-x-4'>
                <p className='pt-2 pr-2'>Record Input:</p>
                <span className='pt-2'>Off</span>{' '}
                <Switch checked={socketOpen} onChange={toggleListen} label='On' />
              </div>
            </Card>
            <Card className='px-4 py-2'>
              <div className='flex space-x-4'>
                <p className='py-2'>Moving Average Sample Size:</p>
                <p className='py-2 w-6'>{samplingSize.x}</p>
                <div className='pt-2'>
                  <Slider
                    axis='x'
                    x={samplingSize.x}
                    onChange={({ x }) => setSamplingSize((state) => ({ ...state, x }))}
                    xmin={1}
                    xmax={1000}
                  />
                </div>
                <Button
                  depressed
                  onClick={() => {
                    setSamplingSize((state) => ({ ...state, x: 10 }));
                  }}
                >
                  Reset
                </Button>
              </div>
            </Card>
            <div>
              {showPerformaceWarning && (
                <Alert type='warning' inset>
                  A low sampling average can cause performance issues.
                </Alert>
              )}
            </div>
            <Card className='px-4 py-2'>
              <div className='flex space-x-4'>
                <p className='py-2'>Error Threshold:</p>
                <p className='py-2 w-8'>{errorThreshold.x}%</p>
                <div className='pt-2'>
                  <Slider
                    axis='x'
                    x={errorThreshold.x}
                    onChange={({ x }) => setErrorThreshold((state) => ({ ...state, x }))}
                    xmin={0}
                    xmax={100}
                    xstep={1}
                  />
                </div>
                <Button
                  depressed
                  onClick={() => {
                    setErrorThreshold((state) => ({ ...state, x: 50 }));
                  }}
                >
                  Reset
                </Button>
              </div>
            </Card>
            <ErrorCountPieChart data={latestValues} threshold={errorThreshold.x / 100} />
          </div>
          <div className='p-4 space-y-4'>
            <h2 className='font-sans text-left text-xl'>Output</h2>
            <div className='flex space-x-4'>
              <p>Connection Status:</p>
              <ConnectionStatus status={socketStatus} /> <p>OSC Port Status:</p>
              <ConnectionStatus status={listen ? 'LISTENING' : 'CLOSED'} />
            </div>
            <div className='flex space-x-4'>
              <p className='pt-2'>Output Magnitude:</p>
            </div>
            <SoundBars data={latestValues} threshold={errorThreshold.x / 100} />
            <Detection data={latestValues} threshold={errorThreshold.x / 100} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
