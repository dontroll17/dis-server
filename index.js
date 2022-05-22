const express = require('express');
const bodyParser = require("body-parser");
const authRouter = require('./src/routes/auth');
const app = express();
const PORT = process.env.PORT || 5555;
const cors = require('cors');
const jwt = require('jsonwebtoken');

//Константы
const {CONNECT, DISCONNECT, SOCKET_USERS_CHANGES, INVITE_USER} = require("./src/constants/socketEvents");

//socket.io инициация
const { createServer } = require("http");
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
});

//Хранилище данных о состоянии пользователей
let jwtUser = null;
const socketUsers = {};

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
io.on(CONNECT, (socket) => {
    socketUsers[socket.id] = jwtUser;
    io.emit(SOCKET_USERS_CHANGES, socketUsers);

    socket.on(INVITE_USER, (userId) => {
        let val = Object.values(socketUsers).find((user) => user.id === userId);
        const client = Object.keys(socketUsers).find(key => socketUsers[key] === val);
        socket.to(client).emit('hi')
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