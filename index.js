import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './src/routes/auth.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import User from './src/models/User.js';

const app = express();
const PORT = process.env.PORT || 5555;

//Константы
import {CONNECT, DISCONNECT, SOCKET_USERS_CHANGES, INVITE_USER, NEW_INVITE} from './src/constants/socketEvents.js';

//socket.io инициация
import { createServer } from 'http';
import { Server } from 'socket.io';
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
});

// Хранилище данных о состоянии пользователей
let jwtUser = null;
const socketUsers = {};

// Хранилище данных о комнатах
const socketRooms = {};

// Проверка авторизации
io.use(function(socket, next){
    try{
        jwtUser = jwt.verify(socket.handshake.query.token, process.env.JWT_KEY);
        if(jwtUser){
            next();
        }else{
            next(new Error('not authorized'));
        }
    } catch(e){
        next(new Error("invalid"));
    }
})

//Соединение пользователей онлайн и обработчики событий
io.on(CONNECT, async (socket) => {
    socketUsers[socket.id] = await User.findByPk(jwtUser.id);
    io.emit(SOCKET_USERS_CHANGES, socketUsers);

    socket.on(INVITE_USER, (userId) => {
        let invitedUser = Object.values(socketUsers).find((user) => user.id === userId);
        const clientId = Object.keys(socketUsers).find(key => socketUsers[key] === invitedUser);
        let uuid = randomUUID();
        socketUsers[socket.id].room_id = uuid;
        socketUsers[socket.id].save();
        socket.join(uuid);
        console.log(socketUsers);
        socket.to(clientId).emit(NEW_INVITE, { uuid });
    })

    //Разрыв соединения сокета и удаления пользователя из списка онлайн
    socket.on(DISCONNECT, () => {
        delete socketUsers[socket.id];
        io.emit(SOCKET_USERS_CHANGES, socketUsers);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true }));
app.use(cors());
app.use('/auth',authRouter);

httpServer.listen(PORT,  () => {
    console.log(`Blast-off on http://localhost:${PORT} pid:${process.pid}`);
});