export type ConnnectionStates = 'CLOSED' | 'LISTENING' | 'ERROR' | 'CLOSING' | 'OPEN';

export type Message = { address: string; args: Array<{ type: string; value: number }> };

export type SocketMessage = {
  message: Message;
};
