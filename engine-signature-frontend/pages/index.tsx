import type { NextPage } from 'next';
import Head from 'next/head';
import io from 'Socket.IO-client';
import * as OSC from 'osc/dist/osc-browser';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';
let socket;

const Home: NextPage = () => {
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Engine Signature</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1>Engine Signature</h1>
      </main>
    </div>
  );
};

export default Home;
