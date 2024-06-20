const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    return res.sendFile(path.resolve('./public/index.html'));
});

// Socket.io 
io.on("connection", (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);

    
    });

    // Listen for 'user-message' events from the client
    socket.on("user-message", (data) => {
        const { room, message } = data;
        io.to(room).emit('message', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(9000, () => console.log(`Server started at PORT: 9000`));
