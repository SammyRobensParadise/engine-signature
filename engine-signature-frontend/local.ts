export type ConnnectionStates = 'CLOSED' | 'LISTENING' | 'ERROR' | 'CLOSING';

export type SocketMessage = {
  message: { address: string; args: Array<{ type: string; value: number }> };
};
