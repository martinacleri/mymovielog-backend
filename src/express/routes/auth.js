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

    try {
        const user = await models.user.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user);
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ error: 'Error logging in', details: error.message });
    }
});

module.exports = router;