import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import userRoutes from './routes/user';
import blogRoutes from './routes/blog';
import dotenv from 'dotenv';
import client from './db/conn';
import errorMiddleware from './middleware/error-middleware';
import Notification from './models/notification';
import getNotifications from "./controllers/notification";
import { IoT1ClickProjects } from 'aws-sdk';
dotenv.config();

const app = express();
const server = createServer(app);


const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
client;

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);
app.use(errorMiddleware);

app.get('/user/notifications', getNotifications);

io.on("connection", (socket) => {
    console.log('User connected', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('name', (name) => {
        socket.broadcast.emit('name', name);
    });
    socket.on('notification', async (name) => {
        io.emit('notification', { message: `${name} has added new blog`, read: false });
        await Notification.create({ message: `${name} has added new blog` });
    });
});

server.listen(process.env.PORT, () => {
    console.log('Server running on port ', process.env.PORT);
});
