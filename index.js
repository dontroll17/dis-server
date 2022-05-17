const express = require('express');
const bodyParser = require("body-parser");
const authRouter = require('./src/routes/auth');
const app = express();
const PORT = process.env.PORT || 5555;
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true }));
app.use(cors());
app.use('/auth',authRouter);

app.listen(PORT,  () => {
    console.log(`Blast-off on http://localhost:${PORT} pid:${process.pid}`);
});