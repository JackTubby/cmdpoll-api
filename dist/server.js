import express from 'express';
import { createServer } from 'http';
import { env } from 'process';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Configure this for production
        methods: ['GET', 'POST'],
    },
});
// Middleware
app.use(express.json());
// Health check endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
    // Example event handlers
    socket.on('message', (data) => {
        console.log('Received message:', data);
        // Broadcast to all clients
        io.emit('message', data);
    });
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        socket.to(room).emit('user_joined', { userId: socket.id, room });
    });
});
// API endpoint that can trigger Socket.IO events
app.post('/api/broadcast', (req, res) => {
    const { message, room } = req.body;
    if (room) {
        io.to(room).emit('message', message);
    }
    else {
        io.emit('message', message);
    }
    res.json({ success: true, message: 'Message broadcasted' });
});
// Start server
const PORT = Number(env.PORT) || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`HTTP: http://localhost:${PORT}`);
    console.log(`Socket.IO: ws://localhost:${PORT}`);
});
