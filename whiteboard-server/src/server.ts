import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

let drawingData: any[] = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('drawing-data', drawingData);

  socket.on('drawing-data', (data) => {
    drawingData = data;
    socket.broadcast.emit('drawing-data', drawingData);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
