const { Router } = require('express');
const router = Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    const { login, password } = req.body;
    if(!login || !password) {
        return res.status(400).send('bad request');
    }
    const check = await User.findOne({ where: { login: login } });
    if(check) {
        return res.status(400).send('Login already used');
    }
    await User.create({
        login: login,
        password: password
    });
    res.status(200).send('Ok')
});

module.exports = router;