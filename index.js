const express = require('express');
const app = express();
const PORT = process.env.PORT || 5555;
const dotenv = require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(`postgres://${process.env.USERNAME}:${process.env.PASSWORD}@localhost:5432/dis-server`)

app.get('/', (req, res) => {
    res.send('It`s work');
});

(async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

app.listen(PORT,  () => {
    console.log(`Blast-off on http://localhost:${PORT} pid:${process.pid}`);
});