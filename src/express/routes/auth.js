const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { models } = require('../../sequelize');

const router = express.Router();

function generateToken(user) {
    return jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Correo electrónico y contraseña son requeridos.'})
    }


    const user = await models.user.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: 'No se encontró el usuario.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    const token = generateToken(user);
    return res.status(200).json({token, user});
});

module.exports = router;