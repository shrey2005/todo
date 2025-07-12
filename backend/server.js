const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
require('./cron'); 

const PORT = process.env.PORT || 5000;

dotenv.config();

connectDB();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
    },
});

io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);
});

app.set('io', io);
app.use(require('./router'));

app.use('/uploads', express.static('uploads'));

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
