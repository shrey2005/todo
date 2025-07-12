import { io } from 'socket.io-client';

const socket = io('http://localhost:8090');

export default socket;
