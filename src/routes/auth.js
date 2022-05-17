const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypt = require('bcryptjs');


const getHash = async (pass) => {
    return await crypt.hash(pass, 10);
}

const compare = async(pass, hashedPass) => {
    return await crypt.compare(pass, hashedPass);
}


router.post('/signup', async (req, res) => {
    const { login, password } = req.body;

    if(!login || !password) {
        return res.status(400).send('bad request');
    }
    const hash = await getHash(password);
    const check = await User.findOne({ where: { login: login } });

    if(check) {
        return res.status(400).send('Login already used');
    }
    await User.create({
        login: login,
        password: hash
    });
    res.status(201).json({
        message: 'User created'
    });
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    if(!login || !password) {
        return res.status(400).send('bad request');
    }
    const user = await User.findOne({
        where: {
            login: login
        }
    });

    if(!user) {
        return res.status(404).send('User not found');
    }
    const check = await compare(password, user.dataValues.password);

    if(check) {
        const token = jwt.sign({
                login:  user.dataValues.login,
                id: user.dataValues.id
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Auth successful",
            token: token
        });
    }

    res.status(401).json({message: "Auth failed"});
});

module.exports = router;