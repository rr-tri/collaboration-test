import { io, Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object


export const socket: Socket = import.meta.env.NODE_ENV === 'production' ? io({
    autoConnect: true
}) : io('http://localhost:3000', {
    autoConnect: true

});