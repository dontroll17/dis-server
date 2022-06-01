const { DataTypes } = require('sequelize');
const db = require('../config/dbConfig');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    room_id: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

User.sync().then(() => console.log('User model sync'));

module.exports = User;
