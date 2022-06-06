import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export default new Sequelize(`postgres://${process.env.USER}:${process.env.PASSWORD}@localhost:5432/dis_server`);