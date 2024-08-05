import { io, Socket } from 'socket.io-client';

export const socket: Socket =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? io()
    : io('http://localhost:3000');
