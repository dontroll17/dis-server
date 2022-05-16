const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();

module.exports = new Sequelize(`postgres://${process.env.USER}:${process.env.PASSWORD}@localhost:5432/dis_server`);