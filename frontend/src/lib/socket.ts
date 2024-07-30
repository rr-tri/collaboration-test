import { io, Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object


export const socket: Socket = import.meta.env.NODE_ENV === 'production' ? io() : io('http://localhost:3000');