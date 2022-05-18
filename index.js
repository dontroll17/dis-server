const express = require('express');
const bodyParser = require("body-parser");
const authRouter = require('./src/routes/auth');
const app = express();
const PORT = process.env.PORT || 5555;
const cors = require('cors');
const jwt = require('jsonwebtoken')

//socket.io init
const { createServer } = require("http");
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
});

// socket authorization verifier
io.use(function(socket, next){
    try{
        if(jwt.verify(socket.handshake.query.token, process.env.JWT_KEY)){
            next();
        }else{
            next(new Error('not authorized'));
        }
    } catch(e){
        next(new Error("invalid"));
    }
})

io.on('connection', (socket) => {
    console.log('Got connect');
    socket.on('emit_method', (msg) => {
        console.log('message: ' + msg);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true }));
app.use(cors());
app.use('/auth',authRouter);

httpServer.listen(PORT,  () => {
    console.log(`Blast-off on http://localhost:${PORT} pid:${process.pid}`);
});