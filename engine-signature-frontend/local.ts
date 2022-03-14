export type ConnnectionStates = 'CLOSED' | 'LISTENING' | 'ERROR' | 'CLOSING' | 'OPEN';

export type SocketMessage = {
  message: { address: string; args: Array<{ type: string; value: number }> };
};
